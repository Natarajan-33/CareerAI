import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProjectStore, useProgressStore } from '../../stores/RootStore';
import TaskCard from '../../components/TaskCard';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import Card from '../../components/Card';

const ProjectDetailsPage: React.FC = observer(() => {
  const { projectId } = useParams<{ projectId: string }>();
  const projectStore = useProjectStore();
  const progressStore = useProgressStore();
  const navigate = useNavigate();
  const [showSocialPostModal, setShowSocialPostModal] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<string>('');
  const [postPlatform, setPostPlatform] = useState<string>('twitter');
  const [customPost, setCustomPost] = useState<string>('');
  
  useEffect(() => {
    if (projectId) {
      // Load project details
      projectStore.loadProject(projectId);
      
      // Load progress for this project
      progressStore.loadProgress(projectId);
    } else {
      navigate('/projects');
    }
  }, [projectId, projectStore, progressStore, navigate]);
  
  const handleUpdateProgress = async (taskId: string, progress: number, notes: string) => {
    if (!projectId || !projectStore.selectedProject) return;
    
    await progressStore.updateProgress({
      projectId,
      taskId,
      percentComplete: progress,
      notes,
    });
    
    // Reload progress after update
    progressStore.loadProgress(projectId);
  };
  
  const handleGeneratePost = async () => {
    if (!projectId || !projectStore.selectedProject) return;
    
    const generated = await progressStore.generateSocialPost(projectId, postPlatform);
    if (generated) {
      setGeneratedPost(generated.content);
      setCustomPost(generated.content);
    }
  };
  
  const handleCreatePost = async () => {
    if (!projectId || !projectStore.selectedProject || !customPost.trim()) return;
    
    await progressStore.createSocialPost(projectId, customPost, postPlatform);
    setShowSocialPostModal(false);
  };
  
  // Calculate overall project progress
  const getOverallProgress = () => {
    if (!projectStore.selectedProject) return 0;
    
    return progressStore.getProjectCompletionPercentage(
      projectId || '',
      projectStore.selectedProject.tasks.length
    );
  };
  
  // Get progress for a specific task
  const getTaskProgress = (taskId: string) => {
    const taskProgress = progressStore.getTaskProgress(projectId || '', taskId);
    return taskProgress?.percentComplete || 0;
  };
  
  if (projectStore.isLoading || !projectStore.selectedProject) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  const { selectedProject } = projectStore;
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedProject.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{selectedProject.description}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowSocialPostModal(true)}
          >
            Share Progress
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overall Progress</h2>
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {getOverallProgress()}%
            </span>
          </div>
          <ProgressBar
            progress={getOverallProgress()}
            height={10}
            color={getOverallProgress() === 100 ? 'success' : 'primary'}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`px-3 py-1 text-sm rounded-full ${
            selectedProject.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            selectedProject.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {selectedProject.difficulty.charAt(0).toUpperCase() + selectedProject.difficulty.slice(1)}
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {selectedProject.tasks.length} Tasks
          </span>
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            ~{selectedProject.estimatedHours || '?'} Hours
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Tasks</h2>
          
          <div className="space-y-4">
            {selectedProject.tasks
              .sort((a, b) => a.order - b.order)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  progress={getTaskProgress(task.id)}
                  onUpdateProgress={handleUpdateProgress}
                />
              ))}
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="sticky top-4">
            {/* Skills */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            
            {/* Resources */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Resources</h3>
              <ul className="space-y-2">
                {selectedProject.resourceLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/projects')}
                >
                  Back to Projects
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowSocialPostModal(true)}
                >
                  Share Progress
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Social post modal */}
      {showSocialPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Progress</h2>
                <button
                  onClick={() => setShowSocialPostModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={postPlatform}
                  onChange={(e) => setPostPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Post
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePost}
                    isLoading={progressStore.isLoading}
                  >
                    Generate Post
                  </Button>
                </div>
                <textarea
                  value={customPost}
                  onChange={(e) => setCustomPost(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={5}
                  placeholder="Share your progress on this project..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {customPost.length}/280 characters
                </p>
              </div>
              
              {generatedPost && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Post</h3>
                  <p className="text-gray-600 dark:text-gray-400">{generatedPost}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowSocialPostModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreatePost}
                  disabled={!customPost.trim()}
                  isLoading={progressStore.isLoading}
                >
                  Share Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProjectDetailsPage;
