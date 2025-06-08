import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-secondary">Progression de la leçon</span>
        <span className="text-xs font-medium text-text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;