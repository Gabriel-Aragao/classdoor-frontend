import { useNavigate } from 'react-router-dom';

function AuthTabs({ page }) {
  const navigate = useNavigate();

  return (
    <div className="auth-tabs" role="tablist" aria-label="Autenticação">
      <button
        type="button"
        role="tab"
        aria-selected={page === 'login'}
        className={page === 'login' ? 'active' : ''}
        onClick={() => navigate('/login')}
      >
        Acessar Conta
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={page === 'register'}
        className={page === 'register' ? 'active' : ''}
        onClick={() => navigate('/register')}
      >
        Criar Conta
      </button>
    </div>
  );
}

export default AuthTabs;
