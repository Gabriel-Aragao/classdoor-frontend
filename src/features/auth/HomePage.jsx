import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { authService } from '../../services/authService';

function HomePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <div className="auth-page">
      <Navbar />
      <main className="home-page-content">
        <section className="home-card">
          <span className="home-badge">Acesso autorizado</span>
          <h1>Bem-vindo ao Classdoor!</h1>
          <p>{user ? `Olá, ${user.name}.` : 'Login realizado com sucesso.'}</p>
          <p>Você foi redirecionado para a Home após a autenticação.</p>
          <button type="button" className="auth-primary home-button" onClick={() => { authService.logout(); navigate('/login'); }}>
            Sair da conta
          </button>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
