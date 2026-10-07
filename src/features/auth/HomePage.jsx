import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/SearchBar';
import FilterButton from '../../components/FilterButton';
import FilterSelect from '../../components/FilterSelect';
import RatingFilter from '../../components/RatingFilter';
import { authService } from '../../services/authService';
import { DEPARTMENTS } from '../../services/mockCatalogData';
import mockProfessorService from '../../services/mockProfessorService';
import ResultCard from '../../components/ResultCard';

function HomePage() {
  const _navigate = useNavigate();
  const _user = authService.getCurrentUser();
  const [query, setQuery] = useState('');

  const [tipobusca, setTipoBusca] = useState('Todos');
  const [departamento, setDepartamento] = useState('Ciência da Computação');
  const [semestre, setSemestre] = useState('2026.1 (Atual)');
  const [notaMinima, setNotaMinima] = useState(4.0);

  // Estados dos resultados vindos do mock
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lista para seleção de semestres
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

  // Efeito que carrega e filtra os dados do mock sempre que um filtro mudar
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadCatalogData() {
      try {
        let professors = [];
        let courses = [];

        // 1. Busca Professores se tipo for 'Todos' ou 'Docentes'
        if (tipobusca === 'Todos' || tipobusca === 'Docentes') {
          const profResponse = await mockProfessorService.getProfessors({
            query,
            department: departamento === 'Todos' ? '' : departamento,
            size: 20
          });

          professors = profResponse.content.map((p, idx) => ({
            id: p.id,
            type: 'professor',
            title: p.name,
            subtitle: p.department,
            rating: p.averageRating,
            reviewsCount: p.totalReviews,
            avatarColor: idx % 2 === 0 ? 'green' : 'blue'
          }));
        }

        // 2. Busca Cursos se tipo for 'Todos' ou 'Cursos'
        if (tipobusca === 'Todos' || tipobusca === 'Cursos') {
          const courseResponse = await mockProfessorService.getCourses({
            query,
            department: departamento === 'Todos' ? '' : departamento,
            size: 20
          });

          courses = courseResponse.content.map((c) => ({
            id: c.id,
            type: 'course',
            title: c.name,
            subtitle: `${c.code} • ${c.credits ? `${c.credits * 15}h` : '60h'}`,
            rating: c.averageRating,
            reviewsCount: c.totalReviews,
            avatarColor: 'orange'
          }));
        }

        // 3. Combina os resultados e filtra por nota mínima
        let combined = [...professors, ...courses];
        if (notaMinima) {
          combined = combined.filter((item) => item.rating >= Number(notaMinima));
        }

        if (isMounted) {
          setResults(combined);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao consultar dados mockados:', error);
        if (isMounted) setLoading(false);
      }
    }

    loadCatalogData();

    return () => {
      isMounted = false;
    };
  }, [tipobusca, departamento, notaMinima, query]);

  const handleFilterSearch = () => {
    setTipoBusca('Todos');
    setDepartamento('Ciência da Computação');
    setSemestre('2026.1 (Atual)');
    setNotaMinima(4.0);
    setQuery('');
  };

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm || '');
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
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
              className="btn w-100 bg-white fw-semibold mt-1" style={{borderColor: "#CED4DA"}}
              onClick={handleFilterSearch}
            >
              <i className='fw-semibold'style={{fontSize: "14px", color: "#7B8A8B"}}>Limpar Filtros</i>
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
                  isPrimaryButton={idx === false}
                  onViewProfile={() => console.log('Visualizar perfil:', item.id, item.title)}
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
