import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../../services/authService';
import { useUserStore } from '../../store/userStore';

vi.mock('../../services/api', () => ({
  apiCall: vi.fn(async (endpoint, options) => {
    const body = options?.body ? JSON.parse(options.body) : {};

    if (endpoint === '/api/auth/register') {
      if (!body.email || !body.password || !body.name) {
        throw new Error('E-mail, senha e nome são obrigatórios.');
      }
      if (!body.email.includes('@')) {
        throw new Error('Digite um e-mail válido.');
      }
      if (body.password.length < 8) {
        throw new Error('A senha deve ter no mínimo 8 caracteres.');
      }
      return {
        token: `mock-jwt-${Date.now()}`,
        user: { id: 'usr-1', name: body.name, email: body.email, role: body.role }
      };
    }

    if (endpoint === '/api/auth/login') {
      if (body.email === 'maria@gmail.com' && body.password === 'password123') {
        return {
          token: `mock-jwt-${Date.now()}`,
          user: { id: 'usr-1', name: 'Maria Silva', email: 'maria@gmail.com' }
        };
      }
      throw new Error('E-mail ou senha inválidos.');
    }

    throw new Error('Not found');
  })
}));

describe('Autenticação — Card 007 / F020', () => {
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

  it('aceita e-mail válido de qualquer domínio no cadastro', async () => {
    const promise = authService.register({
      name: 'Ana Silva',
      email: 'ana@outlook.com',
      password: '12345678',
      role: 'student',
    });

    await vi.advanceTimersByTimeAsync(600);
    const result = await promise;

    expect(result.user.email).toBe('ana@outlook.com');
    expect(result.token).toMatch(/^mock-jwt-/);
  });

  it('rejeita e-mail malformado no cadastro', async () => {
    const promise = authService.register({
      name: 'Ana Silva',
      email: 'ana@invalido',
      password: '12345678',
    });

    const rejection = expect(promise).rejects.toThrow('Digite um e-mail válido.');
    await vi.advanceTimersByTimeAsync(600);
    await rejection;
  });

  it('rejeita senha com menos de 8 caracteres', async () => {
    const promise = authService.register({
      name: 'Ana Silva',
      email: 'ana@gmail.com',
      password: '1234567',
    });

    const rejection = expect(promise).rejects.toThrow('A senha deve ter no mínimo 8 caracteres.');
    await vi.advanceTimersByTimeAsync(600);
    await rejection;
  });

  it('faz login com credenciais corretas e emite JWT mockado', async () => {
    const promise = authService.login({
      email: 'maria@gmail.com',
      password: 'password123',
    });

    await vi.advanceTimersByTimeAsync(600);
    const result = await promise;

    expect(result.token).toMatch(/^mock-jwt-/);
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('rejeita login com credenciais incorretas', async () => {
    const promise = authService.login('maria@gmail.com', 'errada');
    const rejection = expect(promise).rejects.toThrow('E-mail ou senha inválidos.');
    await vi.advanceTimersByTimeAsync(600);
    await rejection;
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('faz logout limpando a sessão', () => {
    useUserStore.setState({
      ...initialState,
      user: { id: 'usr-1', name: 'Ana' },
      token: 'mock-jwt-123',
      isAuthenticated: true,
    });

    authService.logout();

    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
    expect(authService.getToken()).toBeNull();
  });
});
