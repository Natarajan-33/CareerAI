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
   * Get milestones for a specific project
   */
  async getProjectMilestones(projectId) {
    try {
      const response = await this.get(`/milestones/project/${projectId}`);
      return response;
    } catch (error) {
      // Handle connection issues gracefully
      console.error('Error fetching project milestones:', error);
      return [];
    }
  }
  
  /**
   * Create a new milestone
   */
  async createMilestone(milestoneData) {
    try {
      console.log('Creating milestone with data:', milestoneData);
      
      // Format the date as YYYY-MM-DD for the API
      const formattedDate = typeof milestoneData.dueDate === 'string' 
        ? milestoneData.dueDate 
        : new Date(milestoneData.dueDate).toISOString().split('T')[0];
      
      const response = await this.post(`/milestones?project_id=${milestoneData.projectId}`, {
        title: milestoneData.title,
        description: milestoneData.description || '',
        due_date: formattedDate,
        status: milestoneData.status || 'not_started',
        task_id: milestoneData.task_id // Use task_id from the form data
      });
      
      console.log('Milestone created successfully:', response);
      return response;
    } catch (error) {
      // Handle connection issues gracefully
      console.error('Error creating milestone:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create milestone');
    }
  }
  
  /**
   * Update an existing milestone
   */
  async updateMilestone(milestoneData) {
    try {
      const response = await this.patch(`/milestones/${milestoneData.id}`, {
        title: milestoneData.title,
        description: milestoneData.description,
        due_date: milestoneData.dueDate,
        status: milestoneData.status
      });
      return response;
    } catch (error) {
      // Handle connection issues gracefully
      console.error('Error updating milestone:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update milestone');
    }
  }
  
  /**
   * Delete a milestone
   */
  async deleteMilestone(milestoneId) {
    try {
      await this.delete(`/milestones/${milestoneId}`);
      return true;
    } catch (error) {
      // Handle connection issues gracefully
      console.error('Error deleting milestone:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete milestone');
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
