import { useState, useEffect, useCallback } from 'react';
import { mockReviewService } from '../services/mockReviewService';

export function useReviews({
  professorId = null,
  courseId = null,
  initialSort = 'recentes',
  pageSize = 10,
  currentUserId = 'user_guest',
} = {}) {
  const [reviews, setReviews] = useState([]);
  const [scorecard, setScorecard] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Carregar turmas associadas para o formulário de avaliação
  useEffect(() => {
    let isMounted = true;
    try {
      const availableClasses = mockReviewService.getClasses({ professorId, courseId });
      if (isMounted) setClasses(availableClasses);
    } catch (_) {
      console.error('Erro ao buscar turmas para avaliação:');
    }
    return () => { isMounted = false; };
  }, [professorId, courseId]);

  // Carregar avaliações e métricas
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (professorId) {
        result = await mockReviewService.getReviewsByProfessorId(professorId, {
          sort,
          page,
          size: pageSize,
          delayMs: 100,
        });
      } else if (courseId) {
        result = await mockReviewService.getReviewsByCourseId(courseId, {
          sort,
          page,
          size: pageSize,
          delayMs: 100,
        });
      } else {
        result = {
          content: [],
          scorecard: mockReviewService.calculateScorecard([]),
          page: { number: 0, size: pageSize, totalElements: 0, totalPages: 0 },
        };
      }

      setReviews(result.content);
      setScorecard(result.scorecard);
      setTotalPages(result.page.totalPages);
      setTotalElements(result.page.totalElements);
    } catch (err) {
      setError(err.message || 'Erro ao carregar avaliações.');
    } finally {
      setIsLoading(false);
    }
  }, [professorId, courseId, sort, page, pageSize]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Submissão de nova avaliação
  const submitReview = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await mockReviewService.submitReview({
        professorId,
        courseId,
        ...formData,
      });

      // Recarrega a lista para refletir a nova submissão no topo
      await fetchReviews();
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Voto de utilidade
  const toggleUpvote = async (reviewId) => {
    try {
      const res = await mockReviewService.toggleUpvote(reviewId, currentUserId);

      // Atualização otimista no estado local
      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                upvotes: res.upvotes,
                upvotedBy: res.hasUpvoted
                  ? [...(r.upvotedBy || []), currentUserId]
                  : (r.upvotedBy || []).filter((id) => id !== currentUserId),
              }
            : r
        )
      );

      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    reviews,
    scorecard,
    classes,
    isLoading,
    error,
    sort,
    setSort: (newSort) => {
      setSort(newSort);
      setPage(0); // Reseta para a primeira página ao alterar ordenação
    },
    page,
    setPage,
    totalPages,
    totalElements,
    submitReview,
    toggleUpvote,
    refetch: fetchReviews,
  };
}

export default useReviews;
