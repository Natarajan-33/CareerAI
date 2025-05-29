import React from 'react';
import Button from './Button.jsx';

const DomainCard = ({ domain, selected, onSelect, onViewDetails }) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm transition-all duration-200 ${selected ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700 hover:shadow-md'}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{domain.name}</h3>
          {selected && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              Selected
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {domain.description}
        </p>
        
        {domain.requiredSkills && domain.requiredSkills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {domain.requiredSkills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {skill}
                </span>
              ))}
              {domain.requiredSkills.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  +{domain.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button 
            variant={selected ? "outline" : "primary"}
            size="sm"
            onClick={() => onSelect(domain.id)}
            className="flex-1"
          >
            {selected ? 'Selected' : 'Select'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(domain.id)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DomainCard;
