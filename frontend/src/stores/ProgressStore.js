import { makeAutoObservable, runInAction } from 'mobx';
import { ProgressService } from '../services/ProgressService.js';

export class ProgressStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.progressService = new ProgressService();
    
    // Observable state
    this.progressItems = [];
    this.milestones = [];
    this.socialPosts = [];
    this.isLoading = false;
    this.error = null;
    
    makeAutoObservable(this, { rootStore: false, progressService: false });
  }
  
  /**
   * Load progress for the current user
   */
  loadProgress = async (projectId) => {
    if (!this.rootStore.authStore.isAuthenticated) return;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const progress = await this.progressService.getUserProgress(
        this.rootStore.authStore.user.id,
        projectId
      );
      
      runInAction(() => {
        this.progressItems = progress;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load progress';
      });
    }
  };
  
  /**
   * Update progress for a task
   */
  updateProgress = async (progressData) => {
    if (!this.rootStore.authStore.isAuthenticated) return false;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const updatedProgress = await this.progressService.updateProgress({
        ...progressData,
        userId: this.rootStore.authStore.user.id,
      });
      
      runInAction(() => {
        // Update or add the progress item
        const index = this.progressItems.findIndex(
          p => p.projectId === progressData.projectId && p.taskId === progressData.taskId
        );
        
        if (index !== -1) {
          this.progressItems[index] = updatedProgress;
        } else {
          this.progressItems.push(updatedProgress);
        }
        
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to update progress';
      });
      
      return false;
    }
  };
  
  /**
   * Load milestones for the current user
   */
  loadMilestones = async () => {
    if (!this.rootStore.authStore.isAuthenticated) return;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const milestones = await this.progressService.getUserMilestones(
        this.rootStore.authStore.user.id
      );
      
      runInAction(() => {
        this.milestones = milestones;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load milestones';
      });
    }
  };
  
  /**
   * Create a social post
   */
  createSocialPost = async (projectId, content, platform) => {
    if (!this.rootStore.authStore.isAuthenticated) return false;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const post = await this.progressService.createSocialPost({
        userId: this.rootStore.authStore.user.id,
        projectId,
        content,
        platform,
      });
      
      runInAction(() => {
        this.socialPosts.push(post);
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to create social post';
      });
      
      return false;
    }
  };
  
  /**
   * Generate a social post
   */
  generateSocialPost = async (projectId, platform) => {
    if (!this.rootStore.authStore.isAuthenticated) return null;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const generatedPost = await this.progressService.generateSocialPost(
        this.rootStore.authStore.user.id,
        projectId,
        platform
      );
      
      runInAction(() => {
        this.isLoading = false;
      });
      
      return generatedPost;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to generate social post';
      });
      
      return null;
    }
  };
  
  /**
   * Get progress for a specific project
   */
  getProjectProgress = (projectId) => {
    return this.progressItems.filter(p => p.projectId === projectId);
  };
  
  /**
   * Get progress for a specific task
   */
  getTaskProgress = (projectId, taskId) => {
    return this.progressItems.find(
      p => p.projectId === projectId && p.taskId === taskId
    ) || null;
  };
  
  /**
   * Calculate overall project completion percentage
   */
  getProjectCompletionPercentage = (projectId, totalTasks) => {
    const projectProgress = this.getProjectProgress(projectId);
    if (projectProgress.length === 0) return 0;
    
    const completedTasks = projectProgress.filter(p => p.percentComplete === 100).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
