import React from 'react';

const TaskCheckbox = ({ 
  task, 
  id, 
  title, 
  description, 
  isCompleted, 
  onChange,
  onCreateMilestone,
  onShareProgress
 }) => {
  // Support both passing a task object or individual properties
  const taskId = id || (task && task.id);
  const taskTitle = title || (task && task.title) || 'Task';
  const taskDescription = description || (task && task.description) || '';
  
  // Handle both callback styles
  const handleChange = (e) => {
    if (task && typeof onChange === 'function') {
      // Original style: onChange(taskId, isChecked)
      onChange(taskId, e.target.checked);
    } else if (typeof onChange === 'function') {
      // New style: onChange(isChecked)
      onChange(e.target.checked);
    }
  };
  
  return (
    <div className="flex flex-col p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-start">
        <div className="flex items-center h-5 mt-1">
          <input
            id={`task-${taskId}`}
            type="checkbox"
            checked={isCompleted}
            onChange={handleChange}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="ml-3 text-sm flex-grow">
          <label 
            htmlFor={`task-${taskId}`} 
            className={`font-medium ${isCompleted ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}
          >
            {taskTitle}
          </label>
          <p className={`mt-1 ${isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
            {taskDescription}
          </p>
        </div>
      </div>
      
      {/* Action buttons - only show if callbacks are provided */}
      {(onCreateMilestone || onShareProgress) && (
        <div className="flex mt-3 ml-8 space-x-2">
          {onCreateMilestone && (
            <button
              onClick={() => onCreateMilestone({ id: taskId, title: taskTitle })}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 rounded"
            >
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Set Milestone
              </span>
            </button>
          )}
          
          {isCompleted && onShareProgress && (
            <button
              onClick={() => onShareProgress({ id: taskId, title: taskTitle })}
              className="text-xs px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 rounded"
            >
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Progress
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCheckbox;
