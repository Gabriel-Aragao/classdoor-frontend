import RatingStars from '../ui/RatingStars';

function ReviewCard({ review, onUpvote }) {
  const avatarUrl =
    review.avatarUrl ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(review.studentName)}`;

  return (
    <article className="review-card">
      <div className="review-header">
        <img
          src={avatarUrl}
          alt={review.studentName}
          className="review-avatar"
        />
        <div className="review-user-info">
          <span className="review-user-name">{review.studentName}</span>
          <span className="review-meta">
            {new Date(review.createdAt).toLocaleDateString()} • {review.semester}
          </span>
        </div>
        <div className="review-rating-badge">
            <RatingStars rating={review.rating} size="sm" showValue={false} />
            <span className="fw-bold">{review.rating}</span>
        </div>
      </div>

      <p className="review-comment">{review.comment}</p>

      {review.tags && review.tags.length > 0 && (
        <div className="catalog-tags">
          {review.tags.map((tag, index) => (
            <span key={index} className="catalog-tag">
              <i className="bi bi-tag-fill" aria-hidden="true" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      <div className="review-footer">
        <button
          type="button"
          className={`btn-upvote ${review.hasUpvoted ? 'active' : ''}`}
          onClick={() => onUpvote(review.id)}
        >
          <i className={`bi ${review.hasUpvoted ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} aria-hidden="true" />
          <span>{review.upvotes || 0}</span>
        </button>
      </div>
    </article>
  );
}

export default ReviewCard;
