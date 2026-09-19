import { authService } from './authService';

export const mockAuthService = {
  loginUser: async ({ email, password }) => authService.login({ email, password }),

  requestPasswordReset: async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { email, sent: true, expiresInHours: 24 };
  },
};
