import React from 'react';

const TaskCheckbox = ({ task, id, title, description, isCompleted, onChange }) => {
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
    <div className="flex items-start p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center h-5 mt-1">
        <input
          id={`task-${taskId}`}
          type="checkbox"
          checked={isCompleted}
          onChange={handleChange}
          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <div className="ml-3 text-sm">
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
  );
};

export default TaskCheckbox;
