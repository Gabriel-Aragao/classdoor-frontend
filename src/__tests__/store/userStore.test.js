import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useUserStore } from '../../store/userStore';

describe('userStore — Card 007', () => {
  const initialState = {
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
    expect(state.user.password).toBeUndefined();
    expect(state.token).toMatch(/^mock-jwt-/);
    expect(state.registeredUsers).toHaveLength(1);
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
      expect(useUserStore.getState().registeredUsers).toHaveLength(0);
      expect(useUserStore.getState().error).toBeTruthy();
    }
  });

  it('impede e-mail duplicado sem diferenciar maiúsculas e minúsculas', async () => {
    useUserStore.setState({
      ...initialState,
      registeredUsers: [{
        id: 'usr-1',
        name: 'Carlos',
        email: 'carlos@example.com',
        password: '12345678',
      }],
    });

    const promise = useUserStore.getState().register({
      name: 'Outro Carlos',
      email: 'CARLOS@EXAMPLE.COM',
      password: '87654321',
    });

    await vi.advanceTimersByTimeAsync(600);
    await promise;

    expect(useUserStore.getState().error).toBe('Este e-mail já está cadastrado.');
    expect(useUserStore.getState().registeredUsers).toHaveLength(1);
  });

  it('faz login somente com credenciais corretas', async () => {
    useUserStore.setState({
      ...initialState,
      registeredUsers: [{
        id: 'usr-123',
        name: 'Ana Souza',
        email: 'ana@example.com',
        password: 'correctpassword',
      }],
    });

    const promise = useUserStore.getState().login('ana@example.com', 'correctpassword');
    await vi.advanceTimersByTimeAsync(600);
    await promise;

    expect(useUserStore.getState().isAuthenticated).toBe(true);
    expect(useUserStore.getState().user.password).toBeUndefined();
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
