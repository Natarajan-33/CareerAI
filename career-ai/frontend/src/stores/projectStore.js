import { makeAutoObservable, runInAction } from 'mobx';
import { ProjectService } from '../services/projectService';
import { ProgressService } from '../services/progressService';

export class ProjectStore {
  // Projects state
  projects = [];
  selectedProject = null;
  projectSuggestions = [];
  isLoading = false;
  error = null;
  
  // Progress tracking
  progressEntries = [];
  milestones = [];
  
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.projectService = new ProjectService();
    this.progressService = new ProgressService();
    makeAutoObservable(this);
  }
  
  // Load user projects
  async loadProjects() {
    try {
      this.isLoading = true;
      this.error = null;
      
      const userId = this.rootStore.authStore.user?.id || 'guest';
      
      // Skip for guest users
      if (userId === 'guest') {
        return true;
      }
      
      const projects = await this.projectService.getUserProjects(userId);
      
      runInAction(() => {
        this.projects = projects;
        
        // If there are projects but none selected, select the first one
        if (projects.length > 0 && !this.selectedProject) {
          this.selectedProject = projects[0];
        }
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to load projects';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Get project suggestions for a domain
  async getProjectSuggestions(domain) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const suggestions = await this.projectService.getProjectSuggestions(domain);
      
      runInAction(() => {
        this.projectSuggestions = suggestions;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to get project suggestions';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Select a project
  selectProject(project) {
    this.selectedProject = project;
    
    // Load project progress and milestones
    if (project) {
      this.loadProjectProgress(project.id);
      this.loadProjectMilestones(project.id);
    }
  }
  
  // Create a new project
  async createProject(projectData) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const userId = this.rootStore.authStore.user?.id || 'guest';
      
      const newProject = {
        user_id: userId,
        ...projectData,
        selected_at: new Date().toISOString(),
        status: 'not_started'
      };
      
      const createdProject = await this.projectService.createProject(newProject);
      
      runInAction(() => {
        this.projects.push(createdProject);
        this.selectedProject = createdProject;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to create project';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Update project status
  async updateProjectStatus(projectId, status) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const updatedProject = await this.projectService.updateProject(projectId, { status });
      
      runInAction(() => {
        // Update project in the list
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
          this.projects[index] = updatedProject;
        }
        
        // Update selected project if it's the same
        if (this.selectedProject && this.selectedProject.id === projectId) {
          this.selectedProject = updatedProject;
        }
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to update project status';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Load project progress
  async loadProjectProgress(projectId) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const userId = this.rootStore.authStore.user?.id || 'guest';
      
      const progressEntries = await this.progressService.getProgressEntries(userId, projectId);
      
      runInAction(() => {
        this.progressEntries = progressEntries;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to load progress';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Create a progress entry
  async createProgressEntry(progressData) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const userId = this.rootStore.authStore.user?.id || 'guest';
      
      const newEntry = {
        user_id: userId,
        project_id: this.selectedProject.id,
        ...progressData
      };
      
      await this.progressService.createProgressEntry(newEntry);
      
      // Reload progress entries
      await this.loadProjectProgress(this.selectedProject.id);
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to create progress entry';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Load project milestones
  async loadProjectMilestones(projectId) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const userId = this.rootStore.authStore.user?.id || 'guest';
      
      const milestones = await this.progressService.getProjectMilestones(userId, projectId);
      
      runInAction(() => {
        this.milestones = milestones;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to load milestones';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Create a milestone
  async createMilestone(milestoneData) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const userId = this.rootStore.authStore.user?.id || 'guest';
      
      const newMilestone = {
        user_id: userId,
        project_id: this.selectedProject.id,
        ...milestoneData
      };
      
      await this.progressService.createMilestone(newMilestone);
      
      // Reload milestones
      await this.loadProjectMilestones(this.selectedProject.id);
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to create milestone';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Update milestone status
  async updateMilestoneStatus(milestoneId, status) {
    try {
      this.isLoading = true;
      this.error = null;
      
      await this.progressService.updateMilestoneStatus(milestoneId, status);
      
      // Reload milestones
      await this.loadProjectMilestones(this.selectedProject.id);
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to update milestone status';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Generate social media post
  async generateSocialPost(tasksCompleted, progressPercentage) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const postContent = await this.progressService.generateSocialPost(
        this.selectedProject.title,
        this.selectedProject.domain,
        tasksCompleted,
        progressPercentage
      );
      
      return postContent;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to generate social post';
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Generate daily post
  async generateDailyPost(dayNumber, goalsForToday, learnings, targetFirms) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const postContent = await this.progressService.generateDailyPost({
        project_id: this.selectedProject.id,
        day_number: dayNumber,
        goals_for_today: goalsForToday,
        learnings: learnings,
        target_firms: targetFirms
      });
      
      return postContent;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to generate daily post';
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Reset the store
  reset() {
    this.projects = [];
    this.selectedProject = null;
    this.projectSuggestions = [];
    this.progressEntries = [];
    this.milestones = [];
    this.error = null;
  }
}
