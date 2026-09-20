import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { mockAuthService } from '../../services/mockAuthService';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSent(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Digite um e-mail válido.');
      return;
    }

    await mockAuthService.requestPasswordReset(email.trim());
    setSent(true);
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-shell">
        <section className="auth-card recovery-card" aria-label="Recuperação de senha">
          <div className="recovery-icon"><i className="bi bi-key-fill" /></div>
          <div className="auth-heading">
            <h1>Esqueceu sua senha?</h1>
            <p>Insira seu e-mail cadastrado e enviaremos um link de redefinição com validade de 24 horas.</p>
          </div>

          {error && <div className="auth-alert" role="alert">{error}</div>}
          {sent && <div className="auth-success" role="status">Link de recuperação enviado! Verifique seu e-mail.</div>}

          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="auth-primary">Enviar Link de Recuperação</button>
          </form>

          <button type="button" className="recovery-back" onClick={() => navigate('/login')}>
            ← Voltar para o Login
          </button>

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
