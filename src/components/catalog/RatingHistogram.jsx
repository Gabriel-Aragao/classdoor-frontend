function RatingHistogram({ histogram = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } } }) {
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="rating-histogram">
      <h4 className="histogram-title">Distribuição de Notas</h4>
      {stars.map((star) => (
        <div key={star} className="histogram-row">
          <span className="star-label">{star}★</span>
          <div className="progress histogram-progress">
            <div
              className="progress-bar bg-warning"
              role="progressbar"
              style={{ width: `${histogram.percentages[star]}%` }}
              aria-valuenow={histogram.percentages[star]}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <span className="count-label">{histogram.percentages[star]}%</span>
        </div>
      ))}
    </div>
  );
}

export default RatingHistogram;
