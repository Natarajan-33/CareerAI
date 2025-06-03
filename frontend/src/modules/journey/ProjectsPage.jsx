import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useProjectStore } from '../../stores/RootStore.js';
import ProjectCard from '../../components/ProjectCard.jsx';
import Button from '../../components/Button.jsx';

const ProjectsPage = observer(() => {
  const projectStore = useProjectStore();
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  
  useEffect(() => {
    // If no domain is selected, redirect back to domain selection
    if (!projectStore.selectedDomain) {
      navigate('/domains');
      return;
    }
    
    // Load projects for the selected domain
    projectStore.loadProjects(projectStore.selectedDomain.id);
  }, [projectStore, navigate]);
  
  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    projectStore.selectProject(projectId);
    
    // Store selected project ID in session storage
    try {
      sessionStorage.setItem('selectedProjectId', projectId);
      // Immediately navigate to progress page
      navigate(`/progress/${projectId}`);
    } catch (error) {
      console.error('Error saving project selection to session storage:', error);
    }
  };
  
  const handleViewDetails = (projectId) => {
    setShowDetails(projectId);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(null);
  };
  
  const handleProceedToProgress = () => {
    if (selectedProjectId) {
      // Store selected project ID in session storage
      try {
        sessionStorage.setItem('selectedProjectId', selectedProjectId);
      } catch (error) {
        console.error('Error saving project selection to session storage:', error);
      }
      navigate(`/progress/${selectedProjectId}`);
    }
  };
  
  // Find the selected project for details modal
  const selectedProject = projectStore.projects.find(p => p.id === showDetails);
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Select a Project</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose a project from the <span className="font-semibold">{projectStore.selectedDomain?.name}</span> domain to start your learning journey.
        </p>
      </div>
      
      {/* Show error message if there's an error */}
      {projectStore.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{projectStore.error}</p>
        </div>
      )}
      
      {projectStore.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : projectStore.projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No projects available for this domain.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" onClick={() => projectStore.generateProjects()}>
              Generate Projects
            </Button>
            <Button variant="outline" onClick={() => navigate('/domains')}>
              Back to Domains
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Projects</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => projectStore.generateProjects()}
              disabled={projectStore.isLoading}
            >
              {projectStore.isLoading ? 'Generating...' : 'Generate More Projects'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projectStore.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={project.id === selectedProjectId}
                onSelect={handleSelectProject}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {/* Button removed as we now navigate immediately on selection */}
        </>
      )}
      
      {/* Project details modal */}
      {showDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedProject.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2.5 py-0.5 text-sm rounded-full ${
                    selectedProject.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    selectedProject.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {selectedProject.difficulty.charAt(0).toUpperCase() + selectedProject.difficulty.slice(1)} Difficulty
                  </span>
                  <span className="px-2.5 py-0.5 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Estimated: {selectedProject.estimated_hours} hours
                  </span>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills_required.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Tasks</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedProject.tasks.map((task) => (
                      <li key={task.id}>{task.title}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedProject.resource_links && selectedProject.resource_links.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Helpful Resources</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedProject.resource_links.map((link, index) => (
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
                )}
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

export default ProjectsPage;
