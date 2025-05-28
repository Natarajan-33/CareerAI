import { ApiService } from './ApiService';
import { ProgressItem, Milestone, SocialPost } from '../stores/ProgressStore';

/**
 * Service for handling progress-related API calls
 */
export class ProgressService extends ApiService {
  /**
   * Get progress for a specific user
   */
  async getUserProgress(userId: string, projectId?: string): Promise<ProgressItem[]> {
    try {
      const url = projectId
        ? `/progress/user/${userId}?project_id=${projectId}`
        : `/progress/user/${userId}`;
      
      const response = await this.get<ProgressItem[]>(url);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get user progress');
    }
  }

  /**
   * Update progress for a task
   */
  async updateProgress(progressData: Omit<ProgressItem, 'id' | 'updatedAt'>): Promise<ProgressItem> {
    try {
      const response = await this.post<ProgressItem>('/progress/update', progressData);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update progress');
    }
  }

  /**
   * Get milestones for a specific user
   */
  async getUserMilestones(userId: string): Promise<Milestone[]> {
    try {
      const response = await this.get<Milestone[]>(`/progress/milestones/${userId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get user milestones');
    }
  }

  /**
   * Create a social post
   */
  async createSocialPost(postData: Omit<SocialPost, 'id' | 'createdAt'>): Promise<SocialPost> {
    try {
      const response = await this.post<SocialPost>('/progress/social-post', postData);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create social post');
    }
  }

  /**
   * Generate a social post
   */
  async generateSocialPost(userId: string, projectId: string, platform: string): Promise<{ content: string; suggested_hashtags: string[]; suggested_image: string }> {
    try {
      const response = await this.post<{ content: string; suggested_hashtags: string[]; suggested_image: string }>(
        '/progress/generate-post',
        { user_id: userId, project_id: projectId, platform }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to generate social post');
    }
  }
}
