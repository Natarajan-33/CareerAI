import React, { useState } from 'react';
import Button from './Button.jsx';

const SocialPostForm = ({ projectId, projectTitle, taskTitle, onSave, onCancel, onGenerate, initialContent = '' }) => {
  const [content, setContent] = useState(initialContent);
  const [platform, setPlatform] = useState('twitter');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      projectId,
      content,
      platform
    });
  };
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Pass task title to help generate more relevant content
      const generatedContent = await onGenerate(projectId, platform, taskTitle);
      console.log('Generated content:', generatedContent);
      
      // Handle different response formats
      if (generatedContent?.content) {
        setContent(generatedContent.content);
      } else if (generatedContent?.text) {
        setContent(generatedContent.text);
      } else if (typeof generatedContent === 'string') {
        setContent(generatedContent);
      } else if (generatedContent) {
        // If it's an object but doesn't have content or text properties
        setContent(JSON.stringify(generatedContent));
      }
    } catch (error) {
      console.error('Error generating post:', error);
      // Set a fallback message
      setContent(`Just completed the "${taskTitle}" task in my ${projectTitle} project! #coding #learning #CareerAI`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Share Your Progress
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Post Content
            </label>
            <Button 
              variant="outline" 
              size="xs" 
              onClick={handleGenerate}
              type="button"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            rows="5"
            placeholder={`Share your progress on ${projectTitle || 'your project'}${taskTitle ? ` - ${taskTitle}` : ''}`}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit"
          >
            Share
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SocialPostForm;
