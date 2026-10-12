import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../features/auth/HomePage';

describe('HomePage Integration (US03 / Card 010)', () => {
  it('deve renderizar a Navbar, Hero com barra de busca, FilterSidebar e CatalogGrid', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // Hero e títulos
    expect(screen.getByText(/Avaliações Reais de Professores/i)).not.toBeNull();
    expect(screen.getByPlaceholderText(/Busque por professor, disciplina/i)).not.toBeNull();

    // Filtros
    expect(screen.getByText('Filtros Acadêmicos')).not.toBeNull();

    // Aguarda carregar os itens do catálogo
    await waitFor(() => {
      expect(screen.queryByLabelText('Carregando catálogo')).toBeNull();
    });

    // Deve listar professores
    expect(screen.getByText('Dr. Carlos Eduardo')).not.toBeNull();
  });

  it('deve filtrar os resultados ao digitar na busca com debounce', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Busque por professor, disciplina/i);
    fireEvent.change(searchInput, { target: { value: 'Algoritmos' } });

    // Aguarda debounce e busca
    await waitFor(
      () => {
        expect(screen.getByText(/Algoritmos e Estruturas de Dados/i)).not.toBeNull();
      },
      { timeout: 1500 }
    );
  });

  it('deve limpar busca ao clicar no botão de reset', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Busque por professor, disciplina/i);
    fireEvent.change(searchInput, { target: { value: 'TermoInexistenteXYZ123' } });

    await waitFor(
      () => {
        expect(screen.getByText('Nenhum resultado encontrado')).not.toBeNull();
      },
      { timeout: 1500 }
    );

    const resetBtn = screen.getByRole('button', { name: 'Limpar Filtros & Busca' });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getByText('Dr. Carlos Eduardo')).not.toBeNull();
    });
  });
});
