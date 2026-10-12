import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewModal from '../../components/catalog/ReviewModal';

describe('ReviewModal Component (Card 014)', () => {
  it('deve validar e submeter avaliação com sucesso', async () => {
    const onSubmittedMock = vi.fn();
    render(
      <ReviewModal
        isOpen={true}
        onClose={vi.fn()}
        professorId="prof-id"
        classId="cls-carlos-aed-2026-1"
        onSubmitted={onSubmittedMock}
      />
    );

    // Preencher form
    fireEvent.change(screen.getByPlaceholderText(/Conte sobre sua experiência/i), { target: { value: 'Comentário longo o suficiente para validação.' } });
    
    // Submeter
    fireEvent.click(screen.getByText('Submeter Avaliação'));

    await waitFor(() => {
      expect(onSubmittedMock).toHaveBeenCalled();
    });
  });
});
