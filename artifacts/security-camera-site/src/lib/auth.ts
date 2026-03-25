const TOKEN_KEY = "securevision_token";

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getHeaders: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { authorization: token } : {};
  }
};
