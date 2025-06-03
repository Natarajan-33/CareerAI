import React, { useState } from 'react';
import Button from './Button.jsx';

const MilestoneForm = ({ taskId, taskTitle, onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || `Complete: ${taskTitle}`);
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(initialData?.status || 'not_started');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      task_id: taskId, // Use task_id to match backend field name
      title,
      description,
      dueDate, // Pass as string in YYYY-MM-DD format
      status
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {initialData ? 'Edit Milestone' : 'Create Milestone'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            rows="3"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
            <option value="at_risk">At Risk</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit"
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MilestoneForm;
