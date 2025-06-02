import { makeAutoObservable, runInAction } from 'mobx';
import { ProjectService } from '../services/ProjectService.js';

export class ProjectStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.projectService = new ProjectService();
    
    // Observable state
    this.domains = [];
    this.projects = [];
    this.selectedDomain = null;
    this.selectedProject = null;
    this.isLoading = false;
    this.error = null;
    this.ikigaiSummary = '';
    
    makeAutoObservable(this, { rootStore: false, projectService: false });
    
    // Load domains from session storage if available
    this.loadDomainsFromSessionStorage();
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
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load domains';
      });
    }
  };
  
  /**
   * Load domains from session storage
   */
  loadDomainsFromSessionStorage = () => {
    try {
      const storedDomains = sessionStorage.getItem('generatedDomains');
      const storedIkigaiSummary = sessionStorage.getItem('ikigaiSummary');
      
      if (storedDomains) {
        this.domains = JSON.parse(storedDomains);
      }
      
      if (storedIkigaiSummary) {
        this.ikigaiSummary = storedIkigaiSummary;
      }
    } catch (error) {
      console.error('Error loading domains from session storage:', error);
    }
  };
  
  /**
   * Save domains to session storage
   */
  saveDomainsToSessionStorage = (domains, ikigaiSummary) => {
    try {
      sessionStorage.setItem('generatedDomains', JSON.stringify(domains));
      sessionStorage.setItem('ikigaiSummary', ikigaiSummary);
    } catch (error) {
      console.error('Error saving domains to session storage:', error);
    }
  };
  
  /**
   * Clear domains from session storage
   */
  clearDomainsFromSessionStorage = () => {
    try {
      sessionStorage.removeItem('generatedDomains');
      sessionStorage.removeItem('ikigaiSummary');
      
      runInAction(() => {
        this.domains = [];
        this.ikigaiSummary = '';
      });
    } catch (error) {
      console.error('Error clearing domains from session storage:', error);
    }
  };
  
  /**
   * Generate domains based on ikigai summary
   */
  generateDomains = async (ikigaiSummary) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const domains = await this.projectService.generateDomains(ikigaiSummary);
      
      runInAction(() => {
        this.domains = domains;
        this.ikigaiSummary = ikigaiSummary;
        this.isLoading = false;
      });
      
      // Save domains and ikigai summary to session storage
      this.saveDomainsToSessionStorage(domains, ikigaiSummary);
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to generate domains';
      });
      
      return false;
    }
  };
  
  /**
   * Load projects for a specific domain
   */
  loadProjects = async (domainId) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const projects = await this.projectService.getProjects(domainId);
      
      runInAction(() => {
        this.projects = projects;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load projects';
      });
    }
  };
  
  /**
   * Load a specific project by ID
   */
  loadProject = async (projectId) => {
    this.isLoading = true;
    this.error = null;
    
    try {
      const project = await this.projectService.getProject(projectId);
      
      runInAction(() => {
        this.selectedProject = project;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load project';
      });
    }
  };
  
  /**
   * Select a domain
   */
  selectDomain = (domainId) => {
    const domain = this.domains.find(d => d.id === domainId) || null;
    this.selectedDomain = domain;
    
    if (domain) {
      this.loadProjects(domain.id);
    }
  };
  
  /**
   * Select a project
   */
  selectProject = (projectId) => {
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
