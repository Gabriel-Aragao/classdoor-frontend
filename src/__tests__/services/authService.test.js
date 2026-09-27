import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../../services/authService';
import { mockAuthService } from '../../services/mockAuthService';
import { useUserStore } from '../../store/userStore';

describe('Autenticação — Card 007', () => {
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
    expect(result.user.password).toBeUndefined();
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

  it('bloqueia e-mail duplicado', async () => {
    useUserStore.setState({
      ...initialState,
      registeredUsers: [{
        id: 'usr-1',
        name: 'Ana',
        email: 'ana@gmail.com',
        password: '12345678',
        role: 'student',
        department: 'Geral',
        createdAt: new Date().toISOString(),
      }],
    });

    const promise = authService.register({
      name: 'Outra Ana',
      email: ' ANA@GMAIL.COM ',
      password: '87654321',
    });

    const rejection = expect(promise).rejects.toThrow('Este e-mail já está cadastrado.');
    await vi.advanceTimersByTimeAsync(600);
    await rejection;
  });

  it('faz login com credenciais corretas e emite JWT mockado', async () => {
    useUserStore.setState({
      ...initialState,
      registeredUsers: [{
        id: 'usr-1',
        name: 'Maria Silva',
        email: 'maria@gmail.com',
        password: 'password123',
        role: 'teacher',
        department: 'Computação',
        createdAt: new Date().toISOString(),
      }],
    });

    const promise = mockAuthService.loginUser({
      email: 'MARIA@GMAIL.COM',
      password: 'password123',
    });

    await vi.advanceTimersByTimeAsync(600);
    const result = await promise;

    expect(result.token).toMatch(/^mock-jwt-/);
    expect(result.user.password).toBeUndefined();
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('rejeita login com credenciais incorretas', async () => {
    useUserStore.setState({
      ...initialState,
      registeredUsers: [{
        id: 'usr-1',
        name: 'Maria Silva',
        email: 'maria@gmail.com',
        password: 'password123',
      }],
    });

    const promise = authService.login('maria@gmail.com', 'errada');
    const rejection = expect(promise).rejects.toThrow('E-mail ou senha inválidos.');
    await vi.advanceTimersByTimeAsync(600);
    await rejection;
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('persiste o cadastro no localStorage do Zustand', async () => {
    const promise = authService.register({
      name: 'João Santos',
      email: 'joao@universidade.edu',
      password: '12345678',
    });

    await vi.advanceTimersByTimeAsync(600);
    await promise;

    const stored = JSON.parse(localStorage.getItem('@classdoor:auth_state'));
    expect(stored.state.registeredUsers).toHaveLength(1);
    expect(stored.state.registeredUsers[0].email).toBe('joao@universidade.edu');
  });

  it('simula recuperação com validade de 30 minutos', async () => {
    const promise = mockAuthService.requestPasswordReset('estudante@gmail.com');
    await vi.advanceTimersByTimeAsync(300);
    const request = await promise;

    expect(request.sent).toBe(true);
    expect(request.expiresInMinutes).toBe(30);
    expect(request.expiresAt - request.requestedAt).toBe(30 * 60 * 1000);
    expect(mockAuthService.getPasswordResetRequest()).toMatchObject({
      email: 'estudante@gmail.com',
      token: request.token,
    });
  });

  it('considera o link de recuperação expirado após 30 minutos', async () => {
    const promise = mockAuthService.requestPasswordReset('estudante@gmail.com');
    await vi.advanceTimersByTimeAsync(300);
    await promise;

    vi.advanceTimersByTime(30 * 60 * 1000);

    expect(mockAuthService.getPasswordResetRequest()).toBeNull();
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
