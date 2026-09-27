/**
 * Mock Professor & Catalog Service — Classdoor
 * Fornece métodos assíncronos simulando chamadas HTTP para /api/v1/professors, /api/v1/courses e /api/v1/home/featured.
 * Alinhado aos contratos da US03 (Spring Pageable).
 */

import { MOCK_PROFESSORS, MOCK_COURSES, DEPARTMENTS } from './mockCatalogData.js';

const DEFAULT_DELAY_MS = 250;

/**
 * Utilitário de delay artificial configurável para testes de loading e skeletons.
 */
export const simulateDelay = (ms = DEFAULT_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockProfessorService = {
  /**
   * Busca paginada de professores (/api/v1/professors)
   * @param {Object} params
   * @param {string} [params.query=''] - Termo de busca (nome, departamento, tag, matéria)
   * @param {string} [params.department=''] - Filtro por departamento
   * @param {number} [params.page=0] - Número da página (0-indexed)
   * @param {number} [params.size=10] - Quantidade por página
   * @param {string} [params.sort='rating'] - Ordenação ('rating', 'reviews', 'name', 'difficulty')
   * @param {number} [params.delayMs=DEFAULT_DELAY_MS] - Delay artificial em ms
   * @returns {Promise<{ content: Array, page: { number: number, size: number, totalElements: number, totalPages: number } }>}
   */
  async getProfessors({
    query = '',
    department = '',
    page = 0,
    size = 10,
    sort = 'rating',
    delayMs = DEFAULT_DELAY_MS
  } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);

    const cleanQuery = query.trim().toLowerCase();

    let results = MOCK_PROFESSORS.filter((p) => {
      const matchQuery =
        !cleanQuery ||
        p.name.toLowerCase().includes(cleanQuery) ||
        p.department.toLowerCase().includes(cleanQuery) ||
        p.coursesTaught?.some((c) => c.toLowerCase().includes(cleanQuery)) ||
        p.topTags.some((t) => t.toLowerCase().includes(cleanQuery));

      const matchDept = !department || p.department === department;

      return matchQuery && matchDept;
    });

    if (sort === 'rating') {
      results.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sort === 'reviews') {
      results.sort((a, b) => b.totalReviews - a.totalReviews);
    } else if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'difficulty') {
      results.sort((a, b) => b.difficultyRating - a.difficultyRating);
    }

    const totalElements = results.length;
    const totalPages = Math.ceil(totalElements / size) || (totalElements === 0 ? 0 : 1);
    const pagedContent = results.slice(page * size, (page + 1) * size);

    return {
      content: pagedContent,
      page: {
        number: page,
        size,
        totalElements,
        totalPages
      }
    };
  },

  /**
   * Busca paginada de disciplinas (/api/v1/courses)
   * @param {Object} params
   * @param {string} [params.query=''] - Termo de busca (nome, código, departamento, tag)
   * @param {string} [params.department=''] - Filtro por departamento
   * @param {number} [params.page=0] - Número da página (0-indexed)
   * @param {number} [params.size=10] - Quantidade por página
   * @param {string} [params.sort='rating'] - Ordenação ('rating', 'reviews', 'code', 'name')
   * @param {number} [params.delayMs=DEFAULT_DELAY_MS] - Delay artificial em ms
   * @returns {Promise<{ content: Array, page: { number: number, size: number, totalElements: number, totalPages: number } }>}
   */
  async getCourses({
    query = '',
    department = '',
    page = 0,
    size = 10,
    sort = 'rating',
    delayMs = DEFAULT_DELAY_MS
  } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);

    const cleanQuery = query.trim().toLowerCase();

    let results = MOCK_COURSES.filter((c) => {
      const matchQuery =
        !cleanQuery ||
        c.name.toLowerCase().includes(cleanQuery) ||
        c.code.toLowerCase().includes(cleanQuery) ||
        c.department.toLowerCase().includes(cleanQuery) ||
        c.topTags.some((t) => t.toLowerCase().includes(cleanQuery));

      const matchDept = !department || c.department === department;

      return matchQuery && matchDept;
    });

    if (sort === 'rating') {
      results.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sort === 'reviews') {
      results.sort((a, b) => b.totalReviews - a.totalReviews);
    } else if (sort === 'code') {
      results.sort((a, b) => a.code.localeCompare(b.code));
    } else if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    const totalElements = results.length;
    const totalPages = Math.ceil(totalElements / size) || (totalElements === 0 ? 0 : 1);
    const pagedContent = results.slice(page * size, (page + 1) * size);

    return {
      content: pagedContent,
      page: {
        number: page,
        size,
        totalElements,
        totalPages
      }
    };
  },

  /**
   * Retorna os itens em destaque para a Home (/api/v1/home/featured)
   * @param {Object} [options]
   * @param {number} [options.delayMs=DEFAULT_DELAY_MS]
   */
  async getFeatured({ delayMs = DEFAULT_DELAY_MS } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);

    const featuredProfessors = MOCK_PROFESSORS.filter((p) => p.featured);
    const featuredCourses = MOCK_COURSES.filter((c) => c.featured);

    return {
      professors: featuredProfessors.length > 0 ? featuredProfessors : MOCK_PROFESSORS.slice(0, 4),
      courses: featuredCourses.length > 0 ? featuredCourses : MOCK_COURSES.slice(0, 4)
    };
  },

  /**
   * Busca global unificada e autocomplete com sugestões rápidas
   * @param {string} query - Termo de busca
   * @param {number} [limit=6] - Limite de itens por categoria
   * @param {number} [delayMs=120] - Delay rápido em ms
   * @returns {Promise<{ professors: Array, courses: Array, totalCount: number }>}
   */
  async searchGlobal({ query = '', limit = 6, delayMs = 120 } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);

    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return { professors: [], courses: [], totalCount: 0 };
    }

    const professors = MOCK_PROFESSORS.filter((p) =>
      p.name.toLowerCase().includes(cleanQuery) ||
      p.department.toLowerCase().includes(cleanQuery) ||
      p.coursesTaught?.some((c) => c.toLowerCase().includes(cleanQuery)) ||
      p.topTags.some((t) => t.toLowerCase().includes(cleanQuery))
    ).slice(0, limit);

    const courses = MOCK_COURSES.filter((c) =>
      c.name.toLowerCase().includes(cleanQuery) ||
      c.code.toLowerCase().includes(cleanQuery) ||
      c.department.toLowerCase().includes(cleanQuery) ||
      c.topTags.some((t) => t.toLowerCase().includes(cleanQuery))
    ).slice(0, limit);

    return {
      professors,
      courses,
      totalCount: professors.length + courses.length
    };
  },

  /**
   * Busca professor por ID (/api/v1/professors/{id})
   */
  async getProfessorById(id, { delayMs = DEFAULT_DELAY_MS } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);
    return MOCK_PROFESSORS.find((p) => p.id === id) || null;
  },

  /**
   * Busca disciplina por ID (/api/v1/courses/{id})
   */
  async getCourseById(id, { delayMs = DEFAULT_DELAY_MS } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);
    return MOCK_COURSES.find((c) => c.id === id) || null;
  },

  /**
   * Retorna lista de departamentos acadêmicos
   */
  async getDepartments({ delayMs = 50 } = {}) {
    if (delayMs > 0) await simulateDelay(delayMs);
    return [...DEPARTMENTS];
  }
};
