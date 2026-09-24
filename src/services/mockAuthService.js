import { authService } from './authService';

const RESET_STORAGE_KEY = '@classdoor:password_reset';
const RESET_EXPIRATION_MS = 30 * 60 * 1000;

export const mockAuthService = {
  loginUser: async ({ email, password }) => authService.login({ email, password }),

  requestPasswordReset: async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const normalizedEmail = email.trim().toLowerCase();
    const requestedAt = Date.now();
    const expiresAt = requestedAt + RESET_EXPIRATION_MS;
    const request = {
      email: normalizedEmail,
      token: `mock-reset-${requestedAt}`,
      requestedAt,
      expiresAt,
    };

    localStorage.setItem(RESET_STORAGE_KEY, JSON.stringify(request));
    return { ...request, sent: true, expiresInMinutes: 30 };
  },

  getPasswordResetRequest: () => {
    const raw = localStorage.getItem(RESET_STORAGE_KEY);
    if (!raw) return null;

    try {
      const request = JSON.parse(raw);
      if (!request.expiresAt || Date.now() >= request.expiresAt) {
        localStorage.removeItem(RESET_STORAGE_KEY);
        return null;
      }
      return request;
    } catch {
      localStorage.removeItem(RESET_STORAGE_KEY);
      return null;
    }
  },
};
