import api from './apiService';

export class IkigaiService {
  async processConversation(userId, message, conversationId = null) {
    try {
      const response = await api.post('/api/ikigai/conversation', {
        user_id: userId,
        message: message,
        conversation_id: conversationId
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to process conversation');
    }
  }
  
  async getDomainSuggestion(passion, strengths) {
    try {
      const response = await api.get('/api/ikigai/domain-suggestion', {
        params: {
          passion,
          strengths
        }
      });
      
      return response.data.suggestion;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get domain suggestion');
    }
  }
  
  async saveIkigai(ikigaiData) {
    try {
      const response = await api.post('/api/ikigai/save-ikigai', ikigaiData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to save Ikigai data');
    }
  }
}
