import ReviewCard from './ReviewCard';

function ReviewsList({ reviews, onUpvote, onSortChange, currentSort }) {
  return (
    <div className="reviews-list-container">
      <div className="reviews-list-header">
        <h3 className="section-title">Avaliações ({reviews.length})</h3>
        <select
          className="form-select form-select-sm sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="recentes">Mais Recentes</option>
          <option value="rating_desc">Melhor Avaliadas</option>
          <option value="upvotes_desc">Mais Úteis</option>
        </select>
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted">Nenhuma avaliação encontrada.</p>
      ) : (
        <div className="reviews-feed">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onUpvote={onUpvote} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
