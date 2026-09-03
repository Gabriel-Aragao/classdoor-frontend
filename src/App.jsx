import { useState } from 'react'
import { useUserStore } from './store/index.js'
import { mockAuthService, SEED_USERS } from './services/index.js'
import './App.css'

function App() {
  const { user, token, isAuthenticated, isLoading, error, login, register, logout, clearError, forgotPassword } =
    useUserStore()

  const [email, setEmail] = useState('maria.santos@universidade.edu.br')
  const [password, setPassword] = useState('SenhaForte@2026')
  const [name, setName] = useState('Novo Aluno Teste')
  const [role, setRole] = useState('STUDENT')
  const [department, setDepartment] = useState('Ciência da Computação')
  const [feedback, setFeedback] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    clearError()
    setFeedback('')
    try {
      await login({ email, password })
      setFeedback('Login realizado com sucesso!')
    } catch (err) {
      setFeedback(`Falha: ${err.message}`)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    clearError()
    setFeedback('')
    try {
      await register({ name, email, password, role, department })
      setFeedback('Cadastro e login realizados com sucesso!')
    } catch (err) {
      setFeedback(`Falha: ${err.message}`)
    }
  }

  const handleForgotPassword = async () => {
    clearError()
    setFeedback('')
    try {
      const res = await forgotPassword(email)
      setFeedback(res.message)
    } catch (err) {
      setFeedback(`Falha: ${err.message}`)
    }
  }

  const handleResetDB = () => {
    mockAuthService.resetMockDatabase()
    setFeedback('Base mock restaurada com os usuários padrão!')
  }

  return (
    <div className="classdoor-app">
      <main className="container">
        <div className="card">
          <div className="badge">Classdoor • Auth &amp; Session</div>
          <h1>🎓 Autenticação Mock &amp; Estado Global (US01 &amp; US02)</h1>
          <p className="subtitle">
            Gerenciamento de sessão com <strong>Zustand</strong> e persistência em <code>localStorage</code>.
          </p>

          {/* Status da Sessão */}
          <div className="session-status" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '0.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>Status da Sessão:</strong> {isAuthenticated ? '🟢 Autenticado' : '⚪ Não autenticado'}</span>
              {isAuthenticated && (
                <button type="button" onClick={logout} style={{ padding: '0.3rem 0.75rem', background: '#dc3545', color: '#fff', borderRadius: '4px' }}>
                  Sair (Logout)
                </button>
              )}
            </div>
            {user && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>E-mail:</strong> {user.email}</p>
                <p><strong>Perfil (Role):</strong> {user.role}</p>
                <p><strong>Token:</strong> <code>{token ? `${token.substring(0, 30)}...` : 'Nenhum'}</code></p>
              </div>
            )}
          </div>

          {/* Feedbacks & Erros */}
          {error && <div style={{ color: '#842029', background: '#f8d7da', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
          {feedback && <div style={{ color: '#0f5132', background: '#d1e7dd', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{feedback}</div>}

          {/* Painel de Testes Rápidos */}
          <div style={{ textAlign: 'left', marginTop: '1.5rem' }}>
            <h3>Testar Autenticação (US01 &amp; US02)</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('maria.santos@universidade.edu.br')
                  setPassword('SenhaForte@2026')
                }}
                style={{ padding: '0.4rem 0.75rem', background: '#e9ecef', borderRadius: '4px' }}
              >
                Preencher Estudante (Maria)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('carlos.santos@universidade.edu.br')
                  setPassword('SenhaForte@2026')
                }}
                style={{ padding: '0.4rem 0.75rem', background: '#e9ecef', borderRadius: '4px' }}
              >
                Preencher Professor (Dr. Carlos)
              </button>
              <button
                type="button"
                onClick={handleResetDB}
                style={{ padding: '0.4rem 0.75rem', background: '#e9ecef', borderRadius: '4px' }}
              >
                Resetar Base Mock
              </button>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Nome (para cadastro):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Tipo de Perfil:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box' }}
                  >
                    <option value="STUDENT">Estudante (STUDENT)</option>
                    <option value="PROFESSOR">Professor (PROFESSOR)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Departamento:</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>E-mail institucional:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Senha:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleLogin}
                  style={{ flex: 1, padding: '0.6rem 1rem', background: '#0d6efd', color: '#fff', borderRadius: '4px', fontWeight: 600 }}
                >
                  {isLoading ? 'Aguarde...' : 'Fazer Login (US02)'}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleRegister}
                  style={{ flex: 1, padding: '0.6rem 1rem', background: '#198754', color: '#fff', borderRadius: '4px', fontWeight: 600 }}
                >
                  {isLoading ? 'Aguarde...' : 'Cadastrar Novo (US01)'}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleForgotPassword}
                  style={{ padding: '0.6rem 1rem', background: '#ffc107', color: '#000', borderRadius: '4px', fontWeight: 500 }}
                >
                  Recuperar Senha
                </button>
              </div>
            </form>
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#6c757d', textAlign: 'left' }}>
            <p><strong>Usuários Mock Disponíveis:</strong></p>
            <ul>
              {SEED_USERS.map((u) => (
                <li key={u.id}>
                  {u.name} ({u.role}) — <code>{u.email}</code> / <code>{u.password}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
