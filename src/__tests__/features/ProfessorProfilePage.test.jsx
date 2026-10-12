import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfessorProfilePage from '../../features/catalog/ProfessorProfilePage';
import { mockReviewService } from '../../services/mockReviewService';

describe('ProfessorProfilePage Integration (US04)', () => {
  beforeEach(() => {
    mockReviewService.resetStorage();
  });

  it('deve renderizar o perfil do professor com scorecard e lista de reviews', async () => {
    const profId = 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    render(
      <MemoryRouter initialEntries={[`/professores/${profId}`]}>
        <Routes>
          <Route path="/professores/:id" element={<ProfessorProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Espera o loading finalizar
    await waitFor(
      () => {
        expect(screen.queryByText('Carregando perfil...')).toBeNull();
      },
      { timeout: 3000 }
    );

    // Agora deve encontrar os elementos após o carregamento
    expect(screen.getByText('Perfil do Professor')).not.toBeNull();
    expect(screen.getByText('Média Geral')).not.toBeNull();
    expect(screen.getByText('Distribuição de Notas')).not.toBeNull();
    
    // Verifica usando getAll para evitar o erro de múltiplos elementos
    const avaliacoesElements = screen.getAllByText(/Avaliações/i);
    expect(avaliacoesElements.length).toBeGreaterThan(0);
  });
});
