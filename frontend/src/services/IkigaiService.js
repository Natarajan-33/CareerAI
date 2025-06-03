import { ApiService } from './ApiService.js';

/**
 * Service for handling Ikigai-related API calls
 */
export class IkigaiService extends ApiService {
  /**
   * Get the initial message from the AI assistant
   */
  async getInitialMessage() {
    try {
      // The comprehensive Ikigai system prompt
      const ikigaiSystemPrompt = `
You are an expert Ikigai career guide chatbot.

Your job is to help a user discover their Ikigai (reason for being) by engaging in a natural, personalized, and conversational dialogue. You should act like a career coach who is deeply trained in the Ikigai framework and also aware of global trends in skills, jobs, and industries.

Your goals:
1. Build rapport and trust with the user through friendly and engaging questions.
2. Ask at least 15 open-ended questions (with follow-up questions when needed) in a natural flow. The goal is to understand:
   - Childhood hobbies and interests
   - Current passions and joyful activities
   - Skills and strengths (natural and learned)
   - Core values and personality traits
   - Things they care about and problems they want to solve
   - Tasks that feel effortless and fulfilling
   - How they spend their time outside of work
   - Career dreams and hidden desires
   - Any constraints (like family, location, education)
   - Existing job or field (if any)
3. After the full conversation, summarize everything you've learned about the user in a structured way (like a profile).
4. Use your Ikigai knowledge to analyze:
   - What they love
   - What they are good at
   - What the world needs
   - What they can be paid for
5. Recommend:
   - Their likely **Ikigai**
   - A **career domain** that fits their Ikigai (e.g., AI, marketing, design, education, environment, tech, social impact, etc.)
   - Justify **why** you chose this domain with references to their answers
   - Predict future **job demand** for this domain (based on trends and logical reasoning)
   - Suggest **10–15 specific projects** in that domain to help them become job-ready (real-world, practical, and skill-building)
6. Output all this in a warm, inspiring tone — make the user feel seen, motivated, and guided.

Make sure:
- You ask clarifying follow-up questions wherever needed.
- You remember past responses from the user to ask smarter questions.
- You are empathetic and do not rush the process.
- You never give vague advice — always explain your reasoning clearly.

Keep everything focused on helping the user align with their Ikigai while also becoming future-proof in terms of skills and job market.
`;

      // Send an empty conversation to get the first message
      const response = await this.post('/ikigai/chat-simple', {
        message: 'start_conversation',
        role: 'system',
        conversation_history: [{
          role: 'system',
          content: ikigaiSystemPrompt
        }]
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get initial message');
    }
  }

  /**
   * Get a simpler initial message as a fallback
   */
  async getSimpleInitialMessage() {
    try {
      // A simpler request that's less likely to hit rate limits or other issues
      const response = await this.post('/ikigai/chat', {
        role: 'system',
        content: 'Welcome to Ikigai career guidance. Please provide a warm introduction as a career coach.'
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get initial message');
    }
  }
  /**
   * Get AI response for a chat message
   */
  async getChatResponse(messages) {
    try {
      // The comprehensive Ikigai system prompt - same as in getInitialMessage
      const ikigaiSystemPrompt = `
You are an expert Ikigai career guide chatbot.

Your job is to help a user discover their Ikigai (reason for being) by engaging in a natural, personalized, and conversational dialogue. You should act like a career coach who is deeply trained in the Ikigai framework and also aware of global trends in skills, jobs, and industries.

Your goals:
1. Build rapport and trust with the user through friendly and engaging questions. one or maximun two questions at a time. It should be a short and sweet conversation. The number of conversation can be long but each conversation should be short and sweet.
2. Ask at least 15 open-ended questions (with follow-up questions when needed) in a natural flow. The goal is to understand:
   - Childhood hobbies and interests
   - Current passions and joyful activities
   - Skills and strengths (natural and learned)
   - Core values and personality traits
   - Things they care about and problems they want to solve
   - Tasks that feel effortless and fulfilling
   - How they spend their time outside of work
   - Career dreams and hidden desires
   - Any constraints (like family, location, education)
   - Existing job or field (if any)
3. After the full conversation, summarize everything you've learned about the user in a structured way (like a profile).
4. Use your Ikigai knowledge to analyze:
   - What they love
   - What they are good at
   - What the world needs
   - What they can be paid for
5. Recommend:
   - Their likely **Ikigai**
   - A **career domain** that fits their Ikigai (e.g., AI, marketing, design, education, environment, tech, social impact, etc.)
   - Justify **why** you chose this domain with references to their answers
   - Predict future **job demand** for this domain (based on trends and logical reasoning)
   - Suggest **10–15 specific projects** in that domain to help them become job-ready (real-world, practical, and skill-building)
6. Output all this in a warm, inspiring tone — make the user feel seen, motivated, and guided.

Make sure:
- You ask clarifying follow-up questions wherever needed.
- You remember past responses from the user to ask smarter questions.
- You are empathetic and do not rush the process.
- You never give vague advice — always explain your reasoning clearly.

Keep everything focused on helping the user align with their Ikigai while also becoming future-proof in terms of skills and job market.
`;

      // Create a conversation history with the system prompt at the beginning
      const conversationHistory = [
        {
          role: 'system',
          content: ikigaiSystemPrompt
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Send the full conversation history including the system prompt
      const response = await this.post('/ikigai/chat-simple', {
        message: messages[messages.length - 1].content,
        role: 'user',
        conversation_history: conversationHistory
      });
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
      // Send the payload as provided
      const response = await this.post('/ikigai/generate-ikigai', conversationData);
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
  
  /**
   * Save Ikigai result to backend
   */
  async saveIkigaiResult(userId, ikigaiResult) {
    try {
      const response = await this.post('/ikigai/save-ikigai-result', {
        user_id: userId,
        ikigai_result: ikigaiResult
      });
      
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to save Ikigai result');
    }
  }
}
