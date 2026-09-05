function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold ms-3" href="#" style={{ fontSize: '22px' }}>
                    <i className="bi bi-mortarboard-fill"></i>
                    Classdoor
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Alternar navegação">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end pt-2 " id="navbarColor01">
                    <ul className="navbar-nav pe-4">
                        <li className="nav-item ms-auto">
                            <a className="nav-link text-light opacity-75" href="#" style={{ fontSize: '14px', fontWeight: '600' }}>
                                Ajuda & FAQ
                            </a>
                        </li>
                        <li className="nav-item ms-auto">
                            <a className="nav-link text-light opacity-75" href="#" style={{ fontSize: '14px', fontWeight: '600' }}>
                                Sobre o Projeto
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;