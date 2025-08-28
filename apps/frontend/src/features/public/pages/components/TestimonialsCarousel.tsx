import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Icon from '@shared/components/AppIcon';
import Image from '@shared/components/AppImage';

const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const testimonials = [
    {
      id: 1,
      name: 'Marie Dubois',
      role: 'Expert-comptable',
      company: 'Cabinet Dubois & Associés',
      age: 45,
      avatar: 'https://ui-avatars.com/api/?name=Marie+Dubois&background=3b82f6&color=ffffff',
      content: `Grâce à AI Foundations, j'ai automatisé 60% de mes tâches comptables. 
      
      La formation sur l'IA pour la comptabilité m'a permis d'implémenter des solutions d'OCR et d'analyse automatique des factures. Mon cabinet a gagné en efficacité et mes clients apprécient la rapidité de traitement.`,
      rating: 5,
      course: 'IA pour la Comptabilité',
      results: '60% de gain de temps',
      beforeAfter: {
        before: '8h/jour de saisie manuelle',
        after: '3h/jour avec automatisation',
      },
    },
    {
      id: 2,
      name: 'Jean-Pierre Martin',
      role: 'Directeur Commercial',
      company: 'TechSolutions SARL',
      age: 52,
      avatar: 'https://ui-avatars.com/api/?name=Jean-Pierre+Martin&background=10b981&color=ffffff',
      content: `À 52 ans, je pensais qu'il était trop tard pour apprendre l'IA. AI Foundations m'a prouvé le contraire ! La formation est progressive et adaptée aux professionnels expérimentés. J'ai maintenant des chatbots qui gèrent 70% de nos demandes clients.`,
      rating: 5,
      course: 'IA et Commerce Digital',
      results: "70% d'automatisation client",
      beforeAfter: {
        before: 'Réponses manuelles 24h',
        after: 'Réponses instantanées 24/7',
      },
    },
    {
      id: 3,
      name: 'Sophie Chen',
      role: 'Analyste Financière',
      company: 'InvestCorp',
      age: 29,
      avatar: 'https://ui-avatars.com/api/?name=Sophie+Chen&background=8b5cf6&color=ffffff',
      content: `La formation en IA pour la finance a révolutionné mon approche de l'analyse des risques. 
      
      Les modèles prédictifs que j'ai appris à développer nous ont permis d'identifier des opportunités d'investissement avec une précision de 85%. Un ROI exceptionnel !`,
      rating: 5,
      course: 'IA pour la Finance',
      results: '85% de précision prédictive',
      beforeAfter: {
        before: 'Analyses manuelles 2 jours',
        after: 'Analyses automatisées 2h',
      },
    },
    {
      id: 4,
      name: 'Robert Lefebvre',
      role: 'Responsable Maintenance',
      company: 'Industrie Plus',
      age: 58,
      avatar: 'https://ui-avatars.com/api/?name=Robert+Lefebvre&background=f59e0b&color=ffffff',
      content: `Proche de la retraite, j'ai voulu me former à l'IA pour transmettre des compétences modernes à mon équipe. 
      
      La maintenance prédictive nous a permis de réduire les pannes de 40% et d'optimiser nos coûts. Une formation accessible même pour les seniors !`,
      rating: 5,
      course: "Maintenance Prédictive avec l'IA",
      results: '40% de réduction des pannes',
      beforeAfter: {
        before: 'Maintenance corrective',
        after: 'Maintenance prédictive',
      },
    },
    {
      id: 5,
      name: 'Amélie Rousseau',
      role: 'Entrepreneure',
      company: 'StartUp Innovante',
      age: 26,
      avatar: 'https://ui-avatars.com/api/?name=Amélie+Rousseau&background=ec4899&color=ffffff',
      content: `En tant que jeune entrepreneure, l'IA était essentielle pour rester compétitive. AI Foundations m'a donné les clés pour intégrer l'IA dans tous les aspects de mon business. De la relation client à l'optimisation des processus, tout est automatisé !`,
      rating: 5,
      course: "Fondamentaux de l'IA",
      results: 'Business 100% optimisé',
      beforeAfter: {
        before: 'Gestion manuelle complète',
        after: 'Automatisation intelligente',
      },
    },
  ];

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length, paused, reduceMotion]);

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const currentTestimonial = testimonials[currentIndex];
  
  if (!currentTestimonial) {
    return null; // ou un loading state
  }

  return (
    <section
      className='py-16 lg:py-20 bg-surface'
      role='region'
      aria-roledescription='carousel'
      aria-label='Témoignages étudiants'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <div className='inline-flex items-center px-4 py-2 bg-success-100 text-success-700 rounded-full text-sm font-medium mb-6'>
            <Icon aria-hidden='true' name='MessageSquare' size={16} className='mr-2' />
            Témoignages de réussite
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold text-text-primary mb-6'>
            Ils ont transformé leur carrière
          </h2>
          <p className='text-xl text-text-secondary max-w-3xl mx-auto'>
            Découvrez comment nos étudiants de tous âges ont révolutionné leur approche
            professionnelle grâce à l&rsquo;IA
          </p>
        </motion.div>

        {/* Controls */}
        <div className='flex justify-end -mt-8 mb-4'>
          <button
            onClick={() => setPaused(p => !p)}
            className='inline-flex items-center px-3 py-1.5 text-sm rounded-md border bg-surface hover:bg-secondary-50 transition-colors'
            aria-pressed={paused}
            aria-label={paused ? 'Relancer le carrousel' : 'Mettre le carrousel en pause'}
          >
            <Icon aria-hidden='true' name={paused ? 'Play' : 'Pause'} size={14} className='mr-2' />
            {paused ? 'Lecture' : 'Pause'}
          </button>
        </div>

        {/* Testimonial Carousel */}
        <div className='relative'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className='bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 lg:p-12'
            >
              <div className='grid lg:grid-cols-2 gap-8 items-center'>
                {/* Testimonial Content */}
                <div>
                  {/* Rating */}
                  <div className='flex items-center mb-6'>
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Icon
                        aria-hidden='true'
                        key={i}
                        name='Star'
                        size={20}
                        className='text-warning fill-current'
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className='text-lg lg:text-xl text-text-primary mb-6 leading-relaxed'>
                    <Icon aria-hidden='true' name='Quote' size={24} className='text-primary mb-4' />
                    {currentTestimonial.content}
                  </blockquote>

                  {/* Author Info */}
                  <div className='flex items-center mb-6'>
                    <div className='w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary'>
                      <Image
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h4 className='text-lg font-semibold text-text-primary'>
                        {currentTestimonial.name}
                      </h4>
                      <p className='text-text-secondary'>
                        {currentTestimonial.role} • {currentTestimonial.age} ans
                      </p>
                      <p className='text-sm text-primary font-medium'>
                        {currentTestimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className='bg-surface rounded-lg p-4 border border-border'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium text-text-secondary'>
                        Formation suivie
                      </span>
                      <Icon aria-hidden='true' name='BookOpen' size={16} className='text-primary' />
                    </div>
                    <p className='font-semibold text-primary'>{currentTestimonial.course}</p>
                  </div>
                </div>

                {/* Results & Stats */}
                <div className='space-y-6'>
                  {/* Main Result */}
                  <div className='bg-surface rounded-xl p-6 text-center border border-border shadow-subtle'>
                    <Icon
                      aria-hidden='true'
                      name='TrendingUp'
                      size={32}
                      className='text-accent mx-auto mb-4'
                    />
                    <h3 className='text-2xl font-bold text-text-primary mb-2'>
                      Résultat principal
                    </h3>
                    <p className='text-xl font-semibold text-accent'>
                      {currentTestimonial.results}
                    </p>
                  </div>

                  {/* Before/After */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-error-50 rounded-lg p-4 text-center border border-error-200'>
                      <Icon
                        aria-hidden='true'
                        name='X'
                        size={20}
                        className='text-error mx-auto mb-2'
                      />
                      <p className='text-sm font-medium text-error-700 mb-1'>Avant</p>
                      <p className='text-xs text-error-600'>
                        {currentTestimonial.beforeAfter.before}
                      </p>
                    </div>
                    <div className='bg-success-50 rounded-lg p-4 text-center border border-success-200'>
                      <Icon
                        aria-hidden='true'
                        name='Check'
                        size={20}
                        className='text-success mx-auto mb-2'
                      />
                      <p className='text-sm font-medium text-success-700 mb-1'>Après</p>
                      <p className='text-xs text-success-600'>
                        {currentTestimonial.beforeAfter.after}
                      </p>
                    </div>
                  </div>

                  {/* Age Group Badge */}
                  <div className='text-center'>
                    <span className='inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium'>
                      <Icon aria-hidden='true' name='Users' size={16} className='mr-2' />
                      {currentTestimonial.age < 30
                        ? 'Jeune professionnel'
                        : currentTestimonial.age < 50
                          ? 'Professionnel expérimenté'
                          : 'Senior expert'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className='absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-secondary-50 transition-colors duration-200'
            aria-label='Témoignage précédent'
          >
            <Icon aria-hidden='true' name='ChevronLeft' size={20} />
          </button>

          <button
            onClick={nextTestimonial}
            className='absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-secondary-50 transition-colors duration-200'
            aria-label='Témoignage suivant'
          >
            <Icon aria-hidden='true' name='ChevronRight' size={20} />
          </button>
        </div>

        {/* Indicators */}
        <div className='flex justify-center mt-8 space-x-2'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-primary' : 'bg-secondary-300'
              }`}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border'
        >
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>95%</div>
            <div className='text-sm text-text-secondary'>Taux de satisfaction</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-accent mb-2'>15K+</div>
            <div className='text-sm text-text-secondary'>Étudiants formés</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-warning mb-2'>340%</div>
            <div className='text-sm text-text-secondary'>ROI moyen</div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary mb-2'>87%</div>
            <div className='text-sm text-text-secondary'>Obtiennent leur certification</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
