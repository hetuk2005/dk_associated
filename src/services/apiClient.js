/**
 * MERN-Compatible API Client
 * ------------------------------------------------------------
 * Currently runs against seeded mock data + localStorage when
 * VITE_USE_MOCK !== 'false'. To connect an Express + MongoDB
 * backend later, set VITE_USE_MOCK=false and VITE_API_BASE_URL
 * in your .env file without changing any UI component.
 */

const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  useMock: import.meta.env.VITE_USE_MOCK !== 'false',
};

export function getApiConfig() {
  return API_CONFIG;
}

export async function request(endpoint, options = {}, mockHandler = null) {
  if (API_CONFIG.useMock && typeof mockHandler === 'function') {
    // Simulate realistic network latency for authentic loading states
    await new Promise((resolve) => setTimeout(resolve, 160));
    return mockHandler();
  }

  const token = localStorage.getItem('dk_associated_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Invalid server response',
  }));

  if (!response.ok) {
    throw new Error(payload.message || `HTTP Error ${response.status}`);
  }

  return payload;
}
