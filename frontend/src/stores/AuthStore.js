import { makeAutoObservable, runInAction } from 'mobx';
import { AuthService } from '../services/AuthService.js';
import { supabase } from '../services/SupabaseClient.js';

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
    
    // Set up Supabase auth state change listener
    this.setupAuthListener();
    
    // Check for existing session on initialization
    this.checkAuth();
  }
  
  /**
   * Set up Supabase auth state change listener
   */
  setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User has signed in
        this.fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        // User has signed out
        runInAction(() => {
          this.user = null;
          this.isAuthenticated = false;
        });
      } else if (event === 'USER_UPDATED') {
        // User data has been updated
        this.fetchUserProfile();
      }
    });
  };
  
  /**
   * Fetch user profile from Supabase
   */
  fetchUserProfile = async () => {
    try {
      const userData = await this.authService.getCurrentUser();
      
      runInAction(() => {
        this.user = userData;
        this.isAuthenticated = true;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message;
      });
    }
  };
  
  /**
   * Check if user is already authenticated
   */
  checkAuth = async () => {
    this.isLoading = true;
    
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data?.session) {
        await this.fetchUserProfile();
      } else {
        runInAction(() => {
          this.isLoading = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = 'Authentication failed';
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
      const result = await this.authService.register(userData);
      
      // Handle email confirmation case
      if (result.message && !result.token) {
        runInAction(() => {
          this.isLoading = false;
        });
        return { success: true, message: result.message };
      }
      
      runInAction(() => {
        this.user = result.user;
        this.isAuthenticated = true;
        this.isLoading = false;
      });
      
      return { success: true };
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Registration failed';
      });
      
      return { success: false, error: this.error };
    }
  };
  
  /**
   * Logout user
   */
  logout = async () => {
    this.isLoading = true;
    
    try {
      await this.authService.logout();
      
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Logout failed';
      });
      
      return false;
    }
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
   * Request password reset
   */
  resetPassword = async (email) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const result = await this.authService.resetPassword(email);
      
      runInAction(() => {
        this.isLoading = false;
      });
      
      return { success: true, message: result.message };
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Password reset failed';
      });
      
      return { success: false, error: this.error };
    }
  };
  
  /**
   * Set new password after reset
   */
  setNewPassword = async (newPassword) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const result = await this.authService.setNewPassword(newPassword);
      
      runInAction(() => {
        this.isLoading = false;
      });
      
      return { success: true, message: result.message };
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Password update failed';
      });
      
      return { success: false, error: this.error };
    }
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}