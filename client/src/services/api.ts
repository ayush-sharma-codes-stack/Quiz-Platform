import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(`${API_BASE}${endpoint}`, config);

  // Auto-refresh token handling on 401 Unauthorized
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.accessToken) {
          useAuthStore.getState().setToken(refreshData.accessToken);
          headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
          response = await fetch(`${API_BASE}${endpoint}`, { ...config, headers });
        }
      } else {
        useAuthStore.getState().logout();
      }
    } catch (e) {
      useAuthStore.getState().logout();
    }
  }

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Failed to parse server response.',
  }));

  if (!response.ok || data.success === false) {
    const error: any = new Error(data.message || 'An unexpected error occurred.');
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data as T;
}
