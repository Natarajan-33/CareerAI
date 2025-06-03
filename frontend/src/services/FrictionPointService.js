import { ApiService } from './ApiService.js';

/**
 * Service for handling friction points and Delta 4 analysis API calls
 */
export class FrictionPointService extends ApiService {
  /**
   * Get all friction points for a project
   */
  async getProjectFrictionPoints(projectId, dimension, pointType) {
    try {
      let url = `/friction-points/project/${projectId}`;
      
      // Add query parameters if provided
      const params = new URLSearchParams();
      if (dimension) params.append('dimension', dimension);
      if (pointType) params.append('point_type', pointType);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const response = await this.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching project friction points:', error);
      // Handle connection issues gracefully
      return [];
    }
  }

  /**
   * Create a new friction point
   */
  async createFrictionPoint(frictionPointData, projectId, userId) {
    try {
      const response = await this.post(
        `/friction-points?project_id=${projectId}&user_id=${userId}`,
        frictionPointData
      );
      return response;
    } catch (error) {
      console.error('Error creating friction point:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create friction point');
    }
  }

  /**
   * Delete a friction point
   */
  async deleteFrictionPoint(frictionPointId) {
    try {
      await this.delete(`/friction-points/${frictionPointId}`);
      return true;
    } catch (error) {
      console.error('Error deleting friction point:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete friction point');
    }
  }

  /**
   * Analyze a project using the Delta 4 framework
   */
  async analyzeDelta4(projectId, projectDescription, currentStatus, challenges, goals, userId) {
    try {
      const response = await this.post(
        `/analyze-delta4?user_id=${userId}`,
        {
          project_id: projectId,
          project_description: projectDescription,
          current_status: currentStatus,
          challenges: challenges,
          goals: goals
        }
      );
      return response;
    } catch (error) {
      console.error('Error analyzing project with Delta 4:', error);
      throw new Error(error.response?.data?.detail || 'Failed to analyze project');
    }
  }
}
