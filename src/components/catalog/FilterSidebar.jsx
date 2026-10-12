import { DEPARTMENTS } from '../../services/mockCatalogData';

const SEMESTER_OPTIONS = [
  { value: 'ALL', label: 'Todos os Períodos' },
  { value: '2026.1', label: '2026.1 (Atual)' },
  { value: '2026.2', label: '2026.2' },
  { value: '1º Semestre', label: '1º Semestre' },
  { value: '2º Semestre', label: '2º Semestre' },
  { value: '3º Semestre', label: '3º Semestre' },
  { value: '4º Semestre', label: '4º Semestre' },
  { value: '5º Semestre', label: '5º Semestre' },
  { value: '6º Semestre', label: '6º Semestre' },
];

const RATING_OPTIONS = [
  { value: 0, label: 'Todas as notas' },
  { value: 4.5, label: '4.5+ ★ Excelente' },
  { value: 4.0, label: '4.0+ ★ Muito Bom' },
  { value: 3.5, label: '3.5+ ★ Bom' },
  { value: 3.0, label: '3.0+ ★ Regular' },
];

function FilterSidebar({
  filters,
  onChange,
  onReset,
  departments = DEPARTMENTS,
  isMobileOpen = false,
  onCloseMobile,
  totalResults = 0,
}) {
  const { type = 'ALL', department = 'ALL', semester = 'ALL', minRating = 0, sort = 'rating' } = filters;

  const hasActiveFilters =
    type !== 'ALL' ||
    department !== 'ALL' ||
    semester !== 'ALL' ||
    minRating > 0 ||
    sort !== 'rating';

  const handleTypeChange = (newType) => {
    onChange({ ...filters, type: newType });
  };

  const handleDepartmentChange = (e) => {
    onChange({ ...filters, department: e.target.value });
  };

  const handleSemesterChange = (e) => {
    onChange({ ...filters, semester: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    onChange({ ...filters, minRating: newRating });
  };

  const handleSortChange = (e) => {
    onChange({ ...filters, sort: e.target.value });
  };

  return (
    <>
      {/* Backdrop para mobile drawer */}
      {isMobileOpen && (
        <div
          className="filter-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`filter-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        aria-label="Filtros acadêmicos"
      >
        <div className="filter-header">
          <div className="filter-header-title">
            <i className="bi bi-funnel-fill text-primary" aria-hidden="true" />
            <span>Filtros Acadêmicos</span>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              className="btn-close-filter-mobile"
              onClick={onCloseMobile}
              aria-label="Fechar filtros"
            >
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Resumo de resultados */}
        <div className="filter-results-summary">
          <span className="results-count-badge">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'item encontrado' : 'itens encontrados'}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={onReset}
              title="Restaurar filtros originais"
            >
              <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* 1. Tipo de Catálogo */}
        <div className="filter-section">
          <label className="filter-label" id="filter-type-label">Tipo de Item</label>
          <div className="filter-type-group" role="radiogroup" aria-labelledby="filter-type-label">
            <button
              type="button"
              role="radio"
              aria-checked={type === 'ALL'}
              className={`filter-type-btn ${type === 'ALL' ? 'active' : ''}`}
              onClick={() => handleTypeChange('ALL')}
            >
              <i className="bi bi-grid-fill" aria-hidden="true" />
              <span>Todos</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={type === 'PROFESSORS'}
              className={`filter-type-btn ${type === 'PROFESSORS' ? 'active' : ''}`}
              onClick={() => handleTypeChange('PROFESSORS')}
            >
              <i className="bi bi-person-fill" aria-hidden="true" />
              <span>Professores</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={type === 'COURSES'}
              className={`filter-type-btn ${type === 'COURSES' ? 'active' : ''}`}
              onClick={() => handleTypeChange('COURSES')}
            >
              <i className="bi bi-journal-text" aria-hidden="true" />
              <span>Disciplinas</span>
            </button>
          </div>
        </div>

        {/* 2. Departamento */}
        <div className="filter-section">
          <label htmlFor="filter-department" className="filter-label">
            Departamento
          </label>
          <div className="select-wrapper">
            <select
              id="filter-department"
              className="filter-select"
              value={department}
              onChange={handleDepartmentChange}
            >
              <option value="ALL">Todos os Departamentos</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down select-chevron" aria-hidden="true" />
          </div>
        </div>

        {/* 3. Período Letivo Semestral */}
        <div className="filter-section">
          <label htmlFor="filter-semester" className="filter-label">
            Período Letivo
          </label>
          <div className="select-wrapper">
            <select
              id="filter-semester"
              className="filter-select"
              value={semester}
              onChange={handleSemesterChange}
            >
              {SEMESTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down select-chevron" aria-hidden="true" />
          </div>
        </div>

        {/* 4. Faixa de Estrelas (Nota Mínima) */}
        <div className="filter-section">
          <label className="filter-label">Avaliação Mínima</label>
          <div className="rating-filter-options">
            {RATING_OPTIONS.map((opt) => {
              const isSelected = Number(minRating) === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`rating-filter-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleRatingChange(opt.value)}
                >
                  {opt.value > 0 ? (
                    <>
                      <i className="bi bi-star-fill text-warning" aria-hidden="true" />
                      <span>{opt.label}</span>
                    </>
                  ) : (
                    <span>{opt.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Ordenação */}
        <div className="filter-section">
          <label htmlFor="filter-sort" className="filter-label">
            Ordenar Por
          </label>
          <div className="select-wrapper">
            <select
              id="filter-sort"
              className="filter-select"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="rating">Melhor Avaliados (Nota ★)</option>
              <option value="reviews">Mais Avaliados (Volume)</option>
              <option value="name">Nome (Ordem Alfabética)</option>
              <option value="difficulty">Maior Dificuldade</option>
            </select>
            <i className="bi bi-chevron-down select-chevron" aria-hidden="true" />
          </div>
        </div>

        {/* Botão de Redefinir no final */}
        <div className="filter-footer">
          <button
            type="button"
            className="btn-reset-all"
            onClick={onReset}
            disabled={!hasActiveFilters}
          >
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
            <span>Restaurar Todos os Filtros</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default FilterSidebar;
