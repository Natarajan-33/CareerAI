import React, { useState } from 'react';
import Button from './Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isTyping,
  placeholder = 'Type your message here...',
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder={isTyping ? 'AI is typing...' : placeholder}
          disabled={isTyping}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() || isTyping}
        >
          Send
        </Button>
      </form>
      {isTyping && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
          <div className="flex space-x-1 mr-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          AI is typing...
        </div>
      )}
    </div>
  );
};

export default ChatInput;
