import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { ProgressService } from '../services/ProgressService';

export interface ProgressItem {
  id: string;
  userId: string;
  projectId: string;
  taskId: string;
  percentComplete: number;
  notes?: string;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  targetDate: Date;
  completedDate?: Date;
}

export interface SocialPost {
  id: string;
  userId: string;
  projectId: string;
  content: string;
  platform: string;
  createdAt: Date;
}

export class ProgressStore {
  rootStore: RootStore;
  progressService: ProgressService;
  
  // Observable state
  progressItems: ProgressItem[] = [];
  milestones: Milestone[] = [];
  socialPosts: SocialPost[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.progressService = new ProgressService();
    makeAutoObservable(this, { rootStore: false, progressService: false });
  }
  
  /**
   * Load progress for the current user
   */
  loadProgress = async (projectId?: string) => {
    if (!this.rootStore.authStore.isAuthenticated) return;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const progress = await this.progressService.getUserProgress(
        this.rootStore.authStore.user!.id,
        projectId
      );
      
      runInAction(() => {
        this.progressItems = progress;
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load progress';
      });
    }
  };
  
  /**
   * Update progress for a task
   */
  updateProgress = async (progressData: Omit<ProgressItem, 'id' | 'userId' | 'updatedAt'>) => {
    if (!this.rootStore.authStore.isAuthenticated) return false;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const updatedProgress = await this.progressService.updateProgress({
        ...progressData,
        userId: this.rootStore.authStore.user!.id,
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
    } catch (error: any) {
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
        this.rootStore.authStore.user!.id
      );
      
      runInAction(() => {
        this.milestones = milestones;
        this.isLoading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load milestones';
      });
    }
  };
  
  /**
   * Create a social post
   */
  createSocialPost = async (projectId: string, content: string, platform: string) => {
    if (!this.rootStore.authStore.isAuthenticated) return false;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const post = await this.progressService.createSocialPost({
        userId: this.rootStore.authStore.user!.id,
        projectId,
        content,
        platform,
      });
      
      runInAction(() => {
        this.socialPosts.push(post);
        this.isLoading = false;
      });
      
      return true;
    } catch (error: any) {
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
  generateSocialPost = async (projectId: string, platform: string) => {
    if (!this.rootStore.authStore.isAuthenticated) return null;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const generatedPost = await this.progressService.generateSocialPost(
        this.rootStore.authStore.user!.id,
        projectId,
        platform
      );
      
      runInAction(() => {
        this.isLoading = false;
      });
      
      return generatedPost;
    } catch (error: any) {
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
  getProjectProgress = (projectId: string) => {
    return this.progressItems.filter(p => p.projectId === projectId);
  };
  
  /**
   * Get progress for a specific task
   */
  getTaskProgress = (projectId: string, taskId: string) => {
    return this.progressItems.find(
      p => p.projectId === projectId && p.taskId === taskId
    ) || null;
  };
  
  /**
   * Calculate overall project completion percentage
   */
  getProjectCompletionPercentage = (projectId: string, totalTasks: number) => {
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
