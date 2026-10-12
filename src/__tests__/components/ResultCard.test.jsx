import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultCard from '../../components/ResultCard';

describe('ResultCard Component', () => {
  it('deve renderizar título, subtítulo, rating e contagem de avaliações', () => {
    render(
      <ResultCard
        title="Dr. Carlos Alberto"
        subtitle="Ciência da Computação"
        rating={4.8}
        reviewsCount={34}
      />
    );

    expect(screen.getByText('Dr. Carlos Alberto')).toBeDefined();
    expect(screen.getByText('Ciência da Computação')).toBeDefined();
    expect(screen.getByText('4.8')).toBeDefined();
    expect(screen.getByText('(34 avaliações)')).toBeDefined();
    expect(screen.getByText('CA')).toBeDefined();
  });

  it('deve formatar iniciais limpando títulos honoríficos como Dr., Dra., Prof.', () => {
    const { unmount } = render(
      <ResultCard
        title="Profa. Maria Helena Silva"
        subtitle="Matemática"
      />
    );
    expect(screen.getByText('MS')).toBeDefined();
    unmount();

    render(
      <ResultCard
        title="Algoritmos"
        subtitle="CC01"
      />
    );
    expect(screen.getByText('AL')).toBeDefined();
  });

  it('deve acionar callback onViewProfile ao clicar no botão', () => {
    const handleView = vi.fn();
    render(
      <ResultCard
        title="Prof. João Mendes"
        onViewProfile={handleView}
        buttonText="Ver Perfil"
      />
    );

    const btn = screen.getByRole('button', { name: /Ver Perfil/i });
    fireEvent.click(btn);
    expect(handleView).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar classe primary quando isPrimaryButton for true', () => {
    render(
      <ResultCard
        title="Destaque"
        isPrimaryButton={true}
      />
    );

    const btn = screen.getByRole('button', { name: /Ver Perfil Completo/i });
    expect(btn.className).toContain('primary');
  });
});
