import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useReviews } from '../../hooks/useReviews';
import { mockReviewService } from '../../services/mockReviewService';

describe('useReviews Hook (Card 012 / US04-US07)', () => {
  beforeEach(() => {
    mockReviewService.resetStorage();
  });

  it('deve carregar avaliações, métricas de scorecard e turmas para um professor', async () => {
    const { result } = renderHook(() =>
      useReviews({
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      })
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.reviews.length).toBeGreaterThan(0);
    expect(result.current.scorecard).not.toBeNull();
    expect(result.current.classes.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('deve alternar ordenação e resetar para página 0', async () => {
    const { result } = renderHook(() =>
      useReviews({
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSort('rating_desc');
    });

    expect(result.current.sort).toBe('rating_desc');
    expect(result.current.page).toBe(0);
  });

  it('deve realizar toggle de upvote com atualização de estado local', async () => {
    const { result } = renderHook(() =>
      useReviews({
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        currentUserId: 'hook_user_test',
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const targetReview = result.current.reviews[0];
    const initialUpvotes = targetReview.upvotes;

    await act(async () => {
      await result.current.toggleUpvote(targetReview.id);
    });

    const updated = result.current.reviews.find((r) => r.id === targetReview.id);
    expect(updated.upvotes).toBe(initialUpvotes + 1);
  });

  it('deve submeter nova avaliação e atualizar a listagem', async () => {
    const { result } = renderHook(() =>
      useReviews({
        professorId: 'prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialTotal = result.current.reviews.length;

    await act(async () => {
      await result.current.submitReview({
        classId: 'cls-carlos-aed-2026-1',
        rating: 5.0,
        difficulty: 2.0,
        wouldRecommend: true,
        comment: 'Avaliação submetida via Hook!',
        isAnonymous: true,
        userEmail: 'aluno_hook_test@universidade.edu.br',
      });
    });

    expect(result.current.reviews.length).toBe(initialTotal + 1);
  });
});
