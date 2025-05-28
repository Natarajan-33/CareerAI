import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { IkigaiService } from '../services/IkigaiService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: {
    score: number;
    label: string;
    keywords: string[];
  };
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  requiredSkills: string[];
}

export interface IkigaiResult {
  passion: string;
  strengths: string[];
  aiSuggestion: string;
  domains: Domain[];
  sentiment: {
    overall: number;
    confidence: number;
    excitement: number;
  };
}

export class IkigaiStore {
  rootStore: RootStore;
  ikigaiService: IkigaiService;
  
  // Observable state
  messages: ChatMessage[] = [];
  isTyping: boolean = false;
  conversationId: string | null = null;
  ikigaiResult: IkigaiResult | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.ikigaiService = new IkigaiService();
    makeAutoObservable(this, { rootStore: false, ikigaiService: false });
    
    // Initialize with a welcome message
    this.addAssistantMessage(
      "Hi there! I'm your Ikigai assistant. I'll help you discover your ideal career path in AI and robotics. Let's start by talking about what you're passionate about. What topics or activities make you lose track of time?"
    );
  }
  
  /**
   * Add a user message to the conversation
   */
  addUserMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = {
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
  addAssistantMessage = (content: string) => {
    const assistantMessage: ChatMessage = {
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
    } catch (error: any) {
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
      const result = await this.ikigaiService.generateIkigai(this.conversationId || this.messages);
      
      runInAction(() => {
        this.ikigaiResult = result;
        this.isLoading = false;
      });
      
      return true;
    } catch (error: any) {
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
        this.rootStore.authStore.user!.id,
        this.messages
      );
      
      runInAction(() => {
        this.conversationId = conversationId;
        this.isLoading = false;
      });
      
      return true;
    } catch (error: any) {
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
    
    // Add welcome message again
    this.addAssistantMessage(
      "Hi there! I'm your Ikigai assistant. I'll help you discover your ideal career path in AI and robotics. Let's start by talking about what you're passionate about. What topics or activities make you lose track of time?"
    );
  };
  
  /**
   * Clear error state
   */
  clearError = () => {
    this.error = null;
  };
}
