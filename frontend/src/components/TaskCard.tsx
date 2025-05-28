import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import ProgressBar from './ProgressBar';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    order: number;
  };
  progress?: number; // 0-100
  onUpdateProgress: (taskId: string, progress: number, notes: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  progress = 0,
  onUpdateProgress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [progressValue, setProgressValue] = useState(progress);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
    onUpdateProgress(task.id, progressValue, notes);
    setIsEditing(false);
  };
  
  return (
    <Card className="mb-4">
      <div>
        {/* Task header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                {task.order}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <ProgressBar progress={progress} showLabel color={progress === 100 ? 'success' : 'primary'} />
        </div>
        
        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {task.description}
            </p>
            
            {/* Progress update form */}
            {isEditing ? (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Update Progress
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progressValue}
                    onChange={(e) => setProgressValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                    placeholder="Add notes about your progress..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={handleSave}
                  >
                    Save Progress
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Update Progress
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
