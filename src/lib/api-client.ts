import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding CSRF token
// apiClient.interceptors.request.use((config) => {

  
//   // Add auth token to header if available and no cookie present
//   const accessToken = localStorage.getItem('accessToken');
//   if (accessToken && !document.cookie.includes('access_token')) {
//     config.headers['Authorization'] = `Bearer ${accessToken}`;
//   }
  
//   return config;
// });

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/refresh`,
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data?.access_token) {
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        // window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;