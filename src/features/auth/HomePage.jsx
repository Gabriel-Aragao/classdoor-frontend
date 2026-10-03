import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/SearchBar';
import FilterButton from '../../components/FilterButton';
import FilterSelect from '../../components/FilterSelect';
import RatingFilter from '../../components/RatingFilter';
import { authService } from '../../services/authService';
import { DEPARTMENTS } from '../../services/mockCatalogData';

function HomePage() {
  const _navigate = useNavigate();
  const _user = authService.getCurrentUser();
  const [query, setQuery] = useState('');

  const [tipobusca, setTipoBusca] = useState('Todos');
  const [departamento, setDepartamento] = useState('Ciência da Computação');
  const [semestre, setSemestre] = useState('2026.1 (Atual)');
  const [notaMinima, setNotaMinima] = useState(4.0);
  // lista apenas para testes.
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


  const handleSearch = (searchTerm) => {
    if (!searchTerm?.trim()) return;
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
        </aside>

        
        <main className="flex-grow-1 pt-2">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <p className="fw-bold mb-0" style={{ fontSize: '18px', color: '#2C3E50' }}>
              Resultados em Destaque (3 encontrados)
            </p>
          </div>
          
          
        </main>
      </div>
      
    </div>
  );
}

export default HomePage;
