import React, { useState } from 'react';
import Icon from '@frontend/components/AppIcon';

interface BulkOperationsProps {
  selectedItems: string[];
  onClose: () => void;
  onExecute: (operationId: string, items: string[]) => void;
}

const BulkOperations = ({ selectedItems, onClose, onExecute }: BulkOperationsProps) => {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const operations = [
    {
      id: 'publish',
      label: 'Publier',
      description: 'Publier tous les éléments sélectionnés',
      icon: 'Eye',
      color: 'text-accent',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
    },
    {
      id: 'unpublish',
      label: 'Dépublier',
      description: 'Mettre en brouillon tous les éléments sélectionnés',
      icon: 'EyeOff',
      color: 'text-warning',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
    },
    {
      id: 'duplicate',
      label: 'Dupliquer',
      description: 'Créer une copie de tous les éléments sélectionnés',
      icon: 'Copy',
      color: 'text-primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
    },
    {
      id: 'export',
      label: 'Exporter',
      description: 'Exporter les éléments sélectionnés en JSON',
      icon: 'Download',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
    },
    {
      id: 'delete',
      label: 'Supprimer',
      description: 'Supprimer définitivement tous les éléments sélectionnés',
      icon: 'Trash2',
      color: 'text-error',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200',
    },
  ];

  const handleExecute = () => {
    if (selectedOperation === 'delete' && confirmationText !== 'SUPPRIMER') {
      return;
    }

    onExecute(selectedOperation, selectedItems);
  };

  const selectedOp = operations.find(op => op.id === selectedOperation);
  const requiresConfirmation = selectedOperation === 'delete';

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <div>
            <h2 className='text-xl font-semibold text-text-primary'>Actions groupées</h2>
            <p className='text-text-secondary mt-1'>
              {selectedItems.length} élément{selectedItems.length > 1 ? 's' : ''} sélectionné
              {selectedItems.length > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            className='p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200'
          >
            <Icon name='X' size={20} aria-label='Fermer' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Operation Selection */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium text-text-primary mb-4'>Choisissez une action</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {operations.map(operation => (
                <button
                  key={operation.id}
                  onClick={() => setSelectedOperation(operation.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-subtle ${
                    selectedOperation === operation.id
                      ? `${operation.borderColor} ${operation.bgColor}`
                      : 'border-border hover:border-secondary-300'
                  }`}
                >
                  <div className='flex items-start'>
                    <Icon
                      aria-hidden='true'
                      name={operation.icon}
                      size={20}
                      className={`${operation.color} mr-3 mt-0.5`}
                    />
                    <div>
                      <h4 className='font-medium text-text-primary'>{operation.label}</h4>
                      <p className='text-sm text-text-secondary mt-1'>{operation.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Confirmation for Delete */}
          {requiresConfirmation && (
            <div className='mb-6 p-4 bg-error-50 border border-error-200 rounded-lg'>
              <div className='flex items-start'>
                <Icon
                  aria-hidden='true'
                  name='AlertTriangle'
                  size={20}
                  className='text-error mr-3 mt-0.5'
                />
                <div className='flex-1'>
                  <h4 className='font-medium text-error mb-2'>Attention : Action irréversible</h4>
                  <p className='text-sm text-error-700 mb-4'>
                    Cette action supprimera définitivement {selectedItems.length} élément
                    {selectedItems.length > 1 ? 's' : ''}
                    et ne peut pas être annulée. Tapez <strong>SUPPRIMER</strong> pour confirmer.
                  </p>

                  <input
                    type='text'
                    value={confirmationText}
                    onChange={e => setConfirmationText(e.target.value)}
                    placeholder='Tapez SUPPRIMER'
                    className='w-full px-3 py-2 border border-error-300 rounded-lg focus:ring-2 focus:ring-error focus:border-transparent'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Selected Operation Summary */}
          {selectedOp && (
            <div
              className={`mb-6 p-4 ${selectedOp.bgColor} border ${selectedOp.borderColor} rounded-lg`}
            >
              <div className='flex items-start'>
                <Icon
                  aria-hidden='true'
                  name={selectedOp.icon}
                  size={20}
                  className={`${selectedOp.color} mr-3 mt-0.5`}
                />
                <div>
                  <h4 className='font-medium text-text-primary mb-2'>
                    Action sélectionnée : {selectedOp.label}
                  </h4>
                  <p className='text-sm text-text-secondary'>
                    Cette action sera appliquée à {selectedItems.length} élément
                    {selectedItems.length > 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview of Selected Items */}
          <div className='mb-6'>
            <h4 className='font-medium text-text-primary mb-3'>Éléments sélectionnés</h4>

            <div className='max-h-40 overflow-y-auto border border-border rounded-lg'>
              {selectedItems.map((itemId, index) => (
                <div
                  key={itemId}
                  className={`px-4 py-2 flex items-center justify-between ${
                    index !== selectedItems.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <span className='text-sm text-text-secondary'>Élément ID: {itemId}</span>
                  <Icon aria-hidden='true' name='Check' size={16} className='text-accent' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-border bg-secondary-50'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200'
          >
            Annuler
          </button>

          <button
            onClick={handleExecute}
            disabled={
              !selectedOperation || (requiresConfirmation && confirmationText !== 'SUPPRIMER')
            }
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              !selectedOperation || (requiresConfirmation && confirmationText !== 'SUPPRIMER')
                ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                : selectedOp?.id === 'delete'
                  ? 'bg-error text-white hover:bg-error-600'
                  : 'bg-primary text-white hover:bg-primary-700'
            }`}
          >
            {selectedOp ? (
              <div className='flex items-center'>
                <Icon aria-hidden='true' name={selectedOp.icon} size={16} className='mr-2' />
                {selectedOp.label}
              </div>
            ) : (
              'Sélectionner une action'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;
