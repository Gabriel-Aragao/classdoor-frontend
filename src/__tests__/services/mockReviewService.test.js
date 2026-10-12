import { describe, it, expect, beforeEach } from 'vitest';
import { mockReviewService, generateAuditHash } from '../../services/mockReviewService';

describe('mockReviewService (US04, US05, US06, US07 / Card 012)', () => {
  beforeEach(() => {
    mockReviewService.resetStorage();
  });

  describe('Scorecards e Histograma (US04)', () => {
    it('deve calcular médias, porcentagem de recomendação e histograma de estrelas corretamente', async () => {
      const result = await mockReviewService.getReviewsByProfessorId(
        'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        { delayMs: 0 }
      );

      expect(result.content.length).toBeGreaterThan(0);
      expect(result.scorecard).toBeDefined();
      expect(result.scorecard.totalReviews).toBe(result.content.length);
      expect(result.scorecard.averageRating).toBeGreaterThanOrEqual(1);
      expect(result.scorecard.averageRating).toBeLessThanOrEqual(5);
      expect(result.scorecard.recommendationPercentage).toBeGreaterThanOrEqual(0);
      expect(result.scorecard.recommendationPercentage).toBeLessThanOrEqual(100);
      expect(result.scorecard.starHistogram).toBeDefined();
      expect(result.scorecard.starHistogram[5]).toBeDefined();
    });

    it('deve retornar scorecard zerado para lista vazia de avaliações', () => {
      const emptyScorecard = mockReviewService.calculateScorecard([]);
      expect(emptyScorecard.totalReviews).toBe(0);
      expect(emptyScorecard.averageRating).toBe(0);
      expect(emptyScorecard.difficultyRating).toBe(0);
      expect(emptyScorecard.recommendationPercentage).toBe(0);
    });
  });

  describe('Ordenação e Paginação de Avaliações (US07)', () => {
    it('deve ordenar por maior nota (rating_desc)', async () => {
      const res = await mockReviewService.getReviewsByProfessorId(
        'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        { sort: 'rating_desc', delayMs: 0 }
      );

      const ratings = res.content.map((r) => r.rating);
      for (let i = 0; i < ratings.length - 1; i += 1) {
        expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1]);
      }
    });

    it('deve ordenar por mais úteis / upvotes (upvotes_desc)', async () => {
      const res = await mockReviewService.getReviewsByProfessorId(
        'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        { sort: 'upvotes_desc', delayMs: 0 }
      );

      const upvotes = res.content.map((r) => r.upvotes || 0);
      for (let i = 0; i < upvotes.length - 1; i += 1) {
        expect(upvotes[i]).toBeGreaterThanOrEqual(upvotes[i + 1]);
      }
    });
  });

  describe('Submissão e Validações de Negócio (US05)', () => {
    it('deve submeter avaliação com sucesso para turma aberta com quórum >= 5', async () => {
      const newReviewData = {
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        classId: 'cls-carlos-aed-2026-1',
        rating: 5.0,
        difficulty: 3.0,
        wouldRecommend: true,
        comment: 'Excelente didática nas aulas de Algoritmos.',
        tags: ['Didático', 'Provas Justas'],
        isAnonymous: true,
        userEmail: 'novo_aluno_teste_1@universidade.edu.br',
        delayMs: 0,
      };

      const res = await mockReviewService.submitReview(newReviewData);
      expect(res.success).toBe(true);
      expect(res.review.studentName).toBe('Estudante Anônimo');
      expect(res.review.isAnonymous).toBe(true);
      expect(res.review.audit_hash).toBeDefined();
    });

    it('deve preservar o nome do aluno quando isAnonymous for false', async () => {
      const newReviewData = {
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        classId: 'cls-carlos-aed-2026-1',
        rating: 4.5,
        difficulty: 2.5,
        wouldRecommend: true,
        comment: 'Muito bom!',
        isAnonymous: false,
        studentName: 'Gabriel Teste',
        userEmail: 'gabriel_aluno@universidade.edu.br',
        delayMs: 0,
      };

      const res = await mockReviewService.submitReview(newReviewData);
      expect(res.success).toBe(true);
      expect(res.review.studentName).toBe('Gabriel Teste');
      expect(res.review.isAnonymous).toBe(false);
    });

    it('deve rejeitar submissão para turma com quórum < 5', async () => {
      const invalidQuorumData = {
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        classId: 'cls-low-quorum-sample', // matriculados: 3
        rating: 5.0,
        difficulty: 3.0,
        delayMs: 0,
      };

      await expect(mockReviewService.submitReview(invalidQuorumData)).rejects.toThrow(
        /Quórum insuficiente/i
      );
    });

    it('deve rejeitar submissão para turma com período encerrado', async () => {
      const closedClassData = {
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        classId: 'cls-closed-sample', // isEvaluationOpen: false
        rating: 4.0,
        difficulty: 3.0,
        delayMs: 0,
      };

      await expect(mockReviewService.submitReview(closedClassData)).rejects.toThrow(
        /período de avaliação para esta turma encontra-se encerrado/i
      );
    });

    it('deve rejeitar submissão duplicada para o mesmo aluno na mesma turma (audit_hash)', async () => {
      const reviewPayload = {
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        classId: 'cls-carlos-aed-2026-1',
        rating: 5.0,
        difficulty: 3.0,
        userEmail: 'aluno_duplicado@universidade.edu.br',
        delayMs: 0,
      };

      await mockReviewService.submitReview(reviewPayload);

      // Segunda tentativa idêntica
      await expect(mockReviewService.submitReview(reviewPayload)).rejects.toThrow(
        /já enviou uma avaliação para esta turma/i
      );
    });
  });

  describe('Voto de Utilidade e Idempotência (US06)', () => {
    it('deve incrementar upvote na primeira chamada e decrementar ao remover (toggle)', async () => {
      const reviewId = 'rev-001';
      const userId = 'usuario_teste_123';

      // 1º clique: adiciona upvote
      const res1 = await mockReviewService.toggleUpvote(reviewId, userId, { delayMs: 0 });
      expect(res1.success).toBe(true);
      expect(res1.hasUpvoted).toBe(true);
      expect(res1.upvotes).toBe(15); // Inicial era 14

      // 2º clique: remove upvote
      const res2 = await mockReviewService.toggleUpvote(reviewId, userId, { delayMs: 0 });
      expect(res2.success).toBe(true);
      expect(res2.hasUpvoted).toBe(false);
      expect(res2.upvotes).toBe(14);
    });
  });
});
