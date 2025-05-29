import { ApiService } from './ApiService.js';

/**
 * Service for handling progress-related API calls
 */
export class ProgressService extends ApiService {
  /**
   * Get progress for a specific user
   */
  async getUserProgress(userId, projectId) {
    try {
      const url = projectId
        ? `/progress/user/${userId}?project_id=${projectId}`
        : `/progress/user/${userId}`;
      
      const response = await this.get(url);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get user progress');
    }
  }

  /**
   * Update progress for a task
   */
  async updateProgress(progressData) {
    try {
      const response = await this.post('/progress/update', progressData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update progress');
    }
  }

  /**
   * Get milestones for a specific user
   */
  async getUserMilestones(userId) {
    try {
      const response = await this.get(`/progress/milestones/${userId}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get user milestones');
    }
  }

  /**
   * Create a social post
   */
  async createSocialPost(postData) {
    try {
      const response = await this.post('/progress/social-post', postData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create social post');
    }
  }

  /**
   * Generate a social post
   */
  async generateSocialPost(userId, projectId, platform) {
    try {
      const response = await this.post(
        '/progress/generate-post',
        { user_id: userId, project_id: projectId, platform }
      );
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate social post');
    }
  }
}
