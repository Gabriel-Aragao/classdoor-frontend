function RatingFilter({
  label = 'Nota Média Mínima',
  value = 4.0,
  onChange,
  min = 1.0,
  max = 5.0,
  step = 0.5,
  className = '',
  id = 'rating-filter-slider'
}) {
  const numericValue = typeof value === 'number' && !isNaN(value) ? value : (parseFloat(value) || 4.0);
  const percentage = Math.min(Math.max(((numericValue - min) / (max - min)) * 100, 0), 100);

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div className={`rating-filter-group ${className}`.trim()}>
      {label && (
        <label
          htmlFor={id}
          className="fw-semibold mb-2 d-block"
          style={{ fontSize: '13px', color: '#2C3E50' }}
        >
          {label}
        </label>
      )}

      <div className="rating-slider-wrapper">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={handleChange}
          className="rating-slider w-100"
          style={{
            background: `linear-gradient(to right, #18bc9c 0%, #18bc9c ${percentage}%, #e9ecef ${percentage}%, #e9ecef 100%)`
          }}
          aria-label={label}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2 px-1 user-select-none">
        <span
          className="d-flex align-items-center text-muted"
          style={{ fontSize: '12.5px', cursor: 'pointer' }}
          onClick={() => onChange && onChange(min)}
          title={`Definir ${min.toFixed(1)}`}
        >
          <i className="bi bi-star-fill text-warning me-1"></i>
          {min.toFixed(1)}
        </span>

        <span
          className="d-flex align-items-center fw-bold"
          style={{ fontSize: '13px', color: '#18BC9C' }}
        >
          <i className="bi bi-star-fill text-warning me-1"></i>
          {numericValue.toFixed(1)}+
        </span>

        <span
          className="d-flex align-items-center text-muted"
          style={{ fontSize: '12.5px', cursor: 'pointer' }}
          onClick={() => onChange && onChange(max)}
          title={`Definir ${max.toFixed(1)}`}
        >
          <i className="bi bi-star-fill text-warning me-1"></i>
          {max.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export default RatingFilter;
