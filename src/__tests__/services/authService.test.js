import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../../services/authService';
import { useUserStore } from '../../store/userStore';

describe('authService', () => {
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

  describe('login', () => {
    const mockUser = {
      id: 'usr-1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'password123',
      role: 'teacher',
      department: 'Computação',
      createdAt: new Date().toISOString(),
    };

    beforeEach(() => {
      useUserStore.setState({
        ...initialStoreState,
        registeredUsers: [mockUser],
      });
    });

    it('deve realizar login com sucesso passando email e senha', async () => {
      const loginPromise = authService.login('maria@example.com', 'password123');

      await vi.advanceTimersByTimeAsync(600);
      const result = await loginPromise;

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: 'usr-1',
        name: 'Maria Silva',
        email: 'maria@example.com',
        role: 'teacher',
        department: 'Computação',
        createdAt: mockUser.createdAt,
      });
      expect(result.user.password).toBeUndefined();
      expect(result.token).toMatch(/^mock-token-usr-1-/);

      // Garante que o userStore foi atualizado
      expect(useUserStore.getState().isAuthenticated).toBe(true);
      expect(useUserStore.getState().user).toEqual(result.user);
    });

    it('deve suportar chamada com objeto de credenciais { email, password }', async () => {
      const loginPromise = authService.login({
        email: 'maria@example.com',
        password: 'password123',
      });

      await vi.advanceTimersByTimeAsync(600);
      const result = await loginPromise;

      expect(result.user.email).toBe('maria@example.com');
      expect(result.token).toBeDefined();
    });

    it('deve lançar erro se email ou senha forem omitidos', async () => {
      const cases = [
        ['', '123'],
        ['maria@example.com', ''],
        [null, null],
      ];

      for (const [email, pass] of cases) {
        useUserStore.setState({
          ...initialStoreState,
          registeredUsers: [mockUser],
        });

        const loginPromise = authService.login(email, pass);
        const rejection = expect(loginPromise).rejects.toThrow('Email e senha são obrigatórios.');
        await vi.advanceTimersByTimeAsync(600);
        await rejection;
      }
    });

    it('deve lançar erro se o usuário não for encontrado no mock', async () => {
      const loginPromise = authService.login('inexistente@example.com', '123456');
      const rejection = expect(loginPromise).rejects.toThrow('Email ou senha invalidos');
      await vi.advanceTimersByTimeAsync(600);
      await rejection;
    });

    it('deve lançar erro se a senha estiver incorreta', async () => {
      const loginPromise = authService.login('maria@example.com', 'senhaincorreta');
      const rejection = expect(loginPromise).rejects.toThrow('Email ou senha invalidos');
      await vi.advanceTimersByTimeAsync(600);
      await rejection;
    });
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso no mock do userStore e autenticá-lo', async () => {
      const userData = {
        name: ' Carlos Drummond ',
        email: 'carlos@example.com',
        password: 'pass',
        role: 'teacher',
        department: 'Letras',
      };

      const registerPromise = authService.register(userData);
      await vi.advanceTimersByTimeAsync(600);
      const result = await registerPromise;

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');

      // user (sessão) não expõe a senha
      expect(result.user.name).toBe('Carlos Drummond');
      expect(result.user.password).toBeUndefined();
      expect(result.token).toMatch(/^mock-token-/);

      // userStore armazena nos registeredUsers
      const state = useUserStore.getState();
      expect(state.registeredUsers).toHaveLength(1);
      expect(state.registeredUsers[0].name).toBe('Carlos Drummond');
      expect(state.isAuthenticated).toBe(true);
    });

    it('deve aplicar valores padrão (student, Geral) se role e department forem omitidos', async () => {
      const userData = {
        name: 'Ana',
        email: 'ana@example.com',
        password: 'pass',
      };

      const registerPromise = authService.register(userData);
      await vi.advanceTimersByTimeAsync(600);
      const result = await registerPromise;

      expect(result.user.role).toBe('student');
      expect(result.user.department).toBe('Geral');
    });

    it('deve lançar erro se nome, email ou senha estiverem ausentes', async () => {
      const cases = [
        { name: '', email: 'teste@example.com', password: '123' },
        { name: 'Teste', email: '', password: '123' },
        { name: 'Teste', email: 'teste@example.com', password: '' },
      ];

      for (const invalidData of cases) {
        const registerPromise = authService.register(invalidData);
        const rejection = expect(registerPromise).rejects.toThrow('Email, senha e nome são obrigatórios');
        await vi.advanceTimersByTimeAsync(600);
        await rejection;
      }
    });

    it('deve lançar erro se o email já estiver cadastrado', async () => {
      useUserStore.setState({
        ...initialStoreState,
        registeredUsers: [{ email: 'duplicado@example.com', password: '123' }],
      });

      const registerPromise = authService.register({
        name: 'Duplicado',
        email: 'duplicado@example.com',
        password: '123',
      });

      const rejection = expect(registerPromise).rejects.toThrow('Email ja cadastrado');
      await vi.advanceTimersByTimeAsync(600);
      await rejection;
    });
  });

  describe('logout e helpers de estado', () => {
    it('deve efetuar logout e limpar a sessão no userStore', () => {
      useUserStore.setState({
        ...initialStoreState,
        user: { id: 'usr-1', name: 'Ana' },
        token: 'mock-token',
        isAuthenticated: true,
      });

      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getCurrentUser()).toEqual({ id: 'usr-1', name: 'Ana' });
      expect(authService.getToken()).toBe('mock-token');

      authService.logout();

      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getCurrentUser()).toBeNull();
      expect(authService.getToken()).toBeNull();
    });
  });
});
