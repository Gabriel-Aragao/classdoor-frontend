import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import AuthTabs from "../../components/layout/AuthTabs";
import { authService } from "../../services/authService";
function RegisterPage() {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [userType, setUserType] = useState('');
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertType, setAlertType] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setAlertMessage(null);

		try {
			await authService.register({
				name,
				email,
				password,
				role: userType
			});

			setAlertType("success");
			setAlertMessage("Conta Criada com Sucesso!");
		} catch (error) {
			setAlertType("danger");
			setAlertMessage(error.message);
		}
	};

	return (
		<>
			<Navbar />

			<div className="container mt-3 ">
				<h1 className="fw-bold text-primary text-center" style={{ fontSize: '28px' }}>
					Cadastro Acadêmico
				</h1>
				<p className="fw-bold mb-3 text-center" style={{ fontSize: '15px', color: '#7B8A8B' }}>
					Crie sua conta para avaliar professores e disciplinas
				</p>
			</div>
			<div className="card register-card p-4 mx-auto mt-1" style={{ maxWidth: "520px" }}>

				<AuthTabs page="register" />


				<p className="fw-bold my-2 d-flex" style={{ fontSize: '18px', color: '#2C3E50' }}>Dados do Usuário</p>

				{alertMessage && (
					<div className={`alert alert-${alertType} alert-dismissible fade show mb-1 py-1  px-1`} style={{ fontSize: '14px' }}role="alert">
						{alertMessage}
						<button type="button" className="btn-close py-2" onClick={() => setAlertMessage(null)} aria-label="Fechar"></button>
					</div>
				)}

				<form onSubmit={handleSubmit} className="d-flex flex-column align-items-start">
					<p className="fw-semibold my-1" style={{ fontSize: '12px', color: '#2C3E50' }}>Nome Completo</p>
					<input type="text" className="form-control shadow-none" value={name} onChange={(e) => setName(e.target.value)} style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="Lucas Mendes Silva" />

					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>E-mail ou e-mail institucional</p>
					<input type="text" className="form-control shadow-none" value={email} onChange={(e) => setEmail(e.target.value)}  style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="lucas.silva@universidade.edu" />

					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>Tipo de Perfil Universitário</p>
					<div className="w-100 p-1 d-flex gap-2" >
						<button type="button" className={`fw-bold btn btn-success w-100 border-1 ${userType === "student" ? "btn-success" : "btn-outline-success bg-white text-secondary"}`} onClick={() => setUserType("student")}>
							Sou Estudante
						</button>
						<button type="button" className={`fw-bold btn me-1 w-100 border-1 ${userType === "teacher" ? "btn-success" : "btn-outline-success bg-white text-secondary"}`} onClick={() => setUserType("teacher")}>
							Sou Professor
						</button>

					</div>
					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>Criar Senha de Acesso</p>
					<input type="text" className="form-control shadow-none" value={password} onChange={(e) => setPassword(e.target.value)} style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="••••••••••••" />
					<p className="fw-semibold" style={{ fontSize: '12px', color: '#18BC9C' }}>✓ Mínimo 8 dígitos   ✓ Letras e números   ✓ E-mail verificado</p>

					<button type="submit" className="fw-semibold btn btn-success w-100">
						Criar Minha Conta
					</button>

					<p className="fw-semibold mt-3 mb-1" style={{ fontSize: '13px', color: '#7B8A8B' }}>Já possui conta cadastrada?</p>

					<button type="button" className="fw-semibold btn w-100" style={{ backgroundColor: "#2C3E50", color: "white" }}>
						Entrar com Conta Existente
					</button>
				</form>
			</div>
		</>
	)
}
export default RegisterPage;
