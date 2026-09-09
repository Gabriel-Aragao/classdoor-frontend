import { useUserStore } from '../store/userStore';

export const authService = {

  login: async (credentialsOrEmail, password) => {
    let email;
    let pass;

    if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
      email = credentialsOrEmail.email;
      pass = credentialsOrEmail.password;
    } else {
      email = credentialsOrEmail;
      pass = password;
    }

    await useUserStore.getState().login(email, pass);

    const state = useUserStore.getState();
    if (state.error) {
      throw new Error(state.error);
    }

    return {
      user: state.user,
      token: state.token,
    };
  },

  register: async (dados) => {
    await useUserStore.getState().register(dados);

    const state = useUserStore.getState();
    if (state.error) {
      throw new Error(state.error);
    }

    return {
      user: state.user,
      token: state.token,
    };
  },

  logout: () => {
    useUserStore.getState().logout();
  },

  getCurrentUser: () => {
    return useUserStore.getState().user;
  },

  getToken: () => {
    return useUserStore.getState().token;
  },

  isAuthenticated: () => {
    return useUserStore.getState().isAuthenticated;
  },
};
