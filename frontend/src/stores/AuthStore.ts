import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { AuthService } from '../services/AuthService';

export interface User {
  id: string;
  email: string;
  name: string;
  skillLevel: string;
  profileType: string;
}

export class AuthStore {
  rootStore: RootStore;
  authService: AuthService;
  
  // Observable state
  user: User | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.authService = new AuthService();
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
  login = async (email: string, password: string) => {
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
    } catch (error: any) {
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
  register = async (userData: Omit<User, 'id'> & { password: string }) => {
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
    } catch (error: any) {
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
  updateProfile = async (userData: Partial<Omit<User, 'id'>>) => {
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
    } catch (error: any) {
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
