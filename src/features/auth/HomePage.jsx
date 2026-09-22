import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import SearchBar from '../../components/SearchBar';
import { authService } from '../../services/authService';

function HomePage() {
  const _navigate = useNavigate();
  const _user = authService.getCurrentUser();
  const [query, setQuery] = useState('');

  const handleSearch = (searchTerm) => {
    if (!searchTerm?.trim()) return;
    console.log('Pesquisando por:', searchTerm);
    // Exemplo: navigate(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="container pt-2 bg-white ">
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
    </div>
  );
}

export default HomePage;
