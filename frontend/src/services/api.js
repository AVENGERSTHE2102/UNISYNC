export function getApiUrl(path) {
  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (typeof window !== 'undefined') {
    // Only fallback to runtime config if env is missing, and don't let it force port 3000 in dev
    if (!baseUrl && window.__UNISYNC_API_BASE_URL__ && !window.__UNISYNC_API_BASE_URL__.includes('3000')) {
      baseUrl = window.__UNISYNC_API_BASE_URL__;
    }

    if (!baseUrl) {
      baseUrl = 'http://localhost:3001';
    }

    // Dynamic hostname rewrite for local network sharing (e.g. 192.168.x.x)
    if (baseUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      const portMatch = baseUrl.match(/:(\d+)$/);
      const port = portMatch ? `:${portMatch[1]}` : '';
      baseUrl = `${window.location.protocol}//${window.location.hostname}${port}`;
    }
  } else {
    baseUrl = baseUrl || 'http://localhost:3001';
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
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
        ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers ?? {})
      },
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined)
    });

    const contentType = response.headers.get('content-type');
    let data = {};

    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    }

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('backendToken');
          localStorage.removeItem('userType');
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        }
        throw new Error('Your session has expired. Please log in again.');
      }
      
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
