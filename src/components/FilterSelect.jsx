function FilterSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  id,
  className = '',
  ...props
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`filter-select-group ${className}`.trim()}>
      {label && (
        <label
          htmlFor={selectId}
          className="fw-semibold mb-2 d-block"
          style={{ fontSize: '13px', color: '#2C3E50' }}
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className="form-select filter-select"
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const optValue = typeof option === 'object' ? option.value : option;
          const optLabel = typeof option === 'object' ? option.label : option;

          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FilterSelect;
