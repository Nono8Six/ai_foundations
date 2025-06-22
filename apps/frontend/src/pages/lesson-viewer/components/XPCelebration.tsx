import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const XPCelebration = ({ xpEarned, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('enter');

  useEffect(() => {
    setIsVisible(true);
    setAnimationPhase('enter');

    const timer1 = setTimeout(() => {
      setAnimationPhase('celebrate');
    }, 300);

    const timer2 = setTimeout(() => {
      setAnimationPhase('exit');
    }, 2500);

    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div
        className={`
        bg-surface rounded-2xl p-8 text-center max-w-sm mx-4 transform transition-all duration-500
        ${animationPhase === 'enter' ? 'scale-50 opacity-0' : ''}
        ${animationPhase === 'celebrate' ? 'scale-100 opacity-100' : ''}
        ${animationPhase === 'exit' ? 'scale-110 opacity-0' : ''}
      `}
      >
        {/* Celebration Icon */}
        <div className='relative mb-6'>
          <div
            className={`
            w-20 h-20 bg-gradient-to-br from-accent to-accent-700 rounded-full flex items-center justify-center mx-auto
            transform transition-transform duration-700
            ${animationPhase === 'celebrate' ? 'animate-bounce' : ''}
          `}
          >
            <Icon name='Trophy' size={32} color='white' />
          </div>

          {/* Sparkle Effects */}
          <div className='absolute inset-0 pointer-events-none'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 bg-warning rounded-full
                  ${animationPhase === 'celebrate' ? 'animate-ping' : 'opacity-0'}
                `}
                style={{
                  top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 30}%`,
                  left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 30}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Congratulations Text */}
        <h2 className='text-2xl font-bold text-text-primary mb-2'>Félicitations !</h2>

        <p className='text-text-secondary mb-6'>Vous avez terminé cette leçon avec succès</p>

        {/* XP Earned */}
        <div className='bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 mb-6'>
          <div className='flex items-center justify-center space-x-3'>
            <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
              <Icon name='Zap' size={20} color='white' />
            </div>
            <div>
              <p className='text-sm text-text-secondary'>XP gagné</p>
              <p className='text-2xl font-bold text-primary'>+{xpEarned}</p>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className='flex justify-center space-x-4 mb-6'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mb-1'>
              <Icon name='BookOpen' size={16} className='text-accent' />
            </div>
            <span className='text-xs text-text-secondary'>Leçon terminée</span>
          </div>

          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center mb-1'>
              <Icon name='Target' size={16} className='text-warning' />
            </div>
            <span className='text-xs text-text-secondary'>Objectif atteint</span>
          </div>

          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-1'>
              <Icon name='TrendingUp' size={16} className='text-primary' />
            </div>
            <span className='text-xs text-text-secondary'>Progression</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className='w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium'
        >
          Continuer l'apprentissage
        </button>
      </div>
    </div>
  );
};

export default XPCelebration;
