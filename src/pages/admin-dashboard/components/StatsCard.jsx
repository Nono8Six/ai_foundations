import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ title, value, change, changeType, icon, description }) => {
  return (
    <div className="bg-surface rounded-lg border border-border p-6 hover:shadow-medium transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          changeType === 'positive' ? 'bg-success-50' : 
          changeType === 'negative' ? 'bg-error-50' : 'bg-secondary-50'
        }`}>
          <Icon 
            name={icon} 
            size={24} 
            className={
              changeType === 'positive' ? 'text-success' : 
              changeType === 'negative' ? 'text-error' : 'text-text-secondary'
            }
          />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          changeType === 'positive' ? 'text-success' : 
          changeType === 'negative' ? 'text-error' : 'text-text-secondary'
        }`}>
          <Icon 
            name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
            size={16} 
          />
          <span>{change}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-1">{value}</h3>
        <p className="text-sm font-medium text-text-primary mb-1">{title}</p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
    </div>
  );
};

export default StatsCard;