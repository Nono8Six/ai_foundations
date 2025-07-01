import React, { useState } from 'react';
import Icon from '@frontend/components/AppIcon';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
  onClearSelection: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [showActionMenu, setShowActionMenu] = useState(false);

  const bulkActions = [
    {
      id: 'activate',
      label: 'Activer les comptes',
      icon: 'UserCheck',
      color: 'text-success',
      description: 'Activer les comptes utilisateurs sélectionnés',
    },
    {
      id: 'deactivate',
      label: 'Désactiver les comptes',
      icon: 'UserX',
      color: 'text-warning',
      description: 'Désactiver temporairement les comptes',
    },
    {
      id: 'reset-password',
      label: 'Réinitialiser les mots de passe',
      icon: 'Key',
      color: 'text-primary',
      description: 'Envoyer un email de réinitialisation',
    },
    {
      id: 'send-message',
      label: 'Envoyer un message',
      icon: 'MessageCircle',
      color: 'text-primary',
      description: 'Envoyer un message groupé',
    },
    {
      id: 'export',
      label: 'Exporter les données',
      icon: 'Download',
      color: 'text-text-secondary',
      description: 'Télécharger les informations utilisateurs',
    },
    {
      id: 'delete',
      label: 'Supprimer les comptes',
      icon: 'Trash2',
      color: 'text-error',
      description: 'Supprimer définitivement les comptes',
    },
  ];

  const handleActionClick = actionId => {
    onBulkAction(actionId);
    setShowActionMenu(false);
  };

  return (
    <div className='bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <Icon aria-hidden='true' name='CheckSquare' size={20} className='text-primary' />
            <span className='text-sm font-medium text-primary'>
              {selectedCount} utilisateur{selectedCount > 1 ? 's' : ''} sélectionné
              {selectedCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className='h-4 w-px bg-primary-200'></div>

          <div className='relative'>
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className='inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-lg text-primary bg-surface hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200'
            >
              <Icon aria-hidden='true' name='Settings' size={16} className='mr-2' />
              Actions groupées
              <Icon aria-hidden='true' name='ChevronDown' size={14} className='ml-1' />
            </button>

            {showActionMenu && (
              <div className='absolute top-full left-0 mt-2 w-64 bg-surface rounded-lg shadow-medium border border-border z-10'>
                <div className='py-2'>
                  {bulkActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action.id)}
                      className='w-full flex items-start px-4 py-3 text-left hover:bg-secondary-50 transition-colors'
                    >
                      <Icon
                        aria-hidden='true'
                        name={action.icon}
                        size={16}
                        className={`mr-3 mt-0.5 ${action.color}`}
                      />
                      <div>
                        <div className='text-sm font-medium text-text-primary'>{action.label}</div>
                        <div className='text-xs text-text-secondary'>{action.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClearSelection}
          className='inline-flex items-center px-3 py-1.5 text-sm text-text-secondary hover:text-primary transition-colors'
        >
          <Icon aria-hidden='true' name='X' size={16} className='mr-1' />
          Désélectionner tout
        </button>
      </div>

      {/* Quick Actions */}
      <div className='flex items-center space-x-2 mt-3'>
        <span className='text-xs text-text-secondary'>Actions rapides:</span>
        <button
          onClick={() => handleActionClick('activate')}
          className='inline-flex items-center px-2 py-1 text-xs font-medium rounded text-success bg-success-50 hover:bg-success-100 transition-colors'
        >
          <Icon aria-hidden='true' name='UserCheck' size={12} className='mr-1' />
          Activer
        </button>
        <button
          onClick={() => handleActionClick('send-message')}
          className='inline-flex items-center px-2 py-1 text-xs font-medium rounded text-primary bg-primary-50 hover:bg-primary-100 transition-colors'
        >
          <Icon aria-hidden='true' name='MessageCircle' size={12} className='mr-1' />
          Message
        </button>
        <button
          onClick={() => handleActionClick('export')}
          className='inline-flex items-center px-2 py-1 text-xs font-medium rounded text-text-secondary bg-secondary-50 hover:bg-secondary-100 transition-colors'
        >
          <Icon aria-hidden='true' name='Download' size={12} className='mr-1' />
          Exporter
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
