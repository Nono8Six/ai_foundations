import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PublishingControls = ({ item, onPublish, onSchedule, onPreview }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const getStatusInfo = (status) => {
    switch (status) {
      case 'published':
        return {
          color: 'text-success bg-success-50 border-success-100',
          icon: 'CheckCircle',
          label: 'Publié'
        };
      case 'draft':
        return {
          color: 'text-warning bg-warning-50 border-warning-100',
          icon: 'Clock',
          label: 'Brouillon'
        };
      case 'scheduled':
        return {
          color: 'text-primary bg-primary-50 border-primary-100',
          icon: 'Calendar',
          label: 'Programmé'
        };
      case 'archived':
        return {
          color: 'text-text-secondary bg-secondary-100 border-secondary-200',
          icon: 'Archive',
          label: 'Archivé'
        };
      default:
        return {
          color: 'text-text-secondary bg-secondary-100 border-secondary-200',
          icon: 'Circle',
          label: 'Inconnu'
        };
    }
  };

  const statusInfo = getStatusInfo(item?.status);

  const handleScheduleSubmit = () => {
    if (scheduleDate && scheduleTime) {
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      onSchedule(item, scheduledDateTime);
      setShowScheduleModal(false);
      setScheduleDate('');
      setScheduleTime('');
    }
  };

  return (
    <>
      <div className="bg-surface border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Status badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
              <Icon name={statusInfo.icon} size={14} className="mr-2" />
              {statusInfo.label}
            </div>

            {/* Last modified */}
            <div className="text-sm text-text-secondary">
              <Icon name="Clock" size={14} className="inline mr-1" />
              Modifié le {item?.lastModified ? new Date(item.lastModified).toLocaleDateString('fr-FR') : 'N/A'}
            </div>

            {/* Version info */}
            <div className="text-sm text-text-secondary">
              <Icon name="GitBranch" size={14} className="inline mr-1" />
              Version 1.0
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Preview button */}
            <button
              onClick={() => onPreview(item)}
              className="inline-flex items-center px-3 py-1.5 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 transition-all duration-200"
            >
              <Icon name="Eye" size={14} className="mr-2" />
              Aperçu
            </button>

            {/* Schedule button */}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 transition-all duration-200"
            >
              <Icon name="Calendar" size={14} className="mr-2" />
              Programmer
            </button>

            {/* Publish/Unpublish button */}
            {item?.status === 'published' ? (
              <button
                onClick={() => onPublish({ ...item, status: 'draft' })}
                className="inline-flex items-center px-3 py-1.5 border border-warning text-sm font-medium rounded-lg text-warning bg-warning-50 hover:bg-warning-100 transition-all duration-200"
              >
                <Icon name="EyeOff" size={14} className="mr-2" />
                Dépublier
              </button>
            ) : (
              <button
                onClick={() => onPublish({ ...item, status: 'published' })}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-success hover:bg-success transition-all duration-200"
              >
                <Icon name="CheckCircle" size={14} className="mr-2" />
                Publier
              </button>
            )}

            {/* More actions dropdown */}
            <div className="relative">
              <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-all duration-200">
                <Icon name="MoreVertical" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Additional info for scheduled items */}
        {item?.status === 'scheduled' && item?.scheduledDate && (
          <div className="mt-2 flex items-center text-sm text-primary">
            <Icon name="Calendar" size={14} className="mr-2" />
            Programmé pour le {new Date(item.scheduledDate).toLocaleString('fr-FR')}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-medium w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Programmer la publication
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded transition-all duration-200"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Heure de publication
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Info" size={16} className="text-primary mt-0.5" />
                    <div className="text-sm text-primary">
                      <p className="font-medium mb-1">Information importante</p>
                      <p>
                        Le contenu sera automatiquement publié à la date et heure spécifiées.
                        Vous recevrez une notification de confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-border text-sm font-medium rounded-lg text-text-secondary bg-surface hover:bg-secondary-50 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleScheduleSubmit}
                  disabled={!scheduleDate || !scheduleTime}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Icon name="Calendar" size={16} className="mr-2" />
                  Programmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublishingControls;