export const API_URL = 'http://localhost:5000/api';

export const getAuthHeaders = () => {
  const userInfo = localStorage.getItem('userInfo');
  let token = null;
  if (userInfo) {
    try {
      token = JSON.parse(userInfo).token;
    } catch (e) {
      console.error('Error parsing userInfo from localStorage');
    }
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
