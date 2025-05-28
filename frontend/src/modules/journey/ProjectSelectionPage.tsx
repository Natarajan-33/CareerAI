import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProjectStore, useProgressStore } from '../../stores/RootStore';
import ProjectCard from '../../components/ProjectCard';
import Button from '../../components/Button';
import Card from '../../components/Card';

const ProjectSelectionPage: React.FC = observer(() => {
  const projectStore = useProjectStore();
  const progressStore = useProgressStore();
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  useEffect(() => {
    // Load projects for the selected domain
    if (projectStore.selectedDomain) {
      projectStore.loadProjects(projectStore.selectedDomain.id);
    } else {
      // If no domain is selected, redirect to domain selection
      navigate('/domains');
    }
    
    // Load user progress
    progressStore.loadProgress();
  }, [projectStore, progressStore, navigate]);
  
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    projectStore.selectProject(projectId);
  };
  
  const handleViewDetails = (projectId: string) => {
    setShowDetails(projectId);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(null);
  };
  
  const handleProceedToProject = () => {
    if (selectedProjectId) {
      navigate(`/projects/${selectedProjectId}`);
    }
  };
  
  // Calculate project progress
  const getProjectProgress = (projectId: string) => {
    const project = projectStore.projects.find(p => p.id === projectId);
    if (!project) return 0;
    
    return progressStore.getProjectCompletionPercentage(projectId, project.tasks.length);
  };
  
  // Find the selected project for details modal
  const selectedProject = projectStore.projects.find(p => p.id === showDetails);
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {projectStore.selectedDomain ? `${projectStore.selectedDomain.name} Projects` : 'Select a Project'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose a project that interests you. Each project is designed to build practical skills through hands-on implementation.
        </p>
      </div>
      
      {projectStore.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : projectStore.projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No projects available for this domain.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/domains')}>
              Back to Domains
            </Button>
            <Button variant="primary" onClick={() => projectStore.loadProjects(projectStore.selectedDomain?.id)}>
              Refresh
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projectStore.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                progress={getProjectProgress(project.id)}
                selected={project.id === selectedProjectId}
                onSelect={handleSelectProject}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {selectedProjectId && (
            <div className="flex justify-center mt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToProject}
              >
                Start Selected Project
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Project details modal */}
      {showDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProject.title}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedProject.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    selectedProject.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  } mr-3`}>
                    {selectedProject.difficulty.charAt(0).toUpperCase() + selectedProject.difficulty.slice(1)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Estimated time: ~{selectedProject.estimatedHours || '?'} hours
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedProject.description}
                </p>
                
                <div className="mb-6">
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
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Project Tasks</h3>
                  <div className="space-y-3">
                    {selectedProject.tasks.map((task) => (
                      <Card key={task.id} className="border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                              {task.order}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">{task.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
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
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleSelectProject(selectedProject.id);
                    handleCloseDetails();
                  }}
                >
                  Select This Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProjectSelectionPage;
