import { clearAllAuthData } from '../authUtils';

export const IDENTITY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

export const authApi = {
  login: async (data: any) => {
    const res = await fetch(`${IDENTITY_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  register: async (data: any) => {
    const res = await fetch(`${IDENTITY_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getMe: async (token: string) => {
    const res = await fetch(`${IDENTITY_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401 || res.status === 403) {
      clearAllAuthData();
    }
    return res.json();
  }
};