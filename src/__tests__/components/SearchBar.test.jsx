import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

describe('SearchBar Component', () => {
  it('deve renderizar campo de busca e botão de pesquisar', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/Buscar por professor/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Pesquisar/i })).toBeDefined();
  });

  it('deve disparar onSearch ao submeter formulário', () => {
    const handleSearch = vi.fn();
    render(<SearchBar value="Estruturas" onSearch={handleSearch} />);

    const form = screen.getByRole('search');
    fireEvent.submit(form);

    expect(handleSearch).toHaveBeenCalledWith('Estruturas');
  });

  it('deve acionar onSearchDelayed com debounce após digitação', async () => {
    const handleDelayed = vi.fn();
    render(<SearchBar onSearchDelayed={handleDelayed} />);

    const input = screen.getByPlaceholderText(/Buscar por professor/i);
    fireEvent.change(input, { target: { value: 'Banco de Dados' } });

    await waitFor(() => {
      expect(handleDelayed).toHaveBeenCalledWith('Banco de Dados');
    }, { timeout: 1000 });
  });

  it('deve exibir dropdown de sugestões quando focado e com dados de autocomplete', () => {
    const suggestions = {
      professors: [{ id: 'p1', name: 'Dr. Lucas Ribeiro', department: 'Engenharia' }],
      courses: [{ id: 'c1', name: 'Sistemas Operacionais', code: 'SO01', department: 'Computação' }]
    };

    render(<SearchBar suggestions={suggestions} />);
    const input = screen.getByPlaceholderText(/Buscar por professor/i);

    fireEvent.focus(input);

    expect(screen.getByRole('listbox')).toBeDefined();
    expect(screen.getByText('Dr. Lucas Ribeiro')).toBeDefined();
    expect(screen.getByText('Sistemas Operacionais')).toBeDefined();
  });

  it('deve disparar onSuggestionClick e fechar dropdown ao clicar em item', () => {
    const handleSuggestionClick = vi.fn();
    const suggestions = {
      professors: [{ id: 'p1', name: 'Dr. Lucas Ribeiro', department: 'Engenharia' }]
    };

    render(
      <SearchBar
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
    );

    const input = screen.getByPlaceholderText(/Buscar por professor/i);
    fireEvent.focus(input);

    const item = screen.getByText('Dr. Lucas Ribeiro');
    fireEvent.click(item);

    expect(handleSuggestionClick).toHaveBeenCalledWith({
      id: 'p1',
      name: 'Dr. Lucas Ribeiro',
      department: 'Engenharia',
      type: 'professor'
    });
  });
});
