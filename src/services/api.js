const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.odominoapp.win';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('@classdoor:token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
