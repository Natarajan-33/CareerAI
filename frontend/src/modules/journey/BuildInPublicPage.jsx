import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useProjectStore, useProgressStore } from '../../stores/RootStore.js';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';

const BuildInPublicPage = observer(() => {
  const projectStore = useProjectStore();
  const progressStore = useProgressStore();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [postContent, setPostContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    // Load all projects
    projectStore.loadProjects();
  }, [projectStore]);
  
  const handleGeneratePost = async () => {
    if (!selectedProject) return;
    
    setIsGenerating(true);
    
    try {
      const generated = await progressStore.generateSocialPost(selectedProject, selectedPlatform);
      if (generated) {
        setPostContent(generated.content);
      }
    } catch (error) {
      console.error('Failed to generate post:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCreatePost = async () => {
    if (!selectedProject || !postContent.trim()) return;
    
    try {
      await progressStore.createSocialPost(selectedProject, postContent, selectedPlatform);
      setPostContent('');
      // Optionally show a success message
    } catch (error) {
      console.error('Failed to create post:', error);
      // Optionally show an error message
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(postContent);
    // Optionally show a success message
  };
  
  // Get the platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Build in Public</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Share your progress with the world. Building in public helps you stay accountable and connect with others on similar journeys.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post creation section */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create a Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a project</option>
                  {projectStore.projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Platform
                </label>
                <div className="flex space-x-4">
                  {['twitter', 'linkedin', 'facebook'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`flex items-center px-4 py-2 rounded-md ${selectedPlatform === platform
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <span className="mr-2">{getPlatformIcon(platform)}</span>
                      <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Post Content
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePost}
                    disabled={!selectedProject || isGenerating}
                    isLoading={isGenerating}
                  >
                    Generate Post
                  </Button>
                </div>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={5}
                  placeholder="Share your progress on this project..."
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {postContent.length} characters
                    {selectedPlatform === 'twitter' && (
                      <span className={postContent.length > 280 ? 'text-red-500' : ''}>
                        {' '}(Twitter limit: 280)
                      </span>
                    )}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyToClipboard}
                      disabled={!postContent.trim()}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCreatePost}
                      disabled={!selectedProject || !postContent.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Post preview */}
          {postContent && (
            <Card className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preview</h2>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="mr-2">{getPlatformIcon(selectedPlatform)}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{postContent}</p>
              </div>
            </Card>
          )}
        </div>
        
        {/* Recent posts section */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Recent Posts</h2>
            
            {progressStore.socialPosts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">You haven't created any posts yet. Start sharing your progress!</p>
            ) : (
              <div className="space-y-4">
                {progressStore.socialPosts.map((post) => {
                  const project = projectStore.projects.find(p => p.id === post.projectId);
                  
                  return (
                    <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="mr-2">{getPlatformIcon(post.platform)}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {project && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {project.title}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm">{post.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
});

export default BuildInPublicPage;
