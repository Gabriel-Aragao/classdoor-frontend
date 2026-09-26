import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/SearchBar';
import FilterButton from '../../components/FilterButton';
import { authService } from '../../services/authService';

function HomePage() {
  const _navigate = useNavigate();
  const _user = authService.getCurrentUser();
  const [query, setQuery] = useState('');

  const [tipobusca, setTipoBusca] = useState('Todos');
  const [departamento, setDepartamento] = useState('');
  const [semestre, setSemestre] = useState('');
  const [notaMinima, setNotaMinima] = useState('');
  

  const handleSearch = (searchTerm) => {
    if (!searchTerm?.trim()) return;
   
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className=" pt-2 bg-white p-4">
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

      <div className="filter-card p-3">
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
        <p className="fw-semibold mx-2 mb-2" style={{ fontSize: '13px', color: '#2C3E50' }}>Departamento</p>
        <div className="d-flex gap-2 mx-2 mb-3">
          
        </div>
      </div>
    </div>
  );
}

export default HomePage;
