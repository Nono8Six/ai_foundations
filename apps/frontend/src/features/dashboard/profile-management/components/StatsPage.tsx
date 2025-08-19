/**
 * Stats Page - Dashboard gamifié motivant et engageant
 * 
 * Focus sur :
 * - Objectifs en premier pour motiver
 * - Recommandations XP depuis xp_sources (ZÉRO donnée hardcodée)
 * - Historique XP avec meilleure UX
 * - Design moderne et responsive
 * - ARCHITECTURE ULTRA-PRO: Toutes données depuis DB
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@features/auth/contexts/AuthContext';

// Services  
import { XPAdapter, type XPOpportunity, type UILevelInfo as LevelInfo } from '@shared/services/xp-adapter';

// Composants
import Icon from '@shared/components/AppIcon';
import AchievementsGrid from './AchievementsGrid';

const StatsPage: React.FC = () => {
  const { userProfile } = useAuth();
  
  // État pour les opportunités XP depuis DB (remplace données hardcodées)
  const [xpOpportunities, setXpOpportunities] = useState<XPOpportunity[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentXP = userProfile?.xp || 0;

  // Chargement données XP et niveau depuis DB (ZÉRO logique hardcodée)
  useEffect(() => {
    const loadData = async () => {
      if (!userProfile?.id) return;
      
      setIsLoading(true);
      try {
        // Charger en parallèle les opportunités XP et les infos de niveau
        const [opportunities, levelInformation] = await Promise.all([
          XPAdapter.getTopXPOpportunities(userProfile.id, 3),
          XPAdapter.getLevelInfo(currentXP)
        ]);

        setXpOpportunities(opportunities);
        setLevelInfo(levelInformation);
      } catch (error) {
        console.error('Error loading XP data:', error);
        setXpOpportunities([]);
        setLevelInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userProfile?.id, currentXP]);

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader" className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Grille des achievements vraies basée sur la DB */}
      <AchievementsGrid />


      {/* Recommandations XP gamifiées - DEPUIS DB */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <Icon name="Zap" size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Comment gagner plus d'XP</h3>
            <p className="text-sm text-blue-600">Actions recommandées depuis notre base de règles XP</p>
          </div>
        </div>

        {/* Affichage des opportunités depuis DB */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader" className="animate-spin text-blue-500" size={24} />
          </div>
        ) : xpOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {xpOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-lg border border-blue-200 p-4 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Icon name={opportunity.icon} size={20} className="text-white" />
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    opportunity.xpValue > 0 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {opportunity.xpValue > 0 ? '+' : ''}{opportunity.xpValue} XP
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{opportunity.title}</h4>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{opportunity.description}</p>
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium py-2 px-3 rounded-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 group-hover:shadow-sm">
                  {opportunity.actionText}
                </button>
                {!opportunity.isRepeatable && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    Une fois seulement
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Zap" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune opportunité XP disponible pour le moment.</p>
            <p className="text-sm text-gray-500 mt-1">Revenez plus tard pour découvrir de nouvelles façons de gagner de l&apos;XP !</p>
          </div>
        )}
        
        {/* Motivation supplémentaire */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200">
            <Icon name="TrendingUp" size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">
              {levelInfo?.isMaxLevel 
                ? `Niveau maximum atteint: ${levelInfo.levelTitle}` 
                : `Prochain niveau dans ${levelInfo?.xpForNextLevel || 0} XP`}
            </span>
            <div className="w-12 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-700"
                style={{ width: `${Math.min(levelInfo?.progressPercent || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};

export default StatsPage;