import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { mockAuthService } from '../../services/mockAuthService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSent(false);

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Digite um e-mail válido.');
      return;
    }

    try {
      await mockAuthService.requestPasswordReset(email.trim());
      setSent(true);
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível enviar o link de recuperação.');
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-shell recovery-shell">
        <section className="auth-card recovery-card" aria-label="Recuperação de senha">
          <div className="auth-heading">
            <h1>Recuperar Acesso</h1>
            <p>Redefina sua senha de forma rápida e segura</p>
          </div>

          <div className="recovery-panel">
            <div className="recovery-icon"><i className="bi bi-key-fill" /></div>
            <h2>Esqueceu sua senha?</h2>
            <p>Informe seu e-mail cadastrado e enviaremos um link de redefinição com validade de 30 minutos.</p>

            {error && <div className="auth-alert" role="alert">{error}</div>}
            {sent && <div className="auth-success" role="status">Link de recuperação enviado! Verifique seu e-mail.</div>}

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="recovery-email">E-mail</label>
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="auth-input"
                placeholder="estudante@universidade.edu"
                autoComplete="email"
              />
              <button type="submit" className="auth-primary auth-primary-green">
                Enviar Link de Recuperação
              </button>
            </form>

            <button type="button" className="recovery-back" onClick={() => navigate('/login')}>
              ← Voltar para o Login
            </button>
          </div>

          <div className="auth-security">
            <strong><i className="bi bi-shield-check" /> Segurança da Conta</strong>
            <span>O link de redefinição será enviado para o seu e-mail verificado.</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;
