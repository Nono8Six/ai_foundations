import React, { useState, useEffect } from 'react';
import { log } from '@libs/logger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import Icon from '@shared/components/AppIcon';
import { XPSourceEditor } from './components/XPSourceEditor';
import { AchievementEditor } from './components/AchievementEditor';
import { XPAutoValidator } from '../../../shared/services/xpAutoValidator';
import { 
  AdminXPService, 
  AdminXPSource, 
  AdminAchievement, 
  XPManagementStats 
} from '../../../shared/services/adminXpService';

// Re-export des types pour compatibilité
export type XPSource = AdminXPSource;
export type Achievement = AdminAchievement;

const XPManagementAdmin: React.FC = () => {
  const [xpSources, setXpSources] = useState<XPSource[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<XPSource | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showCreateAction, setShowCreateAction] = useState(false);
  const [showCreateAchievement, setShowCreateAchievement] = useState(false);
  const [stats, setStats] = useState<XPManagementStats>({
    totalActions: 0,
    activeActions: 0,
    totalAchievements: 0,
    activeAchievements: 0,
    totalXPEarnedToday: 0,
    newAchievementsUnlocked: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { actions, achievements, stats } = await AdminXPService.fetchXPManagementData();
      
      setXpSources(actions);
      setAchievements(achievements);
      setStats(stats);

      log.info('XP Management data refreshed successfully');
    } catch (error) {
      log.error('Error fetching XP management data:', error);
      // Optionnel: afficher une notification d'erreur à l'utilisateur
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAction = async (action: XPSource) => {
    try {
      await AdminXPService.saveXPSource(action);
      await fetchData();
      setSelectedAction(null);
      setShowCreateAction(false);
      log.info('Action saved successfully');
    } catch (error) {
      log.error('Error saving action:', error);
      alert('Erreur lors de la sauvegarde de l\'action');
    }
  };

  const handleDeleteAchievement = async (achievement: Achievement) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet achievement ?')) return;

    try {
      await AdminXPService.deleteAchievement(achievement);
      await fetchData();
      log.info('Achievement deleted successfully');
    } catch (error) {
      log.error('Error deleting achievement:', error);
      alert('Erreur lors de la suppression de l\'achievement');
    }
  };

  const handleToggleAchievement = async (achievement: Achievement) => {
    try {
      await AdminXPService.toggleAchievement(achievement);
      await fetchData();
      log.info('Achievement toggled successfully', {
        achievementKey: achievement.achievement_key,
        newState: !achievement.is_active
      });
    } catch (error) {
      log.error('Error toggling achievement:', error);
      alert('Erreur lors de la modification de l\'achievement');
    }
  };

  const handleDeleteAction = async (action: XPSource) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette action ?')) return;

    try {
      await AdminXPService.deleteXPSource(action);
      await fetchData();
      log.info('XP Source deleted successfully');
    } catch (error) {
      log.error('Error deleting action:', error);
      alert('Erreur lors de la suppression de l\'action');
    }
  };

  const handleToggleAction = async (action: XPSource) => {
    try {
      // Si on désactive une source, vérifier l'impact utilisateur
      if (action.is_active && action.usage_count && action.usage_count > 0) {
        const impact = await AdminXPService.getSourceDeactivationImpact(
          action.source_type, 
          action.action_type
        );

        if (impact.affectedUsers > 0) {
          const confirmMessage = `⚠️ ATTENTION - Impact utilisateur détecté ⚠️

Cette action va désactiver "${action.title}" (${action.source_type}:${action.action_type})

📊 IMPACT:
• ${impact.affectedUsers} utilisateur(s) affecté(s)
• ${impact.totalXPImpact} XP total déjà distribué
• Usage actuel: ${action.usage_count} fois

🔄 VOULEZ-VOUS SOUSTRAIRE LES XP DÉJÀ GAGNÉS ?

✅ OUI = Les utilisateurs perdent les XP de cette source
❌ NON = Les utilisateurs gardent leurs XP (recommandé)

Confirmer la désactivation avec soustraction XP ?`;

          const shouldRecalculate = confirm(confirmMessage);
          
          if (shouldRecalculate) {
            // Double confirmation pour action irréversible
            const finalConfirm = confirm(
              `🚨 DERNIÈRE CONFIRMATION 🚨\n\n` +
              `Cette action va SOUSTRAIRE définitivement ${impact.totalXPImpact} XP ` +
              `chez ${impact.affectedUsers} utilisateur(s).\n\n` +
              `Cette opération est IRRÉVERSIBLE.\n\n` +
              `Êtes-vous absolument certain ?`
            );
            
            if (!finalConfirm) {
              return; // Annuler complètement
            }
          }

          await AdminXPService.toggleXPSource(action, { 
            recalculateUserXP: shouldRecalculate 
          });

          if (shouldRecalculate) {
            alert(`✅ Action désactivée et ${impact.totalXPImpact} XP soustraits chez ${impact.affectedUsers} utilisateur(s)`);
          } else {
            alert('✅ Action désactivée (XP utilisateurs conservés)');
          }
        } else {
          // Pas d'impact utilisateur, toggle simple
          await AdminXPService.toggleXPSource(action);
        }
      } else {
        // Activation ou aucun usage, toggle simple
        await AdminXPService.toggleXPSource(action);
      }

      await fetchData();
      
      log.info('XP Source toggled successfully', {
        sourceType: action.source_type,
        actionType: action.action_type,
        newState: !action.is_active,
        hadImpact: action.is_active && (action.usage_count || 0) > 0
      });

    } catch (error) {
      log.error('Error toggling action:', error);
      alert(`Erreur lors de la modification de l'action: ${(error as Error).message}`);
    }
  };

  const handleAutoValidateAchievements = async () => {
    try {
      await XPAutoValidator.validateAllUsers();
      await fetchData(); // Refresh data
      alert('Auto-validation des achievements terminée !');
    } catch (error) {
      log.error('Error auto-validating achievements:', error);
      alert('Erreur lors de l\'auto-validation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600">Chargement des données XP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-3 sm:p-6">
        {/* Header - Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Gestion XP &amp; Achievements
              </h1>
              <p className="text-gray-600">
                Interface complète de gestion du système de gamification
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleAutoValidateAchievements} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium"
              >
                <Icon name="Play" size={16} />
                <span className="hidden sm:inline">Auto-valider Achievements</span>
                <span className="sm:hidden">Auto-valider</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Actions Totales</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalActions}</p>
                </div>
                <Icon name="Zap" className="text-blue-500" size={20} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Actions Actives</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.activeActions}</p>
                </div>
                <Icon name="CheckCircle" className="text-green-500" size={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Achievements</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalAchievements}</p>
                </div>
                <Icon name="Award" className="text-purple-500" size={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Achievements Actifs</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.activeAchievements}</p>
                </div>
                <Icon name="Trophy" className="text-amber-500" size={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">XP Aujourd&apos;hui</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalXPEarnedToday}</p>
                </div>
                <Icon name="Star" className="text-yellow-500" size={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Nouveaux Unlocks</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.newAchievementsUnlocked}</p>
                </div>
                <Icon name="Unlock" className="text-emerald-500" size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="actions" className="space-y-4 sm:space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="actions" className="flex-1 sm:flex-initial">
              <Icon name="Zap" size={16} />
              <span className="hidden sm:inline">Actions XP ({stats.activeActions})</span>
              <span className="sm:hidden">Actions ({stats.activeActions})</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1 sm:flex-initial">
              <Icon name="Award" size={16} />
              <span className="hidden sm:inline">Achievements ({stats.activeAchievements})</span>
              <span className="sm:hidden">Achievements ({stats.activeAchievements})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Actions XP</CardTitle>
                    <CardDescription className="text-sm">
                      Gérez les actions répétables qui donnent de l&apos;XP aux utilisateurs
                    </CardDescription>
                  </div>
                  <button 
                    onClick={() => setShowCreateAction(true)} 
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                  >
                    <Icon name="Plus" size={16} />
                    <span className="hidden sm:inline">Nouvelle Action</span>
                    <span className="sm:hidden">Ajouter</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Vue Mobile - Cartes élégantes */}
                <div className="block lg:hidden space-y-4">
                  {xpSources.map((action) => (
                    <div key={action.id} className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                          <h3 className="font-semibold text-gray-800 text-base leading-tight mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-500 font-mono">{action.source_type}:{action.action_type}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                            <span>{action.is_repeatable ? 'Répétable' : 'Une fois'}</span>
                            <span>• Usage: {action.usage_count || 0}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                            {action.xp_value} XP
                          </div>
                          {action.is_active ? (
                            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">Actif</div>
                          ) : (
                            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Inactif</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button 
                          onClick={() => setSelectedAction(action)}
                          className="flex-1 flex items-center justify-center py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                          title="Modifier"
                        >
                          <Icon name="Edit" size={18} />
                        </button>
                        <button 
                          onClick={() => handleToggleAction(action)}
                          className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg transition-all duration-200 text-white ${
                            action.is_active 
                              ? 'bg-amber-500 hover:bg-amber-600' 
                              : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                          title={action.is_active ? 'Mettre en pause' : 'Activer'}
                        >
                          <Icon name={action.is_active ? "Pause" : "Play"} size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAction(action)}
                          className="flex-1 flex items-center justify-center py-2.5 px-3 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all duration-200"
                          title="Supprimer"
                        >
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vue Desktop - Tableau élégant sans scroll horizontal */}
                <div className="hidden lg:block">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                      <div className="col-span-4">Action</div>
                      <div className="col-span-2">XP</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-1">Usage</div>
                      <div className="col-span-3">Actions</div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {xpSources.map((action, index) => (
                        <div key={action.id} className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                        }`}>
                          <div className="col-span-4">
                            <div className="font-medium text-gray-900 mb-1">{action.title}</div>
                            <div className="text-sm text-gray-500 font-mono">{action.source_type}:{action.action_type}</div>
                          </div>
                          
                          <div className="col-span-2 flex items-center">
                            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                              {action.xp_value} XP
                            </div>
                          </div>
                          
                          <div className="col-span-2 flex items-center gap-2">
                            {action.is_repeatable ? (
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Répétable</div>
                            ) : (
                              <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">Une fois</div>
                            )}
                            {action.is_active ? (
                              <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">Actif</div>
                            ) : (
                              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">Inactif</div>
                            )}
                          </div>
                          
                          <div className="col-span-1 flex items-center text-sm text-gray-600">
                            {action.usage_count || 0}
                          </div>
                          
                          <div className="col-span-3 flex items-center gap-1.5">
                            <button 
                              onClick={() => setSelectedAction(action)}
                              className="flex items-center justify-center w-9 h-9 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                              title="Modifier"
                            >
                              <Icon name="Edit" size={16} />
                            </button>
                            <button 
                              onClick={() => handleToggleAction(action)}
                              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 text-white ${
                                action.is_active 
                                  ? 'bg-amber-500 hover:bg-amber-600' 
                                  : 'bg-emerald-500 hover:bg-emerald-600'
                              }`}
                              title={action.is_active ? 'Mettre en pause' : 'Activer'}
                            >
                              <Icon name={action.is_active ? "Pause" : "Play"} size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAction(action)}
                              className="flex items-center justify-center w-9 h-9 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all duration-200"
                              title="Supprimer"
                            >
                              <Icon name="Trash2" size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Achievements</CardTitle>
                    <CardDescription className="text-sm">
                      Gérez les objectifs uniques que les utilisateurs peuvent débloquer
                    </CardDescription>
                  </div>
                  <button 
                    onClick={() => setShowCreateAchievement(true)} 
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                  >
                    <Icon name="Plus" size={16} />
                    <span className="hidden sm:inline">Nouvel Achievement</span>
                    <span className="sm:hidden">Ajouter</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Vue Mobile - Cartes élégantes */}
                <div className="block lg:hidden space-y-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                          <h3 className="font-semibold text-gray-800 text-base leading-tight mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-500 font-mono">{achievement.achievement_key}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                            <span>Unlocks: {achievement.usage_count || 0}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {achievement.xp_reward} XP
                          </div>
                          {achievement.is_active ? (
                            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">Actif</div>
                          ) : (
                            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Inactif</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t border-purple-200">
                        <button 
                          onClick={() => setSelectedAchievement(achievement)}
                          className="flex-1 flex items-center justify-center py-2.5 px-3 bg-white border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
                          title="Modifier"
                        >
                          <Icon name="Edit" size={18} />
                        </button>
                        <button 
                          onClick={() => handleToggleAchievement(achievement)}
                          className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg transition-all duration-200 text-white ${
                            achievement.is_active 
                              ? 'bg-amber-500 hover:bg-amber-600' 
                              : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                          title={achievement.is_active ? 'Mettre en pause' : 'Activer'}
                        >
                          <Icon name={achievement.is_active ? "Pause" : "Play"} size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAchievement(achievement)}
                          className="flex-1 flex items-center justify-center py-2.5 px-3 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all duration-200"
                          title="Supprimer"
                        >
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vue Desktop - Grille élégante sans scroll horizontal */}
                <div className="hidden lg:block">
                  <div className="bg-white rounded-xl border border-purple-200 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-purple-50 border-b border-purple-200 text-sm font-semibold text-gray-700">
                      <div className="col-span-4">Achievement</div>
                      <div className="col-span-2">XP Reward</div>
                      <div className="col-span-2">Statut</div>
                      <div className="col-span-1">Unlocks</div>
                      <div className="col-span-3">Actions</div>
                    </div>
                    
                    <div className="divide-y divide-purple-100">
                      {achievements.map((achievement, index) => (
                        <div key={achievement.id} className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-purple-25 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-purple-25'
                        }`}>
                          <div className="col-span-4">
                            <div className="font-medium text-gray-900 mb-1">{achievement.title}</div>
                            <div className="text-sm text-gray-500 font-mono">{achievement.achievement_key}</div>
                          </div>
                          
                          <div className="col-span-2 flex items-center">
                            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                              {achievement.xp_reward} XP
                            </div>
                          </div>
                          
                          <div className="col-span-2 flex items-center">
                            {achievement.is_active ? (
                              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Actif</div>
                            ) : (
                              <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">Inactif</div>
                            )}
                          </div>
                          
                          <div className="col-span-1 flex items-center text-sm text-gray-600">
                            {achievement.usage_count || 0}
                          </div>
                          
                          <div className="col-span-3 flex items-center gap-1.5">
                            <button 
                              onClick={() => setSelectedAchievement(achievement)}
                              className="flex items-center justify-center w-9 h-9 bg-white border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
                              title="Modifier"
                            >
                              <Icon name="Edit" size={16} />
                            </button>
                            <button 
                              onClick={() => handleToggleAchievement(achievement)}
                              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 text-white ${
                                achievement.is_active 
                                  ? 'bg-amber-500 hover:bg-amber-600' 
                                  : 'bg-emerald-500 hover:bg-emerald-600'
                              }`}
                              title={achievement.is_active ? 'Mettre en pause' : 'Activer'}
                            >
                              <Icon name={achievement.is_active ? "Pause" : "Play"} size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAchievement(achievement)}
                              className="flex items-center justify-center w-9 h-9 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all duration-200"
                              title="Supprimer"
                            >
                              <Icon name="Trash2" size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs pour l'édition */}
        {(selectedAction || showCreateAction) && (
          <XPSourceEditor
            action={selectedAction}
            isOpen={!!(selectedAction || showCreateAction)}
            onSave={handleSaveAction}
            onCancel={() => {
              setSelectedAction(null);
              setShowCreateAction(false);
            }}
          />
        )}

        {(selectedAchievement || showCreateAchievement) && (
          <AchievementEditor
            achievement={selectedAchievement}
            isOpen={!!(selectedAchievement || showCreateAchievement)}
            onSave={async (_achievement) => {
              // Handle save achievement
              setSelectedAchievement(null);
              setShowCreateAchievement(false);
              await fetchData();
            }}
            onCancel={() => {
              setSelectedAchievement(null);
              setShowCreateAchievement(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default XPManagementAdmin;