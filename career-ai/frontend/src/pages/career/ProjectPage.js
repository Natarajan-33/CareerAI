import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/rootStore';

const ProjectPage = observer(() => {
  const { projectStore } = useStores();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [domain, setDomain] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  
  // Get domain from location state or from selected project
  useEffect(() => {
    if (location.state?.domain) {
      setDomain(location.state.domain);
    } else if (projectStore.selectedProject?.domain) {
      setDomain(projectStore.selectedProject.domain);
    }
  }, [location.state, projectStore.selectedProject]);
  
  // Load projects when component mounts
  useEffect(() => {
    projectStore.loadProjects();
  }, [projectStore]);
  
  // Load project suggestions when domain changes
  useEffect(() => {
    if (domain) {
      projectStore.getProjectSuggestions(domain);
    }
  }, [domain, projectStore]);
  
  const handleProjectClick = (project) => {
    setSelectedProjectDetails(project);
    setProjectModalOpen(true);
  };
  
  const handleSelectProject = async () => {
    if (selectedProjectDetails) {
      await projectStore.createProject(selectedProjectDetails);
      setProjectModalOpen(false);
      navigate('/progress');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Project Selection
        </h1>
        <p className="text-lg text-gray-600">
          Choose a project in your selected domain to start building your skills and portfolio.
        </p>
      </div>
      
      {/* Domain information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {getDomainTitle(domain)}
        </h2>
        <p className="text-gray-700 mb-4">
          {getDomainDescription(domain)}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {getDomainSkills(domain).map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Project suggestions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Projects</h2>
        
        {projectStore.isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : projectStore.projectSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectStore.projectSuggestions.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">No project suggestions available for this domain.</p>
          </div>
        )}
      </div>
      
      {/* Current projects */}
      {projectStore.projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Current Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectStore.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={projectStore.selectedProject?.id === project.id}
                onClick={() => {
                  projectStore.selectProject(project);
                  navigate('/progress');
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Project details modal */}
      {projectModalOpen && selectedProjectDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProjectDetails.title}</h2>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedProjectDetails.description}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Skills You'll Develop</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectDetails.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Difficulty</h3>
                <div className="flex items-center">
                  <DifficultyBadge difficulty={selectedProjectDetails.difficulty} />
                </div>
              </div>
              
              {selectedProjectDetails.resources && selectedProjectDetails.resources.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Resources</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedProjectDetails.resources.map((resource, index) => (
                      <li key={index}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {resource.type}: {resource.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelectProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Select This Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Project card component
const ProjectCard = ({ project, isActive = false, onClick }) => {
  return (
    <div
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
          <DifficultyBadge difficulty={project.difficulty} />
        </div>
        
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
        
        {project.status && (
          <div className="mt-2">
            <StatusBadge status={project.status} />
          </div>
        )}
      </div>
    </div>
  );
};

// Difficulty badge component
const DifficultyBadge = ({ difficulty }) => {
  const getBadgeColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded ${getBadgeColor()}`}>
      {difficulty}
    </span>
  );
};

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

// Helper functions for domain information
function getDomainTitle(domain) {
  const domains = {
    'nlp': 'Natural Language Processing',
    'computer_vision': 'Computer Vision',
    'robotics': 'Robotics & Automation',
    'data_science': 'Data Science & Analytics',
    'reinforcement_learning': 'Reinforcement Learning',
    'generative_ai': 'Generative AI'
  };
  
  return domains[domain] || 'Select a Domain';
}

function getDomainDescription(domain) {
  const descriptions = {
    'nlp': 'Natural Language Processing (NLP) focuses on enabling computers to understand, interpret, and generate human language. Projects in this domain will help you build skills in text analysis, sentiment analysis, chatbots, and more.',
    'computer_vision': 'Computer Vision involves teaching machines to interpret and understand visual information from the world. Projects in this domain will help you build skills in image recognition, object detection, image segmentation, and more.',
    'robotics': 'Robotics & Automation focuses on creating intelligent robots and automated systems that can interact with the physical world. Projects in this domain will help you build skills in robot control, motion planning, sensor fusion, and more.',
    'data_science': 'Data Science & Analytics involves extracting insights and knowledge from structured and unstructured data. Projects in this domain will help you build skills in statistical analysis, data visualization, predictive modeling, and more.',
    'reinforcement_learning': 'Reinforcement Learning focuses on building systems that learn optimal behaviors through interaction with environments. Projects in this domain will help you build skills in policy optimization, Q-learning, multi-agent systems, and more.',
    'generative_ai': 'Generative AI involves creating AI systems that can generate new content, from text to images to music. Projects in this domain will help you build skills in GANs, diffusion models, transformers, and more.'
  };
  
  return descriptions[domain] || 'Please select a domain to see relevant projects.';
}

function getDomainSkills(domain) {
  const skills = {
    'nlp': ['Text analysis', 'Sentiment analysis', 'Chatbots', 'Machine translation', 'Information extraction'],
    'computer_vision': ['Image recognition', 'Object detection', 'Image segmentation', 'Video analysis', 'Augmented reality'],
    'robotics': ['Robot control', 'Motion planning', 'Sensor fusion', 'Autonomous navigation', 'Manipulation'],
    'data_science': ['Statistical analysis', 'Data visualization', 'Predictive modeling', 'A/B testing', 'Business intelligence'],
    'reinforcement_learning': ['Policy optimization', 'Q-learning', 'Multi-agent systems', 'Game AI', 'Simulation'],
    'generative_ai': ['GANs', 'Diffusion models', 'Transformers', 'Content generation', 'Creative AI']
  };
  
  return skills[domain] || [];
}

export default ProjectPage;
