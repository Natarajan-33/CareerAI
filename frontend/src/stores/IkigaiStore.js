import { makeAutoObservable, runInAction } from 'mobx';
import { IkigaiService } from '../services/IkigaiService.js';

export class IkigaiStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.ikigaiService = new IkigaiService();
    
    // Observable state
    this.messages = [];
    this.isTyping = false;
    this.conversationId = null;
    this.ikigaiResult = null;
    this.isLoading = false;
    this.error = null;
    
    makeAutoObservable(this, { rootStore: false, ikigaiService: false });
  }
  
  /**
   * Add a user message to the conversation
   */
  addUserMessage = async (content) => {
    if (!content.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    this.messages.push(userMessage);
    
    // Get response from AI
    await this.getAIResponse();
  };
  
  /**
   * Add an assistant message to the conversation
   */
  addAssistantMessage = (content) => {
    const assistantMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    
    this.messages.push(assistantMessage);
    return assistantMessage;
  };
  
  /**
   * Get AI response based on conversation history
   */
  getAIResponse = async () => {
    this.isTyping = true;
    
    try {
      // In a real implementation, this would send the entire conversation history
      const response = await this.ikigaiService.getChatResponse(this.messages);
      
      // Analyze sentiment of the last user message
      const lastUserMessage = [...this.messages]
        .reverse()
        .find(msg => msg.role === 'user');
      
      if (lastUserMessage) {
        const sentiment = await this.ikigaiService.analyzeSentiment(lastUserMessage.content);
        
        // Update the user message with sentiment
        runInAction(() => {
          const index = this.messages.findIndex(msg => msg.id === lastUserMessage.id);
          if (index !== -1) {
            this.messages[index] = {
              ...this.messages[index],
              sentiment,
            };
          }
        });
      }
      
      runInAction(() => {
        this.addAssistantMessage(response.content);
        this.isTyping = false;
      });
    } catch (error) {
      runInAction(() => {
        this.addAssistantMessage(
          "I'm sorry, I encountered an error processing your request. Please try again."
        );
        this.isTyping = false;
        this.error = error.message || 'Failed to get AI response';
      });
    }
  };
  
  /**
   * Generate Ikigai results based on conversation history
   */
  generateIkigaiResults = async () => {
    // Ensure we have enough messages for a meaningful analysis
    if (this.messages.length < 5) {
      this.error = 'Please have a longer conversation to generate accurate results';
      return false;
    }
    
    // Check if the first message is from the user
    if (this.messages.length > 0 && this.messages[0].role !== 'user') {
      console.warn('First message is not from user - this may affect analysis quality');
    }
    
    this.isLoading = true;
    this.error = null;
    
    try {
      // Save the conversation first to ensure we have a conversation_id
      if (this.rootStore.authStore.isAuthenticated && !this.conversationId) {
        await this.saveConversation();
      }
      
      // Prepare the request payload
      const payload = {
        messages: this.messages,
        user_id: this.rootStore.authStore.isAuthenticated ? this.rootStore.authStore.user.id : null
      };
      
      if (this.conversationId) {
        payload.conversation_id = this.conversationId;
      }
      
      // Generate Ikigai results based on the conversation history
      const result = await this.ikigaiService.generateIkigai(payload);
      
      runInAction(() => {
        this.ikigaiResult = result;
        this.isLoading = false;
        
        // Store the domain and projects in sessionStorage for use in the journey tab
        if (result.domains && result.domains.length > 0) {
          const selectedDomain = result.domains[0]; // Default to first domain
          sessionStorage.setItem('selectedDomain', JSON.stringify(selectedDomain));
        }
        
        if (result.projects && result.projects.length > 0) {
          sessionStorage.setItem('suggestedProjects', JSON.stringify(result.projects));
        }
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to generate Ikigai results';
      });
      
      return false;
    }
  };
  
  /**
   * Save conversation to backend
   */
  saveConversation = async () => {
    if (!this.rootStore.authStore.isAuthenticated || this.messages.length < 2) {
      return false;
    }
    
    this.isLoading = true;
    
    try {
      const conversationId = await this.ikigaiService.saveConversation(
        this.rootStore.authStore.user.id,
        this.messages
      );
      
      runInAction(() => {
        this.conversationId = conversationId;
        this.isLoading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to save conversation';
      });
      
      return false;
    }
  };
  
  /**
   * Clear the current conversation
   */
  clearConversation = () => {
    this.messages = [];
    this.ikigaiResult = null;
    this.conversationId = null;
    
    // Initialize with AI message
    this.initializeConversation();
  };
  
  /**
   * Initialize the conversation - no longer adds an initial AI message
   * The first message should always be from the user
   */
  initializeConversation = () => {
    // Clear any existing messages
    this.messages = [];
    this.isTyping = false;
    this.error = null;
    
    // We no longer automatically add an assistant message at the beginning
    // The conversation will start when the user sends their first message
    console.log('Conversation initialized - waiting for user to start the conversation');
  };
  
  /**
   * Save the Ikigai result to the database
   */
  saveIkigaiResult = async () => {
    if (!this.ikigaiResult) {
      this.error = 'No Ikigai result to save';
      return false;
    }
    
    if (!this.rootStore.authStore.isAuthenticated) {
      this.error = 'You must be logged in to save results';
      return false;
    }
    
    this.isLoading = true;
    this.error = null;
    
    try {
      const userId = this.rootStore.authStore.user.id;
      const saveResponse = await this.ikigaiService.saveIkigaiResult(userId, this.ikigaiResult);
      
      runInAction(() => {
        this.isLoading = false;
        this.savedResultId = saveResponse.result_id;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error.message || 'Failed to save Ikigai result';
      });
      
      return false;
    }
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
