import React from 'react';
import Card from './Card';
import Button from './Button';
import ProgressBar from './ProgressBar';

interface ProjectCardProps {
  project: {
    id: string;
    domain: string;
    title: string;
    description: string;
    tasks: {
      id: string;
      title: string;
      description: string;
      order: number;
    }[];
    difficulty: string;
    skillsRequired: string[];
    resourceLinks: {
      title: string;
      url: string;
    }[];
    estimatedHours?: number;
  };
  progress?: number; // 0-100
  selected?: boolean;
  onSelect: (projectId: string) => void;
  onViewDetails: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  progress = 0,
  selected = false,
  onSelect,
  onViewDetails,
}) => {
  // Difficulty badge color
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }[project.difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  
  return (
    <Card
      hoverable
      selected={selected}
      onClick={() => onSelect(project.id)}
      className="h-full"
    >
      <div className="flex flex-col h-full">
        {/* Project title and difficulty */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${difficultyColor}`}>
            {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
          </span>
        </div>
        
        {/* Project description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
          {project.description}
        </p>
        
        {/* Task count */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tasks: {project.tasks.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ~{project.estimatedHours || '?'} hours
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <ProgressBar progress={progress} showLabel />
        </div>
        
        {/* Skills required */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between mt-auto pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(project.id);
            }}
          >
            View Details
          </Button>
          
          <Button 
            variant={selected ? 'success' : 'primary'} 
            size="sm"
          >
            {selected ? 'Selected' : 'Select Project'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
