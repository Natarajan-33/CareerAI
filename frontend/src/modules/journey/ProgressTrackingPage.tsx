import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProjectStore, useProgressStore } from '../../stores/RootStore';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';

const ProgressTrackingPage: React.FC = observer(() => {
  const projectStore = useProjectStore();
  const progressStore = useProgressStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load all projects
    projectStore.loadProjects();
    
    // Load user progress
    progressStore.loadProgress();
    
    // Load milestones
    progressStore.loadMilestones();
  }, [projectStore, progressStore]);
  
  // Calculate project progress
  const getProjectProgress = (projectId: string) => {
    const project = projectStore.projects.find(p => p.id === projectId);
    if (!project) return 0;
    
    return progressStore.getProjectCompletionPercentage(projectId, project.tasks.length);
  };
  
  // Calculate overall progress across all projects
  const getOverallProgress = () => {
    if (projectStore.projects.length === 0) return 0;
    
    const totalProjects = projectStore.projects.length;
    const completedProjects = projectStore.projects.filter(
      project => getProjectProgress(project.id) === 100
    ).length;
    
    const inProgressProjects = projectStore.projects.filter(
      project => {
        const progress = getProjectProgress(project.id);
        return progress > 0 && progress < 100;
      }
    ).length;
    
    // Weight completed projects fully and in-progress projects partially
    return Math.round(((completedProjects + (inProgressProjects * 0.5)) / totalProjects) * 100);
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Progress Tracking</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your journey through AI projects and milestones. Visualize your growth and achievements.
        </p>
      </div>
      
      {projectStore.isLoading || progressStore.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overall progress */}
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Overall Journey Progress</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your progress across all projects and domains.
              </p>
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getOverallProgress()}%</span>
              </div>
              <ProgressBar progress={getOverallProgress()} height={10} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {projectStore.projects.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {projectStore.projects.filter(project => getProjectProgress(project.id) === 100).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed Projects</div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {projectStore.projects.filter(project => {
                    const progress = getProjectProgress(project.id);
                    return progress > 0 && progress < 100;
                  }).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">In-Progress Projects</div>
              </div>
            </div>
          </Card>
          
          {/* Projects progress */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Projects Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectStore.projects.map((project) => {
                const progress = getProjectProgress(project.id);
                
                return (
                  <Card key={project.id} className="h-full">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                      </div>
                      
                      <div className="mb-4 flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
                        </div>
                        <ProgressBar 
                          progress={progress} 
                          color={progress === 100 ? 'success' : progress > 0 ? 'primary' : 'secondary'} 
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto pt-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          progress === 0 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                          progress === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {progress === 0 ? 'Not Started' : progress === 100 ? 'Completed' : 'In Progress'}
                        </span>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          {progress === 0 ? 'Start Project' : 'Continue Project'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Milestones */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Milestones</h2>
            
            {progressStore.milestones.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No milestones yet. Complete projects to earn milestones.</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {progressStore.milestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          milestone.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {milestone.status === 'completed' ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : milestone.status === 'in_progress' ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{milestone.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                          </div>
                          
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            milestone.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {milestone.status === 'completed' ? 'Completed' : 
                             milestone.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                          </span>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                          {milestone.completedDate && (
                            <span className="ml-4">Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ProgressTrackingPage;
