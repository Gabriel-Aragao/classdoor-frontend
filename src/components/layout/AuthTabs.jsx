import { useNavigate } from 'react-router-dom';

function AuthTabs({ page }) {
  const navigate = useNavigate();

  return (
    <div className="auth-tabs" role="tablist" aria-label="Autenticação">
      <button
        type="button"
        className={page === 'login' ? 'active' : ''}
        onClick={() => navigate('/login')}
      >
        Acessar Conta
      </button>
      <button
        type="button"
        className={page === 'register' ? 'active' : ''}
        onClick={() => navigate('/register')}
      >
        Criar Nova Conta
      </button>
    </div>
  );
}

export default AuthTabs;
