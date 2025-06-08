import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealth = () => {
  const systemMetrics = [
    {
      id: 1,
      name: 'Serveur principal',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '12ms',
      icon: 'Server'
    },
    {
      id: 2,
      name: 'Base de données',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '8ms',
      icon: 'Database'
    },
    {
      id: 3,
      name: 'CDN',
      status: 'warning',
      uptime: '98.5%',
      responseTime: '45ms',
      icon: 'Globe'
    },
    {
      id: 4,
      name: 'API Gateway',
      status: 'healthy',
      uptime: '99.7%',
      responseTime: '15ms',
      icon: 'Wifi'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-success-50';
      case 'warning':
        return 'bg-warning-50';
      case 'error':
        return 'bg-error-50';
      default:
        return 'bg-secondary-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">État du système</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-success font-medium">Opérationnel</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {systemMetrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getStatusBg(metric.status)}`}>
                <Icon 
                  name={metric.icon} 
                  size={16} 
                  className={getStatusColor(metric.status)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{metric.name}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-text-secondary">
                    Uptime: {metric.uptime}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Réponse: {metric.responseTime}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`p-1 rounded-full ${getStatusBg(metric.status)}`}>
              <Icon 
                name={getStatusIcon(metric.status)} 
                size={16} 
                className={getStatusColor(metric.status)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Dernière vérification</span>
          <span className="text-text-primary font-medium">Il y a 2 minutes</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-text-secondary">Prochaine maintenance</span>
          <span className="text-text-primary font-medium">Dimanche 3h00</span>
        </div>
      </div>
      
      <button className="w-full mt-4 px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors duration-200">
        Voir les détails système
      </button>
    </div>
  );
};

export default SystemHealth;