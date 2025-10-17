// API Base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.removeAuthToken();
          window.location.href = '/otp-login';
          throw new Error('Authentication failed');
        }
        
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create API instance
const api = new ApiService();

// Auth API methods
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/auth/register', userData),

  // Login user
  login: (credentials) => api.post('/auth/login', credentials),

  // Send OTP
  sendOTP: (mobile) => api.post('/auth/send-otp', { mobile }),

  // Verify OTP
  verifyOTP: (mobile, otp) => api.post('/auth/verify-otp', { mobile, otp }),

  // Admin login
  adminLogin: (credentials) => api.post('/auth/admin-login', credentials),

  // Get current user profile
  getProfile: () => api.get('/auth/me'),

  // Update user profile
  updateProfile: (profileData) => api.put('/auth/profile', profileData),

  // Logout
  logout: () => api.post('/auth/logout'),
};

// Test API methods
export const testAPI = {
  // Create new test
  createTest: (testData) => api.post('/tests/create', testData),

  // Get test details
  getTest: (testId, questionNumber = 1) => 
    api.get(`/tests/${testId}?questionNumber=${questionNumber}`),

  // Start test
  startTest: (testId) => api.post(`/tests/${testId}/start`),

  // Submit answer
  submitAnswer: (testId, answerData) => 
    api.post(`/tests/${testId}/answer`, answerData),

  // Complete test
  completeTest: (testId) => api.post(`/tests/${testId}/complete`),

  // Get test history
  getTestHistory: (page = 1, limit = 10) => 
    api.get(`/tests/user/history?page=${page}&limit=${limit}`),

  // Get test results
  getTestResults: (testId) => api.get(`/tests/${testId}/results`),
};

// User API methods
export const userAPI = {
  // Get user profile
  getProfile: () => api.get('/users/profile'),
};

// Payment API methods
export const paymentAPI = {
  // Create payment
  createPayment: (paymentData) => api.post('/payments/create', paymentData),
};

// Admin API methods
export const adminAPI = {
  // Get dashboard data
  getDashboard: () => api.get('/admin/dashboard'),
};

// Report API methods
export const reportAPI = {
  // Get test report
  getReport: (testId) => api.get(`/reports/${testId}`),
};

// Health check
export const healthAPI = {
  // Check API health
  checkHealth: () => api.get('/health'),
};

export default api;













