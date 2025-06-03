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
   * Generate domains based on ikigai summary
   */
  async generateDomains(ikigaiSummary) {
    try {
      const response = await this.post('/projects/domains/generate', { ikigai_summary: ikigaiSummary });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate domains');
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
   * Get projects for a specific domain, with option to generate if none exist
   */
  async getDomainProjects(domainId, generate = false) {
    try {
      const url = `/projects/domain/${domainId}/projects${generate ? '?generate=true' : ''}`;
      const response = await this.get(url);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get domain projects');
    }
  }
  
  /**
   * Generate projects for a domain
   */
  async generateProjects(domain) {
    try {
      const response = await this.post('/projects/generate', {
        domain_id: domain.id,
        domain_name: domain.name,
        domain_description: domain.description
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate projects');
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
