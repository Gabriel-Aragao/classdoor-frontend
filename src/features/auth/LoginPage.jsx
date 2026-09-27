import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import AuthTabs from '../../components/layout/AuthTabs';
import { mockAuthService } from '../../services/mockAuthService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem('@classdoor:remember_email') || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem('@classdoor:remember_email')));
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = EMAIL_REGEX.test(email.trim());
  const passwordValid = password.length > 0;

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    setError('');

    if (!emailValid || !passwordValid) {
      setError('Informe um e-mail válido e uma senha.');
      return;
    }

    setLoading(true);
    try {
      await mockAuthService.loginUser({ email: email.trim(), password });

      if (remember) {
        localStorage.setItem('@classdoor:remember_email', email.trim());
      } else {
        localStorage.removeItem('@classdoor:remember_email');
      }

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
      <main className="auth-shell login-shell">
        <section className="auth-card login-card" aria-label="Acesso à conta">
          <div className="auth-heading">
            <h1>Acesse o Classdoor</h1>
            <p>Avaliação docente ética, transparente e 100% anônima</p>
          </div>

          <AuthTabs page="login" />

          <div className="auth-section-title">Entrar no Sistema</div>
          <p className="auth-section-subtitle">Use seu e-mail cadastrado para acessar sua conta.</p>

          {error && <div className="auth-alert" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              className={touched.email && !emailValid ? 'auth-input invalid' : 'auth-input'}
              placeholder="estudante@universidade.edu"
              autoComplete="email"
            />
            {touched.email && !emailValid && (
              <small className="field-error">Digite um e-mail válido.</small>
            )}

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
              onChange={handlePasswordChange}
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              className={touched.password && !passwordValid ? 'auth-input invalid' : 'auth-input'}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
            {touched.password && !passwordValid && (
              <small className="field-error">A senha é obrigatória.</small>
            )}

            <label className="remember-row">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>Lembrar de mim</span>
            </label>

            <button type="submit" className="auth-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no Classdoor'}
            </button>
          </form>

          <div className="auth-security">
            <strong><i className="bi bi-shield-lock-fill" /> Acesso Seguro e Protegido</strong>
            <span>Sua conta é protegida com criptografia segura.</span>
          </div>

          <div className="auth-bottom">
            <span>Ainda não possui uma conta?</span>
            <button type="button" className="auth-secondary auth-secondary-green" onClick={() => navigate('/register')}>
              Criar Nova Conta
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
