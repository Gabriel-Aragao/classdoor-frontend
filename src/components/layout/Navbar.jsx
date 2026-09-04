function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand ps-5" href="#">Classdoor</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Alternar navegação">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end pt-2 " id="navbarColor01">
                    <ul className="navbar-nav pe-4">
                        <li className="nav-item ">
                            <a className="nav-link " href="#">Ajuda & FAQ</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link ms-4" href="#">Sobre o Projeto</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;