import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xl font-bold text-amber-400">Dac</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#sobre" className="text-slate-300 hover:text-amber-400 transition-colors">Sobre</a>
              <a href="#programacao" className="text-slate-300 hover:text-amber-400 transition-colors">Programação</a>
              <a href="#inscricao" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg font-medium transition-colors">Inscreva-se</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Entrada Gratuita
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              BoardGame Fest <span className="text-amber-400">2026</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              O maior encontro de jogos de tabuleiro da região. Mesas organizadas, espaço para trazer seus próprios jogos,
              feira com lanchonetes e comerciantes locais. Diversão garantida para iniciantes e veteranos!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href="#inscricao" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105">
                Garantir minha vaga
              </a>
              <a href="#programacao" className="border-2 border-slate-700 hover:border-amber-500 text-slate-100 hover:text-amber-400 px-8 py-3 rounded-lg font-semibold text-lg transition-all">
                Ver programação
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-amber-400">30</div>
                <div className="text-slate-400 text-sm">AGOSTO</div>
              </div>
              <div className="border-l border-slate-800 md:border-0 md:border-t">
                <div className="text-3xl sm:text-4xl font-bold text-amber-400">18:00</div>
                <div className="text-slate-400 text-sm">INÍCIO</div>
              </div>
              <div className="border-l border-slate-800 md:border-0 md:border-t">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-400">GRÁTIS</div>
                <div className="text-slate-400 text-sm">ENTRADA</div>
              </div>
              <div className="border-l border-slate-800 md:border-0 md:border-t">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-400">50+</div>
                <div className="text-slate-400 text-sm">MESAS</div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">O que é o BoardGame Fest?</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Um evento democrático e inclusivo para celebrar a cultura dos jogos de tabuleiro modernos.
                Seja você um estrategista nato ou alguém que nunca rolou um d20, há lugar na mesa para todos.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/50 transition-colors">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Mesas Organizadas</h3>
                <p className="text-slate-400">Mesas temáticas com jogos explicados por monitores experientes. Chegue e jogue!</p>
              </article>
              <article className="bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/50 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Traga seu Jogo</h3>
                <p className="text-slate-400">Espaço livre para você levar seus próprios jogos e encontrar grupo para jogar.</p>
              </article>
              <article className="bg-slate-950 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Feira & Gastronomia</h3>
                <p className="text-slate-400">Comerciantes locais com acessórios, jogos e lanchonetes para recarregar as energias.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="programacao" className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Programação & Atrações</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Atividades durante todo o evento. Chegue cedo para aproveitar tudo!
              </p>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { time: '18:00', title: 'Abertura & Boas-vindas', desc: 'Credenciamento e distribuição de pulseiras' },
                { time: '18:30', title: 'Rodada de Apresentação dos Jogos', desc: 'Monitores explicam as regras dos jogos principais' },
                { time: '19:00', title: 'Início das Mesas Livres', desc: 'Jogue o que quiser, quantas vezes quiser' },
                { time: '20:30', title: 'Torneio Relâmpago', desc: 'Inscrições na hora - premiação para o vencedor' },
                { time: '22:00', title: 'Encerramento', desc: 'Agradecimentos e sorteio de brindes' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                  <div className="flex-shrink-0 w-20 text-amber-400 font-mono font-bold text-lg">{item.time}</div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="inscricao" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Garanta sua vaga</h2>
              <p className="text-slate-300 mb-8">Entrada gratuita. Vagas limitadas por ordem de chegada. Inscreva-se para receber o voucher digital.</p>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Inscrição simulada! Em produção, enviaria para API.'); }}>                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nome completo" required className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                  <input type="email" placeholder="E-mail" required className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 px-6 rounded-lg font-semibold text-lg transition-colors">
                  Confirmar Inscrição
                </button>
              </form>
              <p className="text-slate-500 text-sm mt-4">Ao se inscrever, você concorda em receber comunicações sobre o evento.</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-amber-400">Local</h3>
                <p className="text-slate-400 mt-2">Centro de Convenções Dac - Av. Principal, 123</p>
              </div>
              <div className="border-l border-slate-800 md:border-0 md:border-t">
                <h3 className="text-4xl font-bold text-indigo-400">Transporte</h3>
                <p className="text-slate-400 mt-2">Ônibus linhas 102, 205, 310 | Estação Metro Dac (5 min a pé)</p>
              </div>
              <div className="border-l border-slate-800 md:border-0 md:border-t">
                <h3 className="text-4xl font-bold text-emerald-400">Contato</h3>
                <p className="text-slate-400 mt-2">contato@dac.events | @dac_events</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xl font-bold text-amber-400">Dac</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 BoardGame Fest. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Instagram</a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Discord</a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App