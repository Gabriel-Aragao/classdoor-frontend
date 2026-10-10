import RatingStars from '../ui/RatingStars';

function ScorecardOverview({ scorecard }) {
  if (!scorecard) return null;

  return (
    <div className="scorecard-overview">
      <div className="scorecard-grid">
        <div className="scorecard-item">
          <span className="scorecard-value">{scorecard.averageRating}</span>
          <span className="scorecard-label">Média Geral</span>
          <RatingStars rating={scorecard.averageRating} showValue={false} size="sm" />
        </div>
        <div className="scorecard-item">
          <span className="scorecard-value">{scorecard.difficultyRating}</span>
          <span className="scorecard-label">Dificuldade</span>
          <i className="bi bi-lightning-charge text-muted" aria-hidden="true" />
        </div>
        <div className="scorecard-item">
          <span className="scorecard-value">{scorecard.recommendationPercentage}%</span>
          <span className="scorecard-label">Recomendam</span>
          <i className="bi bi-hand-thumbs-up-fill text-success" aria-hidden="true" />
        </div>
        <div className="scorecard-item">
          <span className="scorecard-value">{scorecard.totalReviews}</span>
          <span className="scorecard-label">Avaliações</span>
          <i className="bi bi-chat-square-text text-muted" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default ScorecardOverview;
