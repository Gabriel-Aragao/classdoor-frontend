function FilterButton({
  label,
  isActive = false,
  onClick,
  className = '',
  ...props
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-btn ${isActive ? 'active' : ''} ${className}`.trim()}
      {...props}
    >
      {label}
    </button>
  );
}

export default FilterButton;
