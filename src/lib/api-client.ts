import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // Always include credentials in requests
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding CSRF token
apiClient.interceptors.request.use((config) => {
  // Add CSRF token to protected requests
  const csrfToken = localStorage.getItem('csrfToken');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  
  // Add auth token to header if available and no cookie present
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && !document.cookie.includes('access_token')) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not a retry, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          'http://localhost:8000/api/v1/user/refresh',
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data?.access_token) {
          localStorage.setItem('accessToken', refreshResponse.data.access_token);
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;