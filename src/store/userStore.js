import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mockAuthService } from '../services/mockAuthService.js'

/**
 * Store Global de Usuário e Sessão — Classdoor (Zustand)
 * 
 * Gerencia o estado de autenticação (US01 & US02) com persistência automática no localStorage.
 * Chave de armazenamento: classdoor_auth_session
 */
export const useUserStore = create(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // --- Ações de Sessão e Autenticação ---

      /**
       * Realiza login do usuário com credenciais e armazena token/sessão
       */
      login: async ({ email, password }) => {
        set({ isLoading: true, error: null })
        try {
          const response = await mockAuthService.login({ email, password })
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return response
        } catch (err) {
          const errorMessage = err.message || 'Erro ao realizar login.'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          })
          throw err
        }
      },

      /**
       * Registra um novo usuário e realiza login automático na sequência
       */
      register: async ({ name, email, password, role = 'STUDENT', department = '' }) => {
        set({ isLoading: true, error: null })
        try {
          const newUser = await mockAuthService.register({
            name,
            email,
            password,
            role,
            department,
          })

          // Efetua login automático do novo usuário cadastrado
          const loginResponse = await mockAuthService.login({ email, password })
          set({
            user: loginResponse.user,
            token: loginResponse.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return newUser
        } catch (err) {
          const errorMessage = err.message || 'Erro ao registrar usuário.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw err
        }
      },

      /**
       * Solicita recuperação de senha
       */
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null })
        try {
          const response = await mockAuthService.forgotPassword(email)
          set({ isLoading: false, error: null })
          return response
        } catch (err) {
          const errorMessage = err.message || 'Erro ao solicitar recuperação de senha.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw err
        }
      },

      /**
       * Encerra a sessão ativa do usuário e limpa o estado
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      /**
       * Limpa mensagens de erro pendentes
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Retorna os dados da sessão atual ou verifica validade
       */
      getSession: () => {
        const { user, token, isAuthenticated } = get()
        return { user, token, isAuthenticated }
      },
    }),
    {
      name: 'classdoor_auth_session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
