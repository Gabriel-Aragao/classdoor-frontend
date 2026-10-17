const getApiBaseUrl = () => {
  try {
    const envUrl = import.meta.env && import.meta.env.VITE_API_BASE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
      return envUrl.trim();
    }
    
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const hostname = window.location.hostname.toLowerCase();
      if (hostname.includes('dev') || hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('preview') || hostname.includes('git')) {
        return 'https://dev-api.odominoapp.win';
      }
    }
  } catch (e) {
    console.error('Error determining API base URL:', e);
  }
  
  return 'https://api.odominoapp.win';
};

const API_BASE_URL = getApiBaseUrl();

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('@classdoor:token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Erro na requisição';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Se a resposta for vazia (204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
