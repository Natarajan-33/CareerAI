import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface ChatBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sentiment?: {
      score: number;
      label: string;
      keywords: string[];
    };
  };
  animate?: boolean;
  onAnimationComplete?: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  animate = false,
  onAnimationComplete,
}) => {
  const isUser = message.role === 'user';
  
  // Determine sentiment color for user messages
  const getSentimentColor = () => {
    if (!message.sentiment) return '';
    
    if (message.sentiment.score > 0.5) {
      return 'border-l-4 border-green-500';
    } else if (message.sentiment.score < -0.2) {
      return 'border-l-4 border-red-500';
    } else {
      return 'border-l-4 border-gray-400';
    }
  };
  
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
        </div>
      )}
      
      <div
        className={`${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'} ${
          isUser && message.sentiment ? getSentimentColor() : ''
        }`}
      >
        {animate && !isUser ? (
          <TypeAnimation
            sequence={[
              message.content,
              () => {
                if (onAnimationComplete) onAnimationComplete();
              },
            ]}
            wrapper="span"
            cursor={false}
            speed={70}
            style={{ display: 'inline-block' }}
          />
        ) : (
          <span>{message.content}</span>
        )}
        
        <div className="text-xs opacity-70 mt-1 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 rounded-full bg-secondary-600 flex items-center justify-center text-white font-bold">
            You
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
