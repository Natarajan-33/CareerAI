import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const DailyPostPage = observer(() => {
  const { projectStore } = useStores();
  
  const [formData, setFormData] = useState({
    day_number: 1,
    goals_for_today: '',
    learnings: '',
    target_firms: ''
  });
  
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Load projects when component mounts
  useEffect(() => {
    if (!projectStore.projects.length) {
      projectStore.loadProjects();
    }
  }, [projectStore]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGeneratePost = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      // Parse target firms as array
      const targetFirms = formData.target_firms
        .split(',')
        .map(firm => firm.trim())
        .filter(firm => firm !== '');
      
      // Generate daily post
      const postContent = await projectStore.generateDailyPost(
        formData.day_number,
        formData.goals_for_today,
        formData.learnings,
        targetFirms.length > 0 ? targetFirms : undefined
      );
      
      setGeneratedPost(postContent);
    } catch (error) {
      console.error('Error generating post:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Daily Build in Public
        </h1>
        <p className="text-lg text-gray-600">
          Generate professional social media posts to share your daily progress and build in public.
        </p>
      </div>
      
      {/* Project selection */}
      {projectStore.projects.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Project</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectStore.projects.map(project => (
              <div
                key={project.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${projectStore.selectedProject?.id === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => projectStore.selectProject(project)}
              >
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{project.domain}</p>
                <div className="mt-2">
                  <StatusBadge status={project.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-lg mb-8">
          <p className="text-yellow-800">
            You haven't selected any projects yet. Please go to the Project Selection page to choose a project.
          </p>
        </div>
      )}
      
      {/* Post generation form */}
      {projectStore.selectedProject && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Generate Daily Post for {projectStore.selectedProject.title}
          </h2>
          
          <form onSubmit={handleGeneratePost}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Day Number
              </label>
              <input
                type="number"
                name="day_number"
                value={formData.day_number}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Today's Goals/Focus
              </label>
              <textarea
                name="goals_for_today"
                value={formData.goals_for_today}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What did you plan to work on today?"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Learnings & Accomplishments
              </label>
              <textarea
                name="learnings"
                value={formData.learnings}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What did you learn or accomplish today?"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Target Companies (Optional)
              </label>
              <input
                type="text"
                name="target_firms"
                value={formData.target_firms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company names, separated by commas (e.g., Google, Microsoft, Amazon)"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Post...
                  </span>
                ) : (
                  'Generate Post'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Generated post */}
      {generatedPost && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Generated Post</h2>
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {generatedPost}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Share on:</h3>
            <div className="flex space-x-4">
              <SocialButton
                platform="LinkedIn"
                url={`https://www.linkedin.com/share?url=https://careerai.app&text=${encodeURIComponent(generatedPost)}`}
                color="bg-blue-700"
              />
              <SocialButton
                platform="Twitter"
                url={`https://twitter.com/intent/tweet?text=${encodeURIComponent(generatedPost)}`}
                color="bg-blue-400"
              />
              <SocialButton
                platform="Facebook"
                url={`https://www.facebook.com/sharer/sharer.php?u=https://careerai.app&quote=${encodeURIComponent(generatedPost)}`}
                color="bg-blue-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Status badge component
const StatusBadge = ({ status }) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded ${getBadgeColor()}`}>
      {getStatusText()}
    </span>
  );
};

// Social share button component
const SocialButton = ({ platform, url, color }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-4 py-2 ${color} text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
    >
      Share on {platform}
    </a>
  );
};

export default DailyPostPage;
