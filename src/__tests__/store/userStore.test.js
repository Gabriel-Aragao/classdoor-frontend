import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useUserStore } from '../../store/userStore';

describe('useUserStore', () => {
  const initialStoreState = {
    registeredUsers: [],
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    useUserStore.setState(initialStoreState);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Estado inicial', () => {
    it('deve inicializar com o estado padrão esperado', () => {
      const state = useUserStore.getState();

      expect(state.registeredUsers).toEqual([]);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('Registro (register)', () => {
    it('deve registrar um novo usuário com sucesso e autenticá-lo', async () => {
      const userData = {
        name: ' Maria Silva ',
        email: 'maria@example.com',
        password: 'password123',
        role: 'teacher',
        department: 'Computação',
      };

      const registerPromise = useUserStore.getState().register(userData);

      // Estado de loading durante a execução
      expect(useUserStore.getState().isLoading).toBe(true);
      expect(useUserStore.getState().error).toBeNull();

      await vi.advanceTimersByTimeAsync(600);
      await registerPromise;

      const state = useUserStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toMatch(/^mock-token-/);

      // Usuário logado na sessão não deve conter a senha
      expect(state.user).toBeDefined();
      expect(state.user.name).toBe('Maria Silva');
      expect(state.user.email).toBe('maria@example.com');
      expect(state.user.role).toBe('teacher');
      expect(state.user.department).toBe('Computação');
      expect(state.user.password).toBeUndefined();

      // Lista de registrados deve conter o usuário com a senha salva
      expect(state.registeredUsers).toHaveLength(1);
      expect(state.registeredUsers[0]).toMatchObject({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: 'password123',
        role: 'teacher',
        department: 'Computação',
      });
      expect(state.registeredUsers[0].id).toBeDefined();
      expect(state.registeredUsers[0].createdAt).toBeDefined();
    });

    it('deve aplicar valores padrão para role (student) e department (Geral) se omitidos', async () => {
      const userData = {
        name: 'João Santos',
        email: 'joao@example.com',
        password: '123456password',
      };

      const registerPromise = useUserStore.getState().register(userData);
      await vi.advanceTimersByTimeAsync(600);
      await registerPromise;

      const state = useUserStore.getState();

      expect(state.user.role).toBe('student');
      expect(state.user.department).toBe('Geral');
      expect(state.registeredUsers[0].role).toBe('student');
      expect(state.registeredUsers[0].department).toBe('Geral');
    });

    it('deve retornar erro se campos obrigatórios (nome, email ou senha) não forem fornecidos', async () => {
      const invalidDataCases = [
        { name: '', email: 'teste@example.com', password: '123' },
        { name: 'Teste', email: '', password: '123' },
        { name: 'Teste', email: 'teste@example.com', password: '' },
      ];

      for (const invalidData of invalidDataCases) {
        useUserStore.setState(initialStoreState);

        const registerPromise = useUserStore.getState().register(invalidData);
        await vi.advanceTimersByTimeAsync(600);
        await registerPromise;

        const state = useUserStore.getState();
        expect(state.error).toBe('Email, senha e nome são obrigatórios');
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.registeredUsers).toHaveLength(0);
      }
    });

    it('deve impedir o cadastro de um email já existente', async () => {
      useUserStore.setState({
        ...initialStoreState,
        registeredUsers: [
          {
            id: 'usr-1',
            name: 'Carlos Lima',
            email: 'carlos@example.com',
            password: 'secret',
            role: 'student',
            department: 'Geral',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const registerPromise = useUserStore.getState().register({
        name: 'Carlos Clone',
        email: 'carlos@example.com',
        password: 'outrasenha',
      });

      await vi.advanceTimersByTimeAsync(600);
      await registerPromise;

      const state = useUserStore.getState();
      expect(state.error).toBe('Email ja cadastrado');
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.registeredUsers).toHaveLength(1);
    });
  });

  describe('Login (login)', () => {
    const existingUser = {
      id: 'usr-123',
      name: 'Ana Souza',
      email: 'ana@example.com',
      password: 'correctpassword',
      role: 'teacher',
      department: 'Matemática',
      createdAt: new Date().toISOString(),
    };

    beforeEach(() => {
      useUserStore.setState({
        ...initialStoreState,
        registeredUsers: [existingUser],
      });
    });

    it('deve realizar login com sucesso usando credenciais corretas', async () => {
      const loginPromise = useUserStore.getState().login('ana@example.com', 'correctpassword');

      expect(useUserStore.getState().isLoading).toBe(true);
      expect(useUserStore.getState().error).toBeNull();

      await vi.advanceTimersByTimeAsync(600);
      await loginPromise;

      const state = useUserStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toMatch(/^mock-token-usr-123-/);
      expect(state.user).toEqual({
        id: 'usr-123',
        name: 'Ana Souza',
        email: 'ana@example.com',
        role: 'teacher',
        department: 'Matemática',
        createdAt: existingUser.createdAt,
      });
      expect(state.user.password).toBeUndefined();
    });

    it('deve falhar se email ou senha forem omitidos', async () => {
      const cases = [
        { email: '', password: '123' },
        { email: 'ana@example.com', password: '' },
      ];

      for (const { email, password } of cases) {
        const loginPromise = useUserStore.getState().login(email, password);
        await vi.advanceTimersByTimeAsync(600);
        await loginPromise;

        const state = useUserStore.getState();
        expect(state.error).toBe('Email e senha são obrigatórios.');
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
      }
    });

    it('deve falhar se o usuário não for encontrado', async () => {
      const loginPromise = useUserStore.getState().login('inexistente@example.com', 'correctpassword');
      await vi.advanceTimersByTimeAsync(600);
      await loginPromise;

      const state = useUserStore.getState();
      expect(state.error).toBe('Email ou senha invalidos');
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it('deve falhar se a senha for incorreta', async () => {
      const loginPromise = useUserStore.getState().login('ana@example.com', 'wrongpassword');
      await vi.advanceTimersByTimeAsync(600);
      await loginPromise;

      const state = useUserStore.getState();
      expect(state.error).toBe('Email ou senha invalidos');
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('Logout (logout)', () => {
    it('deve limpar as credenciais e resetar o estado de autenticação', () => {
      useUserStore.setState({
        ...initialStoreState,
        user: { id: 'usr-1', name: 'Ana' },
        token: 'mock-token-xyz',
        isAuthenticated: true,
        isLoading: true,
        error: 'Algum erro',
      });

      useUserStore.getState().logout();

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('Limpeza de Erro (clearError)', () => {
    it('deve redefinir o campo error para null', () => {
      useUserStore.setState({
        ...initialStoreState,
        error: 'Ocorreu um erro qualquer',
      });

      expect(useUserStore.getState().error).toBe('Ocorreu um erro qualquer');

      useUserStore.getState().clearError();

      expect(useUserStore.getState().error).toBeNull();
    });
  });
});
