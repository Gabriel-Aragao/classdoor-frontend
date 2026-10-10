import { useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import RatingStars from '../ui/RatingStars';
import StarRatingInput from './StarRatingInput';
import DifficultySlider from './DifficultySlider';
import AnonymityToggle from './AnonymityToggle';

function ReviewModal({ isOpen, onClose, professorId, courseId, classId, onSubmitted }) {
  const { submitReview } = useReviews({ professorId, courseId });
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(3);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [studentName, setStudentName] = useState('');
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
        studentName: !isAnonymous ? studentName : '',
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
          
          <div className="mb-4">
            <label className="form-label fw-bold">Nota de Avaliação</label>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Dificuldade</label>
            <DifficultySlider value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Comentário</label>
            <textarea className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" required placeholder="Conte sobre sua experiência com esta turma..." />
          </div>

          <div className="mb-4">
            <AnonymityToggle isAnonymous={isAnonymous} onChange={setIsAnonymous} />
            {!isAnonymous && (
                <div className="mt-2">
                    <input type="text" className="form-control" placeholder="Seu nome" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
                </div>
            )}
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
