import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ actions = [], onAction }) => {
  const handleAction = action => {
    if (action.link && action.link !== '#') return;
    if (onAction) onAction(action);
  };

  const renderAction = action => {
    if (action.link && action.link !== '#') {
      return (
        <Link
          key={action.id}
          to={action.link}
          className={`${action.color} ${action.hoverColor} text-white rounded-lg p-4 transition-all duration-200 hover:shadow-medium hover:-translate-y-0.5 group block`}
        >
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200'>
              <Icon name={action.icon} size={20} color='white' />
            </div>
            <div className='flex-1'>
              <h4 className='font-medium text-white'>{action.title}</h4>
              <p className='text-sm text-white opacity-90'>{action.description}</p>
            </div>
            <Icon
              name='ArrowRight'
              size={16}
              color='white'
              className='opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200'
            />
          </div>
        </Link>
      );
    }

    return (
      <button
        key={action.id}
        onClick={() => handleAction(action)}
        className={`${action.color} ${action.hoverColor} text-white rounded-lg p-4 transition-all duration-200 hover:shadow-medium hover:-translate-y-0.5 group w-full text-left`}
      >
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200'>
            <Icon name={action.icon} size={20} color='white' />
          </div>
          <div className='flex-1'>
            <h4 className='font-medium text-white'>{action.title}</h4>
            <p className='text-sm text-white opacity-90'>{action.description}</p>
          </div>
          <Icon
            name='ArrowRight'
            size={16}
            color='white'
            className='opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200'
          />
        </div>
      </button>
    );
  };

  return (
    <div className='bg-surface rounded-xl border border-border p-6'>
      <h3 className='text-lg font-semibold text-text-primary mb-4'>Actions rapides</h3>
      <div className='space-y-3'>{actions.map(renderAction)}</div>
    </div>
  );
};

export default QuickActions;
