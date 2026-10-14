import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiCall } from '../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const normalizedEmail = String(email || '').trim().toLowerCase();

          if (!normalizedEmail || !password) {
            throw new Error('E-mail e senha são obrigatórios.');
          }

          if (!EMAIL_REGEX.test(normalizedEmail)) {
            throw new Error('Digite um e-mail válido.');
          }

          const data = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: normalizedEmail, password }),
          });

          // Espera-se que a API retorne { token, user: { id, name, email, role, department } } ou similar
          const token = data.token || data.accessToken;
          const user = data.user || { email: normalizedEmail, name: data.name || 'Usuário' };

          if (token) {
            localStorage.setItem('@classdoor:token', token);
          }

          set({
            user,
            token,
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

          const data = await apiCall('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
              name: name.trim(),
              email: normalizedEmail,
              password,
              role: role || 'student',
              department: department || 'Geral',
            }),
          });

          const token = data.token || data.accessToken;
          const user = data.user || { name: name.trim(), email: normalizedEmail, role: role || 'student' };

          if (token) {
            localStorage.setItem('@classdoor:token', token);
          }

          set({
            user,
            token,
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
        localStorage.removeItem('@classdoor:token');
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
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
