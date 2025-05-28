import React from 'react';
import Card from './Card';
import Button from './Button';

interface DomainCardProps {
  domain: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    requiredSkills: string[];
    jobTitles: string[];
  };
  selected?: boolean;
  onSelect: (domainId: string) => void;
  onViewDetails: (domainId: string) => void;
}

const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  selected = false,
  onSelect,
  onViewDetails,
}) => {
  // Color classes based on domain color
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }[domain.color] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  
  return (
    <Card
      hoverable
      selected={selected}
      onClick={() => onSelect(domain.id)}
      className="h-full"
    >
      <div className="flex flex-col h-full">
        {/* Domain icon and name */}
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-lg ${colorClasses} mr-3`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{domain.name}</h3>
        </div>
        
        {/* Domain description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
          {domain.description}
        </p>
        
        {/* Skills required */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {domain.requiredSkills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Job titles */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Potential Job Titles:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
            {domain.jobTitles.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between mt-auto pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(domain.id);
            }}
          >
            View Details
          </Button>
          
          <Button 
            variant={selected ? 'success' : 'primary'} 
            size="sm"
          >
            {selected ? 'Selected' : 'Select Domain'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DomainCard;
