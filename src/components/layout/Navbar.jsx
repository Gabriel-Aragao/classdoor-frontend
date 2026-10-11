import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="classdoor-navbar">
      <Link className="classdoor-brand" to="/login" aria-label="Classdoor - Início">
        <i className="bi bi-mortarboard-fill classdoor-brand-icon" aria-hidden="true" />
        <span>Classdoor</span>
      </Link>

      <nav className="classdoor-nav-links" aria-label="Links institucionais">
        <a href="#ajuda">Ajuda &amp; FAQ</a>
        <a href="#sobre">Sobre o Projeto</a>
      </nav>
    </header>
  );
}

export default Navbar;
