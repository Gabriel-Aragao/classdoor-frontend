import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import AuthTabs from "../../components/layout/AuthTabs";
import { authService } from "../../services/authService";
function RegisterPage() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [userType, setUserType] = useState('student');
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertType, setAlertType] = useState('');

	const [touched, setTouched] = useState({ name: false, email: false, password: false });
	const isNameValid = name.trim().length >= 3;
    const isEmailValid = email.includes('@') && email.includes('.');
    const hasMinLength = password.length >= 8;
    const hasLettersAndNumbers = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
    const isPasswordValid = hasMinLength && hasLettersAndNumbers;

	const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getInputClass = (field, isValid) => {
        if (!touched[field]) return "form-control shadow-none";
        return `form-control shadow-none ${isValid ? "is-valid" : "is-invalid"}`;
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		setTouched({ name: true, email: true, password: true });

		if (!isNameValid || !isEmailValid || !isPasswordValid) {
            setAlertType("danger");
            setAlertMessage("Por favor, preencha todos os campos corretamente.");
            return;
        }
		
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
			setTimeout(() => navigate('/login'), 2000);
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
					<div className={`alert alert-${alertType} alert-dismissible fade show mb-1 py-1  px-1`} style={{ fontSize: '14px' }} role="alert">
						{alertMessage}
						<button type="button" className="btn-close py-2" onClick={() => setAlertMessage(null)} aria-label="Fechar"></button>
					</div>
				)}

				<form onSubmit={handleSubmit} className="d-flex flex-column align-items-start">
					<p className="fw-semibold my-1" style={{ fontSize: '12px', color: '#2C3E50' }}>Nome Completo</p>
					<input type="text" className={getInputClass('name', isNameValid)} value={name} onChange={(e) => setName(e.target.value)} onBlur={() => handleBlur('name')} style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="Lucas Mendes Silva" />
					
					{touched.name && !isNameValid && (
                        <div className="invalid-feedback" style={{ fontSize: '11px' }}>Digite ao menos 3 caracteres.</div>
                    )}

					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>E-mail ou e-mail institucional</p>
					<input type="text" className={getInputClass('email', isEmailValid)} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur('email')} style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="lucas.silva@universidade.edu" />

					{touched.email && !isEmailValid && (
                        <div className="invalid-feedback" style={{ fontSize: '11px' }}>Insira um e-mail válido.</div>
                    )}

					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>Tipo de Perfil Universitário</p>
					<div className="w-100 p-1 d-flex gap-2" >
						<button type="button" className={`fw-bold btn  w-100 border-1 ${userType === "student" ? "btn-success" : "btn-outline-success bg-white text-secondary"}`} onClick={() => setUserType("student")}>
							Sou Estudante
						</button>
						<button type="button" className={`fw-bold btn me-1 w-100  border-1 ${userType === "teacher" ? "btn-success" : "btn-outline-success bg-white text-secondary"}`} onClick={() => setUserType("teacher")}>
							Sou Professor
						</button>

					</div>
					<p className="fw-semibold my-1 " style={{ fontSize: '12px', color: '#2C3E50' }}>Criar Senha de Acesso</p>
					<input type="password" className={getInputClass('password', isPasswordValid)} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => handleBlur('password')} style={{
						height: '40px',
						borderRadius: '6px',
						backgroundColor: '#ffffff',
						border: '1px solid #ced4da'
					}} placeholder="••••••••••••" required />
					
					<div className="fw-semibold d-flex flex-wrap gap-3 my-2" style={{ fontSize: '11px' }}>
                        <span style={{ color: hasMinLength ? '#18BC9C' : '#E74C3C' }}>
                            {hasMinLength ? '✓' : '✕'} Mínimo 8 dígitos
                        </span>
                        <span style={{ color: hasLettersAndNumbers ? '#18BC9C' : '#E74C3C' }}>
                            {hasLettersAndNumbers ? '✓' : '✕'} Letras e números
                        </span>
                        <span style={{ color: isEmailValid ? '#18BC9C' : '#E74C3C' }}>
                            {isEmailValid ? '✓' : '✕'} E-mail verificado
                        </span>
                    </div>

					<button type="submit" className="fw-semibold btn btn-success w-100">
						Criar Minha Conta
					</button>

					<p className="fw-semibold mt-3 mb-1" style={{ fontSize: '13px', color: '#7B8A8B' }}>Já possui conta cadastrada?</p>

					<button type="button" onClick={() => navigate('/login')} className="fw-semibold btn w-100" style={{ backgroundColor: "#2C3E50", color: "white" }}>
						Entrar com Conta Existente
					</button>
				</form>
			</div>
		</>
	)
}
export default RegisterPage;
