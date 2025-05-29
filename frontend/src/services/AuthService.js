import { ApiService } from './ApiService.js';

/**
 * Service for handling authentication-related API calls
 */
export class AuthService extends ApiService {
  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await this.post('/auth/token', {
        username: email, // OAuth2 compatible format expects 'username'
        password,
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await this.post('/auth/signup', userData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      // This is a placeholder - in a real implementation, you would have an endpoint to get the user profile
      // For now, we'll simulate it with a mock user
      return {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Test User',
        skillLevel: 'intermediate',
        profileType: 'professional',
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get user profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    try {
      // This is a placeholder - in a real implementation, you would have an endpoint to update the user profile
      return {
        id: 'user-1',
        email: userData.email || 'user@example.com',
        name: userData.name || 'Test User',
        skillLevel: userData.skillLevel || 'intermediate',
        profileType: userData.profileType || 'professional',
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update profile');
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(token) {
    try {
      const response = await this.post('/auth/refresh-token', { token });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to refresh token');
    }
  }
}
