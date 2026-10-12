import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterSidebar from '../../components/catalog/FilterSidebar';

describe('FilterSidebar Component (US03 / Card 010)', () => {
  const defaultFilters = {
    type: 'ALL',
    department: 'ALL',
    semester: 'ALL',
    minRating: 0,
    sort: 'rating',
  };

  const departmentsMock = [
    'Ciência da Computação',
    'Engenharia Elétrica',
    'Matemática & Estatística',
  ];

  it('deve renderizar todos os campos de filtros (Tipo, Departamento, Período, Avaliação e Ordenação)', () => {
    render(
      <FilterSidebar
        filters={defaultFilters}
        onChange={vi.fn()}
        onReset={vi.fn()}
        departments={departmentsMock}
        totalResults={15}
      />
    );

    expect(screen.getByText('Filtros Acadêmicos')).not.toBeNull();
    expect(screen.getByText(/15/)).not.toBeNull();
    expect(screen.getByText(/itens encontrados/)).not.toBeNull();
    expect(screen.getByRole('radio', { name: 'Todos' })).not.toBeNull();
    expect(screen.getByRole('radio', { name: 'Professores' })).not.toBeNull();
    expect(screen.getByRole('radio', { name: 'Disciplinas' })).not.toBeNull();
    expect(screen.getByLabelText('Departamento')).not.toBeNull();
    expect(screen.getByLabelText('Período Letivo')).not.toBeNull();
    expect(screen.getByLabelText('Ordenar Por')).not.toBeNull();
  });

  it('deve disparar onChange ao selecionar tipo de item (Professores/Disciplinas)', () => {
    const onChangeMock = vi.fn();
    render(
      <FilterSidebar
        filters={defaultFilters}
        onChange={onChangeMock}
        onReset={vi.fn()}
        departments={departmentsMock}
      />
    );

    const profBtn = screen.getByRole('radio', { name: 'Professores' });
    fireEvent.click(profBtn);

    expect(onChangeMock).toHaveBeenCalledWith({
      ...defaultFilters,
      type: 'PROFESSORS',
    });
  });

  it('deve disparar onChange ao alterar departamento', () => {
    const onChangeMock = vi.fn();
    render(
      <FilterSidebar
        filters={defaultFilters}
        onChange={onChangeMock}
        onReset={vi.fn()}
        departments={departmentsMock}
      />
    );

    const deptSelect = screen.getByLabelText('Departamento');
    fireEvent.change(deptSelect, { target: { value: 'Ciência da Computação' } });

    expect(onChangeMock).toHaveBeenCalledWith({
      ...defaultFilters,
      department: 'Ciência da Computação',
    });
  });

  it('deve disparar onChange ao selecionar nota mínima', () => {
    const onChangeMock = vi.fn();
    render(
      <FilterSidebar
        filters={defaultFilters}
        onChange={onChangeMock}
        onReset={vi.fn()}
        departments={departmentsMock}
      />
    );

    const ratingChip = screen.getByText('4.0+ ★ Muito Bom');
    fireEvent.click(ratingChip);

    expect(onChangeMock).toHaveBeenCalledWith({
      ...defaultFilters,
      minRating: 4.0,
    });
  });

  it('deve disparar onReset ao clicar no botão de limpar filtros', () => {
    const onResetMock = vi.fn();
    render(
      <FilterSidebar
        filters={{ ...defaultFilters, type: 'PROFESSORS' }}
        onChange={vi.fn()}
        onReset={onResetMock}
        departments={departmentsMock}
      />
    );

    const resetBtn = screen.getByRole('button', { name: 'Restaurar Todos os Filtros' });
    fireEvent.click(resetBtn);

    expect(onResetMock).toHaveBeenCalled();
  });
});
