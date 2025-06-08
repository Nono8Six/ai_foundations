import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: 'Calculator',
      title: 'Comptabilité Automatisée',
      description: 'Automatisez la saisie, la classification et l\'analyse de vos documents comptables avec une précision de 95%.',
      features: ['OCR intelligent', 'Classification automatique', 'Détection d\'anomalies'],
      productivity: '+60%',
      color: 'primary'
    },
    {
      icon: 'ShoppingCart',
      title: 'Commerce Optimisé',
      description: 'Personnalisez l\'expérience client, optimisez les prix et prédisez les tendances de vente.',
      features: ['Recommandations personnalisées', 'Pricing dynamique', 'Prédiction des ventes'],
      productivity: '+45%',
      color: 'accent'
    },
    {
      icon: 'TrendingUp',
      title: 'Finance Prédictive',
      description: 'Analysez les risques, détectez les fraudes et optimisez vos investissements avec l\'IA.',
      features: ['Analyse des risques', 'Détection de fraudes', 'Trading algorithmique'],
      productivity: '+70%',
      color: 'warning'
    },
    {
      icon: 'Settings',
      title: 'Maintenance Intelligente',
      description: 'Prédisez les pannes, optimisez les interventions et réduisez les coûts de maintenance.',
      features: ['Maintenance prédictive', 'Optimisation des stocks', 'Planification intelligente'],
      productivity: '+40%',
      color: 'success'
    },
    {
      icon: 'Users',
      title: 'Ressources Humaines',
      description: 'Automatisez le recrutement, analysez les performances et optimisez la gestion des talents.',
      features: ['Screening automatique', 'Analyse de performance', 'Prédiction de turnover'],
      productivity: '+35%',
      color: 'primary'
    },
    {
      icon: 'BarChart3',
      title: 'Marketing Intelligent',
      description: 'Segmentez vos audiences, personnalisez vos campagnes et maximisez votre ROI marketing.',
      features: ['Segmentation avancée', 'Campagnes personnalisées', 'Attribution multi-touch'],
      productivity: '+55%',
      color: 'accent'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        icon: 'text-primary',
        badge: 'bg-primary text-white'
      },
      accent: {
        bg: 'bg-accent-50',
        border: 'border-accent-200',
        icon: 'text-accent',
        badge: 'bg-accent text-white'
      },
      warning: {
        bg: 'bg-warning-50',
        border: 'border-warning-200',
        icon: 'text-warning',
        badge: 'bg-warning text-white'
      },
      success: {
        bg: 'bg-success-50',
        border: 'border-success-200',
        icon: 'text-success',
        badge: 'bg-success text-white'
      }
    };
    return colors[color] || colors.primary;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 lg:py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-success-100 text-success-700 rounded-full text-sm font-medium mb-6">
            <Icon name="Zap" size={16} className="mr-2" />
            Gains de productivité
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-6">
            Révolutionnez votre secteur d'activité
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Découvrez comment l'IA peut transformer votre productivité dans votre domaine professionnel spécifique
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {benefits.map((benefit, index) => {
            const colorClasses = getColorClasses(benefit.color);
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className={`bg-surface rounded-xl p-6 border ${colorClasses.border} shadow-subtle hover:shadow-medium transition-all duration-300 group`}
              >
                {/* Icon & Productivity Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon name={benefit.icon} size={24} className={colorClasses.icon} />
                  </div>
                  <span className={`px-3 py-1 ${colorClasses.badge} text-sm font-semibold rounded-full`}>
                    {benefit.productivity}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors duration-200">
                  {benefit.title}
                </h3>

                <p className="text-text-secondary mb-4 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-text-secondary">
                      <Icon name="Check" size={16} className={`${colorClasses.icon} mr-2 flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ROI Calculator Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 lg:p-12 text-white text-center"
        >
          <Icon name="Calculator" size={48} className="mx-auto mb-6 opacity-90" />
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Calculez votre retour sur investissement
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            En moyenne, nos étudiants récupèrent leur investissement en formation en moins de 3 mois 
            grâce aux gains de productivité obtenus
          </p>

          {/* ROI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">3 mois</div>
              <div className="text-sm opacity-80">Retour sur investissement</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">340%</div>
              <div className="text-sm opacity-80">ROI moyen annuel</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">15h</div>
              <div className="text-sm opacity-80">Économisées par semaine</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">€25K</div>
              <div className="text-sm opacity-80">Gain moyen annuel</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-8 py-4 bg-surface text-primary font-semibold rounded-lg hover:bg-secondary-50 transition-colors duration-200 shadow-lg"
          >
            <Icon name="Calculator" size={20} className="mr-2" />
            Calculer mon ROI personnalisé
          </motion.button>
        </motion.div>

        {/* Industry Focus */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-8">
            Secteurs d'activité couverts
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Comptabilité & Finance',
              'Commerce & E-commerce',
              'Industrie & Maintenance',
              'Ressources Humaines',
              'Marketing & Communication',
              'Santé & Médical',
              'Immobilier',
              'Éducation',
              'Transport & Logistique',
              'Agriculture',
              'Tourisme & Hôtellerie',
              'Services Juridiques'
            ].map((sector, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-surface border border-border rounded-full text-sm font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors duration-200"
              >
                {sector}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;