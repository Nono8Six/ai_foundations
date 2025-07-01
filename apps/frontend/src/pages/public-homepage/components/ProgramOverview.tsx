import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '@frontend/components/AppIcon';
import Image from '@frontend/components/AppImage';

interface ProgramOverviewProps {}

const ProgramOverview: React.FC<ProgramOverviewProps> = () => {
  const courses = [
    {
      id: 1,
      title: "Fondamentaux de l'IA",
      description:
        "Découvrez les concepts de base de l'intelligence artificielle et ses applications pratiques dans le monde professionnel.",
      difficulty: 'Débutant',
      duration: '4 semaines',
      modules: 12,
      thumbnail:
        'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=400&h=250&fit=crop',
      category: 'Fondamentaux',
      rating: 4.8,
      students: 2340,
      highlights: ['Machine Learning', 'Réseaux de neurones', 'Applications pratiques'],
    },
    {
      id: 2,
      title: 'IA pour la Comptabilité',
      description:
        "Automatisez vos processus comptables avec l'IA. Apprenez à utiliser des outils d'automatisation pour optimiser votre productivité.",
      difficulty: 'Intermédiaire',
      duration: '6 semaines',
      modules: 18,
      thumbnail:
        'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?w=400&h=250&fit=crop',
      category: 'Spécialisé',
      rating: 4.9,
      students: 1890,
      highlights: ['Automatisation', 'OCR', 'Analyse de données'],
    },
    {
      id: 3,
      title: 'IA et Commerce Digital',
      description:
        "Révolutionnez votre stratégie commerciale avec l'IA. Personnalisation, prédiction des ventes et optimisation des prix.",
      difficulty: 'Intermédiaire',
      duration: '5 semaines',
      modules: 15,
      thumbnail:
        'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?w=400&h=250&fit=crop',
      category: 'Commerce',
      rating: 4.7,
      students: 1560,
      highlights: ['E-commerce', 'Chatbots', 'Analytics'],
    },
    {
      id: 4,
      title: 'IA Avancée et Deep Learning',
      description:
        "Maîtrisez les techniques avancées d'apprentissage profond et développez vos propres modèles d'IA.",
      difficulty: 'Avancé',
      duration: '8 semaines',
      modules: 24,
      thumbnail:
        'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?w=400&h=250&fit=crop',
      category: 'Avancé',
      rating: 4.9,
      students: 890,
      highlights: ['TensorFlow', 'PyTorch', 'Modèles personnalisés'],
    },
    {
      id: 5,
      title: 'IA pour la Finance',
      description:
        "Utilisez l'IA pour l'analyse financière, la détection de fraudes et la gestion des risques.",
      difficulty: 'Intermédiaire',
      duration: '6 semaines',
      modules: 20,
      thumbnail:
        'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?w=400&h=250&fit=crop',
      category: 'Finance',
      rating: 4.8,
      students: 1230,
      highlights: ['Analyse prédictive', 'Détection de fraudes', 'Trading algorithmique'],
    },
    {
      id: 6,
      title: "Maintenance Prédictive avec l'IA",
      description:
        "Optimisez la maintenance industrielle grâce aux algorithmes prédictifs et à l'IoT.",
      difficulty: 'Intermédiaire',
      duration: '5 semaines',
      modules: 16,
      thumbnail:
        'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?w=400&h=250&fit=crop',
      category: 'Industrie',
      rating: 4.6,
      students: 780,
      highlights: ['IoT', 'Capteurs', 'Algorithmes prédictifs'],
    },
  ];

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-accent-100 text-accent-700';
      case 'Intermédiaire':
        return 'bg-warning-100 text-warning-700';
      case 'Avancé':
        return 'bg-error-100 text-error-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className='py-16 lg:py-20 bg-secondary-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <div className='inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6'>
            <Icon aria-hidden='true' name='BookOpen' size={16} className='mr-2' />
            Programmes de formation
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold text-text-primary mb-6'>
            Nos formations IA spécialisées
          </h2>
          <p className='text-xl text-text-secondary max-w-3xl mx-auto'>
            Choisissez parmi nos programmes conçus pour différents secteurs professionnels et
            niveaux d'expertise
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'
        >
          {courses.map(course => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className='bg-surface rounded-xl shadow-subtle hover:shadow-medium transition-all duration-300 overflow-hidden group'
            >
              {/* Course Image */}
              <div className='relative overflow-hidden h-48'>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute top-4 left-4'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}
                  >
                    {course.difficulty}
                  </span>
                </div>
                <div className='absolute top-4 right-4 bg-surface/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center'>
                  <Icon aria-hidden='true' name='Star' size={14} className='text-warning mr-1' />
                  <span className='text-xs font-medium text-text-primary'>{course.rating}</span>
                </div>
              </div>

              {/* Course Content */}
              <div className='p-6'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-sm font-medium text-primary'>{course.category}</span>
                  <div className='flex items-center text-sm text-text-secondary'>
                    <Icon aria-hidden='true' name='Users' size={14} className='mr-1' />
                    {course.students}
                  </div>
                </div>

                <h3 className='text-xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors duration-200'>
                  {course.title}
                </h3>

                <p className='text-text-secondary mb-4 line-clamp-3'>{course.description}</p>

                {/* Course Highlights */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {course.highlights.slice(0, 2).map((highlight, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-md'
                    >
                      {highlight}
                    </span>
                  ))}
                  {course.highlights.length > 2 && (
                    <span className='px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-md'>
                      +{course.highlights.length - 2}
                    </span>
                  )}
                </div>

                {/* Course Meta */}
                <div className='flex items-center justify-between text-sm text-text-secondary mb-6'>
                  <div className='flex items-center'>
                    <Icon aria-hidden='true' name='Clock' size={14} className='mr-1' />
                    {course.duration}
                  </div>
                  <div className='flex items-center'>
                    <Icon aria-hidden='true' name='BookOpen' size={14} className='mr-1' />
                    {course.modules} modules
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to='/programmes'
                  className='w-full inline-flex items-center justify-center px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 group'
                >
                  <span>Découvrir le programme</span>
                  <Icon
                    aria-hidden='true'
                    name='ArrowRight'
                    size={16}
                    className='ml-2 group-hover:translate-x-1 transition-transform duration-200'
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center'
        >
          <div className='bg-gradient-to-r from-primary to-accent rounded-2xl p-8 lg:p-12 text-white'>
            <h3 className='text-2xl lg:text-3xl font-bold mb-4'>
              Prêt à transformer votre carrière ?
            </h3>
            <p className='text-lg opacity-90 mb-8 max-w-2xl mx-auto'>
              Rejoignez plus de 15 000 professionnels qui ont déjà révolutionné leur approche du
              travail grâce à l'IA
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/register'
                className='inline-flex items-center justify-center px-8 py-4 bg-surface text-primary font-semibold rounded-lg hover:bg-secondary-50 transition-colors duration-200'
              >
                <Icon aria-hidden='true' name='Rocket' size={20} className='mr-2' />
                Commencer gratuitement
              </Link>
              <Link
                to='/programmes'
                className='inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors duration-200'
              >
                <Icon aria-hidden='true' name='Info' size={20} className='mr-2' />
                Plus d'informations
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramOverview;
