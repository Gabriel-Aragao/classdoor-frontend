import Navbar from "../../components/layout/Navbar";
function RegisterPage() {
	return (
		<>
			<Navbar />

			<div className="container mt-5 ">
				<h1 className="fw-bold text-primary text-center" style={{ fontSize: '28px' }}>
					Cadastro Acadêmico
				</h1>
				<p className="fw-bold mb-4 text-center" style={{ fontSize: '15px', color: '#7B8A8B' }}>
					Crie sua conta para avaliar professores e disciplinas
				</p>
			</div>
			<div className="card p-4 center mx-auto" style={{ maxWidth: "520px" }}>

				<div className="bg-light w-100 p-1 d-flex rounded " >
					<button type="button" className=" fw-bold btn btn-success me-1 bg-white w-100 border-0" style={{ color: "#7B8A8B" }}>
						Acessar Conta
					</button>
					<button type="button" className="fw-bold btn btn-success w-100">
						Criar Nova Conta
					</button>
				</div>
				<p className="fw-bold my-2 d-flex" style={{ fontSize: '18px', color: '#2C3E50' }}>Dados do Usuário</p>
				<form action="" className="d-flex flex-column align-items-start">
					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>Nome Completo</p>
					<input type="text" className="form-control shadow-none" style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="Lucas Mendes Silva"/>
					
					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>E-mail ou e-mail institucional</p>
					<input type="text" className="form-control shadow-none" style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="lucas.silva@universidade.edu"/>
				</form>
			</div>
		</>
	)
}

export default RegisterPage;
