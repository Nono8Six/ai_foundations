import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section className='relative pt-20 pb-16 lg:pt-24 lg:pb-20 bg-gradient-to-br from-primary-50 via-surface to-accent-50 overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-secondary rounded-full blur-3xl'></div>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center lg:text-left'
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6'
            >
              <Icon name='Sparkles' size={16} className='mr-2' />
              Formation IA de nouvelle génération
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight'
            >
              Maîtrisez l'
              <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                Intelligence Artificielle
              </span>
              <br />
              dès aujourd'hui
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-xl text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0'
            >
              Transformez votre carrière avec notre plateforme d'apprentissage IA complète. De
              débutant à expert, découvrez comment l'IA peut révolutionner votre productivité
              professionnelle.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'
            >
              {!user ? (
                <Link
                  to='/register'
                  className='inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-medium hover:shadow-lg hover:-translate-y-0.5 group'
                >
                  <Icon
                    name='Play'
                    size={20}
                    className='mr-2 group-hover:scale-110 transition-transform duration-200'
                  />
                  Commencer maintenant
                </Link>
              ) : (
                <Link
                  to='/user-dashboard'
                  className='inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-medium hover:shadow-lg hover:-translate-y-0.5 group'
                >
                  <Icon
                    name='Play'
                    size={20}
                    className='mr-2 group-hover:scale-110 transition-transform duration-200'
                  />
                  Accéder à mon tableau de bord
                </Link>
              )}

              <Link
                to='/program-overview'
                className='inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-200 group'
              >
                <Icon
                  name='BookOpen'
                  size={20}
                  className='mr-2 group-hover:scale-110 transition-transform duration-200'
                />
                En savoir plus
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border'
            >
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-primary'>15K+</div>
                <div className='text-sm text-text-secondary'>Étudiants actifs</div>
              </div>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-primary'>95%</div>
                <div className='text-sm text-text-secondary'>Taux de satisfaction</div>
              </div>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-primary'>50+</div>
                <div className='text-sm text-text-secondary'>Modules de formation</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Video/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='relative'
          >
            <div className='relative bg-surface rounded-2xl shadow-lg overflow-hidden'>
              {/* Video Placeholder */}
              <div className='aspect-video bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className='w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200'
                >
                  <Icon name='Play' size={32} />
                </motion.button>
              </div>

              {/* Video Info */}
              <div className='p-6'>
                <h3 className='text-lg font-semibold text-text-primary mb-2'>
                  Présentation de la formation IA
                </h3>
                <p className='text-text-secondary text-sm'>
                  Découvrez comment notre programme peut transformer votre approche professionnelle
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className='absolute -top-4 -right-4 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-lg'
            >
              <Icon name='Zap' size={24} />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className='absolute -bottom-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg'
            >
              <Icon name='Star' size={20} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
