/**
 * Catalog & Professor Service — Classdoor
 * Integração real com a API backend com fallback robusto e suporte a ambiente de testes.
 */

import { MOCK_PROFESSORS, MOCK_COURSES, DEPARTMENTS } from './mockCatalogData.js';
import { apiCall } from './api.js';

const DEFAULT_DELAY_MS = 150;

export const simulateDelay = (ms = DEFAULT_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

export const mockProfessorService = {
  async getProfessors({
    query = '',
    department = '',
    minRating = 0,
    semester = '',
    page = 0,
    size = 10,
    sort = 'rating',
    delayMs = DEFAULT_DELAY_MS
  } = {}) {
    if (!isTestEnv) {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sort: sort,
          ...(query ? { query } : {}),
          ...(department && department !== 'ALL' ? { department } : {}),
          ...(minRating ? { minRating: minRating.toString() } : {}),
          ...(semester && semester !== 'ALL' ? { semester } : {}),
        });
        return await apiCall(`/api/professors?${params.toString()}`);
      } catch (_error) {
        // fallback
      }
    }

    if (delayMs > 0) await simulateDelay(delayMs);

    const cleanQuery = query.trim().toLowerCase();
    let results = MOCK_PROFESSORS.filter((p) => {
      const matchQuery =
        !cleanQuery ||
        p.name.toLowerCase().includes(cleanQuery) ||
        p.department.toLowerCase().includes(cleanQuery) ||
        p.coursesTaught?.some((c) => c.toLowerCase().includes(cleanQuery)) ||
        p.topTags.some((t) => t.toLowerCase().includes(cleanQuery));

      const matchDept = !department || department === 'ALL' || p.department === department;
      const matchRating = !minRating || p.averageRating >= Number(minRating);

      return matchQuery && matchDept && matchRating;
    });

    if (sort === 'rating') {
      results.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sort === 'reviews') {
      results.sort((a, b) => b.totalReviews - a.totalReviews);
    } else if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'difficulty') {
      results.sort((a, b) => a.difficultyRating - b.difficultyRating);
    }

    const totalElements = results.length;
    const totalPages = Math.ceil(totalElements / size) || (totalElements === 0 ? 0 : 1);
    const pagedContent = results.slice(page * size, (page + 1) * size);

    return {
      content: pagedContent,
      page: { number: page, size, totalElements, totalPages }
    };
  },

  async getCourses({
    query = '',
    department = '',
    minRating = 0,
    semester = '',
    page = 0,
    size = 10,
    sort = 'rating',
    delayMs = DEFAULT_DELAY_MS
  } = {}) {
    if (!isTestEnv) {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          sort: sort,
          ...(query ? { query } : {}),
          ...(department && department !== 'ALL' ? { department } : {}),
          ...(minRating ? { minRating: minRating.toString() } : {}),
          ...(semester && semester !== 'ALL' ? { semester } : {}),
        });
        return await apiCall(`/api/courses?${params.toString()}`);
      } catch (_error) {
        // fallback
      }
    }

    if (delayMs > 0) await simulateDelay(delayMs);

    const cleanQuery = query.trim().toLowerCase();
    let results = MOCK_COURSES.filter((c) => {
      const matchQuery =
        !cleanQuery ||
        c.name.toLowerCase().includes(cleanQuery) ||
        c.code.toLowerCase().includes(cleanQuery) ||
        c.department.toLowerCase().includes(cleanQuery) ||
        c.topTags.some((t) => t.toLowerCase().includes(cleanQuery));

      const matchDept = !department || department === 'ALL' || c.department === department;
      const matchRating = !minRating || c.averageRating >= Number(minRating);

      return matchQuery && matchDept && matchRating;
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
      page: { number: page, size, totalElements, totalPages }
    };
  },

  async getFeatured({ delayMs = DEFAULT_DELAY_MS } = {}) {
    if (!isTestEnv) {
      try {
        return await apiCall('/api/home/featured');
      } catch (_error) {
        // fallback
      }
    }
    if (delayMs > 0) await simulateDelay(delayMs);
    return {
      professors: MOCK_PROFESSORS.slice(0, 4),
      courses: MOCK_COURSES.slice(0, 4)
    };
  },

  async searchGlobal({ query = '', limit = 6, delayMs = 120 } = {}) {
    if (!isTestEnv) {
      try {
        return await apiCall(`/api/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      } catch (_error) {
        // fallback
      }
    }
    if (delayMs > 0) await simulateDelay(delayMs);
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return { professors: [], courses: [], totalCount: 0 };

    const professors = MOCK_PROFESSORS.filter((p) =>
      p.name.toLowerCase().includes(cleanQuery) || p.department.toLowerCase().includes(cleanQuery)
    ).slice(0, limit);

    const courses = MOCK_COURSES.filter((c) =>
      c.name.toLowerCase().includes(cleanQuery) || c.code.toLowerCase().includes(cleanQuery)
    ).slice(0, limit);

    return { professors, courses, totalCount: professors.length + courses.length };
  },

  async getProfessorById(id, { delayMs = DEFAULT_DELAY_MS } = {}) {
    if (!isTestEnv) {
      try {
        return await apiCall(`/api/professors/${id}`);
      } catch (_error) {
        // fallback
      }
    }
    if (delayMs > 0) await simulateDelay(delayMs);
    return MOCK_PROFESSORS.find((p) => p.id === id) || null;
  },

  async getCourseById(id, { delayMs = DEFAULT_DELAY_MS } = {}) {
    if (!isTestEnv) {
      try {
        return await apiCall(`/api/courses/${id}`);
      } catch (_error) {
        // fallback
      }
    }
    if (delayMs > 0) await simulateDelay(delayMs);
    return MOCK_COURSES.find((c) => c.id === id) || null;
  },

  async getDepartments({ delayMs = 50 } = {}) {
    if (!isTestEnv) {
      try {
        return await apiCall('/api/departments');
      } catch (_error) {
        // fallback
      }
    }
    if (delayMs > 0) await simulateDelay(delayMs);
    return [...DEPARTMENTS];
  }
};

export default mockProfessorService;
