export const authService = {
  async login(email: string) {
    return { user: { id: "mock-user", email }, token: "mock-session-token" };
  },
  async signup(email: string) {
    return { user: { id: "new-user", email }, requiresVerification: true };
  },
  async resetPassword(email: string) {
    return { email, sent: true };
  }
};
