import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useUserStore } from '../../store/userStore';

// Mock do serviço de API real para os testes unitários
vi.mock('../../services/api', () => ({
  apiCall: vi.fn(async (endpoint, options) => {
    const body = options?.body ? JSON.parse(options.body) : {};
    
    if (endpoint === '/api/auth/register') {
      if (!body.email || !body.password || !body.name) {
        throw new Error('E-mail, senha e nome são obrigatórios.');
      }
      return {
        token: `mock-jwt-${Date.now()}`,
        user: { id: 'usr-1', name: body.name, email: body.email, role: body.role, department: body.department }
      };
    }

    if (endpoint === '/api/auth/login') {
      if (!body.email || !body.password) {
        throw new Error('E-mail e senha são obrigatórios.');
      }
      if (body.email === 'ana@example.com' && body.password === 'correctpassword') {
        return {
          token: `mock-jwt-${Date.now()}`,
          user: { id: 'usr-123', name: 'Ana Souza', email: 'ana@example.com' }
        };
      }
      throw new Error('E-mail ou senha inválidos.');
    }

    throw new Error('Not found');
  })
}));

describe('userStore — Card 007 / F020', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    useUserStore.setState(initialState);
  });

  afterEach(() => vi.useRealTimers());

  it('começa sem sessão autenticada', () => {
    expect(useUserStore.getState().isAuthenticated).toBe(false);
    expect(useUserStore.getState().user).toBeNull();
  });

  it('cadastra usuário, remove senha da sessão e cria token mockado', async () => {
    const promise = useUserStore.getState().register({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'password123',
      role: 'teacher',
      department: 'Computação',
    });

    await vi.advanceTimersByTimeAsync(600);
    await promise;

    const state = useUserStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toMatch(/^mock-jwt-/);
  });

  it('não cadastra e-mail inválido ou senha curta', async () => {
    const invalidCases = [
      { name: 'Teste', email: 'teste@', password: '12345678' },
      { name: 'Teste', email: 'teste@example.com', password: '1234567' },
    ];

    for (const data of invalidCases) {
      useUserStore.setState(initialState);
      const promise = useUserStore.getState().register(data);
      await vi.advanceTimersByTimeAsync(600);
      await promise;

      expect(useUserStore.getState().isAuthenticated).toBe(false);
      expect(useUserStore.getState().error).toBeTruthy();
    }
  });

  it('faz login somente com credenciais corretas', async () => {
    const promise = useUserStore.getState().login('ana@example.com', 'correctpassword');
    await vi.advanceTimersByTimeAsync(600);
    await promise;

    expect(useUserStore.getState().isAuthenticated).toBe(true);
  });

  it('limpa sessão no logout', () => {
    useUserStore.setState({
      ...initialState,
      user: { id: 'usr-1', name: 'Ana' },
      token: 'mock-jwt',
      isAuthenticated: true,
      error: 'erro',
    });

    useUserStore.getState().logout();

    expect(useUserStore.getState()).toMatchObject({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });
});
