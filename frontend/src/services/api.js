export function getApiUrl(path) {
  // Force local backend URL in development to bypass Next.js env caching bugs
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3001${path}`;
  }
  const baseUrl = typeof window !== 'undefined'
    ? (window.__UNISYNC_API_BASE_URL__ || process.env.NEXT_PUBLIC_API_BASE_URL || '')
    : (process.env.NEXT_PUBLIC_API_BASE_URL || '');
  return `${baseUrl}${path}`;
}

export async function apiRequest(path, options = {}) {
  const { auth = false, body, headers, ...fetchOptions } = options;
  const token = (auth && typeof window !== 'undefined')
    ? localStorage.getItem('backendToken') ?? localStorage.getItem('token')
    : null;

  try {
    const response = await fetch(getApiUrl(path), {
      ...fetchOptions,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers ?? {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get('content-type');
    let data = {};

    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    }

    if (!response.ok) {
      // If it's a proxy 504/502 error (HTML), explain clearly
      if (response.status === 504 || response.status === 502) {
        throw new Error(`Server connection failed (${response.status}). Please make sure your backend server is running on port 3001.`);
      }
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    // Re-throw with user-friendly network message if it was a connection error
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Could not connect to the backend server. Please verify that the Express server is running on port 3001.');
    }
    throw error;
  }
}
