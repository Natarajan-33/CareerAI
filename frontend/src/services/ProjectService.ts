import { ApiService } from './ApiService';
import { Project, Domain } from '../stores/ProjectStore';

/**
 * Service for handling project-related API calls
 */
export class ProjectService extends ApiService {
  /**
   * Get all available domains
   */
  async getDomains(): Promise<Domain[]> {
    try {
      const response = await this.get<Domain[]>('/projects/domains');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get domains');
    }
  }

  /**
   * Get a specific domain by ID
   */
  async getDomain(domainId: string): Promise<Domain> {
    try {
      const response = await this.get<Domain>(`/projects/domain/${domainId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get domain');
    }
  }

  /**
   * Get all projects, optionally filtered by domain
   */
  async getProjects(domainId?: string): Promise<Project[]> {
    try {
      const url = domainId ? `/projects/?domain=${domainId}` : '/projects/';
      const response = await this.get<Project[]>(url);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get projects');
    }
  }

  /**
   * Get a specific project by ID
   */
  async getProject(projectId: string): Promise<Project> {
    try {
      const response = await this.get<Project>(`/projects/${projectId}`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get project');
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    try {
      const response = await this.post<Project>('/projects/', projectData);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create project');
    }
  }
}
