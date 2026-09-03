/**
 * Serviço de Autenticação Simulado (Mock) — Classdoor
 * 
 * Implementa a camada de autenticação offline com persistência em localStorage (chave: classdoor_users_db),
 * validação de contratos RESTful e delays assíncronos simulados para feedback real em UI.
 * 
 * User Stories atendidas: US01 (Cadastro) e US02 (Login & Recuperação de Senha).
 */

const USERS_STORAGE_KEY = 'classdoor_users_db'
const SIMULATED_DELAY_MS = 400

// Base inicial de usuários pré-cadastrados para desenvolvimento e testes
export const SEED_USERS = [
  {
    id: 'usr-seed-student-001',
    name: 'Maria Silva Santos',
    email: 'maria.santos@universidade.edu.br',
    password: 'SenhaForte@2026',
    role: 'STUDENT',
    department: 'Ciência da Computação',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'usr-seed-prof-002',
    name: 'Dr. Carlos Eduardo Santos',
    email: 'carlos.santos@universidade.edu.br',
    password: 'SenhaForte@2026',
    role: 'PROFESSOR',
    department: 'Ciência da Computação',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'usr-seed-student-003',
    name: 'Lucas Oliveira',
    email: 'lucas.oliveira@univ.edu',
    password: '123456',
    role: 'STUDENT',
    department: 'Engenharia de Software',
    createdAt: '2026-09-02T14:30:00Z',
  },
]

const delay = (ms = SIMULATED_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY)
    if (!data) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS))
      return SEED_USERS
    }
    return JSON.parse(data)
  } catch (err) {
    console.warn('[mockAuthService] Falha ao acessar localStorage:', err)
    return SEED_USERS
  }
}

const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('[mockAuthService] Erro ao salvar usuários no localStorage:', err)
  }
}

/**
 * Validador de formato de e-mail institucional
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export const mockAuthService = {
  /**
   * Inicializa ou redefine a base mock com os seed users
   */
  resetMockDatabase: () => {
    saveStoredUsers(SEED_USERS)
    return SEED_USERS
  },

  /**
   * Retorna todos os usuários cadastrados na base mock
   */
  getMockDatabase: () => {
    return getStoredUsers()
  },

  /**
   * US01 — Cadastro de Novo Usuário (POST /api/v1/auth/register)
   */
  register: async ({ name, email, password, role = 'STUDENT', department = '' }) => {
    await delay()

    if (!name || !name.trim()) {
      throw new Error('O nome completo é obrigatório.')
    }

    if (!isValidEmail(email)) {
      throw new Error('Formato de e-mail inválido. Utilize um e-mail válido (ex: seu.nome@universidade.edu.br).')
    }

    if (!password || password.length < 6) {
      throw new Error('A senha deve conter no mínimo 6 caracteres.')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()

    // Validação de unicidade de e-mail
    const emailExists = users.some((u) => u.email.toLowerCase() === normalizedEmail)
    if (emailExists) {
      const error = new Error('E-mail já cadastrado no sistema.')
      error.status = 409
      throw error
    }

    const normalizedRole = role.toUpperCase().includes('PROF') ? 'PROFESSOR' : 'STUDENT'

    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,
      department: department.trim(),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveStoredUsers(users)

    // Retorna payload sanitizado sem expor a senha
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      createdAt: newUser.createdAt,
    }
  },

  /**
   * US02 — Login e Autenticação (POST /api/v1/auth/login)
   */
  login: async ({ email, password }) => {
    await delay()

    if (!email || !password) {
      throw new Error('Informe o e-mail e a senha para acessar.')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()

    const user = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    )

    if (!user) {
      const error = new Error('Credenciais inválidas. Verifique seu e-mail e senha.')
      error.status = 401
      throw error
    }

    const roleFormatted = user.role.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`

    const accessToken = `mock-jwt-header.${btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: roleFormatted,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    )}.mock-signature-${Date.now()}`

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleFormatted,
        department: user.department,
      },
    }
  },

  /**
   * US02 — Recuperação de Senha (POST /api/v1/auth/forgot-password)
   */
  forgotPassword: async (email) => {
    await delay()

    if (!isValidEmail(email)) {
      throw new Error('Informe um e-mail válido para recuperação.')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)

    if (!user) {
      const error = new Error('E-mail não encontrado no sistema.')
      error.status = 404
      throw error
    }

    return {
      success: true,
      message: `Instruções para redefinição de senha foram enviadas para ${normalizedEmail}.`,
    }
  },
}
