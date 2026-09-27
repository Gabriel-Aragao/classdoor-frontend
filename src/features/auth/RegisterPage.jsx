import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import AuthTabs from '../../components/layout/AuthTabs';
import { authService } from '../../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const isNameValid = name.trim().length >= 3;
  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const hasMinLength = password.length >= 8;
  const isPasswordValid = hasMinLength;

  const handleBlur = (field) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const getInputClass = (field, isValid) => {
    if (!touched[field]) return 'auth-input';
    return `auth-input ${isValid ? 'valid' : 'invalid'}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      setAlertType('danger');
      setAlertMessage('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setAlertMessage(null);

    try {
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: userType,
      });

      setAlertType('success');
      setAlertMessage('Conta criada com sucesso!');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setAlertType('danger');
      setAlertMessage(error.message || 'Não foi possível criar a conta.');
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-shell register-shell">
        <section className="auth-card register-card">
          <div className="auth-heading">
            <h1>Criar Nova Conta</h1>
            <p>Cadastre-se para participar da comunidade</p>
          </div>

          <AuthTabs page="register" />

          <div className="auth-section-title">Dados do Usuário</div>

          {alertMessage && (
            <div className={`auth-alert ${alertType === 'success' ? 'auth-success' : ''}`} role="alert">
              {alertMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="register-name">Nome Completo</label>
            <input
              id="register-name"
              type="text"
              className={getInputClass('name', isNameValid)}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Lucas Mendes Silva"
              autoComplete="name"
            />
            {touched.name && !isNameValid && (
              <small className="field-error">Digite ao menos 3 caracteres.</small>
            )}

            <label htmlFor="register-email">E-mail</label>
            <div className="input-with-status">
              <input
                id="register-email"
                type="email"
                className={getInputClass('email', isEmailValid)}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="lucas.silva@universidade.edu"
                autoComplete="email"
              />
              {isEmailValid && (
                <span className="validated-badge">
                  <i className="bi bi-check-circle-fill" /> Validado
                </span>
              )}
            </div>
            {touched.email && !isEmailValid && (
              <small className="field-error">Insira um e-mail válido.</small>
            )}

            <label>Tipo de Perfil Universitário</label>
            <div className="profile-options">
              <button
                type="button"
                className={userType === 'student' ? 'profile-option selected' : 'profile-option'}
                onClick={() => setUserType('student')}
              >
                <i className="bi bi-person-fill" /> Sou Estudante
              </button>
              <button
                type="button"
                className={userType === 'teacher' ? 'profile-option selected' : 'profile-option'}
                onClick={() => setUserType('teacher')}
              >
                <i className="bi bi-person-badge-fill" /> Sou Professor
              </button>
            </div>

            <label htmlFor="register-password">Criar Senha</label>
            <input
              id="register-password"
              type="password"
              className={getInputClass('password', isPasswordValid)}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••••••"
              autoComplete="new-password"
            />

            <div className="password-rules">
              <span className={hasMinLength ? 'rule-ok' : 'rule-pending'}>
                <i className={hasMinLength ? 'bi bi-check-circle-fill' : 'bi bi-circle'} /> Mínimo 8 dígitos
              </span>
              <span className={isEmailValid ? 'rule-ok' : 'rule-pending'}>
                <i className={isEmailValid ? 'bi bi-check-circle-fill' : 'bi bi-circle'} /> E-mail verificado
              </span>
            </div>

            {touched.password && !isPasswordValid && (
              <small className="field-error">A senha deve ter no mínimo 8 caracteres.</small>
            )}

            <button type="submit" className="auth-primary auth-primary-green">
              Criar Minha Conta
            </button>

            <p className="auth-bottom-label">Já possui conta cadastrada?</p>
            <button type="button" onClick={() => navigate('/login')} className="auth-secondary">
              Entrar com Conta Existente
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default RegisterPage;
