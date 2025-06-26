import React from 'react';
import Icon from '@frontend/components/AppIcon';
import type { PerformanceMetricsData } from '@frontend/types/metrics';

export interface PerformanceMetricsProps {
  metrics: PerformanceMetricsData | null;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  // Filter and map available metrics from props
  const availableMetrics = [];

  if (metrics) {
    if (metrics.systemUptime) {
      availableMetrics.push({
        id: 'systemUptime',
        title: 'Disponibilité système',
        value: metrics.systemUptime,
        status: metrics.systemUptime === "N/A" || metrics.systemUptime === "Error" ? 'unknown' : 'excellent', // Or derive from value if it's a percentage
        icon: 'Shield',
        description: 'Uptime mensuel',
      });
    }
    if (metrics.activeUsers !== undefined) { // activeUsers can be 0, so check for undefined
      availableMetrics.push({
        id: 'activeSessions',
        title: 'Sessions actives',
        value: metrics.activeUsers.toLocaleString('fr-FR'),
        status: 'info', // Or 'excellent' if you consider any number good
        icon: 'Users',
        description: 'Utilisateurs actifs',
      });
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'info': return 'text-primary'; // For neutral info like active sessions
      case 'unknown': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const getStatusBg = status => {
    switch (status) {
      case 'excellent': return 'bg-success-50';
      case 'info': return 'bg-primary-50';
      case 'unknown': return 'bg-secondary-100';
      default: return 'bg-secondary-50';
    }
  };

  const getStatusIndicator = status => {
    switch (status) {
      case 'excellent': return 'bg-success';
      case 'info': return 'bg-primary';
      case 'unknown': return 'bg-secondary-400';
      default: return 'bg-secondary-400';
    }
  };

  const getStatusLabel = status => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'info': return 'Info';
      case 'unknown': return 'N/A';
      default: return 'N/A';
    }
  };

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Métriques système</h3>
          <p className='text-sm text-text-secondary'>Performance et disponibilité</p>
        </div>
        <div className='flex items-center space-x-2'>
          {/* Online status can be dynamic if a specific metric indicates it */}
          <div className='flex items-center space-x-1'>
            <div className={`w-2 h-2 ${metrics && metrics.systemUptime !== "N/A" && metrics.systemUptime !== "Error" ? "bg-success" : "bg-text-secondary"} rounded-full animate-pulse`}></div>
            <span className='text-xs text-text-secondary'>
              {metrics && metrics.systemUptime !== "N/A" && metrics.systemUptime !== "Error" ? "En ligne" : "Statut inconnu"}
            </span>
          </div>
          {/* <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon aria-hidden="true"  name='Settings' size={16} className='text-text-secondary' />
          </button> */}
        </div>
      </div>

      {availableMetrics.length > 0 ? (
        <div className='space-y-4 max-h-80 overflow-y-auto'>
          {availableMetrics.map(metric => (
            <div
              key={metric.id}
              className={`p-4 rounded-lg border transition-colors ${getStatusBg(metric.status)}`}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-3'>
                  <div className={`p-2 rounded-lg ${getStatusBg(metric.status)}`}>
                    <Icon aria-hidden="true"  name={metric.icon} size={16} className={getStatusColor(metric.status)} />
                  </div>
                  <div>
                    <h4 className='text-sm font-medium text-text-primary'>{metric.title}</h4>
                    <p className='text-xs text-text-secondary'>{metric.description}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-semibold text-text-primary'>{metric.value}</p>
                  <div className='flex items-center justify-end space-x-1 mt-1'>
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusIndicator(metric.status)}`}
                    ></div>
                    <span className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {getStatusLabel(metric.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
           <div className="mt-4 p-4 border border-dashed border-border rounded-lg text-center">
            <Icon aria-hidden="true"  name="Info" size={20} className="text-text-secondary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">
              Les données de performance détaillées (CPU, mémoire, etc.) ne sont pas disponibles.
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              Celles-ci proviennent généralement d'outils de surveillance système spécifiques.
            </p>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-48 text-center'>
          <Icon aria-hidden="true"  name='ServerOff' size={32} className='text-secondary-400 mb-3' />
          <p className='text-md font-medium text-text-primary mb-1'>
            Aucune métrique système disponible.
          </p>
        </div>
      )}

      <div className='mt-6 pt-4 border-t border-border'>
        <div className='text-center'>
          <p className='text-sm text-text-secondary'>Informations de maintenance non disponibles.</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
