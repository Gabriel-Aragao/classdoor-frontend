function AuthTabs({page}) {
    return (
    <div className="bg-light w-100 p-1 d-flex rounded" >
        <button type="button" className={`fw-bold btn me-1 w-100 border-0 ${page === "register" ? "bg-white shadow-sm" : "btn-success"}`} style={{ color: page === "register" ? "#7B8A8B" : "#FFFFFF", backgroundColor: page === "register" ? "#FFFFFF" : "#2C3E50" }}>
            Acessar Conta
        </button>
        <button type="button" className={`fw-bold w-100 border-0 ${page === "register" ? "btn btn-success" : "bg-white shadow-sm"}`}>
            Criar Nova Conta
        </button>
    </div>
    )
}
export default AuthTabs;