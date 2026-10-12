function getInitials(text) {
  if (!text) return '';
  const clean = text.replace(/^(Dr\.|Dra\.|Prof\.|Profa\.)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ResultCard({
  initials,
  avatarColor = 'green', // 'green' | 'blue' | 'orange'
  title,
  subtitle,
  rating,
  reviewsCount,
  isPrimaryButton = true,
  buttonText = 'Ver Perfil Completo',
  onViewProfile,
  className = '',
  ...props
}) {
  const displayInitials = initials || getInitials(title);
  const formattedReviews = typeof reviewsCount === 'number'
    ? `(${reviewsCount} avaliações)`
    : reviewsCount;

  return (
    <div className={`result-card ${className}`.trim()} {...props}>
      {/* 1. Avatar circular com iniciais */}
      <div className={`result-avatar ${avatarColor}`}>
        {displayInitials}
      </div>

      {/* 2. Informações textuais */}
      <div className="w-100 mb-2">
        <h2 className="result-card-title">{title}</h2>
        {subtitle && <p className="result-card-subtitle">{subtitle}</p>}

        {/* 3. Avaliação e contagem */}
        {(rating !== undefined || formattedReviews) && (
          <div className="result-card-rating">
            <i className="bi bi-star-fill text-warning"></i>
            {rating !== undefined && (
              <span className="result-card-score">
                {typeof rating === 'number' ? rating.toFixed(1) : rating}
              </span>
            )}
            {formattedReviews && (
              <span className="result-card-reviews">{formattedReviews}</span>
            )}
          </div>
        )}
      </div>

      {/* 4. Botão de ação */}
      <button
        type="button"
        className={`result-card-btn ${isPrimaryButton ? 'primary' : 'outline'}`}
        onClick={onViewProfile}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default ResultCard;
