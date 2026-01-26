const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private getUploadHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response, endpoint: string, method: string, data?: any): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      // Check if it's an authentication error
      if (response.status === 401) {
        const errorData = await response.json();
        if (errorData.code === 'TOKEN_INVALID' || errorData.code === 'TOKEN_EXPIRED') {
          // Attempt to refresh the token by logging the user out
          console.log('Token invalid/expired, clearing auth token');
          localStorage.removeItem('auth_token');
          window.location.href = '/auth'; // Redirect to login
          return {} as T; // This won't be reached due to redirect
        }
      }

      let errorData;
      try {
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { message: await response.text() };
        }
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new ApiError(response.status, errorData.message || 'Request failed', errorData);
    }

    try {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return { success: true, data: await response.text() } as T;
      }
    } catch {
      throw new ApiError(500, 'Invalid response format');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<T>(response, endpoint, 'GET');
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<T>(response, endpoint, 'POST', data);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<T>(response, endpoint, 'PUT', data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<T>(response, endpoint, 'DELETE');
  }

  async upload<T>(endpoint: string, formData: FormData, method: string = 'POST'): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: headers, // Don't set Content-Type for FormData - let browser set it with proper boundary
      body: formData
    });
    return this.handleResponse<T>(response, endpoint, method);
  }
}

export const api = new ApiClient();
export { ApiError };
