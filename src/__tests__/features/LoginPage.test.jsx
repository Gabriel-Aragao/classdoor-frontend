import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../features/auth/LoginPage';
import { mockAuthService } from '../../services/mockAuthService';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('LoginPage Component (US02 / Figma 1A SSOT)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar a estrutura completa da tela de login alinhada ao Figma', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Header / Brand
    expect(screen.getByLabelText('Classdoor - Início')).not.toBeNull();
    expect(screen.getByText('Ajuda & FAQ')).not.toBeNull();
    expect(screen.getByText('Sobre o Projeto')).not.toBeNull();

    // Headings
    expect(screen.getByRole('heading', { name: 'Acesse o Classdoor', level: 1 })).not.toBeNull();
    expect(screen.getByText('Avaliação docente ética, transparente e 100% anônima')).not.toBeNull();
    expect(screen.getByText('Entrar no Sistema')).not.toBeNull();
    expect(screen.getByText('Use seu e-mail cadastrado para acessar sua conta.')).not.toBeNull();

    // Tabs
    const loginTab = screen.getByRole('tab', { name: 'Acessar Conta' });
    const registerTab = screen.getByRole('tab', { name: 'Criar Conta' });
    expect(loginTab.className).toContain('active');
    expect(registerTab.className).not.toContain('active');

    // Inputs & Labels
    expect(screen.getByLabelText('E-mail')).not.toBeNull();
    expect(screen.getByLabelText('Senha de Acesso')).not.toBeNull();
    expect(screen.getByLabelText('Lembrar de mim')).not.toBeNull();

    // Links & Buttons
    expect(screen.getByRole('button', { name: 'Esqueci minha senha' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Entrar no Classdoor' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Criar Nova Conta' })).not.toBeNull();

    // Security Box
    expect(screen.getByText('Acesso Seguro e Protegido')).not.toBeNull();
    expect(screen.getByText(/Sua conta é protegida com criptografia segura/)).not.toBeNull();
  });

  it('deve exibir mensagens de validação ao submeter formulário vazio', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: 'Entrar no Classdoor' });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Informe um e-mail válido e uma senha.')).not.toBeNull();
    expect(screen.getByText('Digite um e-mail válido.')).not.toBeNull();
    expect(screen.getByText('A senha é obrigatória.')).not.toBeNull();
  });

  it('deve validar formato inválido de e-mail ao perder o foco (onBlur)', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('E-mail');
    fireEvent.change(emailInput, { target: { value: 'emailinvalido' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText('Digite um e-mail válido.')).not.toBeNull();
    expect(emailInput.className).toContain('invalid');
  });

  it('deve autenticar com sucesso e redirecionar para /home', async () => {
    const loginSpy = vi.spyOn(mockAuthService, 'loginUser').mockResolvedValueOnce({
      user: { id: 'usr-1', name: 'Maria Silva', email: 'maria@example.com' },
      token: 'mock-token-123',
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha de Acesso');
    const submitBtn = screen.getByRole('button', { name: 'Entrar no Classdoor' });

    fireEvent.change(emailInput, { target: { value: 'maria@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Senha@123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith({
        email: 'maria@example.com',
        password: 'Senha@123',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });
  });

  it('deve salvar e-mail no localStorage se "Lembrar de mim" estiver marcado', async () => {
    vi.spyOn(mockAuthService, 'loginUser').mockResolvedValueOnce({
      user: { id: 'usr-1', name: 'Maria Silva', email: 'maria@example.com' },
      token: 'mock-token-123',
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha de Acesso');
    const rememberCheckbox = screen.getByLabelText('Lembrar de mim');
    const submitBtn = screen.getByRole('button', { name: 'Entrar no Classdoor' });

    fireEvent.change(emailInput, { target: { value: 'maria@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Senha@123' } });
    fireEvent.click(rememberCheckbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(localStorage.getItem('@classdoor:remember_email')).toBe('maria@example.com');
    });
  });

  it('deve carregar e-mail salvo do localStorage se disponível', () => {
    localStorage.setItem('@classdoor:remember_email', 'salvo@universidade.edu');

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('E-mail');
    const rememberCheckbox = screen.getByLabelText('Lembrar de mim');

    expect(emailInput.value).toBe('salvo@universidade.edu');
    expect(rememberCheckbox.checked).toBe(true);
  });

  it('deve exibir mensagem de erro retornada pelo serviço de autenticação', async () => {
    vi.spyOn(mockAuthService, 'loginUser').mockRejectedValueOnce(
      new Error('Email ou senha invalidos')
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha de Acesso');
    const submitBtn = screen.getByRole('button', { name: 'Entrar no Classdoor' });

    fireEvent.change(emailInput, { target: { value: 'usuario@errado.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Email ou senha invalidos');
    });
  });

  it('deve navegar para /recuperar-senha ao clicar em "Esqueci minha senha"', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const forgotBtn = screen.getByRole('button', { name: 'Esqueci minha senha' });
    fireEvent.click(forgotBtn);

    expect(mockedNavigate).toHaveBeenCalledWith('/recuperar-senha');
  });

  it('deve navegar para /register ao clicar em "Criar Nova Conta" ou na aba "Criar Conta"', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const createAccountBtn = screen.getByRole('button', { name: 'Criar Nova Conta' });
    fireEvent.click(createAccountBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/register');

    const tabCreateBtn = screen.getByRole('tab', { name: 'Criar Conta' });
    fireEvent.click(tabCreateBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/register');
  });
});
