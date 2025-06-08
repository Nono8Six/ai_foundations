import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ExportModal = ({ isOpen, onClose, users }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    fields: {
      basicInfo: true,
      contactInfo: true,
      accountInfo: true,
      progressInfo: true,
      activityInfo: true,
      achievementsInfo: false
    },
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    includeInactive: true
  });

  if (!isOpen) return null;

  const exportFormats = [
    {
      id: 'csv',
      label: 'CSV',
      description: 'Format compatible avec Excel et autres tableurs',
      icon: 'FileSpreadsheet'
    },
    {
      id: 'json',
      label: 'JSON',
      description: 'Format structuré pour développeurs',
      icon: 'FileCode'
    },
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Rapport formaté pour impression',
      icon: 'FileText'
    }
  ];

  const fieldCategories = [
    {
      id: 'basicInfo',
      label: 'Informations de base',
      description: 'Nom, prénom, email',
      fields: ['Nom', 'Prénom', 'Email']
    },
    {
      id: 'contactInfo',
      label: 'Informations de contact',
      description: 'Localisation, département',
      fields: ['Localisation', 'Département', 'Téléphone']
    },
    {
      id: 'accountInfo',
      label: 'Informations du compte',
      description: 'Rôle, statut, dates',
      fields: ['Rôle', 'Statut', 'Date d\'inscription', 'Dernière connexion']
    },
    {
      id: 'progressInfo',
      label: 'Progression d\'apprentissage',
      description: 'Cours, modules, progression',
      fields: ['Cours inscrits', 'Cours terminés', 'Progression globale', 'Points XP']
    },
    {
      id: 'activityInfo',
      label: 'Activité récente',
      description: 'Dernières actions, temps passé',
      fields: ['Dernière activité', 'Temps total passé', 'Sessions cette semaine']
    },
    {
      id: 'achievementsInfo',
      label: 'Réussites et badges',
      description: 'Badges obtenus, certifications',
      fields: ['Badges obtenus', 'Certifications', 'Niveau atteint']
    }
  ];

  const handleFieldToggle = (fieldId) => {
    setExportConfig(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldId]: !prev.fields[fieldId]
      }
    }));
  };

  const handleExport = () => {
    // Simulate export process
    const selectedFields = Object.entries(exportConfig.fields)
      .filter(([_, selected]) => selected)
      .map(([fieldId, _]) => fieldId);

    console.log('Exporting users:', users.length);
    console.log('Format:', exportConfig.format);
    console.log('Selected fields:', selectedFields);
    console.log('Date range:', exportConfig.dateRange);
    console.log('Include inactive:', exportConfig.includeInactive);

    // Simulate file download
    const filename = `users_export_${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
    
    // In a real application, this would generate and download the actual file
    alert(`Export généré avec succès !\nFichier: ${filename}\nUtilisateurs: ${users.length}\nFormat: ${exportConfig.format.toUpperCase()}`);
    
    onClose();
  };

  const getSelectedFieldsCount = () => {
    return Object.values(exportConfig.fields).filter(Boolean).length;
  };

  return (
    <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Exporter les données utilisateurs</h2>
              <p className="text-text-secondary text-sm mt-1">
                {users.length} utilisateur(s) à exporter
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-all duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Format d'export</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setExportConfig(prev => ({ ...prev, format: format.id }))}
                  className={`flex items-start space-x-3 p-4 border rounded-lg text-left transition-all duration-200 ${
                    exportConfig.format === format.id
                      ? 'border-primary bg-primary-50' :'border-border hover:bg-secondary-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    exportConfig.format === format.id
                      ? 'bg-primary text-white' :'bg-secondary-100 text-text-secondary'
                  }`}>
                    <Icon name={format.icon} size={20} />
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      exportConfig.format === format.id ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {format.label}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">{format.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Champs à inclure</h3>
              <span className="text-sm text-text-secondary">
                {getSelectedFieldsCount()} catégorie(s) sélectionnée(s)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldCategories.map((category) => (
                <div
                  key={category.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    exportConfig.fields[category.id]
                      ? 'border-primary bg-primary-50' :'border-border hover:bg-secondary-50'
                  }`}
                >
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.fields[category.id]}
                      onChange={() => handleFieldToggle(category.id)}
                      className="mt-1 rounded border-border focus:ring-primary"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        exportConfig.fields[category.id] ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {category.label}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1">{category.description}</p>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {category.fields.map((field, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary-100 text-text-secondary"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Période d'activité</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dateRange"
                    value="all"
                    checked={exportConfig.dateRange === 'all'}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">Toute la période</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dateRange"
                    value="last30"
                    checked={exportConfig.dateRange === 'last30'}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">30 derniers jours</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dateRange"
                    value="last90"
                    checked={exportConfig.dateRange === 'last90'}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">90 derniers jours</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dateRange"
                    value="custom"
                    checked={exportConfig.dateRange === 'custom'}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">Période personnalisée</span>
                </label>
              </div>

              {exportConfig.dateRange === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-secondary-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={exportConfig.customStartDate}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, customStartDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={exportConfig.customEndDate}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, customEndDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Options supplémentaires</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={exportConfig.includeInactive}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, includeInactive: e.target.checked }))}
                  className="rounded border-border focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Inclure les utilisateurs inactifs</span>
                  <p className="text-xs text-text-secondary">Exporter également les comptes suspendus ou inactifs</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-secondary-50 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2">Aperçu de l'export</h4>
            <div className="text-sm text-text-secondary space-y-1">
              <p>• Format: {exportConfig.format.toUpperCase()}</p>
              <p>• Utilisateurs: {users.length}</p>
              <p>• Catégories de données: {getSelectedFieldsCount()}</p>
              <p>• Période: {
                exportConfig.dateRange === 'all' ? 'Toute la période' :
                exportConfig.dateRange === 'last30' ? '30 derniers jours' :
                exportConfig.dateRange === 'last90'? '90 derniers jours' : 'Période personnalisée'
              }</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-surface border-t border-border p-6 rounded-b-lg">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-lg transition-all duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              disabled={getSelectedFieldsCount() === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-subtle hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="Download" size={18} />
              <span>Générer l'export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;