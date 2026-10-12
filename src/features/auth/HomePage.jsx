import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import FilterSidebar from '../../components/catalog/FilterSidebar';
import CatalogGrid from '../../components/catalog/CatalogGrid';
import { mockProfessorService } from '../../services/mockProfessorService';

const INITIAL_FILTERS = {
  type: 'ALL', // 'ALL' | 'PROFESSORS' | 'COURSES'
  department: 'ALL',
  semester: 'ALL',
  minRating: 0,
  sort: 'rating',
};

function HomePage() {
  const navigate = useNavigate();

  // Estados de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState({ professors: [], courses: [], totalCount: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchBoxRef = useRef(null);

  // Estados de filtros e catálogo
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce do termo de busca (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Carregar departamentos iniciais
  useEffect(() => {
    mockProfessorService.getDepartments({ delayMs: 0 }).then(setDepartments);
  }, []);

  // Autocomplete ao digitar na barra de pesquisa
  useEffect(() => {
    let isCancelled = false;

    if (!debouncedQuery) {
      return;
    }

    const runSearch = async () => {
      setIsSearching(true);
      try {
        const res = await mockProfessorService.searchGlobal({ query: debouncedQuery, limit: 5, delayMs: 100 });
        if (!isCancelled) {
          setSuggestions(res);
          setIsDropdownOpen(true);
          setIsSearching(false);
        }
      } catch {
        if (!isCancelled) setIsSearching(false);
      }
    };

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  // Fechar dropdown de sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Carregar dados de professores e disciplinas quando filtros ou busca mudam
  useEffect(() => {
    let isCancelled = false;

    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const [profRes, courseRes] = await Promise.all([
          mockProfessorService.getProfessors({
            query: debouncedQuery,
            department: filters.department,
            minRating: filters.minRating,
            semester: filters.semester,
            sort: filters.sort,
            delayMs: 200,
          }),
          mockProfessorService.getCourses({
            query: debouncedQuery,
            department: filters.department,
            minRating: filters.minRating,
            semester: filters.semester,
            sort: filters.sort,
            delayMs: 200,
          }),
        ]);

        if (!isCancelled) {
          setProfessors(profRes.content);
          setCourses(courseRes.content);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Erro ao buscar catálogo:', err);
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchCatalog();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm('');
    setDebouncedQuery('');
  };

  const handleSelectSuggestion = (item, type) => {
    setIsDropdownOpen(false);
    if (type === 'PROFESSOR') {
      navigate(`/professores/${item.id}`);
    } else {
      navigate(`/disciplinas/${item.id}`);
    }
  };

  const totalResults = useMemo(() => {
    let count = 0;
    if (filters.type === 'ALL' || filters.type === 'PROFESSORS') {
      count += professors.length;
    }
    if (filters.type === 'ALL' || filters.type === 'COURSES') {
      count += courses.length;
    }
    return count;
  }, [filters.type, professors.length, courses.length]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.type !== 'ALL') count += 1;
    if (filters.department !== 'ALL') count += 1;
    if (filters.semester !== 'ALL') count += 1;
    if (filters.minRating > 0) count += 1;
    if (filters.sort !== 'rating') count += 1;
    if (debouncedQuery) count += 1;
    return count;
  }, [filters, debouncedQuery]);

  return (
    <div className="home-layout">
      <Navbar />

      {/* Hero Section com Barra de Busca Global */}
      <section className="home-hero-section" aria-label="Busca e Apresentação">
        <div className="home-hero-container">
          <div className="hero-badge-pill">
            <i className="bi bi-shield-check text-success" aria-hidden="true" />
            <span>Avaliações 100% Anônimas • Classdoor</span>
          </div>

          <h1 className="hero-title">
            Avaliações Reais de Professores &amp; Disciplinas
          </h1>
          <p className="hero-subtitle">
            Consulte notas de didática, nível de dificuldade e feedbacks anônimos de estudantes para planejar sua grade universitária.
          </p>

          {/* Search Box Central com Debounce e Autocomplete */}
          <div className="hero-search-wrapper" ref={searchBoxRef}>
            <div className="hero-search-box">
              <span className="search-icon-prefix">
                {isSearching ? (
                  <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />
                ) : (
                  <i className="bi bi-search" aria-hidden="true" />
                )}
              </span>

              <input
                type="text"
                className="hero-search-input"
                placeholder="Busque por professor, disciplina, ementa ou departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (debouncedQuery && suggestions.totalCount > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                aria-label="Buscar professores e disciplinas"
                autoComplete="off"
              />

              {searchTerm && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedQuery('');
                    setIsDropdownOpen(false);
                  }}
                  title="Limpar busca"
                  aria-label="Limpar termo de busca"
                >
                  <i className="bi bi-x-circle-fill" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Dropdown de Autocomplete / Sugestões Rápidas */}
            {isDropdownOpen && debouncedQuery && (
              <div className="autocomplete-menu" role="listbox" aria-label="Sugestões de busca">
                <div className="autocomplete-header">
                  <span>Resultados para "{debouncedQuery}"</span>
                  <span className="badge bg-secondary text-white">{suggestions.totalCount} encontrados</span>
                </div>

                {suggestions.totalCount === 0 ? (
                  <div className="autocomplete-empty">
                    <i className="bi bi-search text-muted me-2" aria-hidden="true" />
                    <span>Nenhuma sugestão rápida encontrada.</span>
                  </div>
                ) : (
                  <div className="autocomplete-items-list">
                    {suggestions.professors.length > 0 && (
                      <div className="autocomplete-group">
                        <div className="autocomplete-group-title">
                          <i className="bi bi-person-fill" aria-hidden="true" /> Professores
                        </div>
                        {suggestions.professors.map((prof) => (
                          <div
                            key={prof.id}
                            className="autocomplete-item"
                            role="option"
                            aria-selected="false"
                            onClick={() => handleSelectSuggestion(prof, 'PROFESSOR')}
                          >
                            <img
                              src={prof.avatarUrl}
                              alt={prof.name}
                              className="autocomplete-avatar"
                            />
                            <div className="autocomplete-text">
                              <span className="autocomplete-name">{prof.name}</span>
                              <span className="autocomplete-dept">{prof.department}</span>
                            </div>
                            <span className="autocomplete-rating">
                              <i className="bi bi-star-fill text-warning me-1" aria-hidden="true" />
                              {prof.averageRating.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {suggestions.courses.length > 0 && (
                      <div className="autocomplete-group">
                        <div className="autocomplete-group-title">
                          <i className="bi bi-journal-text" aria-hidden="true" /> Disciplinas
                        </div>
                        {suggestions.courses.map((course) => (
                          <div
                            key={course.id}
                            className="autocomplete-item"
                            role="option"
                            aria-selected="false"
                            onClick={() => handleSelectSuggestion(course, 'COURSE')}
                          >
                            <span className="autocomplete-code-pill">{course.code}</span>
                            <div className="autocomplete-text">
                              <span className="autocomplete-name">{course.name}</span>
                              <span className="autocomplete-dept">{course.department}</span>
                            </div>
                            <span className="autocomplete-rating">
                              <i className="bi bi-star-fill text-warning me-1" aria-hidden="true" />
                              {course.averageRating.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Chips de buscas sugeridas */}
            <div className="search-chips-row">
              <span className="chips-label">Sugestões rápidas:</span>
              {['Dr. Carlos Eduardo', 'Algoritmos', 'Dra. Ana Paula', 'Cálculo I', 'Engenharia de Software'].map(
                (chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="search-chip"
                    onClick={() => setSearchTerm(chip)}
                  >
                    {chip}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container com Barra Lateral e Grid */}
      <main className="catalog-main-content">
        <div className="catalog-layout-container">
          {/* Barra Lateral de Filtros (Desktop & Drawer Mobile) */}
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            departments={departments}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            totalResults={totalResults}
          />

          {/* Área Principal de Catálogo */}
          <section className="catalog-results-area" aria-label="Resultados do Catálogo">
            {/* Barra Superior de Controles e Filtro Mobile */}
            <div className="catalog-controls-bar">
              <div className="controls-summary">
                <span className="results-total-badge">
                  <strong>{totalResults}</strong> {totalResults === 1 ? 'resultado' : 'resultados'}
                  {debouncedQuery && <span> para "{debouncedQuery}"</span>}
                </span>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    className="btn-clear-all-chips"
                    onClick={handleResetFilters}
                    title="Limpar todos os filtros"
                  >
                    <i className="bi bi-x-circle me-1" aria-hidden="true" />
                    Limpar Filtros ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div className="controls-actions">
                {/* Botão para abrir gaveta mobile */}
                <button
                  type="button"
                  className="btn-toggle-filter-mobile"
                  onClick={() => setIsMobileFilterOpen(true)}
                  aria-label="Abrir filtros acadêmicos"
                >
                  <i className="bi bi-funnel-fill" aria-hidden="true" />
                  <span>Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="mobile-filter-badge">{activeFiltersCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Grid de Resultados */}
            <CatalogGrid
              professors={professors}
              courses={courses}
              type={filters.type}
              isLoading={isLoading}
              onResetFilters={handleResetFilters}
            />
          </section>
        </div>
      </main>

      {/* Rodapé institucional */}
      <footer className="catalog-footer">
        <div className="catalog-footer-inner">
          <div className="footer-brand">
            <i className="bi bi-mortarboard-fill text-success me-2" aria-hidden="true" />
            <span className="fw-bold">Classdoor</span>
            <span className="text-muted ms-2">• Avaliação Docente com Garantia de Anonimato Total</span>
          </div>
          <div className="footer-links">
            <a href="#termos">Termos de Uso</a>
            <a href="#privacidade">Privacidade</a>
            <a href="#ajuda">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
