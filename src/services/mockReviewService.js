/**
 * Mock Review & Evaluation Service — Classdoor
 * Camada de serviço com persistência em localStorage para US04, US05, US06 e US07.
 * Gerencia submissão, quorum >= 5, desassociação de anonimato, audit_hash, recálculo dinâmico e upvotes.
 */

import { MOCK_CLASSES, INITIAL_MOCK_REVIEWS } from './mockReviewData.js';
import { simulateDelay } from './mockProfessorService.js';

const STORAGE_KEY_REVIEWS = 'classdoor_mock_reviews';
const STORAGE_KEY_CLASSES = 'classdoor_mock_classes';

/**
 * Utilitário de hash determinístico para cálculo de audit_hash
 * Garante unicidade estrita por estudante + turma sem armazenar PII
 */
export const generateAuditHash = async (identifier, classId) => {
  const payload = `${identifier.trim().toLowerCase()}::${classId}::classdoor_salt_2026`;

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(payload);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback para ambientes sem crypto.subtle
    }
  }

  // Fallback hash determinístico
  let hash = 0;
  for (let i = 0; i < payload.length; i += 1) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}_${classId}`;
};

export const mockReviewService = {
  /**
   * Obtém lista de turmas disponíveis no storage
   */
  getClasses(filters = {}) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLASSES);
      const classes = stored ? JSON.parse(stored) : MOCK_CLASSES;

      if (!stored) {
        localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(MOCK_CLASSES));
      }

      return classes.filter((c) => {
        const matchProf = !filters.professorId || c.professorId === filters.professorId;
        const matchCourse = !filters.courseId || c.courseId === filters.courseId;
        return matchProf && matchCourse;
      });
    } catch (e) {
      return MOCK_CLASSES;
    }
  },

  /**
   * Obtém turma específica por ID
   */
  getClassById(classId) {
    const classes = this.getClasses();
    return classes.find((c) => c.id === classId) || null;
  },

  /**
   * Obtém todas as avaliações armazenadas no localStorage
   */
  getAllReviews() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_MOCK_REVIEWS));
      return [...INITIAL_MOCK_REVIEWS];
    } catch (e) {
      return [...INITIAL_MOCK_REVIEWS];
    }
  },

  /**
   * Salva todas as avaliações no localStorage
   */
  saveReviews(reviews) {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Erro ao salvar avaliações no localStorage:', e);
    }
  },

  /**
   * Restaura o storage de avaliações e turmas para o estado inicial
   */
  resetStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_MOCK_REVIEWS));
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(MOCK_CLASSES));
    } catch (e) {
      // ignore
    }
  },

  /**
   * Calcula métricas agregadas e histograma de estrelas (Scorecards US04)
   */
  calculateScorecard(reviews = []) {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        difficultyRating: 0,
        recommendationPercentage: 0,
        starHistogram: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
          percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
        topTags: [],
      };
    }

    let sumRating = 0;
    let sumDifficulty = 0;
    let recommendCount = 0;
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const tagFrequencies = {};

    reviews.forEach((r) => {
      const rating = Number(r.rating) || 0;
      sumRating += rating;
      sumDifficulty += Number(r.difficulty) || 0;

      if (r.wouldRecommend) {
        recommendCount += 1;
      }

      const roundedStar = Math.min(5, Math.max(1, Math.round(rating)));
      starCounts[roundedStar] = (starCounts[roundedStar] || 0) + 1;

      if (Array.isArray(r.tags)) {
        r.tags.forEach((tag) => {
          tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1;
        });
      }
    });

    const starPercentages = {
      5: Math.round((starCounts[5] / totalReviews) * 100),
      4: Math.round((starCounts[4] / totalReviews) * 100),
      3: Math.round((starCounts[3] / totalReviews) * 100),
      2: Math.round((starCounts[2] / totalReviews) * 100),
      1: Math.round((starCounts[1] / totalReviews) * 100),
    };

    const sortedTags = Object.entries(tagFrequencies)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);

    return {
      totalReviews,
      averageRating: Number((sumRating / totalReviews).toFixed(1)),
      difficultyRating: Number((sumDifficulty / totalReviews).toFixed(1)),
      recommendationPercentage: Math.round((recommendCount / totalReviews) * 100),
      starHistogram: {
        ...starCounts,
        percentages: starPercentages,
      },
      topTags: sortedTags.slice(0, 5),
    };
  },

  /**
   * Busca avaliações de um professor com ordenação, filtros e paginação (US04 / US07)
   */
  async getReviewsByProfessorId(
    professorId,
    { sort = 'recentes', page = 0, size = 10, delayMs = 150 } = {}
  ) {
    if (delayMs > 0) await simulateDelay(delayMs);

    const all = this.getAllReviews();
    let filtered = all.filter((r) => r.professorId === professorId);

    // Ordenação
    if (sort === 'recentes' || sort === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'rating_desc' || sort === 'highest_rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'rating_asc' || sort === 'lowest_rating') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sort === 'upvotes_desc' || sort === 'most_helpful') {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    const scorecard = this.calculateScorecard(filtered);
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size) || (totalElements === 0 ? 0 : 1);
    const content = filtered.slice(page * size, (page + 1) * size);

    return {
      content,
      scorecard,
      page: {
        number: page,
        size,
        totalElements,
        totalPages,
      },
    };
  },

  /**
   * Busca avaliações de uma disciplina com ordenação e paginação (US04 / US07)
   */
  async getReviewsByCourseId(
    courseId,
    { sort = 'recentes', page = 0, size = 10, delayMs = 150 } = {}
  ) {
    if (delayMs > 0) await simulateDelay(delayMs);

    const all = this.getAllReviews();
    let filtered = all.filter((r) => r.courseId === courseId);

    // Ordenação
    if (sort === 'recentes' || sort === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'rating_desc' || sort === 'highest_rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'rating_asc' || sort === 'lowest_rating') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sort === 'upvotes_desc' || sort === 'most_helpful') {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    const scorecard = this.calculateScorecard(filtered);
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size) || (totalElements === 0 ? 0 : 1);
    const content = filtered.slice(page * size, (page + 1) * size);

    return {
      content,
      scorecard,
      page: {
        number: page,
        size,
        totalElements,
        totalPages,
      },
    };
  },

  /**
   * Submete nova avaliação com validações de negócio completas (US05)
   */
  async submitReview({
    professorId,
    courseId,
    classId,
    rating,
    difficulty,
    wouldRecommend = true,
    comment = '',
    tags = [],
    isAnonymous = true,
    studentName = '',
    userEmail = '',
    delayMs = 200,
  }) {
    if (delayMs > 0) await simulateDelay(delayMs);

    // 1. Validação de campos obrigatórios
    if (!classId) {
      throw new Error('A turma acadêmica é obrigatória para envio da avaliação.');
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      throw new Error('A nota deve ser um valor válido entre 1.0 e 5.0 estrelas.');
    }

    const numDifficulty = Number(difficulty);
    if (!numDifficulty || numDifficulty < 1 || numDifficulty > 5) {
      throw new Error('O nível de dificuldade deve ser um valor válido entre 1.0 e 5.0.');
    }

    // 2. Validação da turma e quórum
    const targetClass = this.getClassById(classId);
    if (!targetClass) {
      throw new Error('Turma acadêmica não encontrada no sistema.');
    }

    if (!targetClass.isEvaluationOpen) {
      throw new Error('O período de avaliação para esta turma encontra-se encerrado.');
    }

    if (targetClass.enrolledCount < 5) {
      throw new Error(
        'Quórum insuficiente: a turma possui menos de 5 alunos matriculados para garantir a privacidade.'
      );
    }

    // 3. Validação de Unicidade e Cálculo de audit_hash (Anti-duplicidade)
    const identifier = userEmail || studentName || 'student_session_user';
    const auditHash = await generateAuditHash(identifier, classId);

    const allReviews = this.getAllReviews();
    const alreadyEvaluated = allReviews.some((r) => r.audit_hash === auditHash);
    if (alreadyEvaluated) {
      throw new Error('Você já enviou uma avaliação para esta turma acadêmica.');
    }

    // 4. Desassociação estrita de PII quando anônimo
    const isAnon = Boolean(isAnonymous);
    const finalStudentName = isAnon ? 'Estudante Anônimo' : studentName.trim() || 'Estudante';
    const finalAvatarUrl = isAnon
      ? `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(auditHash)}`
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalStudentName)}&backgroundColor=b6e3f4`;

    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      professorId: professorId || targetClass.professorId,
      courseId: courseId || targetClass.courseId,
      classId,
      courseName: targetClass.courseName,
      semester: targetClass.semester,
      rating: numRating,
      difficulty: numDifficulty,
      wouldRecommend: Boolean(wouldRecommend),
      comment: comment.trim(),
      tags: Array.isArray(tags) ? tags : [],
      isAnonymous: isAnon,
      studentName: finalStudentName,
      avatarUrl: finalAvatarUrl,
      audit_hash: auditHash,
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date().toISOString(),
    };

    allReviews.unshift(newReview);
    this.saveReviews(allReviews);

    const updatedScorecard = this.calculateScorecard(
      allReviews.filter((r) => r.professorId === newReview.professorId)
    );

    return {
      success: true,
      review: newReview,
      scorecard: updatedScorecard,
    };
  },

  /**
   * Voto de utilidade idempotente (US06)
   */
  async toggleUpvote(reviewId, userId = 'current_user', { delayMs = 100 } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);

    const allReviews = this.getAllReviews();
    const reviewIndex = allReviews.findIndex((r) => r.id === reviewId);

    if (reviewIndex === -1) {
      throw new Error('Avaliação não encontrada para registro de voto.');
    }

    const review = allReviews[reviewIndex];
    const upvotedBy = Array.isArray(review.upvotedBy) ? [...review.upvotedBy] : [];
    const hasVoted = upvotedBy.includes(userId);

    let updatedUpvotes = Number(review.upvotes) || 0;
    let newUpvotedBy;
    let hasUpvoted;

    if (hasVoted) {
      // Remove voto
      newUpvotedBy = upvotedBy.filter((id) => id !== userId);
      updatedUpvotes = Math.max(0, updatedUpvotes - 1);
      hasUpvoted = false;
    } else {
      // Adiciona voto
      newUpvotedBy = [...upvotedBy, userId];
      updatedUpvotes += 1;
      hasUpvoted = true;
    }

    allReviews[reviewIndex] = {
      ...review,
      upvotes: updatedUpvotes,
      upvotedBy: newUpvotedBy,
    };

    this.saveReviews(allReviews);

    return {
      success: true,
      reviewId,
      upvotes: updatedUpvotes,
      hasUpvoted,
    };
  },
};
