import { makeAutoObservable, runInAction } from 'mobx';
import { IkigaiService } from '../services/ikigaiService';

export class IkigaiStore {
  // Conversation state
  conversationId = null;
  messages = [];
  isLoading = false;
  error = null;
  
  // Ikigai data
  ikigaiData = {
    passion: '',
    strengths: '',
    ai_suggestion: '',
    final_domain: ''
  };
  
  // Extracted insights
  insights = {
    passions: [],
    strengths: [],
    interests: [],
    potential_domains: []
  };
  
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.ikigaiService = new IkigaiService();
    makeAutoObservable(this);
  }
  
  // Initialize a new conversation
  async startConversation() {
    try {
      this.isLoading = true;
      this.error = null;
      this.messages = [];
      
      // Add initial system message
      this.messages.push({
        role: 'assistant',
        content: "Hi there! I'm here to help you discover your ikigai in the AI/ML field. Let's start by talking about what aspects of technology you find most exciting or enjoyable. What parts of AI, ML, or technology in general are you passionate about?",
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to start conversation';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Send a message in the conversation
  async sendMessage(message) {
    try {
      this.isLoading = true;
      this.error = null;
      
      // Add user message to the conversation
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      this.messages.push(userMessage);
      
      // Send message to API
      const userId = this.rootStore.authStore.user?.id || 'guest';
      const response = await this.ikigaiService.processConversation(userId, message, this.conversationId);
      
      runInAction(() => {
        // Set conversation ID if this is the first message
        if (!this.conversationId) {
          this.conversationId = response.conversation_id;
        }
        
        // Add AI response to the conversation
        this.messages.push({
          role: 'assistant',
          content: response.message.content,
          timestamp: new Date()
        });
        
        // Update insights if available
        if (response.insights) {
          this.insights = response.insights;
        }
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to send message';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Update Ikigai data
  updateIkigaiData(field, value) {
    this.ikigaiData[field] = value;
  }
  
  // Generate domain suggestion based on passion and strengths
  async generateDomainSuggestion() {
    try {
      this.isLoading = true;
      this.error = null;
      
      const suggestion = await this.ikigaiService.getDomainSuggestion(
        this.ikigaiData.passion,
        this.ikigaiData.strengths
      );
      
      runInAction(() => {
        this.ikigaiData.ai_suggestion = suggestion;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to generate domain suggestion';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Save final Ikigai data
  async saveIkigaiData() {
    try {
      this.isLoading = true;
      this.error = null;
      
      const userId = this.rootStore.authStore.user?.id || 'guest';
      
      // Don't save for guest users
      if (userId === 'guest') {
        return true;
      }
      
      await this.ikigaiService.saveIkigai({
        user_id: userId,
        ...this.ikigaiData
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to save Ikigai data';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  
  // Reset the store
  reset() {
    this.conversationId = null;
    this.messages = [];
    this.ikigaiData = {
      passion: '',
      strengths: '',
      ai_suggestion: '',
      final_domain: ''
    };
    this.insights = {
      passions: [],
      strengths: [],
      interests: [],
      potential_domains: []
    };
    this.error = null;
  }
}
