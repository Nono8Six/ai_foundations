import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@frontend/components/AppIcon';

export interface CookieNoticeProps {
  onAccept: () => void;
}

const CookieNotice: React.FC<CookieNoticeProps> = ({ onAccept }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border shadow-lg'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex items-start space-x-3 flex-1'>
            <Icon aria-hidden="true"  name='Cookie' size={24} className='text-warning flex-shrink-0 mt-1' />
            <div>
              <h3 className='font-semibold text-text-primary mb-1'>Nous utilisons des cookies</h3>
              <p className='text-sm text-text-secondary leading-relaxed'>
                Ce site utilise des cookies pour améliorer votre expérience de navigation, analyser
                le trafic et personnaliser le contenu. En continuant à utiliser ce site, vous
                acceptez notre utilisation des cookies conformément au RGPD.
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-3 flex-shrink-0'>
            <button
              onClick={onAccept}
              className='px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center'
            >
              <Icon aria-hidden="true"  name='Check' size={16} className='mr-2' />
              Accepter
            </button>

            <button className='px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors duration-200 text-sm'>
              Paramètres
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CookieNotice;
