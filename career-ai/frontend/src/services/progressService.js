import api from './apiService';

export class ProgressService {
  async getProgressEntries(userId, projectId) {
    try {
      const response = await api.get(`/api/progress/entries/${userId}/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get progress entries');
    }
  }
  
  async createProgressEntry(entryData) {
    try {
      const response = await api.post('/api/progress/entry', entryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create progress entry');
    }
  }
  
  async getProjectMilestones(userId, projectId) {
    try {
      const response = await api.get(`/api/progress/milestones/${userId}/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get project milestones');
    }
  }
  
  async createMilestone(milestoneData) {
    try {
      const response = await api.post('/api/progress/milestone', milestoneData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create milestone');
    }
  }
  
  async updateMilestoneStatus(milestoneId, status) {
    try {
      const response = await api.put(`/api/progress/milestone/${milestoneId}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update milestone status');
    }
  }
  
  async generateSocialPost(projectTitle, domain, tasksCompleted, progressPercentage) {
    try {
      const response = await api.post('/api/progress/social-post', null, {
        params: {
          project_title: projectTitle,
          domain: domain,
          tasks_completed: tasksCompleted,
          progress_percentage: progressPercentage
        }
      });
      
      return response.data.post_content;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate social media post');
    }
  }
  
  async generateDailyPost(postData) {
    try {
      const response = await api.post('/api/progress/daily-post', postData);
      return response.data.post_content;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate daily post');
    }
  }
  
  async analyzeDelta4(projectDescription, currentStatus, challenges, goals) {
    try {
      const response = await api.post('/api/progress/analyze-delta4', {
        project_description: projectDescription,
        current_status: currentStatus,
        challenges: challenges,
        goals: goals
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to analyze Delta4');
    }
  }
  
  async getCompanyInsights(companyName, domain = null, skills = null) {
    try {
      const response = await api.get('/api/progress/company-insights', {
        params: {
          company_name: companyName,
          domain: domain,
          skills: skills ? skills.join(',') : null
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get company insights');
    }
  }
}
