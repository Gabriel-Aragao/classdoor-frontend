import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useProfessors,
  useCourses,
  useFeaturedCatalog,
  useCatalogSearch,
  useDepartments,
  useProfessorDetails,
  useCourseDetails,
  CATALOG_KEYS
} from '../../hooks/useCatalog.js';
import { MOCK_PROFESSORS, MOCK_COURSES } from '../../services/mockCatalogData.js';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCatalog Hooks (TanStack Query)', () => {
  it('CATALOG_KEYS deve gerar chaves consistentes para cache', () => {
    expect(CATALOG_KEYS.all).toEqual(['catalog']);
    expect(CATALOG_KEYS.professors({ page: 0 })).toEqual(['catalog', 'professors', { page: 0 }]);
    expect(CATALOG_KEYS.featured()).toEqual(['catalog', 'featured']);
    expect(CATALOG_KEYS.search('Carlos', 6)).toEqual(['catalog', 'search', { query: 'Carlos', limit: 6 }]);
  });

  it('useProfessors deve buscar lista de professores via query', async () => {
    const { result } = renderHook(() => useProfessors({ delayMs: 0 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.content).toBeDefined();
    expect(result.current.data.content.length).toBeGreaterThan(0);
  });

  it('useCourses deve buscar lista de disciplinas via query', async () => {
    const { result } = renderHook(() => useCourses({ delayMs: 0 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.content).toBeDefined();
    expect(result.current.data.content.length).toBeGreaterThan(0);
  });

  it('useFeaturedCatalog deve retornar destaques para a Home', async () => {
    const { result } = renderHook(() => useFeaturedCatalog({ delayMs: 0 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.professors).toBeDefined();
    expect(result.current.data.courses).toBeDefined();
  });

  it('useCatalogSearch deve realizar busca com query preenchida', async () => {
    const { result } = renderHook(() => useCatalogSearch('Carlos', 5, { delayMs: 0 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.professors.length).toBeGreaterThan(0);
  });

  it('useDepartments deve carregar a lista de departamentos', async () => {
    const { result } = renderHook(() => useDepartments({ delayMs: 0 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it('useProfessorDetails deve buscar detalhes de um docente específico', async () => {
    const profId = MOCK_PROFESSORS[0].id;
    const { result } = renderHook(() => useProfessorDetails(profId, { delayMs: 0 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.id).toBe(profId);
  });

  it('useCourseDetails deve buscar detalhes de uma disciplina específica', async () => {
    const courseId = MOCK_COURSES[0].id;
    const { result } = renderHook(() => useCourseDetails(courseId, { delayMs: 0 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.id).toBe(courseId);
  });
});
