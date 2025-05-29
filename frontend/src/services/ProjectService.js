import { ApiService } from './ApiService.js';

/**
 * Service for handling project-related API calls
 */
export class ProjectService extends ApiService {
  /**
   * Get all available domains
   */
  async getDomains() {
    try {
      const response = await this.get('/projects/domains');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get domains');
    }
  }

  /**
   * Get a specific domain by ID
   */
  async getDomain(domainId) {
    try {
      const response = await this.get(`/projects/domain/${domainId}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get domain');
    }
  }

  /**
   * Get all projects, optionally filtered by domain
   */
  async getProjects(domainId) {
    try {
      const url = domainId ? `/projects/?domain=${domainId}` : '/projects/';
      const response = await this.get(url);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get projects');
    }
  }

  /**
   * Get a specific project by ID
   */
  async getProject(projectId) {
    try {
      const response = await this.get(`/projects/${projectId}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get project');
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData) {
    try {
      const response = await this.post('/projects/', projectData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create project');
    }
  }
}
