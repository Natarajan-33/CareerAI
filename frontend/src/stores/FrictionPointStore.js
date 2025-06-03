import { makeAutoObservable, runInAction } from 'mobx';
import { FrictionPointService } from '../services/FrictionPointService.js';

export class FrictionPointStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.frictionPointService = new FrictionPointService();
    
    // Observable state
    this.frictionPoints = [];
    this.delta4Analysis = null;
    this.isLoading = false;
    this.error = null;
    
    makeAutoObservable(this, { rootStore: false, frictionPointService: false });
  }
  
  /**
   * Load friction points for a project
   */
  loadProjectFrictionPoints = async (projectId, dimension, pointType) => {
    if (!projectId) return;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const frictionPoints = await this.frictionPointService.getProjectFrictionPoints(
        projectId,
        dimension,
        pointType
      );
      
      runInAction(() => {
        this.frictionPoints = frictionPoints;
        this.isLoading = false;
      });
      
      return frictionPoints;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load friction points';
      });
      
      return [];
    }
  };
  
  /**
   * Create a new friction point
   */
  createFrictionPoint = async (frictionPointData) => {
    if (!this.rootStore.authStore.isAuthenticated) return false;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const frictionPoint = await this.frictionPointService.createFrictionPoint(
        frictionPointData,
        frictionPointData.projectId,
        this.rootStore.authStore.user.id
      );
      
      runInAction(() => {
        this.frictionPoints.push(frictionPoint);
        this.isLoading = false;
      });
      
      return frictionPoint;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to create friction point';
      });
      
      return null;
    }
  };
  
  /**
   * Delete a friction point
   */
  deleteFrictionPoint = async (frictionPointId) => {
    if (!this.rootStore.authStore.isAuthenticated) return false;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      await this.frictionPointService.deleteFrictionPoint(frictionPointId);
      
      runInAction(() => {
        this.frictionPoints = this.frictionPoints.filter(p => p.id !== frictionPointId);
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to delete friction point';
      });
      
      return false;
    }
  };
  
  /**
   * Analyze a project using the Delta 4 framework
   */
  analyzeDelta4 = async (projectId, projectDescription, currentStatus, challenges, goals) => {
    if (!this.rootStore.authStore.isAuthenticated) return null;
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const analysis = await this.frictionPointService.analyzeDelta4(
        projectId,
        projectDescription,
        currentStatus,
        challenges,
        goals,
        this.rootStore.authStore.user.id
      );
      
      runInAction(() => {
        this.delta4Analysis = analysis;
        this.isLoading = false;
      });
      
      return analysis;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to analyze project';
      });
      
      // Handle connection issues gracefully
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        // Return a mock analysis if there's a connection issue
        const mockAnalysis = this.createMockAnalysis(projectId);
        this.delta4Analysis = mockAnalysis;
        return mockAnalysis;
      }
      
      return null;
    }
  };
  
  /**
   * Create a mock analysis for testing or when the API is unavailable
   */
  createMockAnalysis = (projectId) => {
    return {
      project_id: projectId,
      summary: "This is a mock analysis created when the API connection failed. The Delta 4 framework identifies friction and delight points across technical, cultural, process, and expectation dimensions.",
      technical: {
        friction: [
          "Limited technical documentation",
          "Integration challenges with existing systems"
        ],
        delight: [
          "Modern tech stack with good developer experience",
          "Automated testing infrastructure"
        ],
        recommendations: [
          "Improve documentation with code examples",
          "Create integration test suite"
        ]
      },
      cultural: {
        friction: [
          "Communication gaps between teams",
          "Knowledge silos"
        ],
        delight: [
          "Collaborative team environment",
          "Regular knowledge sharing sessions"
        ],
        recommendations: [
          "Implement cross-team pairing sessions",
          "Create centralized knowledge repository"
        ]
      },
      process: {
        friction: [
          "Unclear task prioritization",
          "Inconsistent code review process"
        ],
        delight: [
          "Agile methodology adaptation",
          "Regular retrospectives"
        ],
        recommendations: [
          "Implement clear prioritization framework",
          "Standardize code review checklist"
        ]
      },
      expectation: {
        friction: [
          "Timeline pressure affecting quality",
          "Scope creep"
        ],
        delight: [
          "Clear project vision",
          "Stakeholder alignment"
        ],
        recommendations: [
          "Implement buffer time in estimates",
          "Regular scope review meetings"
        ]
      }
    };
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
