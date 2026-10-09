import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../../features/auth/HomePage';

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('HomePage Feature (US03 - Tela Principal)', () => {
  it('deve renderizar a Hero Section, barra de pesquisa e filtros avançados', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText(/Encontre opiniões reais sobre professores e disciplinas/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Buscar por professor, disciplina ou departamento.../i)).toBeDefined();
    expect(screen.getByText(/Filtros Avançados/i)).toBeDefined();
    expect(screen.getByText('Tipo de Busca')).toBeDefined();
    expect(screen.getByText('Limpar Filtros')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText(/Resultados em Destaque/i)).toBeDefined();
    });
  });

  it('deve alternar tipo de busca entre Todos, Docentes e Cursos', async () => {
    renderWithProviders(<HomePage />);

    const docentesBtn = screen.getByRole('button', { name: 'Docentes' });
    fireEvent.click(docentesBtn);
    expect(docentesBtn.className).toContain('active');

    const cursosBtn = screen.getByRole('button', { name: 'Cursos' });
    fireEvent.click(cursosBtn);
    expect(cursosBtn.className).toContain('active');
  });

  it('deve redefinir filtros ao clicar em Limpar Filtros', async () => {
    renderWithProviders(<HomePage />);

    const input = screen.getByPlaceholderText(/Buscar por professor/i);
    fireEvent.change(input, { target: { value: 'Algoritmos' } });
    expect(input.value).toBe('Algoritmos');

    const resetBtn = screen.getByRole('button', { name: /Limpar Filtros/i });
    fireEvent.click(resetBtn);

    expect(input.value).toBe('');
  });

  it('deve carregar e renderizar cards de resultados do catálogo mockado', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      const cards = screen.getAllByRole('button', { name: /Ver Perfil Completo/i });
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
