const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest(path, options = {}) {
  const { auth = false, body, headers, ...fetchOptions } = options;
  const token = auth ? localStorage.getItem('backendToken') ?? localStorage.getItem('token') : null;

  const response = await fetch(getApiUrl(path), {
    ...fetchOptions,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API request failed.');
  }

  return data;
}
