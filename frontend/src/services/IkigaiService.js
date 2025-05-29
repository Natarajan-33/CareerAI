import { ApiService } from './ApiService.js';

/**
 * Service for handling Ikigai-related API calls
 */
export class IkigaiService extends ApiService {
  /**
   * Get AI response for a chat message
   */
  async getChatResponse(messages) {
    try {
      // Get the last user message
      const lastUserMessage = [...messages]
        .reverse()
        .find(msg => msg.role === 'user');
      
      if (!lastUserMessage) {
        throw new Error('No user message found');
      }
      
      const response = await this.post('/ikigai/chat', lastUserMessage);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get chat response');
    }
  }

  /**
   * Analyze sentiment of a message
   */
  async analyzeSentiment(message) {
    try {
      const response = await this.post(
        '/ikigai/analyze-sentiment',
        { content: message, role: 'user' }
      );
      return response;
    } catch (error) {
      // If sentiment analysis fails, return a neutral sentiment
      return {
        score: 0,
        label: 'neutral',
        keywords: [],
      };
    }
  }

  /**
   * Generate Ikigai results based on conversation
   */
  async generateIkigai(conversationData) {
    try {
      let response;
      
      if (typeof conversationData === 'string') {
        // If we have a conversation ID, use that
        response = await this.post('/ikigai/generate-ikigai', { conversation_id: conversationData });
      } else {
        // Otherwise, send the full conversation history
        response = await this.post('/ikigai/generate-ikigai', { messages: conversationData });
      }
      
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate Ikigai results');
    }
  }

  /**
   * Save conversation to backend
   */
  async saveConversation(userId, messages) {
    try {
      const response = await this.post('/ikigai/save-conversation', {
        user_id: userId,
        conversation_data: messages,
      });
      
      return response.conversation_id;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to save conversation');
    }
  }
}
