// API Client for Backend Integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Lightweight in-memory cache for public GET requests (dedupe + TTL).
// Reduces duplicate API calls across components on the same page render.
type CacheEntry = { expiresAt: number; promise: Promise<any> }
const publicGetCache = new Map<string, CacheEntry>()
// 5 minutes in production, 30 seconds in dev (hot reload often changes data)
const PUBLIC_GET_TTL_MS = process.env.NODE_ENV === 'production' ? 5 * 60_000 : 30_000

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_token', token);
  },
  
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('admin_token');
  },
};

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenManager.getToken();
  const method = (options.method || 'GET').toUpperCase()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const doFetch = async (): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || 'An error occurred',
          errorData.errors,
        );
      }

      // Handle empty responses (e.g., DELETE operations)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      const text = await response.text();
      if (!text || text.trim() === '') {
        return {} as T;
      }

      return JSON.parse(text);
    } catch (error) {
      // Handle network errors (backend not running, CORS, etc.)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error(`API request failed: ${API_BASE_URL}${endpoint}`);
        console.error('Make sure the backend server is running on', API_BASE_URL);
        throw new ApiError(
          0,
          `Cannot connect to backend server. Please ensure the backend is running at ${API_BASE_URL}`,
        );
      }
      // Re-throw other errors (ApiError, etc.)
      throw error;
    }
  }

  // Cache only public GET requests (no admin token) to avoid stale admin data.
  if (!token && method === 'GET') {
    // Include full URL + body in key to avoid collisions between different queries
    const cacheKey = `${API_BASE_URL}${endpoint}|${JSON.stringify(options.body ?? null)}`
    const now = Date.now()
    const cached = publicGetCache.get(cacheKey)
    if (cached && cached.expiresAt > now) return cached.promise as Promise<T>

    const promise = doFetch()
    publicGetCache.set(cacheKey, { expiresAt: now + PUBLIC_GET_TTL_MS, promise })
    promise.catch(() => {
      const current = publicGetCache.get(cacheKey)
      if (current?.promise === promise) publicGetCache.delete(cacheKey)
    })
    return promise
  }
  
  return doFetch()
}

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await apiRequest<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    tokenManager.setToken(response.accessToken);
    return response;
  },
  
  logout: () => {
    tokenManager.removeToken();
  },
  
  getProfile: () => apiRequest<any>('/auth/profile'),
};

// Categories API
export const categoriesApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<any>(`/categories?${query}`);
  },
  
  getOne: (id: string) => apiRequest<any>(`/categories/${id}`),
  
  create: (data: any) => apiRequest<any>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest<any>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest<any>(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Products API
export const productsApi = {
  getAll: (params?: { page?: number; limit?: number; isFeatured?: boolean; categoryId?: string }) => {
    if (params?.categoryId) {
      const { categoryId, ...rest } = params;
      const query = new URLSearchParams(rest as any).toString();
      const suffix = query ? `?${query}` : "";
      return apiRequest<any>(`/products/category/${categoryId}${suffix}`);
    }
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<any>(`/products?${query}`);
  },
  
  getOne: (id: string) => apiRequest<any>(`/products/${id}`),

  getBySlug: (slug: string) => apiRequest<any>(`/products/slug/${slug}`),
  
  create: (data: any) => apiRequest<any>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest<any>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest<any>(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Blog API
export const blogApi = {
  getAll: (params?: { page?: number; limit?: number; isPublished?: string | boolean }) => {
    const queryParams: any = { ...params };
    // Convert boolean to string if needed
    if (typeof queryParams.isPublished === 'boolean') {
      queryParams.isPublished = queryParams.isPublished ? 'true' : 'false';
    }
    const query = new URLSearchParams(queryParams as any).toString();
    return apiRequest<any>(`/blog?${query}`);
  },
  
  getOne: (id: string) => apiRequest<any>(`/blog/${id}`),
  
  getBySlug: (slug: string) => apiRequest<any>(`/blog/slug/${slug}`),
  
  create: (data: any) => apiRequest<any>('/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest<any>(`/blog/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest<any>(`/blog/${id}`, {
    method: 'DELETE',
  }),
};

// Applications API
export const applicationsApi = {
  create: (data: any) => apiRequest<any>('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<any>(`/applications?${query}`);
  },

  getOne: (id: string) => apiRequest<any>(`/applications/${id}`),

  getStats: () => apiRequest<any>('/applications/stats'),

  updateStatus: (id: string, status: string) => apiRequest<any>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  update: (id: string, data: any) => apiRequest<any>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest<any>(`/applications/${id}`, {
    method: 'DELETE',
  }),
};

// Dictionary API
export const dictionaryApi = {
  getAll: () => apiRequest<any>('/dictionary'),
  getFilters: () => apiRequest<any>('/dictionary/filters'),
  listByType: (type: string, params?: { all?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<any>(`/dictionary/type/${type}${query ? `?${query}` : ''}`);
  },
  create: (data: any) =>
    apiRequest<any>('/dictionary', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/dictionary/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<any>(`/dictionary/${id}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<any>(`/users?${query}`);
  },
  
  getOne: (id: string) => apiRequest<any>(`/users/${id}`),
  
  create: (data: any) => apiRequest<any>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest<any>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest<any>(`/users/${id}`, {
    method: 'DELETE',
  }),
};

