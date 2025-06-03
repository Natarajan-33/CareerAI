import React from 'react';
import Button from './Button.jsx';

const ProjectCard = ({ project, selected, onSelect, onViewDetails }) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const difficultyColor = difficultyColors[project.difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm transition-all duration-200 ${selected ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700 hover:shadow-md'}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
          {selected && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              Selected
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-0.5 text-xs rounded-full ${difficultyColor}`}>
            {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
          </span>
          <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            ~{project.estimated_hours} hours
          </span>
        </div>
        
        {project.skills_required && project.skills_required.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.skills_required.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {skill}
                </span>
              ))}
              {project.skills_required.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  +{project.skills_required.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button 
            variant={selected ? "outline" : "primary"}
            size="sm"
            onClick={() => onSelect(project.id)}
            className="flex-1"
          >
            {selected ? 'Selected' : 'Select'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(project.id)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
