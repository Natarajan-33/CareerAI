import { supabase } from './SupabaseClient.js';

/**
 * Service for handling authentication-related operations using Supabase
 */
export class AuthService {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || 'User',
          skillLevel: data.user.user_metadata?.skill_level || 'beginner',
          profileType: data.user.user_metadata?.profile_type || 'professional',
        }
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            skill_level: userData.skillLevel,
            profile_type: userData.profileType,
          }
        }
      });
      
      if (error) throw error;
      
      // If email confirmation is required, the session might be null
      if (!data.session) {
        return {
          message: 'Please check your email for confirmation link',
          user: {
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            skillLevel: userData.skillLevel,
            profileType: userData.profileType,
          }
        };
      }
      
      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
          skillLevel: userData.skillLevel,
          profileType: userData.profileType,
        }
      };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      if (!data.user) throw new Error('No user found');
      
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'User',
        skillLevel: data.user.user_metadata?.skill_level || 'beginner',
        profileType: data.user.user_metadata?.profile_type || 'professional',
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get user profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          skill_level: userData.skillLevel,
          profile_type: userData.profileType,
        }
      });
      
      if (error) throw error;
      
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        skillLevel: data.user.user_metadata?.skill_level,
        profileType: data.user.user_metadata?.profile_type,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }

  /**
   * Set new password after reset
   */
  async setNewPassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new Error(error.message || 'Failed to update password');
    }
  }
}
