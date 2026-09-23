import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useUserStore = create(
  persist(
    (set, get) => ({
      registeredUsers: [],
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 600));

          const normalizedEmail = String(email || '').trim().toLowerCase();

          if (!normalizedEmail || !password) {
            throw new Error('E-mail e senha são obrigatórios.');
          }

          if (!EMAIL_REGEX.test(normalizedEmail)) {
            throw new Error('Digite um e-mail válido.');
          }

          const foundUser = get().registeredUsers.find(
            (registeredUser) => registeredUser.email.toLowerCase() === normalizedEmail,
          );

          if (!foundUser || foundUser.password !== password) {
            throw new Error('E-mail ou senha inválidos.');
          }

          const { password: _password, ...sessionUser } = foundUser;
          const mockToken = `mock-jwt-${foundUser.id}-${Date.now()}`;

          set({
            user: sessionUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error.message || 'Falha na autenticação.',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },

      register: async (dados) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 600));

          const { name, email, password, role, department } = dados;
          const normalizedEmail = String(email || '').trim().toLowerCase();

          if (!name?.trim() || !normalizedEmail || !password) {
            throw new Error('E-mail, senha e nome são obrigatórios.');
          }

          if (!EMAIL_REGEX.test(normalizedEmail)) {
            throw new Error('Digite um e-mail válido.');
          }

          if (password.length < 8) {
            throw new Error('A senha deve ter no mínimo 8 caracteres.');
          }

          const emailExists = get().registeredUsers.some(
            (registeredUser) => registeredUser.email.toLowerCase() === normalizedEmail,
          );

          if (emailExists) {
            throw new Error('Este e-mail já está cadastrado.');
          }

          const newUser = {
            id: `usr-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: role || 'student',
            department: department || 'Geral',
            createdAt: new Date().toISOString(),
          };

          const updatedUsers = [...get().registeredUsers, newUser];
          const { password: _password, ...sessionUser } = newUser;
          const mockToken = `mock-jwt-${newUser.id}-${Date.now()}`;

          set({
            registeredUsers: updatedUsers,
            user: sessionUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error.message || 'Falha no registro.',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: '@classdoor:auth_state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        registeredUsers: state.registeredUsers,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
