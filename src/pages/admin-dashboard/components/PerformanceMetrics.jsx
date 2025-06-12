import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ metrics }) => {
  const performanceData = [
    {
      id: 1,
      title: 'Temps de réponse API',
      value: '127ms',
      status: 'excellent',
      icon: 'Zap',
      description: 'Moyenne sur 24h',
    },
    {
      id: 2,
      title: 'Disponibilité système',
      value: metrics.systemUptime,
      status: 'excellent',
      icon: 'Shield',
      description: 'Uptime mensuel',
    },
    {
      id: 3,
      title: 'Requêtes/seconde',
      value: '2,847',
      status: 'good',
      icon: 'Activity',
      description: 'Pic actuel',
    },
    {
      id: 4,
      title: 'Utilisation CPU',
      value: '34%',
      status: 'good',
      icon: 'Cpu',
      description: 'Serveur principal',
    },
    {
      id: 5,
      title: 'Utilisation mémoire',
      value: '67%',
      status: 'warning',
      icon: 'HardDrive',
      description: 'RAM système',
    },
    {
      id: 6,
      title: 'Stockage utilisé',
      value: '1.2TB',
      status: 'good',
      icon: 'Database',
      description: 'Sur 5TB total',
    },
    {
      id: 7,
      title: 'Sessions actives',
      value: '8,932',
      status: 'excellent',
      icon: 'Users',
      description: 'Utilisateurs connectés',
    },
    {
      id: 8,
      title: 'Erreurs 5xx',
      value: '0.02%',
      status: 'excellent',
      icon: 'AlertTriangle',
      description: "Taux d'erreur",
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-primary';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusBg = status => {
    switch (status) {
      case 'excellent':
        return 'bg-success-50';
      case 'good':
        return 'bg-primary-50';
      case 'warning':
        return 'bg-warning-50';
      case 'error':
        return 'bg-error-50';
      default:
        return 'bg-secondary-50';
    }
  };

  const getStatusIndicator = status => {
    switch (status) {
      case 'excellent':
        return 'bg-success';
      case 'good':
        return 'bg-primary';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-secondary-400';
    }
  };

  return (
    <div className='bg-surface rounded-lg p-6 shadow-subtle border border-border'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>Métriques système</h3>
          <p className='text-sm text-text-secondary'>Performance en temps réel</p>
        </div>
        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-1'>
            <div className='w-2 h-2 bg-success rounded-full animate-pulse'></div>
            <span className='text-xs text-text-secondary'>En ligne</span>
          </div>
          <button className='p-1 rounded-md hover:bg-secondary-100 transition-colors'>
            <Icon name='Settings' size={16} className='text-text-secondary' />
          </button>
        </div>
      </div>

      <div className='space-y-4 max-h-80 overflow-y-auto'>
        {performanceData.map(metric => (
          <div
            key={metric.id}
            className={`p-4 rounded-lg border transition-colors ${getStatusBg(metric.status)}`}
          >
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center space-x-3'>
                <div className={`p-2 rounded-lg ${getStatusBg(metric.status)}`}>
                  <Icon name={metric.icon} size={16} className={getStatusColor(metric.status)} />
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
                    {metric.status === 'excellent'
                      ? 'Excellent'
                      : metric.status === 'good'
                        ? 'Bon'
                        : metric.status === 'warning'
                          ? 'Attention'
                          : 'Erreur'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 pt-4 border-t border-border'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center'>
            <p className='text-sm text-text-secondary'>Dernière vérification</p>
            <p className='text-sm font-medium text-text-primary'>Il y a 30 secondes</p>
          </div>
          <div className='text-center'>
            <p className='text-sm text-text-secondary'>Prochaine maintenance</p>
            <p className='text-sm font-medium text-text-primary'>Dans 3 jours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
