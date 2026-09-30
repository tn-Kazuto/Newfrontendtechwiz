import { isBypassAdminEnabled } from '../config/adminConfig';

export function parseJwt(token: string): any {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getAccessToken(): string {
  if (typeof window === 'undefined') return '';
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (match && match[1]) return decodeURIComponent(match[1]);
  return localStorage.getItem('access_token') || localStorage.getItem('token') || '';
}

export function clearAllAuthData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('kpop_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('kpop_user_activities');
  } catch { }

  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname};`;
        const hostParts = window.location.hostname.split('.');
        if (hostParts.length > 1) {
          const rootDomain = hostParts.slice(-2).join('.');
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${rootDomain};`;
        }
      }
    }
  }
}

export function checkIsAdmin(user?: any): boolean {
  if (isBypassAdminEnabled()) return true;
  if (typeof window === 'undefined') return false;

  // 1. If user object is provided from AuthContext
  if (user) {
    const roleStr = String(user.role || '').toLowerCase();
    if (roleStr === 'admin') return true;
    if (Array.isArray(user.roles) && user.roles.some((r: string) => String(r).toLowerCase() === 'admin')) return true;
    
    // If user object is loaded and is not admin (e.g. registered, user, visitor), return false immediately
    if (user.role && user.role !== 'visitor') {
      return false;
    }
  }

  // 2. Check JWT Token claims if user is not in state
  const token = getAccessToken();
  if (token) {
    const payload = parseJwt(token);
    if (payload) {
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      const roleClaim =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload['role'] ||
        payload['roles'];
      if (Array.isArray(roleClaim)) {
        if (roleClaim.some((r: string) => String(r).toLowerCase() === 'admin')) return true;
      } else if (typeof roleClaim === 'string' && roleClaim.toLowerCase() === 'admin') {
        return true;
      }
    }
  }

  // 3. Check saved user in localStorage as fallback
  try {
    const saved = localStorage.getItem('kpop_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (String(parsed.role || '').toLowerCase() === 'admin') return true;
      if (Array.isArray(parsed.roles) && parsed.roles.some((r: string) => String(r).toLowerCase() === 'admin')) return true;
    }
  } catch { }

  return false;
}

