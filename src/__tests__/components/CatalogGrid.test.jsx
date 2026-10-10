import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CatalogGrid from '../../components/catalog/CatalogGrid';
import { MOCK_PROFESSORS, MOCK_COURSES } from '../../services/mockCatalogData';

describe('CatalogGrid Component (US03 / Card 010)', () => {
  it('deve renderizar o estado de loading (Skeletons) quando isLoading for true', () => {
    render(
      <MemoryRouter>
        <CatalogGrid isLoading={true} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Carregando catálogo')).not.toBeNull();
  });

  it('deve renderizar o EmptyState quando não houver professores nem disciplinas', () => {
    const onResetMock = vi.fn();
    render(
      <MemoryRouter>
        <CatalogGrid
          professors={[]}
          courses={[]}
          isLoading={false}
          onResetFilters={onResetMock}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Nenhum resultado encontrado')).not.toBeNull();
    const resetBtn = screen.getByRole('button', { name: 'Limpar Filtros & Busca' });
    fireEvent.click(resetBtn);
    expect(onResetMock).toHaveBeenCalled();
  });

  it('deve renderizar cards de professores e disciplinas quando fornecidos', () => {
    const sampleProfessors = MOCK_PROFESSORS.slice(0, 2);
    const sampleCourses = MOCK_COURSES.slice(0, 2);

    render(
      <MemoryRouter>
        <CatalogGrid
          professors={sampleProfessors}
          courses={sampleCourses}
          type="ALL"
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(sampleProfessors[0].name)).not.toBeNull();
    expect(screen.getByText(sampleProfessors[1].name)).not.toBeNull();
    expect(screen.getByText(sampleCourses[0].name)).not.toBeNull();
    expect(screen.getByText(sampleCourses[1].name)).not.toBeNull();
  });

  it('deve filtrar visualização para exibir somente Professores quando type="PROFESSORS"', () => {
    const sampleProfessors = MOCK_PROFESSORS.slice(0, 2);
    const sampleCourses = MOCK_COURSES.slice(0, 2);

    render(
      <MemoryRouter>
        <CatalogGrid
          professors={sampleProfessors}
          courses={sampleCourses}
          type="PROFESSORS"
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(sampleProfessors[0].name)).not.toBeNull();
    expect(screen.queryByText(sampleCourses[0].name)).toBeNull();
  });

  it('deve filtrar visualização para exibir somente Disciplinas quando type="COURSES"', () => {
    const sampleProfessors = MOCK_PROFESSORS.slice(0, 2);
    const sampleCourses = MOCK_COURSES.slice(0, 2);

    render(
      <MemoryRouter>
        <CatalogGrid
          professors={sampleProfessors}
          courses={sampleCourses}
          type="COURSES"
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText(sampleProfessors[0].name)).toBeNull();
    expect(screen.getByText(sampleCourses[0].name)).not.toBeNull();
  });
});
