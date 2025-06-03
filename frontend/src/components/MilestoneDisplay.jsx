import React from 'react';
import Button from './Button.jsx';

const MilestoneDisplay = ({ milestone, onEdit, onDelete }) => {
  console.log('Rendering milestone:', milestone);
  
  // Format the due date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // If not a valid date, return the string as is
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'at_risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: // not_started
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Get status display name
  const getStatusName = (status) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'delayed':
        return 'Delayed';
      case 'at_risk':
        return 'At Risk';
      default:
        return status;
    }
  };
  
  // Handle case where milestone is undefined or null
  if (!milestone) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800 p-3 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
          {milestone.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{milestone.description}</p>
          )}
          <div className="flex flex-wrap items-center mt-2 gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              Due: {formatDate(milestone.due_date)}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(milestone.status)}`}>
              {getStatusName(milestone.status)}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(milestone)}
            className="text-xs p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(milestone.id)}
            className="text-xs p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneDisplay;
