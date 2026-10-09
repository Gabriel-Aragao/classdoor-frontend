import { useState, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/SearchBar';
import FilterButton from '../../components/FilterButton';
import FilterSelect from '../../components/FilterSelect';
import RatingFilter from '../../components/RatingFilter';
import { DEPARTMENTS } from '../../services/mockCatalogData';
import { useCatalogSearch, useProfessors, useCourses } from '../../hooks/useCatalog';
import ResultCard from '../../components/ResultCard';

function HomePage() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [query, setQuery] = useState('');

  const [tipobusca, setTipoBusca] = useState('Todos');
  const [departamento, setDepartamento] = useState('Ciência da Computação');
  const [semestre, setSemestre] = useState('2026.1 (Atual)');
  const [notaMinima, setNotaMinima] = useState(4.0);

  const {data: searchSuggestions} = useCatalogSearch(query, 4);

  const SEMESTERTests = [
    '2026.1 (Atual)',
    '1º Semestre',
    '2º Semestre',
    '3º Semestre',
    '4º Semestre',
    '5º Semestre',
    '6º Semestre',
    '7º Semestre',
    '8º Semestre'
  ];

  const {data: professors, isLoading: loadingProfessors} = useProfessors(
    {query,
      department : departamento === 'Todos' ? '' : departamento,
      size: 20,
    }, {
      enabled: tipobusca === 'Todos' || tipobusca === 'Docentes'
    }
  );
  const {data: courses, isLoading: loadingCourses} = useCourses({
    query,
    department : departamento === 'Todos' ? '' : departamento,
    size: 20,
  }, {
    enabled: tipobusca === 'Todos' || tipobusca === 'Cursos'
  });
  const loading = (tipobusca !== "Cursos" && loadingProfessors) || (tipobusca !== "Docentes" && loadingCourses);

  const results = useMemo(() => {
    let professorResults = [];
    let courseResults = [];

    if(tipobusca === "Todos" || tipobusca === "Docentes") {
      professorResults = (professors?.content || []).map((p, idx) => ({
        id: p.id,
        type: 'professor',
        title: p.name,
        subtitle: p.department,
        rating: p.averageRating,
        reviewsCount: p.totalReviews,
        avatarColor: idx % 2 == 0 ? "green" : "blue"
      }))
    }

    if (tipobusca === "Todos" || tipobusca === "Cursos") {
      courseResults = (courses?.content || []).map(c => ({
        id: c.id,
        type: 'course',
        title: c.name,
        subtitle: `${c.code} • ${c.credits ? `${c.credits * 15}h` : '60h'}`,
        rating: c.averageRating,
        reviewsCount: c.totalReviews,
        avatarColor: "orange"
      }))
    }
    let combinedResults = [...professorResults, ...courseResults];
    if (notaMinima) {
      combinedResults = combinedResults.filter((item) =>
      item.rating >= Number(notaMinima))
    }
    return combinedResults;
  }, [professors, courses, tipobusca, notaMinima])
    

  const handleFilterSearch = () => {
    setTipoBusca('Todos');
    setDepartamento('Ciência da Computação');
    setSemestre('2026.1 (Atual)');
    setNotaMinima(4.0);
    setQuery('');
    setSearchInputValue('');
  };

  const handleSearch = (searchTerm) => {
    const term = searchTerm || '';
    setSearchInputValue(term);
    setQuery(term)
  };


  const handleSuggestionClick = (item) => {
    const nome = item.name || '';
    setSearchInputValue(nome);
    setQuery(nome);
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="pt-2 bg-white p-4">
        <h1 className="fw-bold mt-4 text-primary text-center" style={{ fontSize: '26px', color: '#2C3E50' }}>
          Encontre opiniões reais sobre professores e disciplinas
        </h1>
        <p className="fw-bold mb-4 text-center" style={{ fontSize: '15px', color: '#7B8A8B' }}>
          Tome as melhores decisões com base em avaliações acadêmicas 100% anônimas.
        </p>

        <SearchBar
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          onSearchDelayed={(delayedTerm) => setQuery(delayedTerm)}
          onSearch={handleSearch}
          suggestions={searchSuggestions}
          onSuggestionClick={handleSuggestionClick}
          className="mx-auto"
        />
      </div>

      <div className="container-fluid d-flex align-items-start gap-4 px-3 px-lg-4 pt-2 pb-4">
        <aside className="filter-card p-3 m-2 flex-shrink-0" style={{ marginTop: '-8px' }}>
          <div className="d-flex gap-2 mb-3 p-2">
            <i className="bi bi-lightning-charge-fill text-warning"></i>
            <p className="fw-bold mb-0" style={{ fontSize: '18px', color: '#2C3E50' }}>
              Filtros Avançados
            </p>
          </div>

          <p className="fw-semibold mx-2 mb-2" style={{ fontSize: '13px', color: '#2C3E50' }}>Tipo de Busca</p>
          <div className="d-flex gap-2 mx-2 mb-3">
            <FilterButton
              label="Todos"
              isActive={tipobusca === 'Todos'}
              onClick={() => setTipoBusca('Todos')}
            />
            <FilterButton
              label="Docentes"
              isActive={tipobusca === 'Docentes'}
              onClick={() => setTipoBusca('Docentes')}
            />
            <FilterButton
              label="Cursos"
              isActive={tipobusca === 'Cursos'}
              onClick={() => setTipoBusca('Cursos')}
            />
          </div>

          <FilterSelect
            label="Departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            options={DEPARTMENTS}
            className="mx-2 mb-3"
          />
          <FilterSelect
            label="Semestre"
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            options={SEMESTERTests}
            className="mx-2 mb-3"
          />

          <RatingFilter
            label="Nota Média Mínima"
            value={notaMinima}
            onChange={(val) => setNotaMinima(val)}
            className="mx-2 mb-3"
          />
          <button
            className="btn w-100 bg-white fw-semibold mt-1" style={{ borderColor: "#CED4DA" }}
            onClick={handleFilterSearch}
          >
            <i className='fw-semibold' style={{ fontSize: "14px", color: "#7B8A8B" }}>Limpar Filtros</i>
          </button>
        </aside>


        <main className="flex-grow-1 pt-2">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <p className="fw-bold mb-0" style={{ fontSize: '18px', color: '#2C3E50' }}>
              Resultados em Destaque ({loading ? '...' : `${results.length} encontrados`})
            </p>
          </div>

          {loading ? (
            <div className="d-flex align-items-center justify-content-center p-5 text-muted">
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
              <span>Carregando resultados...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3 p-4 text-center  text-muted">
              <i className="bi bi-search fs-3 d-block mb-2 text-secondary pt-5"></i>
              <p className="mb-0 fw-semibold">Nenhum resultado encontrado com os filtros selecionados.</p>
              <small>Tente alterar o departamento ou diminuir a nota mínima.</small>
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-4 align-items-stretch">
              {results.map((item, idx) => (
                <ResultCard
                  key={item.id}
                  avatarColor={item.avatarColor}
                  title={item.title}
                  subtitle={item.subtitle}
                  rating={item.rating}
                  reviewsCount={item.reviewsCount}
                />
              ))}
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

export default HomePage;
