# 🎓 Classdoor — Frontend

> Plataforma universitária de avaliação de disciplinas e docentes inspirada no Glassdoor, projetada para impulsionar a melhoria contínua do ensino com garantia de anonimato e métricas transparentes.

---

## 📌 Sobre o Projeto

O **Classdoor** é uma plataforma que permite a estudantes avaliarem disciplinas e professores de forma intuitiva, transparente e segura. 

### Principais Funcionalidades
* **Garantia de Anonimato (Default 100% Anônimo):** O estudante pode fornecer feedbacks construtivos e notas sem ter seus dados pessoais, matrícula ou IP vinculados publicamente à avaliação.
* **Avaliação Nominal Opcional:** Permite avaliações identificadas mediante consentimento explícito e configuração da turma.
* **Busca & Catálogo Acadêmico:** Filtros dinâmicos por departamento, curso, professor e semestre.
* **Métricas Pedagógicas & Perfis:** Nota média (1-5 estrelas), índice de dificuldade, percentual de recomendação discente e tags pedagógicas em destaque.
* **Feedback Útil (Upvotes):** Sistema de apoio a avaliações relevantes.
* **Painel Docente & Analytics:** Relatórios consolidados e séries temporais de satisfação para professores e coordenadores.

---

## 🛠️ Stack Tecnológica (Frontend)

* **Framework:** [React 19](https://react.dev/)
* **Linguagem:** JavaScript (ESNext / JSX)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilização & UI:** [Bootstrap 5](https://getbootstrap.com/) + [Bootswatch](https://bootswatch.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Roteamento:** [React Router v6](https://reactrouter.com/)
* **Server State & Cache:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
* **Formulários & Validação:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) / Yup
* **Cliente HTTP:** [Axios](https://axios-http.com/)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js 18+ ou 20+
* npm ou yarn

### Instalação & Execução
```bash
# 1. Clone o repositório
git clone https://github.com/Gabriel-Aragao/classdoor-frontend.git
cd classdoor-frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## 🌿 Fluxo de Branches e Git Workflow

Adotamos o fluxo de desenvolvimento baseado na branch `dev`:

1. **Branch Principal de Produção:** `main`
2. **Branch de Integração / Desenvolvimento:** `dev`
3. **Branches de Feature/Task:** `feature/dac-<id>-descricao` (criadas a partir da `dev`).
4. **Pull Requests (PRs):** Devem ser abertos sempre apontando para a branch `dev`.
5. **Code Review:** Avaliação e aprovação exclusiva pelo time de **QA (@qa)** antes do merge.

Para mais detalhes, consulte o guia de branches no Obsidian: `Classdoor/Guia-Git-Branches-Junior.md`.

---

## 👥 Equipe do Projeto

* **Product Owner / CTO:** @domaragao
* **Desenvolvedores:** @andreyrian3, @jenniferrebecaalvesdebarros, @aria (Frontend), @peter (Backend)
* **Product Manager:** @atlas
* **Tech Lead & Arquiteto:** @dijkstra
* **UI/UX Design:** @iris
* **Quality Assurance:** @qa
* **Event Router:** @dispatcher
* **Secretária & Hub:** @hermes (Friday)

---

## 📄 Licença
Uso interno / Acadêmico — Todos os direitos reservados.
