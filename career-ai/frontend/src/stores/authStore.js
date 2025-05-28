import { makeAutoObservable, runInAction } from 'mobx';
import { AuthService } from '../services/authService';

export class AuthStore {
  user = null;
  isLoggedIn = false;
  isLoading = false;
  error = null;
  
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.authService = new AuthService();
    makeAutoObservable(this);
    
    // Try to restore session on initialization
    this.checkAuth();
  }
  
  // Check if user is already authenticated
  async checkAuth() {
    try {
      this.isLoading = true;
      const token = localStorage.getItem('token');
      
      if (token) {
        // Validate token and get user info
        const user = await this.authService.getCurrentUser();
        
        runInAction(() => {
          this.user = user;
          this.isLoggedIn = true;
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Login user
  async login(email, password) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const { user, token } = await this.authService.login(email, password);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      runInAction(() => {
        this.user = user;
        this.isLoggedIn = true;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Login failed';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Register new user
  async signup(email, password) {
    try {
      this.isLoading = true;
      this.error = null;
      
      await this.authService.signup(email, password);
      
      // Auto-login after signup
      return await this.login(email, password);
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Signup failed';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Continue as guest
  loginAsGuest() {
    runInAction(() => {
      this.user = { id: 'guest', email: 'guest' };
      this.isLoggedIn = true;
    });
    return true;
  }
  
  // Logout user
  async logout() {
    try {
      this.isLoading = true;
      
      // Only call logout API if not a guest user
      if (this.user && this.user.id !== 'guest') {
        await this.authService.logout();
      }
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      runInAction(() => {
        this.user = null;
        this.isLoggedIn = false;
      });
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Update user profile
  async updateProfile(profileData) {
    try {
      this.isLoading = true;
      
      const updatedUser = await this.authService.updateProfile(this.user.id, profileData);
      
      runInAction(() => {
        this.user = { ...this.user, ...updatedUser };
      });
      
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
