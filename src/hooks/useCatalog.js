/**
 * Hooks de Catálogo Acadêmico — Classdoor
 * Integração de mockProfessorService com TanStack Query para gerenciamento de cache, estados de loading e refetching.
 */

import { useQuery } from '@tanstack/react-query';
import { mockProfessorService } from '../services/mockProfessorService.js';

export const CATALOG_KEYS = {
  all: ['catalog'],
  professors: (params) => ['catalog', 'professors', params],
  professor: (id) => ['catalog', 'professor', id],
  courses: (params) => ['catalog', 'courses', params],
  course: (id) => ['catalog', 'course', id],
  featured: () => ['catalog', 'featured'],
  search: (query, limit) => ['catalog', 'search', { query, limit }],
  departments: () => ['catalog', 'departments']
};

/**
 * Hook para consulta paginada e filtrada de Professores
 */
export function useProfessors(params = {}, options = {}) {
  return useQuery({
    queryKey: CATALOG_KEYS.professors(params),
    queryFn: () => mockProfessorService.getProfessors(params),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    ...options
  });
}

/**
 * Hook para consulta paginada e filtrada de Disciplinas
 */
export function useCourses(params = {}, options = {}) {
  return useQuery({
    queryKey: CATALOG_KEYS.courses(params),
    queryFn: () => mockProfessorService.getCourses(params),
    staleTime: 1000 * 60 * 5,
    ...options
  });
}

/**
 * Hook para obter destaques da página inicial (Home)
 */
export function useFeaturedCatalog(options = {}) {
  return useQuery({
    queryKey: CATALOG_KEYS.featured(),
    queryFn: () => mockProfessorService.getFeatured(),
    staleTime: 1000 * 60 * 10,
    ...options
  });
}

/**
 * Hook para busca global unificada e autocomplete
 */
export function useCatalogSearch(query = '', limit = 6, options = {}) {
  return useQuery({
    queryKey: CATALOG_KEYS.search(query, limit),
    queryFn: () => mockProfessorService.searchGlobal({ query, limit }),
    enabled: Boolean(query && query.trim().length > 0),
    staleTime: 1000 * 60 * 2,
    ...options
  });
}

/**
 * Hook para obter detalhes de um professor por ID
 */
export function useProfessorDetails(id, options = {}) {
  return useQuery({
    queryKey: CATALOG_KEYS.professor(id),
    queryFn: () => mockProfessorService.getProfessorById(id),
    enabled: Boolean(id),
    ...options
  });
}

/**
 * Hook para obter detalhes de uma disciplina por ID
 */
export function useCourseDetails(id, options = {}) {
  return useQuery({
    queryKey: CATALOG_KEYS.course(id),
    queryFn: () => mockProfessorService.getCourseById(id),
    enabled: Boolean(id),
    ...options
  });
}

/**
 * Hook para obter a lista de departamentos
 */
export function useDepartments(options = {}) {
  return useQuery({
    queryKey: CATALOG_KEYS.departments(),
    queryFn: () => mockProfessorService.getDepartments(),
    staleTime: 1000 * 60 * 30, // 30 minutos
    ...options
  });
}
