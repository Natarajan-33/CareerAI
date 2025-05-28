import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const IkigaiPage = observer(() => {
  const { ikigaiStore } = useStores();
  const navigate = useNavigate();
  
  const [userMessage, setUserMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Start conversation when component mounts
  useEffect(() => {
    if (ikigaiStore.messages.length === 0) {
      ikigaiStore.startConversation();
    }
    return () => {
      // Clean up if needed
    };
  }, [ikigaiStore]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [ikigaiStore.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim() || ikigaiStore.isLoading) return;
    
    const message = userMessage;
    setUserMessage('');
    
    await ikigaiStore.sendMessage(message);
  };
  
  const handleCompleteIkigai = async () => {
    // Update ikigai data based on conversation insights
    if (ikigaiStore.insights.passions.length > 0) {
      ikigaiStore.updateIkigaiData('passion', ikigaiStore.insights.passions.join('\n'));
    }
    
    if (ikigaiStore.insights.strengths.length > 0) {
      ikigaiStore.updateIkigaiData('strengths', ikigaiStore.insights.strengths.join('\n'));
    }
    
    // Generate domain suggestion
    await ikigaiStore.generateDomainSuggestion();
    
    // Mark as completed
    setIsCompleted(true);
  };
  
  const handleSaveFinalDomain = async () => {
    // Save ikigai data
    await ikigaiStore.saveIkigaiData();
    
    // Navigate to domain selection
    navigate('/domains');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ikigai Discovery
        </h1>
        <p className="text-lg text-gray-600">
          Let's discover your ikigai in AI/ML through a natural conversation. 
          Share your passions, strengths, and interests to find your ideal domain.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat interface */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Chat messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {ikigaiStore.messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  isUser={message.role === 'user'} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            {!isCompleted && (
              <form onSubmit={handleSendMessage} className="border-t p-4 flex">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={ikigaiStore.isLoading}
                  className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={ikigaiStore.isLoading || !userMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {ikigaiStore.isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Thinking
                    </span>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            )}
            
            {/* Complete button */}
            {!isCompleted && ikigaiStore.messages.length >= 6 && (
              <div className="border-t p-4">
                <button
                  onClick={handleCompleteIkigai}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Complete Ikigai Discovery
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Insights panel */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Insights</h2>
            
            {isCompleted ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Your Passions</h3>
                  <p className="text-gray-700 mt-1">{ikigaiStore.ikigaiData.passion || 'Not identified yet'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Your Strengths</h3>
                  <p className="text-gray-700 mt-1">{ikigaiStore.ikigaiData.strengths || 'Not identified yet'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Recommended Domain</h3>
                  <div className="bg-blue-50 p-3 rounded-md mt-1">
                    <p className="text-gray-700">{ikigaiStore.ikigaiData.ai_suggestion || 'Generating suggestion...'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Your Final Domain</h3>
                  <select
                    value={ikigaiStore.ikigaiData.final_domain}
                    onChange={(e) => ikigaiStore.updateIkigaiData('final_domain', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your domain</option>
                    <option value="nlp">Natural Language Processing</option>
                    <option value="computer_vision">Computer Vision</option>
                    <option value="robotics">Robotics & Automation</option>
                    <option value="data_science">Data Science & Analytics</option>
                    <option value="reinforcement_learning">Reinforcement Learning</option>
                    <option value="generative_ai">Generative AI</option>
                  </select>
                </div>
                
                <button
                  onClick={handleSaveFinalDomain}
                  disabled={!ikigaiStore.ikigaiData.final_domain}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 mt-4"
                >
                  Continue to Domain Selection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Passions Identified</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-1">
                    {ikigaiStore.insights.passions.length > 0 ? (
                      ikigaiStore.insights.passions.map((passion, index) => (
                        <li key={index}>{passion}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">None identified yet</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Strengths Identified</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-1">
                    {ikigaiStore.insights.strengths.length > 0 ? (
                      ikigaiStore.insights.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">None identified yet</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Potential Domains</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-1">
                    {ikigaiStore.insights.potential_domains.length > 0 ? (
                      ikigaiStore.insights.potential_domains.map((domain, index) => (
                        <li key={index}>{domain.replace('_', ' ')}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">None identified yet</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Continue the conversation until you feel we have a good understanding of your passions and strengths. 
                    Then click "Complete Ikigai Discovery" to see your recommended domain.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// Chat message component
const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3/4 rounded-lg p-3 ${isUser ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default IkigaiPage;
