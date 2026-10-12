import { useState, useEffect, useRef } from 'react';

function SearchBar({
  value,
  onChange,
  onSearch,
  onSearchDelayed,
  suggestions = null,     
  onSuggestionClick,      
  className = '',
  autoFocus = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const hasSuggestions =
    suggestions &&
    ((suggestions.professors?.length ?? 0) + (suggestions.courses?.length ?? 0)) > 0;
  const showDropdown = isFocused && hasSuggestions;

  // Debounce para onSearchDelayed
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (onSearchDelayed) {
        onSearchDelayed(searchTerm);
      }
    }, 200);
    return () => clearTimeout(timerId);
  }, [searchTerm, onSearchDelayed]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isControlled) setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFocused(false);
    if (onSearch) onSearch(currentValue);
  };

  const handleSuggestionClick = (item) => {
    setIsFocused(false);
    if (onSuggestionClick) onSuggestionClick(item);
  };

  return (
    <div ref={wrapperRef} className={`search-bar-wrapper ${className}`.trim()}>
      <form role="search" onSubmit={handleSubmit} className="search-bar-container">
        <i className="bi bi-search search-bar-icon"></i>
        <input
          type="text"
          className="search-bar-input"
          placeholder="Buscar por professor, disciplina ou departamento..."
          value={currentValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          autoFocus={autoFocus}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        <button type="submit" className="search-bar-btn">
          Pesquisar
        </button>
      </form>

      {showDropdown && (
        <div className="search-suggestions-dropdown" role="listbox" aria-label="Sugestões de busca">
          {/* Grupo: Docentes */}
          {suggestions.professors?.length > 0 && (
            <>
              <div className="search-suggestion-group-label">
                <i className="bi bi-person-fill me-1"></i> Docentes
              </div>
              {suggestions.professors.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  className="search-suggestion-item"
                  onMouseDown={(e) => e.preventDefault()} // evita blur antes do click
                  onClick={() => handleSuggestionClick({ ...p, type: 'professor' })}
                >
                  <span className="suggestion-title">{p.name}</span>
                  <span className="suggestion-meta">{p.department}</span>
                </button>
              ))}
            </>
          )}

          {/* Grupo: Disciplinas */}
          {suggestions.courses?.length > 0 && (
            <>
              <div className="search-suggestion-group-label">
                <i className="bi bi-book-fill me-1"></i> Disciplinas
              </div>
              {suggestions.courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  className="search-suggestion-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick({ ...c, type: 'course' })}
                >
                  <span className="suggestion-title">{c.name}</span>
                  <span className="suggestion-meta">{c.code} • {c.department}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
