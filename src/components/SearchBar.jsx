import { useState } from 'react';

function SearchBar({
  value,
  onChange,
  onSearch,
  className = '',
  autoFocus = false,
}) {
  const [internalValue, setInternalValue] = useState('');
  
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(currentValue);
    }
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`search-bar-container ${className}`}
    >
      <i className="bi bi-search search-bar-icon" aria-hidden="true"></i>
      <input
        type="text"
        className="search-bar-input"
        placeholder='Buscar por professor, disciplina ou departamento...'
        value={currentValue}
        onChange={handleChange}
        autoFocus={autoFocus}
      />
      <button type="submit" className="search-bar-btn">
        Pesquisar
      </button>
    </form>
  );
}

export default SearchBar;
