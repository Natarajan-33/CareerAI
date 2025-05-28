import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useIkigaiStore } from '../../stores/RootStore';
import ChatBubble from '../../components/ChatBubble';
import ChatInput from '../../components/ChatInput';
import Button from '../../components/Button';
import IkigaiResults from './IkigaiResults';

const IkigaiPage: React.FC = observer(() => {
  const ikigaiStore = useIkigaiStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [ikigaiStore.messages]);
  
  const handleSendMessage = (content: string) => {
    ikigaiStore.addUserMessage(content);
  };
  
  const handleGenerateResults = async () => {
    await ikigaiStore.generateIkigaiResults();
  };
  
  return (
    <div className="flex flex-col h-full">
      {ikigaiStore.ikigaiResult ? (
        <IkigaiResults 
          result={ikigaiStore.ikigaiResult}
          onReset={() => ikigaiStore.clearConversation()}
        />
      ) : (
        <>
          {/* Chat header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ikigai Chatbot</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Let's discover your ideal AI career path through conversation. Share your passions, strengths, and interests.
            </p>
          </div>
          
          {/* Chat messages */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
            {ikigaiStore.messages.map((message, index) => (
              <ChatBubble
                key={message.id}
                message={message}
                animate={message.role === 'assistant' && index === ikigaiStore.messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Generate results button */}
          {ikigaiStore.messages.length >= 6 && (
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleGenerateResults}
                isLoading={ikigaiStore.isLoading}
              >
                Generate Ikigai Results
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                Ready to see your AI career path? Generate your personalized Ikigai results.
              </p>
            </div>
          )}
          
          {/* Chat input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isTyping={ikigaiStore.isTyping}
            placeholder="Share your interests, skills, or ask questions..."
          />
        </>
      )}
    </div>
  );
});

export default IkigaiPage;
