function RatingStars({ rating = 0, max = 5, size = 'md', showValue = true, count = null }) {
  const stars = [];
  const numericRating = Number(rating) || 0;
  const rounded = Math.round(numericRating * 2) / 2;

  for (let i = 1; i <= max; i += 1) {
    if (i <= rounded) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning" aria-hidden="true" />);
    } else if (i - 0.5 === rounded) {
      stars.push(<i key={i} className="bi bi-star-half text-warning" aria-hidden="true" />);
    } else {
      stars.push(<i key={i} className="bi bi-star text-muted opacity-50" aria-hidden="true" />);
    }
  }

  const sizeClass = size === 'sm' ? 'stars-sm' : size === 'lg' ? 'stars-lg' : 'stars-md';

  return (
    <div className={`rating-stars-wrapper ${sizeClass}`}>
      <div className="stars-icons" aria-label={`Nota: ${numericRating.toFixed(1)} de ${max}`}>
        {stars}
      </div>
      {showValue && (
        <span className="rating-value">{numericRating.toFixed(1)}</span>
      )}
      {count !== null && (
        <span className="rating-count">({count})</span>
      )}
    </div>
  );
}

export default RatingStars;
