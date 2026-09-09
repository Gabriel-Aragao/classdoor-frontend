import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

                    if (!email || !password) {
                        throw new Error('Email e senha são obrigatórios.')
                    }

                    const foundUser = get().registeredUsers.find(
                        (u) => u.email === email
                    );

                    if (!foundUser || foundUser.password !== password) {
                        throw new Error('Email ou senha invalidos');
                    }

                    const { password: _, ...sessionUser } = foundUser;
                    const mockToken = `mock-token-${foundUser.id}-${Date.now()}`;

                    set({
                        user: sessionUser,
                        token: mockToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    set({
                        error: error.message || 'Falha na autenticação',
                        isLoading: false,
                    });
                }
            },

            register: async (dados) => {
                set({ isLoading: true, error: null });

                try {
                    await new Promise((resolve) => setTimeout(resolve, 600));

                    const { name, email, password, role, department } = dados;

                    if (!email || !password || !name) {
                        throw new Error('Email, senha e nome são obrigatórios');
                    }

                    const emailExists = get().registeredUsers.some(
                        (u) => u.email === email
                    );

                    if (emailExists) {
                        throw new Error('Email ja cadastrado');
                    }

                    const newUser = {
                        id: `usr-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
                        name: name.trim(),
                        email: email.trim(),
                        password: password.trim(),
                        role: role || 'student',
                        department: department || 'Geral',
                        createdAt: new Date().toISOString(),
                    };

                    const updatedUsers = [...get().registeredUsers, newUser];
                    const { password: _, ...sessionUser } = newUser;
                    const mockToken = `mock-token-${newUser.id}-${Date.now()}`;

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
                        error: error.message || 'Falha no registro',
                        isLoading: false,
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

            clearError: () => {
                set({ error: null });
            },
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

        }
    )
);