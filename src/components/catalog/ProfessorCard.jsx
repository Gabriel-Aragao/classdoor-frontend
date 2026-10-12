import { useNavigate } from 'react-router-dom';
import RatingStars from '../ui/RatingStars';

function ProfessorCard({ professor, onSelect }) {
  const navigate = useNavigate();

  if (!professor) return null;

  const handleAction = () => {
    if (onSelect) {
      onSelect(professor);
    } else {
      navigate(`/professores/${professor.id}`);
    }
  };

  const avatarUrl =
    professor.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(professor.name)}&backgroundColor=b6e3f4`;

  return (
    <article className="catalog-card professor-card" aria-label={`Professor ${professor.name}`}>
      <div className="catalog-card-header">
        <div className="catalog-avatar-wrapper">
          <img
            src={avatarUrl}
            alt={professor.name}
            className="catalog-avatar"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(professor.name)}`;
            }}
          />
          {professor.featured && (
            <span className="featured-badge" title="Docente em Destaque">
              <i className="bi bi-star-fill" aria-hidden="true" /> Top
            </span>
          )}
        </div>

        <div className="catalog-header-info">
          <span className="catalog-type-pill">
            <i className="bi bi-person-badge" aria-hidden="true" /> Professor
          </span>
          <h3 className="catalog-title" title={professor.name}>
            {professor.name}
          </h3>
          <div className="catalog-department" title={professor.department}>
            <i className="bi bi-building" aria-hidden="true" />
            <span>{professor.department}</span>
          </div>
          {professor.title && (
            <span className="catalog-academic-title">{professor.title}</span>
          )}
        </div>
      </div>

      <div className="catalog-card-metrics">
        <div className="metric-row-main">
          <RatingStars rating={professor.averageRating} size="sm" />
          <span className="recommendation-badge">
            <i className="bi bi-hand-thumbs-up-fill" aria-hidden="true" />
            <span>{professor.recommendationPercentage}% recomendam</span>
          </span>
        </div>

        <div className="metric-row-sub">
          <span className="difficulty-metric" title="Nível de Dificuldade">
            <i className="bi bi-lightning-charge" aria-hidden="true" />
            Dificuldade: <strong>{professor.difficultyRating.toFixed(1)} / 5.0</strong>
          </span>
          <span className="reviews-metric" title="Total de avaliações">
            <i className="bi bi-chat-square-text" aria-hidden="true" />
            <strong>{professor.totalReviews}</strong> avaliações
          </span>
        </div>
      </div>

      {professor.bio && (
        <p className="catalog-description" title={professor.bio}>
          {professor.bio}
        </p>
      )}

      {professor.topTags && professor.topTags.length > 0 && (
        <div className="catalog-tags">
          {professor.topTags.slice(0, 3).map((tag, index) => (
            <span key={index} className="catalog-tag">
              <i className="bi bi-tag-fill" aria-hidden="true" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      <div className="catalog-card-footer">
        <button
          type="button"
          className="btn-view-profile"
          onClick={handleAction}
          aria-label={`Ver perfil de ${professor.name}`}
        >
          <span>Ver Perfil</span>
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default ProfessorCard;
