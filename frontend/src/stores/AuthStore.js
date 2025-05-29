import { makeAutoObservable, runInAction } from 'mobx';
import { AuthService } from '../services/AuthService.js';

export class AuthStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.authService = new AuthService();
    
    // Observable state
    this.user = null;
    this.isAuthenticated = false;
    this.isLoading = false;
    this.error = null;
    
    makeAutoObservable(this, { rootStore: false, authService: false });
    
    // Check for existing token on initialization
    this.checkAuth();
  }
  
  /**
   * Check if user is already authenticated
   */
  checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    this.isLoading = true;
    
    try {
      // In a real implementation, this would validate the token with the backend
      // and fetch the user profile
      const userData = await this.authService.getCurrentUser();
      
      runInAction(() => {
        this.user = userData;
        this.isAuthenticated = true;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = 'Authentication failed';
        localStorage.removeItem('token');
      });
    }
  };
  
  /**
   * Login user
   */
  login = async (email, password) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const { token, user } = await this.authService.login(email, password);
      
      localStorage.setItem('token', token);
      
      runInAction(() => {
        this.user = user;
        this.isAuthenticated = true;
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Login failed';
      });
      
      return false;
    }
  };
  
  /**
   * Register new user
   */
  register = async (userData) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const { token, user } = await this.authService.register(userData);
      
      localStorage.setItem('token', token);
      
      runInAction(() => {
        this.user = user;
        this.isAuthenticated = true;
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Registration failed';
      });
      
      return false;
    }
  };
  
  /**
   * Logout user
   */
  logout = () => {
    localStorage.removeItem('token');
    
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
    });
  };
  
  /**
   * Update user profile
   */
  updateProfile = async (userData) => {
    if (!this.user) return false;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const updatedUser = await this.authService.updateProfile(userData);
      
      runInAction(() => {
        this.user = updatedUser;
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Profile update failed';
      });
      
      return false;
    }
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
