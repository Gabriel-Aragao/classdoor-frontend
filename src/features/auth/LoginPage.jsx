import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import AuthTabs from '../../components/layout/AuthTabs';
import { mockAuthService } from '../../services/mockAuthService';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    setError('');

    if (!emailValid || !passwordValid) {
      setError('Informe um e-mail e uma senha válidos.');
      return;
    }

    setLoading(true);
    try {
      await mockAuthService.loginUser({ email: email.trim(), password });
      if (remember) localStorage.setItem('@classdoor:remember_email', email.trim());
      else localStorage.removeItem('@classdoor:remember_email');
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Não foi possível entrar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-shell">
        <section className="auth-card" aria-label="Acesso à conta">
          <AuthTabs page="login" />

          <div className="auth-heading">
            <h1>Entrar no Sistema</h1>
            <p>Informe seu e-mail para acessar sua conta</p>
          </div>

          {error && <div className="auth-alert" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              className={touched.email && !emailValid ? 'auth-input invalid' : 'auth-input'}
              placeholder="estudante@universidade.edu"
              autoComplete="email"
            />
            {touched.email && !emailValid && <small className="field-error">Digite um e-mail válido.</small>}

            <div className="password-label-row">
              <label htmlFor="login-password">Senha de Acesso</label>
              <button type="button" className="auth-link" onClick={() => navigate('/recuperar-senha')}>
                Esqueci minha senha
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              className={touched.password && !passwordValid ? 'auth-input invalid' : 'auth-input'}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
            {touched.password && !passwordValid && <small className="field-error">A senha é obrigatória.</small>}

            <label className="remember-row">
              <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
              <span>Lembrar de mim</span>
            </label>

            <button type="submit" className="auth-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no Classdoor'}
            </button>
          </form>

          <div className="auth-security">
            <strong><i className="bi bi-shield-lock-fill" /> Acesso Seguro e Protegido</strong>
            <span>Identidade isolada das avaliações públicas garantindo anonimato total.</span>
          </div>

          <div className="auth-bottom">
            <span>Ainda não possui uma conta?</span>
            <button type="button" className="auth-secondary" onClick={() => navigate('/register')}>
              Criar Nova Conta
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
