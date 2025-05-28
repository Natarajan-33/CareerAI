import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { ProjectService } from '../services/ProjectService';

export interface ResourceLink {
  title: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Project {
  id: string;
  domain: string;
  title: string;
  description: string;
  tasks: Task[];
  difficulty: string;
  skillsRequired: string[];
  resourceLinks: ResourceLink[];
  estimatedHours?: number;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredSkills: string[];
  jobTitles: string[];
}

export class ProjectStore {
  rootStore: RootStore;
  projectService: ProjectService;
  
  // Observable state
  domains: Domain[] = [];
  projects: Project[] = [];
  selectedDomain: Domain | null = null;
  selectedProject: Project | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.projectService = new ProjectService();
    makeAutoObservable(this, { rootStore: false, projectService: false });
  }
  
  /**
   * Load all available domains
   */
  loadDomains = async () => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const domains = await this.projectService.getDomains();
      
      runInAction(() => {
        this.domains = domains;
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load domains';
      });
    }
  };
  
  /**
   * Load projects for a specific domain
   */
  loadProjects = async (domainId?: string) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const projects = await this.projectService.getProjects(domainId);
      
      runInAction(() => {
        this.projects = projects;
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load projects';
      });
    }
  };
  
  /**
   * Load a specific project by ID
   */
  loadProject = async (projectId: string) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const project = await this.projectService.getProject(projectId);
      
      runInAction(() => {
        this.selectedProject = project;
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load project';
      });
    }
  };
  
  /**
   * Select a domain
   */
  selectDomain = (domainId: string) => {
    const domain = this.domains.find(d => d.id === domainId) || null;
    this.selectedDomain = domain;
    
    if (domain) {
      this.loadProjects(domain.id);
    }
  };
  
  /**
   * Select a project
   */
  selectProject = (projectId: string) => {
    const project = this.projects.find(p => p.id === projectId) || null;
    this.selectedProject = project;
  };
  
  /**
   * Clear selections
   */
  clearSelections = () => {
    this.selectedDomain = null;
    this.selectedProject = null;
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
