import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AchievementCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const achievements = [
    {
      id: 1,
      title: "Premier Pas",
      description: "Première leçon terminée",
      icon: "https://images.pixabay.com/photo/2017/01/13/01/22/achievement-1976395_1280.png",
      earned: true,
      earnedDate: "2024-01-15",
      rarity: "common",
      xpReward: 50
    },
    {
      id: 2,
      title: "Apprenant Assidu",
      description: "7 jours consécutifs d\'apprentissage",
      icon: "https://images.pixabay.com/photo/2017/01/13/01/22/achievement-1976395_1280.png",
      earned: true,
      earnedDate: "2024-02-01",
      rarity: "rare",
      xpReward: 200
    },
    {
      id: 3,
      title: "Maître IA",
      description: "Terminer le cours IA Fondamentale",
      icon: "https://images.pixabay.com/photo/2017/01/13/01/22/achievement-1976395_1280.png",
      earned: false,
      progress: 65,
      rarity: "epic",
      xpReward: 500
    },
    {
      id: 4,
      title: "Quiz Champion",
      description: "Réussir 10 quiz avec 90%+",
      icon: "https://images.pixabay.com/photo/2017/01/13/01/22/achievement-1976395_1280.png",
      earned: false,
      progress: 40,
      rarity: "rare",
      xpReward: 300
    },
    {
      id: 5,
      title: "Explorateur",
      description: "Commencer 5 cours différents",
      icon: "https://images.pixabay.com/photo/2017/01/13/01/22/achievement-1976395_1280.png",
      earned: true,
      earnedDate: "2024-01-28",
      rarity: "uncommon",
      xpReward: 150
    },
    {
      id: 6,
      title: "Perfectionniste",
      description: "Terminer un cours avec 100%",
      icon: "https://images.pixabay.com/photo/2017/01/13/01/22/achievement-1976395_1280.png",
      earned: false,
      progress: 85,
      rarity: "legendary",
      xpReward: 1000
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-secondary-300 bg-secondary-50';
      case 'uncommon': return 'border-success-300 bg-success-50';
      case 'rare': return 'border-primary-300 bg-primary-50';
      case 'epic': return 'border-warning-300 bg-warning-50';
      case 'legendary': return 'border-error-300 bg-error-50';
      default: return 'border-secondary-300 bg-secondary-50';
    }
  };

  const getRarityTextColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-secondary-600';
      case 'uncommon': return 'text-success-600';
      case 'rare': return 'text-primary-600';
      case 'epic': return 'text-warning-600';
      case 'legendary': return 'text-error-600';
      default: return 'text-secondary-600';
    }
  };

  const nextAchievement = () => {
    setCurrentIndex((prev) => (prev + 1) % achievements.length);
  };

  const prevAchievement = () => {
    setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  const currentAchievement = achievements[currentIndex];
  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Succès</h3>
        <span className="text-sm text-text-secondary">
          {earnedCount}/{achievements.length}
        </span>
      </div>

      {/* Achievement Card */}
      <div className={`relative rounded-lg border-2 p-4 mb-4 transition-all duration-300 ${getRarityColor(currentAchievement.rarity)}`}>
        {/* Earned Badge */}
        {currentAchievement.earned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <Icon name="Check" size={14} color="white" />
          </div>
        )}

        <div className="text-center">
          {/* Achievement Icon */}
          <div className={`w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ${currentAchievement.earned ? '' : 'opacity-50 grayscale'}`}>
            <Image 
              src={currentAchievement.icon}
              alt={currentAchievement.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Achievement Info */}
          <h4 className={`font-semibold mb-1 ${currentAchievement.earned ? 'text-text-primary' : 'text-text-secondary'}`}>
            {currentAchievement.title}
          </h4>
          <p className={`text-sm mb-2 ${currentAchievement.earned ? 'text-text-secondary' : 'text-text-secondary opacity-75'}`}>
            {currentAchievement.description}
          </p>

          {/* Rarity */}
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getRarityTextColor(currentAchievement.rarity)} bg-surface`}>
            {currentAchievement.rarity}
          </span>

          {/* Progress or Earned Date */}
          {currentAchievement.earned ? (
            <div className="mt-3">
              <p className="text-xs text-text-secondary">
                Obtenu le {new Date(currentAchievement.earnedDate).toLocaleDateString('fr-FR')}
              </p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Icon name="Plus" size={12} className="text-warning" />
                <span className="text-xs font-medium text-warning">{currentAchievement.xpReward} XP</span>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              {currentAchievement.progress && (
                <div>
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                    <span>Progression</span>
                    <span>{currentAchievement.progress}%</span>
                  </div>
                  <div className="bg-secondary-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${currentAchievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center space-x-1 mt-2">
                <Icon name="Gift" size={12} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">{currentAchievement.xpReward} XP à gagner</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={prevAchievement}
          className="p-2 rounded-full hover:bg-secondary-100 transition-colors"
          disabled={achievements.length <= 1}
        >
          <Icon name="ChevronLeft" size={16} className="text-text-secondary" />
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-1">
          {achievements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary' :'bg-secondary-300 hover:bg-secondary-400'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={nextAchievement}
          className="p-2 rounded-full hover:bg-secondary-100 transition-colors"
          disabled={achievements.length <= 1}
        >
          <Icon name="ChevronRight" size={16} className="text-text-secondary" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-text-primary">{earnedCount}</p>
            <p className="text-xs text-text-secondary">Obtenus</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {achievements.filter(a => a.earned).reduce((sum, a) => sum + a.xpReward, 0)}
            </p>
            <p className="text-xs text-text-secondary">XP des succès</p>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <button className="w-full mt-4 text-center text-primary hover:text-primary-700 transition-colors text-sm font-medium py-2 border border-primary rounded-lg hover:bg-primary-50">
        Voir tous les succès
      </button>
    </div>
  );
};

export default AchievementCarousel;