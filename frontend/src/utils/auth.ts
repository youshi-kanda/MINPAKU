import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  exp: number;
}

export const AUTH_TOKEN_KEY = 'token';

export const saveToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Invalid token format:', error);
    removeToken(); // Remove invalid token
    return false;
  }
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const createApiUrl = (endpoint: string): string => {
  return `${import.meta.env.VITE_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
