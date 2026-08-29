import { useState } from 'react'
import './App.css'

const cards = [
  {
    title: 'Projetos',
    description: 'Organize e acompanhe os projetos da equipe.',
    icon: '▦',
    action: 'Ver projetos',
  },
  {
    title: 'Tarefas',
    description: 'Veja as atividades em andamento e próximas entregas.',
    icon: '✓',
    action: 'Ver tarefas',
  },
  {
    title: 'Equipe',
    description: 'Consulte os integrantes e a participação nos projetos.',
    icon: '♙',
    action: 'Ver equipe',
  },
]

function App() {
  const [activeAction, setActiveAction] = useState('')

  const handleAction = (action) => {
    setActiveAction(action)
    window.setTimeout(() => setActiveAction(''), 1800)
  }

  return (
    <div className="app-shell">
      <header className="header">
        <a className="brand" href="#inicio" aria-label="DAC página inicial">
          <span className="brand-mark">D</span>
          <span>
            <strong>DAC</strong>
            <small>Projetos &amp; tarefas</small>
          </span>
        </a>

        <nav className="nav" aria-label="Navegação principal">
          <a className="nav-link active" href="#inicio">Início</a>
          <a className="nav-link" href="#recursos">Recursos</a>
          <a className="nav-link" href="#sobre">Sobre o projeto</a>
        </nav>

        <button className="header-button" type="button" onClick={() => handleAction('Acessar painel')}>
          Acessar painel
        </button>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">SISTEMA DAC</span>
            <h1>Uma página inicial simples, organizada e pronta para crescer.</h1>
            <p>
              Centralize projetos, tarefas e informações da equipe em um só lugar.
              Esta é a nova página principal da aplicação DAC.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={() => handleAction('Começar agora')}>
                Começar agora <span aria-hidden="true">→</span>
              </button>
              <a className="secondary-button" href="#recursos">Conhecer recursos</a>
            </div>
          </div>

          <div className="hero-card" aria-label="Resumo do painel DAC">
            <div className="hero-card-top">
              <div>
                <span className="card-label">Visão geral</span>
                <h2>Seu espaço de trabalho</h2>
              </div>
              <span className="status-dot" aria-label="Sistema online" />
            </div>

            <div className="metrics">
              <div className="metric">
                <strong>12</strong>
                <span>Projetos</span>
              </div>
              <div className="metric">
                <strong>28</strong>
                <span>Tarefas</span>
              </div>
              <div className="metric">
                <strong>08</strong>
                <span>Membros</span>
              </div>
            </div>

            <div className="progress-block">
              <div className="progress-row">
                <span>Progresso da equipe</span>
                <strong>76%</strong>
              </div>
              <div className="progress-track" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">RECURSOS</span>
              <h2>Tenha tudo o que precisa em um único lugar</h2>
            </div>
            <p>
              Componentes iniciais pensados para deixar a aplicação clara, responsiva e fácil de evoluir.
            </p>
          </div>

          <div className="feature-grid">
            {cards.map((card) => (
              <article className="feature-card" key={card.title}>
                <span className="feature-icon" aria-hidden="true">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <button type="button" onClick={() => handleAction(card.action)}>
                  {card.action} <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="sobre" className="about">
          <div>
            <span className="eyebrow">SOBRE O DAC</span>
            <h2>Uma base preparada para as próximas funcionalidades.</h2>
          </div>
          <p>
            A estrutura foi organizada em componentes simples e reutilizáveis, com layout responsivo
            para desktop e mobile. O objetivo é manter a experiência consistente enquanto novas telas
            e funcionalidades forem adicionadas ao sistema.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} DAC</span>
        <span>Projeto acadêmico • Front-end React</span>
      </footer>

      {activeAction && <div className="toast" role="status">{activeAction}</div>}
    </div>
  )
}

export default App
