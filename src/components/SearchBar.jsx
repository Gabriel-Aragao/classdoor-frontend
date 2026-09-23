import { useState, useEffect } from 'react';

function SearchBar({
  value,
  onChange,
  onSearch,
  onSearchDelayed,
  className = '',
  autoFocus = false,
}) {

  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {

    const timerId = setTimeout(() => {
      if (onSearchDelayed) {
        onSearchDelayed(searchTerm);
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, onSearchDelayed]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
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
      <i className="bi bi-search search-bar-icon"></i>
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
