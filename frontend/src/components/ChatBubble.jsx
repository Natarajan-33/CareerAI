import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const ChatBubble = ({ message, animate = false }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`max-w-[80%] rounded-lg px-4 py-3 ${isUser 
          ? 'bg-primary-600 text-white' 
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'}`}
      >
        {animate ? (
          <TypeAnimation
            sequence={[message.content]}
            wrapper="p"
            speed={70}
            cursor={false}
            className="text-sm"
          />
        ) : (
          <p className="text-sm">{message.content}</p>
        )}
        <p className="text-xs mt-1 opacity-70 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </motion.div>
    </div>
  );
};

export default ChatBubble;
