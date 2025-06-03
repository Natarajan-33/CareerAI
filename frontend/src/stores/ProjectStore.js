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
    
    // Load selected project from session storage if available
    this.loadSelectedProjectFromSessionStorage();
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
      // First try to get projects using the regular endpoint
      let projects = await this.projectService.getProjects(domainId);
      
      // If no projects are found, try to get domain-specific projects with generation
      if (projects.length === 0 && this.selectedDomain) {
        projects = await this.projectService.getDomainProjects(domainId, true);
      }
      
      runInAction(() => {
        this.projects = projects;
        this.isLoading = false;
      });
      
      // Save projects to session storage for the selected domain
      this.saveProjectsToSessionStorage(domainId, projects);
    } catch (error) {
      // Try to load projects from session storage if API fails
      const cachedProjects = this.loadProjectsFromSessionStorage(domainId);
      
      if (cachedProjects && cachedProjects.length > 0) {
        runInAction(() => {
          this.projects = cachedProjects;
          this.isLoading = false;
          this.error = null;
        });
      } else {
        runInAction(() => {
          this.isLoading = false;
          this.error = error.message || 'Failed to load projects';
        });
      }
    }
  };
  
  /**
   * Generate projects for the selected domain
   */
  generateProjects = async () => {
    if (!this.selectedDomain) {
      this.error = 'No domain selected';
      return false;
    }
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const projects = await this.projectService.generateProjects(this.selectedDomain);
      
      runInAction(() => {
        this.projects = projects;
        this.isLoading = false;
      });
      
      // Save projects to session storage for the selected domain
      this.saveProjectsToSessionStorage(this.selectedDomain.id, projects);
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to generate projects';
      });
      
      return false;
    }
  };
  
  /**
   * Save projects to session storage for a domain
   */
  saveProjectsToSessionStorage = (domainId, projects) => {
    try {
      sessionStorage.setItem(`domain_projects_${domainId}`, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to session storage:', error);
    }
  };
  
  /**
   * Load projects from session storage for a domain
   */
  loadProjectsFromSessionStorage = (domainId) => {
    try {
      const storedProjects = sessionStorage.getItem(`domain_projects_${domainId}`);
      return storedProjects ? JSON.parse(storedProjects) : null;
    } catch (error) {
      console.error('Error loading projects from session storage:', error);
      return null;
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
      
      // Ensure project has all required properties
      const normalizedProject = this.normalizeProject(project);
      
      runInAction(() => {
        this.selectedProject = normalizedProject;
        this.isLoading = false;
      });
      
      // Save project to session storage
      this.saveProjectToSessionStorage(projectId, normalizedProject);
    } catch (error) {
      // Try to load project from session storage if API fails
      const cachedProject = this.loadProjectFromSessionStorage(projectId);
      
      if (cachedProject) {
        runInAction(() => {
          this.selectedProject = this.normalizeProject(cachedProject);
          this.isLoading = false;
          this.error = null;
        });
      } else {
        // Try to find the project in the current projects list
        const projectFromList = this.projects.find(p => p.id === projectId);
        
        if (projectFromList) {
          runInAction(() => {
            this.selectedProject = this.normalizeProject(projectFromList);
            this.isLoading = false;
            this.error = null;
          });
        } else {
          runInAction(() => {
            this.isLoading = false;
            this.error = error.message || 'Failed to load project';
          });
        }
      }
    }
  };
  
  /**
   * Normalize project data to ensure all required properties exist
   */
  normalizeProject = (project) => {
    if (!project) return null;
    
    return {
      id: project.id || '',
      domain: project.domain || '',
      title: project.title || 'Untitled Project',
      description: project.description || 'No description available',
      difficulty: project.difficulty || 'intermediate',
      skills_required: Array.isArray(project.skills_required) ? project.skills_required : [],
      tasks: Array.isArray(project.tasks) ? project.tasks : [
        {
          id: 'default-task-1',
          title: 'Getting Started',
          description: 'Begin working on this project by reviewing the project description and requirements.',
          order: 1
        },
        {
          id: 'default-task-2',
          title: 'Complete the Project',
          description: 'Implement the required functionality for this project.',
          order: 2
        },
        {
          id: 'default-task-3',
          title: 'Test Your Work',
          description: 'Test your implementation to ensure it meets all requirements.',
          order: 3
        }
      ],
      resource_links: Array.isArray(project.resource_links) ? project.resource_links : [],
      estimated_hours: project.estimated_hours || 10
    };
  };
  
  /**
   * Save project to session storage
   */
  saveProjectToSessionStorage = (projectId, project) => {
    try {
      sessionStorage.setItem(`project_${projectId}`, JSON.stringify(project));
    } catch (error) {
      console.error('Error saving project to session storage:', error);
    }
  };
  
  /**
   * Load project from session storage
   */
  loadProjectFromSessionStorage = (projectId) => {
    try {
      const storedProject = sessionStorage.getItem(`project_${projectId}`);
      return storedProject ? JSON.parse(storedProject) : null;
    } catch (error) {
      console.error('Error loading project from session storage:', error);
      return null;
    }
  };
  
  /**
   * Load selected project from session storage
   */
  loadSelectedProjectFromSessionStorage = () => {
    try {
      const selectedProjectId = sessionStorage.getItem('selectedProjectId');
      if (selectedProjectId) {
        const storedProject = this.loadProjectFromSessionStorage(selectedProjectId);
        if (storedProject) {
          this.selectedProject = this.normalizeProject(storedProject);
        } else {
          // If project not found in storage, try to load it from API
          this.loadProject(selectedProjectId);
        }
      }
    } catch (error) {
      console.error('Error loading selected project from session storage:', error);
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
   * Select a project and save to session storage
   */
  selectProject = (projectId) => {
    const project = this.projects.find(p => p.id === projectId) || null;
    this.selectedProject = project;
    
    // Save selected project to session storage
    if (project) {
      try {
        sessionStorage.setItem('selectedProjectId', projectId);
        this.saveProjectToSessionStorage(projectId, project);
      } catch (error) {
        console.error('Error saving selected project to session storage:', error);
      }
    }
  };
  
  /**
   * Clear selections
   */
  clearSelections = () => {
    this.selectedDomain = null;
    this.selectedProject = null;
    
    // Clear selected project from session storage
    try {
      sessionStorage.removeItem('selectedProjectId');
    } catch (error) {
      console.error('Error clearing selected project from session storage:', error);
    }
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
