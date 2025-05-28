import api from './apiService';

export class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', {
        username: email, // FastAPI OAuth2 expects 'username'
        password: password,
      });
      
      const { access_token, token_type } = response.data;
      
      // Get user info with the token
      api.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;
      const userResponse = await this.getCurrentUser();
      
      return {
        user: userResponse,
        token: access_token
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }
  
  async signup(email, password) {
    try {
      const response = await api.post('/api/auth/signup', {
        email,
        password,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Signup failed');
    }
  }
  
  async logout() {
    try {
      await api.post('/api/auth/logout');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear token on client side even if server logout fails
      return true;
    }
  }
  
  async getCurrentUser() {
    try {
      // This endpoint would need to be implemented in the backend
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  }
  
  async updateProfile(userId, profileData) {
    try {
      const response = await api.put(`/api/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }
}
