function Navbar() {
  return (
    <header className="classdoor-navbar">
      <a className="classdoor-brand" href="/login" aria-label="Classdoor - Login">
        <i className="bi bi-mortarboard-fill" aria-hidden="true" />
        Classdoor
      </a>

      <nav className="classdoor-nav-links" aria-label="Links institucionais">
        <a href="#ajuda">Ajuda &amp; FAQ</a>
        <a href="#sobre">Sobre o Projeto</a>
      </nav>
    </header>
  );
}

export default Navbar;
