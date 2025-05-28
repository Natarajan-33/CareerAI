import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = false,
  color = 'primary',
  className = '',
  animate = true,
}) => {
  // Ensure progress is between 0-100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Color classes
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-500',
  }[color];
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <div className="flex justify-between w-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {normalizedProgress}%
            </span>
          </div>
        )}
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`${colorClasses} ${animate ? 'transition-all duration-500 ease-out' : ''} rounded-full`}
          style={{ width: `${normalizedProgress}%`, height: '100%' }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
