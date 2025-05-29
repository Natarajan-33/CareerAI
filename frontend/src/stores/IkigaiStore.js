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
   * Generate Ikigai results based on conversation
   */
  generateIkigaiResults = async () => {
    if (this.messages.length < 5) {
      this.error = 'Please have a longer conversation to generate accurate results';
      return false;
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
   * Initialize the conversation with an AI message
   */
  initializeConversation = async () => {
    this.isTyping = true;
    
    try {
      // Create a placeholder message to show loading state
      const placeholderId = Date.now().toString();
      const placeholderMessage = {
        id: placeholderId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true
      };
      
      this.messages.push(placeholderMessage);
      
      // Get the initial message from the AI service
      const response = await this.ikigaiService.getInitialMessage();
      
      runInAction(() => {
        // Find and replace the placeholder message
        const index = this.messages.findIndex(msg => msg.id === placeholderId);
        if (index !== -1) {
          this.messages[index] = {
            id: placeholderId,
            role: 'assistant',
            content: response.content,
            timestamp: new Date(),
            isLoading: false
          };
        }
        
        this.isTyping = false;
      });
    } catch (error) {
      // If there's an error, try again with a simpler request
      console.error('Error initializing conversation:', error);
      
      try {
        // Create a new placeholder for the retry attempt
        const retryPlaceholderId = Date.now().toString();
        const retryPlaceholderMessage = {
          id: retryPlaceholderId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isLoading: true
        };
        
        // Replace the existing placeholder or add a new one
        runInAction(() => {
          const existingIndex = this.messages.findIndex(msg => msg.isLoading);
          if (existingIndex !== -1) {
            this.messages[existingIndex] = retryPlaceholderMessage;
          } else {
            this.messages.push(retryPlaceholderMessage);
          }
        });
        
        // Try a simpler approach to get the initial message
        const response = await this.ikigaiService.getSimpleInitialMessage();
        
        runInAction(() => {
          // Find and replace the placeholder message
          const index = this.messages.findIndex(msg => msg.id === retryPlaceholderId);
          if (index !== -1) {
            this.messages[index] = {
              id: retryPlaceholderId,
              role: 'assistant',
              content: response.content,
              timestamp: new Date(),
              isLoading: false
            };
          }
          
          this.isTyping = false;
        });
      } catch (retryError) {
        // If all else fails, clear the messages to prevent showing a bad first message
        runInAction(() => {
          // Remove any loading messages
          this.messages = this.messages.filter(msg => !msg.isLoading);
          this.isTyping = false;
          this.error = 'Failed to initialize conversation. Please refresh the page or try again later.';
        });
      }
    }
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
