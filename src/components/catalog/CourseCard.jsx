import { useNavigate } from 'react-router-dom';
import RatingStars from '../ui/RatingStars';

function CourseCard({ course, onSelect }) {
  const navigate = useNavigate();

  if (!course) return null;

  const handleAction = () => {
    if (onSelect) {
      onSelect(course);
    } else {
      navigate(`/disciplinas/${course.id}`);
    }
  };

  return (
    <article className="catalog-card course-card" aria-label={`Disciplina ${course.name}`}>
      <div className="catalog-card-header">
        <div className="catalog-course-badge-wrapper">
          <span className="course-code-badge">{course.code}</span>
          {course.featured && (
            <span className="featured-badge" title="Disciplina em Destaque">
              <i className="bi bi-star-fill" aria-hidden="true" /> Top
            </span>
          )}
        </div>

        <div className="catalog-header-info">
          <div className="catalog-type-row">
            <span className="catalog-type-pill course-pill">
              <i className="bi bi-journal-text" aria-hidden="true" /> Disciplina
            </span>
            {course.semester && (
              <span className="semester-pill" title="Semestre Regular">
                <i className="bi bi-calendar3" aria-hidden="true" /> {course.semester}
              </span>
            )}
          </div>
          <h3 className="catalog-title" title={course.name}>
            {course.name}
          </h3>
          <div className="catalog-department" title={course.department}>
            <i className="bi bi-building" aria-hidden="true" />
            <span>{course.department}</span>
            {course.credits && (
              <span className="course-credits">• {course.credits} créditos</span>
            )}
          </div>
        </div>
      </div>

      <div className="catalog-card-metrics">
        <div className="metric-row-main">
          <RatingStars rating={course.averageRating} size="sm" />
          <span className="recommendation-badge">
            <i className="bi bi-hand-thumbs-up-fill" aria-hidden="true" />
            <span>{course.recommendationPercentage}% recomendam</span>
          </span>
        </div>

        <div className="metric-row-sub">
          <span className="difficulty-metric" title="Nível de Dificuldade">
            <i className="bi bi-lightning-charge" aria-hidden="true" />
            Dificuldade: <strong>{course.difficultyRating.toFixed(1)} / 5.0</strong>
          </span>
          <span className="reviews-metric" title="Total de avaliações">
            <i className="bi bi-chat-square-text" aria-hidden="true" />
            <strong>{course.totalReviews}</strong> avaliações
          </span>
        </div>
      </div>

      {course.syllabus && (
        <p className="catalog-description" title={course.syllabus}>
          {course.syllabus}
        </p>
      )}

      {course.topTags && course.topTags.length > 0 && (
        <div className="catalog-tags">
          {course.topTags.slice(0, 3).map((tag, index) => (
            <span key={index} className="catalog-tag">
              <i className="bi bi-bookmark-fill" aria-hidden="true" />
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
          aria-label={`Ver ementa e avaliações de ${course.name}`}
        >
          <span>Ver Perfil</span>
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default CourseCard;
