import api from './apiService';

export class ProjectService {
  async getUserProjects(userId) {
    try {
      const response = await api.get(`/api/projects`, {
        params: { user_id: userId }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get user projects');
    }
  }
  
  async getProject(projectId) {
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get project details');
    }
  }
  
  async createProject(projectData) {
    try {
      const response = await api.post('/api/projects', projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create project');
    }
  }
  
  async updateProject(projectId, projectData) {
    try {
      const response = await api.put(`/api/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update project');
    }
  }
  
  async getProjectSuggestions(domain) {
    try {
      const response = await api.get(`/api/projects/suggestions/${domain}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get project suggestions');
    }
  }
}
