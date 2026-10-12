import { useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import RatingStars from '../ui/RatingStars';

function ReviewModal({ isOpen, onClose, professorId, courseId, classId, onSubmitted }) {
  const { submitReview } = useReviews({ professorId, courseId });
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(3);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 20) {
      setError('O comentário deve ter pelo menos 20 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitReview({
        classId,
        rating,
        difficulty,
        comment,
        isAnonymous,
      });
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao submeter avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Avaliar Turma</h2>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar" />
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert alert-danger p-2">{error}</div>}
          
          <div className="mb-3">
            <label className="form-label">Nota (1 a 5 estrelas)</label>
            <div className="d-flex align-items-center">
                <input type="range" min="1" max="5" step="0.5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="form-range w-50" />
                <span className="ms-3">{rating.toFixed(1)}</span>
            </div>
            <RatingStars rating={rating} />
          </div>

          <div className="mb-3">
            <label className="form-label">Dificuldade (1: Muito Fácil - 5: Muito Difícil)</label>
            <input type="range" min="1" max="5" step="0.5" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} className="form-range" />
            <span className="badge bg-secondary">{difficulty.toFixed(1)}</span>
          </div>

          <div className="mb-3">
            <label className="form-label">Comentário (min. 20 caracteres)</label>
            <textarea className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" required />
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="anon-toggle" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
            <label className="form-check-label" htmlFor="anon-toggle">
                🛡️ Enviar como anônimo
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Submeter Avaliação'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
