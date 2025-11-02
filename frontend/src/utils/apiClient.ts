import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Custom fetch wrapper that handles authentication and token refresh
 */
export const apiClient = async (
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> => {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  // Prepare headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    const accessToken = authService.getAccessToken();
    if (accessToken) {
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  // Make the request
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });

  // If we get a 401 and have a refresh token, try to refresh the access token
  if (response.status === 401 && requiresAuth) {
    try {
      const newAccessToken = await authService.refreshAccessToken();

      // Retry the original request with the new token
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;

      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers: requestHeaders,
      });
    } catch {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
};

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: (endpoint: string, options?: RequestOptions) =>
    apiClient(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiClient(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestOptions) =>
    apiClient(endpoint, { ...options, method: 'DELETE' }),
};