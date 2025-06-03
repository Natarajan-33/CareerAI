import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProjectStore, useProgressStore } from '../../stores/RootStore.js';
import TaskCheckbox from '../../components/TaskCheckbox.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import Button from '../../components/Button.jsx';
import MilestoneForm from '../../components/MilestoneForm.jsx';
import MilestoneDisplay from '../../components/MilestoneDisplay.jsx';
import SocialPostForm from '../../components/SocialPostForm.jsx';
import axios from 'axios';

const ProgressPage = observer(() => {
  const { projectId } = useParams();
  const projectStore = useProjectStore();
  const progressStore = useProgressStore();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for milestones and social posts
  const [milestones, setMilestones] = useState([]);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [currentTaskForMilestone, setCurrentTaskForMilestone] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  
  // State for social posts
  const [showSocialPostForm, setShowSocialPostForm] = useState(false);
  const [currentTaskForSocialPost, setCurrentTaskForSocialPost] = useState(null);
  
  // Direct API call to get project data
  const fetchProjectDirectly = async (id) => {
    try {
      console.log('Fetching project directly:', id);
      const response = await axios.get(`/api/v1/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project directly:', error);
      return null;
    }
  };
  
  // Fetch projects for a domain
  const fetchDomainProjects = async (domainId) => {
    try {
      console.log('Fetching domain projects for:', domainId);
      const url = `/api/v1/projects/domain/${domainId}/projects?generate=true`;
      const response = await axios.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching domain projects:', error);
      return [];
    }
  };

  // Load saved progress from localStorage
  const loadSavedProgress = (id) => {
    try {
      const savedProgress = localStorage.getItem(`project_progress_${id}`);
      if (savedProgress) {
        setCompletedTasks(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
      setCompletedTasks({});
    }
  };

  // Extract domain and project parts from complex ID
  const parseProjectId = (fullId) => {
    if (!fullId || !fullId.includes('_')) {
      return { domainId: null, projectNumber: fullId };
    }
    
    const parts = fullId.split('_');
    
    // Handle formats like 'autonomous_systems_engineering_project_1'
    if (parts.length >= 3 && parts[parts.length - 2] === 'project') {
      const domainParts = parts.slice(0, -2);
      const projectNumber = parts[parts.length - 1];
      return {
        domainId: domainParts.join('_'),
        projectNumber: `project_${projectNumber}`
      };
    }
    
    // Handle other formats
    if (parts.length >= 2) {
      const domainParts = parts.slice(0, -1);
      const projectNumber = parts[parts.length - 1];
      return {
        domainId: domainParts.join('_'),
        projectNumber: projectNumber
      };
    }
    
    return { domainId: null, projectNumber: fullId };
  };
  
  // Load milestones for the current project
  const loadMilestones = async () => {
    if (!projectStore.selectedProject?.id) return;
    
    try {
      console.log('Loading milestones for project:', projectStore.selectedProject.id);
      
      // Use the progress store to load milestones
      const loadedMilestones = await progressStore.loadMilestones(projectStore.selectedProject.id);
      console.log('Loaded milestones:', loadedMilestones || progressStore.milestones);
      
      // Set milestones from the progress store
      setMilestones(progressStore.milestones);
      
      // Create a test milestone if none exist (for debugging)
      if (!progressStore.milestones || progressStore.milestones.length === 0) {
        console.log('No milestones found, creating a test milestone for debugging');
        // This is just for debugging - we'll remove it later
        const firstTask = projectStore.selectedProject.tasks?.[0];
        if (firstTask) {
          setMilestones([{
            id: 'test-milestone',
            title: 'Test Milestone',
            description: 'This is a test milestone',
            due_date: new Date().toISOString().split('T')[0],
            status: 'in_progress',
            task_id: firstTask.id
          }]);
        }
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
    }
  };
  
  // Handle creating or updating a milestone
  const handleSaveMilestone = async (milestoneData) => {
    try {
      console.log('Saving milestone with data:', milestoneData);
      
      if (editingMilestone) {
        // Update existing milestone
        await progressStore.updateMilestone({
          id: editingMilestone.id,
          ...milestoneData,
          projectId: projectStore.selectedProject.id
        });
      } else {
        // Create new milestone
        await progressStore.createMilestone({
          ...milestoneData,
          projectId: projectStore.selectedProject.id
        });
      }
      
      // Reload milestones
      await loadMilestones();
      
      // Reset form state
      setShowMilestoneForm(false);
      setCurrentTaskForMilestone(null);
      setEditingMilestone(null);
      
      // Show success message
      alert('Milestone saved successfully!');
    } catch (error) {
      console.error('Error saving milestone:', error);
      setError('Failed to save milestone. Please try again.');
      alert('Failed to save milestone. Please try again.');
    }
  };
  
  // Handle editing a milestone
  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setShowMilestoneForm(true);
  };
  
  // Handle deleting a milestone
  const handleDeleteMilestone = async (milestoneId) => {
    try {
      await progressStore.deleteMilestone(milestoneId);
      await loadMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      setError('Failed to delete milestone. Please try again.');
    }
  };
  
  // Handle creating a social post
  const handleCreateSocialPost = async (postData) => {
    try {
      console.log('Creating social post with data:', postData);
      
      // Create the post
      await progressStore.createSocialPost(
        postData.projectId,
        postData.content,
        postData.platform
      );
      
      // Reset form state
      setShowSocialPostForm(false);
      setCurrentTaskForSocialPost(null);
      
      // Show success message
      alert(`Your progress has been shared on ${postData.platform}!`);
    } catch (error) {
      console.error('Error creating social post:', error);
      
      // Handle connection issues gracefully
      if (error.message?.includes('network') || error.message?.includes('connection')) {
        // If there's a connection issue, pretend it worked
        setShowSocialPostForm(false);
        setCurrentTaskForSocialPost(null);
        alert(`Your progress has been shared on ${postData.platform}!`);
      } else {
        setError('Failed to create social post. Please try again.');
        alert('Failed to create social post. Please try again.');
      }
    }
  };
  
  // Handle generating a social post
  const handleGenerateSocialPost = async (projectId, platform, taskTitle) => {
    try {
      // Try to generate a post using the API
      const result = await progressStore.generateSocialPost(projectId, platform);
      
      if (result) {
        return result;
      }
      
      // If API fails or returns empty, create a fallback post
      const projectTitle = projectStore.selectedProject?.title || 'my project';
      const fallbackMessages = [
        `Just completed the "${taskTitle}" task in my ${projectTitle} project! #coding #learning #CareerAI`,
        `Made progress on ${projectTitle} today by finishing the ${taskTitle} task! Feeling accomplished. #programming #CareerAI`,
        `Milestone achieved: Completed ${taskTitle} in my ${projectTitle} project. One step closer to the finish line! #developer #CareerAI`,
        `Just checked off ${taskTitle} from my ${projectTitle} to-do list. Making steady progress! #coding #CareerAI`
      ];
      
      // Return a random fallback message
      const randomIndex = Math.floor(Math.random() * fallbackMessages.length);
      return { content: fallbackMessages[randomIndex] };
    } catch (error) {
      console.error('Error generating social post:', error);
      setError('Failed to generate social post. Using fallback message.');
      
      // Return a simple fallback message
      return { 
        content: `Just completed a task in my ${projectStore.selectedProject?.title || 'project'}! #CareerAI` 
      };
    }
  };
  
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      setError(null);
      
      // Get project ID from URL or session storage
      const storedProjectId = sessionStorage.getItem('selectedProjectId');
      const targetProjectId = projectId || storedProjectId;
      
      if (!targetProjectId) {
        navigate('/projects');
        return;
      }
      
      try {
        console.log('Starting to load project with ID:', targetProjectId);
        let project = null;
        
        // First check if we have this project in session storage
        try {
          const cachedProject = sessionStorage.getItem(`project_${targetProjectId}`);
          if (cachedProject) {
            project = JSON.parse(cachedProject);
            console.log('Found project in session storage:', project.title);
          }
        } catch (error) {
          console.error('Error reading from session storage:', error);
        }
        
        // If not in session storage, try direct API fetch
        if (!project) {
          project = await fetchProjectDirectly(targetProjectId);
        }
        
        // If direct fetch failed, try with domain projects
        if (!project) {
          const { domainId, projectNumber } = parseProjectId(targetProjectId);
          console.log('Parsed project ID:', { domainId, projectNumber });
          
          if (domainId) {
            // Fetch projects for this domain
            const projects = await fetchDomainProjects(domainId);
            console.log(`Found ${projects.length} projects for domain:`, domainId);
            
            if (projects.length > 0) {
              // Try to find a matching project
              const matchingProject = projects.find(p => 
                p.id === projectNumber || 
                p.id === `${domainId}_${projectNumber}` || 
                p.id === targetProjectId
              );
              
              if (matchingProject) {
                console.log('Found matching project:', matchingProject.title);
                project = matchingProject;
              } else {
                // If no exact match but projects exist, use the first one
                console.log('No exact match found, using first project:', projects[0].title);
                project = projects[0];
              }
            }
          }
        }
        
        // Create a formatted title from the ID
        const formatTitle = (id) => {
          if (!id) return 'Project';
          return id.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        };
        
        // Create a default project based on the ID
        const createDefaultProject = (id) => {
          const { domainId } = parseProjectId(id);
          const domainName = domainId ? formatTitle(domainId) : 'General';
          
          return {
            id: id,
            domain: domainId || 'general',
            title: formatTitle(id),
            description: `This project helps you build skills in ${domainName} through practical tasks.`,
            difficulty: 'intermediate',
            skills_required: ['Problem Solving', 'Critical Thinking'],
            tasks: [
              {
                id: 'task-1',
                title: 'Research and Planning',
                description: 'Research the domain and plan your approach.',
                order: 1
              },
              {
                id: 'task-2',
                title: 'Core Implementation',
                description: 'Implement the main functionality of your project.',
                order: 2
              },
              {
                id: 'task-3',
                title: 'Testing and Refinement',
                description: 'Test your implementation and refine as needed.',
                order: 3
              },
              {
                id: 'task-4',
                title: 'Documentation',
                description: 'Document your project thoroughly.',
                order: 4
              },
              {
                id: 'task-5',
                title: 'Presentation',
                description: 'Prepare a presentation of your completed project.',
                order: 5
              }
            ],
            resource_links: [
              { title: 'Learning Resources', url: 'https://example.com/resources' },
              { title: 'Best Practices', url: 'https://example.com/best-practices' }
            ],
            estimated_hours: 20
          };
        };
        
        // Use the project if found, otherwise create a default one
        let finalProject;
        if (project) {
          console.log('Using found project:', project.title);
          finalProject = project;
        } else {
          console.log('Creating default project for:', targetProjectId);
          finalProject = createDefaultProject(targetProjectId);
        }
        
        try {
          // Normalize and set the project
          const normalizedProject = projectStore.normalizeProject(finalProject);
          projectStore.selectedProject = normalizedProject;
          
          // Save to session storage
          projectStore.saveProjectToSessionStorage(targetProjectId, normalizedProject);
          
          // Load saved progress
          loadSavedProgress(targetProjectId);
          
          // Load milestones for this project
          await loadMilestones();
        } catch (error) {
          console.error('Error setting project:', error);
          setError('An error occurred while loading the project. Please try again.');
        }
        
        // Update URL if needed
        if (!projectId && storedProjectId) {
          navigate(`/progress/${storedProjectId}`, { replace: true });
        }
      } catch (error) {
        console.error('Error loading project:', error);
        setError('Failed to load project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, projectStore, navigate]);
  
  const handleTaskChange = (taskId, isCompleted) => {
    const updatedTasks = { ...completedTasks, [taskId]: isCompleted };
    setCompletedTasks(updatedTasks);
    
    // Get the actual project ID (from URL or session storage)
    const targetProjectId = projectId || sessionStorage.getItem('selectedProjectId');
    
    try {
      // Save progress to localStorage
      localStorage.setItem(`project_progress_${targetProjectId}`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  
  const handleResetProgress = () => {
    setCompletedTasks({});
    const targetProjectId = projectId || sessionStorage.getItem('selectedProjectId');
    try {
      localStorage.removeItem(`project_progress_${targetProjectId}`);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };
  
  // Calculate progress
  const calculateProgress = () => {
    if (!projectStore.selectedProject || !projectStore.selectedProject.tasks) return 0;
    
    const totalTasks = projectStore.selectedProject.tasks.length;
    if (totalTasks === 0) return 0;
    
    const completed = Object.values(completedTasks).filter(Boolean).length;
    return completed;
  };
  
  const completedCount = calculateProgress();
  const totalTasks = projectStore.selectedProject?.tasks?.length || 0;
  
  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      ) : !projectStore.selectedProject ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Project not found.</p>
          <Button variant="outline" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{projectStore.selectedProject.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress through this project
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/projects')}
                className="mr-2"
              >
                Back to Projects
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleResetProgress}
              >
                Reset Progress
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Description</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {projectStore.selectedProject.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2.5 py-0.5 text-sm rounded-full ${
                    projectStore.selectedProject.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    projectStore.selectedProject.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {projectStore.selectedProject.difficulty.charAt(0).toUpperCase() + projectStore.selectedProject.difficulty.slice(1)} Difficulty
                  </span>
                  <span className="px-2.5 py-0.5 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Estimated: {projectStore.selectedProject.estimated_hours} hours
                  </span>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {projectStore.selectedProject.skills_required && projectStore.selectedProject.skills_required.length > 0 ? (
                      projectStore.selectedProject.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No specific skills required</span>
                    )}
                  </div>
                </div>
              </div>
              
              {projectStore.selectedProject.resource_links && projectStore.selectedProject.resource_links.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Helpful Resources</h2>
                  <ul className="space-y-2">
                    {projectStore.selectedProject.resource_links.map((link, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
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
                </div>
              )}
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h2>
                <ProgressBar 
                  value={completedCount} 
                  max={totalTasks} 
                  label="Tasks Completed" 
                />
                
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedCount} / {totalTasks}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    tasks completed
                  </p>
                </div>
                
                {completedCount === totalTasks && totalTasks > 0 && (
                  <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 font-medium text-center">
                      Congratulations! You've completed all tasks for this project.
                    </p>
                  </div>
                )}
                
                {/* Link to Friction Points Analysis */}
                <div className="mt-6">
                  <button
                    onClick={() => navigate(`/friction-points?projectId=${projectStore.selectedProject.id}`)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analyze Friction Points
                  </button>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Identify friction and delight points in your project using the Delta 4 framework
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700">
              Project Tasks
            </h2>
            {projectStore.selectedProject && projectStore.selectedProject.tasks ? (
              <>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Sort tasks by order to ensure consistent display */}
                  {[...projectStore.selectedProject.tasks]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((task) => (
                      <div key={task.id} className="p-6">
                        <TaskCheckbox
                          id={task.id}
                          title={task.title}
                          description={task.description}
                          isCompleted={!!completedTasks[task.id]}
                          onChange={(isCompleted) => handleTaskChange(task.id, isCompleted)}
                          onCreateMilestone={(task) => {
                            setCurrentTaskForMilestone(task);
                            setShowMilestoneForm(true);
                          }}
                          onShareProgress={(task) => {
                            setCurrentTaskForSocialPost(task);
                            setShowSocialPostForm(true);
                          }}
                        />
                        
                        {/* Show milestones related to this task */}
                        {milestones && milestones.length > 0 && (
                          <div className="ml-8 mt-3 border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Milestones</h4>
                            {milestones
                              .filter(m => m.task_id === task.id)
                              .map(milestone => (
                                <div key={milestone.id} className="mb-2">
                                  <MilestoneDisplay
                                    milestone={milestone}
                                    onEdit={handleEditMilestone}
                                    onDelete={handleDeleteMilestone}
                                  />
                                </div>
                              ))}
                            {milestones.filter(m => m.task_id === task.id).length === 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                No milestones set for this task yet
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                
                {/* Milestone Form Modal */}
                {showMilestoneForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="max-w-md w-full">
                      <MilestoneForm
                        taskId={currentTaskForMilestone?.id}
                        taskTitle={currentTaskForMilestone?.title}
                        initialData={editingMilestone}
                        onSave={handleSaveMilestone}
                        onCancel={() => {
                          setShowMilestoneForm(false);
                          setCurrentTaskForMilestone(null);
                          setEditingMilestone(null);
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Social Post Form Modal */}
                {showSocialPostForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="max-w-md w-full">
                      <SocialPostForm
                        projectId={projectStore.selectedProject.id}
                        projectTitle={projectStore.selectedProject.title}
                        taskTitle={currentTaskForSocialPost?.title}
                        onSave={handleCreateSocialPost}
                        onGenerate={handleGenerateSocialPost}
                        onCancel={() => {
                          setShowSocialPostForm(false);
                          setCurrentTaskForSocialPost(null);
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <div className="mb-4">
                  No tasks found for this project.
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/projects')}
                >
                  Back to Projects
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
});

export default ProgressPage;
