import { describe, it, expect } from 'vitest';
import { mockProfessorService, simulateDelay } from '../../services/mockProfessorService.js';
import { MOCK_PROFESSORS, MOCK_COURSES, DEPARTMENTS } from '../../services/mockCatalogData.js';

describe('mockCatalogData & mockProfessorService (US03)', () => {
  describe('MOCK_PROFESSORS e MOCK_COURSES integridade dos dados', () => {
    it('deve conter 10 ou mais professores com campos obrigatórios preenchidos', () => {
      expect(MOCK_PROFESSORS.length).toBeGreaterThanOrEqual(10);
      MOCK_PROFESSORS.forEach((p) => {
        expect(p.id).toBeDefined();
        expect(p.name).toBeTruthy();
        expect(p.department).toBeTruthy();
        expect(p.avatarUrl).toMatch(/^https:\/\/api\.dicebear\.com/);
        expect(p.averageRating).toBeGreaterThanOrEqual(1);
        expect(p.averageRating).toBeLessThanOrEqual(5);
        expect(p.difficultyRating).toBeGreaterThanOrEqual(1);
        expect(p.difficultyRating).toBeLessThanOrEqual(5);
        expect(p.recommendationPercentage).toBeGreaterThanOrEqual(0);
        expect(p.recommendationPercentage).toBeLessThanOrEqual(100);
        expect(p.totalReviews).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(p.topTags)).toBe(true);
        expect(p.topTags.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('deve conter 10 ou mais disciplinas com campos obrigatórios preenchidos', () => {
      expect(MOCK_COURSES.length).toBeGreaterThanOrEqual(10);
      MOCK_COURSES.forEach((c) => {
        expect(c.id).toBeDefined();
        expect(c.code).toBeTruthy();
        expect(c.name).toBeTruthy();
        expect(c.department).toBeTruthy();
        expect(c.credits).toBeGreaterThan(0);
        expect(c.syllabus).toBeTruthy();
        expect(c.averageRating).toBeGreaterThanOrEqual(1);
        expect(c.averageRating).toBeLessThanOrEqual(5);
        expect(c.difficultyRating).toBeGreaterThanOrEqual(1);
        expect(c.difficultyRating).toBeLessThanOrEqual(5);
        expect(c.recommendationPercentage).toBeGreaterThanOrEqual(0);
        expect(c.recommendationPercentage).toBeLessThanOrEqual(100);
        expect(c.totalReviews).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(c.topTags)).toBe(true);
      });
    });

    it('deve conter lista de departamentos válidos', () => {
      expect(DEPARTMENTS.length).toBeGreaterThanOrEqual(5);
      expect(DEPARTMENTS).toContain('Ciência da Computação');
    });
  });

  describe('mockProfessorService.getProfessors', () => {
    it('deve retornar lista paginada de professores no envelope Spring Pageable', async () => {
      const result = await mockProfessorService.getProfessors({ page: 0, size: 5, delayMs: 0 });

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('page');
      expect(result.content.length).toBeLessThanOrEqual(5);
      expect(result.page.number).toBe(0);
      expect(result.page.size).toBe(5);
      expect(result.page.totalElements).toBe(MOCK_PROFESSORS.length);
      expect(result.page.totalPages).toBe(Math.ceil(MOCK_PROFESSORS.length / 5));
    });

    it('deve filtrar professores por termo de busca (query)', async () => {
      const result = await mockProfessorService.getProfessors({ query: 'Carlos', delayMs: 0 });

      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content.every((p) => p.name.includes('Carlos') || p.coursesTaught?.some((c) => c.includes('Carlos')))).toBe(true);
    });

    it('deve filtrar professores por departamento', async () => {
      const result = await mockProfessorService.getProfessors({
        department: 'Ciência da Computação',
        delayMs: 0
      });

      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content.every((p) => p.department === 'Ciência da Computação')).toBe(true);
    });

    it('deve ordenar professores por nota média (rating)', async () => {
      const result = await mockProfessorService.getProfessors({ sort: 'rating', size: 10, delayMs: 0 });

      for (let i = 0; i < result.content.length - 1; i++) {
        expect(result.content[i].averageRating).toBeGreaterThanOrEqual(result.content[i + 1].averageRating);
      }
    });
  });

  describe('mockProfessorService.getCourses', () => {
    it('deve retornar lista paginada de disciplinas no envelope Spring Pageable', async () => {
      const result = await mockProfessorService.getCourses({ page: 0, size: 4, delayMs: 0 });

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('page');
      expect(result.content.length).toBeLessThanOrEqual(4);
      expect(result.page.number).toBe(0);
      expect(result.page.size).toBe(4);
      expect(result.page.totalElements).toBe(MOCK_COURSES.length);
    });

    it('deve filtrar disciplinas por código ou nome', async () => {
      const result = await mockProfessorService.getCourses({ query: 'CC201', delayMs: 0 });

      expect(result.content.length).toBe(1);
      expect(result.content[0].code).toBe('CC201');
      expect(result.content[0].name).toBe('Algoritmos e Estruturas de Dados');
    });

    it('deve filtrar disciplinas por departamento', async () => {
      const result = await mockProfessorService.getCourses({
        department: 'Design & Mídia Digital',
        delayMs: 0
      });

      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content.every((c) => c.department === 'Design & Mídia Digital')).toBe(true);
    });
  });

  describe('mockProfessorService.getFeatured', () => {
    it('deve retornar lista de professores e disciplinas em destaque para a Home', async () => {
      const featured = await mockProfessorService.getFeatured({ delayMs: 0 });

      expect(featured).toHaveProperty('professors');
      expect(featured).toHaveProperty('courses');
      expect(featured.professors.length).toBeGreaterThanOrEqual(1);
      expect(featured.courses.length).toBeGreaterThanOrEqual(1);
      expect(featured.professors.every((p) => p.featured)).toBe(true);
      expect(featured.courses.every((c) => c.featured)).toBe(true);
    });
  });

  describe('mockProfessorService.searchGlobal (Autocomplete)', () => {
    it('deve retornar professores e disciplinas correspondentes em uma busca unificada', async () => {
      const result = await mockProfessorService.searchGlobal({ query: 'Computação', limit: 5, delayMs: 0 });

      expect(result).toHaveProperty('professors');
      expect(result).toHaveProperty('courses');
      expect(result).toHaveProperty('totalCount');
      expect(result.totalCount).toBe(result.professors.length + result.courses.length);
      expect(result.totalCount).toBeGreaterThan(0);
    });

    it('deve retornar arrays vazios quando a busca for vazia', async () => {
      const result = await mockProfessorService.searchGlobal({ query: '   ', delayMs: 0 });

      expect(result.professors).toEqual([]);
      expect(result.courses).toEqual([]);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('mockProfessorService.getProfessorById & getCourseById', () => {
    it('deve buscar professor específico por ID com sucesso', async () => {
      const firstProf = MOCK_PROFESSORS[0];
      const found = await mockProfessorService.getProfessorById(firstProf.id, { delayMs: 0 });

      expect(found).not.toBeNull();
      expect(found.id).toBe(firstProf.id);
      expect(found.name).toBe(firstProf.name);
    });

    it('deve retornar null para ID inexistente', async () => {
      const notFound = await mockProfessorService.getProfessorById('id-inexistente', { delayMs: 0 });
      expect(notFound).toBeNull();
    });

    it('deve buscar disciplina específica por ID com sucesso', async () => {
      const firstCourse = MOCK_COURSES[0];
      const found = await mockProfessorService.getCourseById(firstCourse.id, { delayMs: 0 });

      expect(found).not.toBeNull();
      expect(found.id).toBe(firstCourse.id);
      expect(found.code).toBe(firstCourse.code);
    });
  });

  describe('simulateDelay', () => {
    it('deve resolver promise de delay com sucesso', async () => {
      const start = Date.now();
      await simulateDelay(20);
      expect(Date.now() - start).toBeGreaterThanOrEqual(15);
    });
  });
});
