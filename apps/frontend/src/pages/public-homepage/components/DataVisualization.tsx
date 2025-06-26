import React, { useMemo } from 'react';
import { colors, theme } from '@frontend/utils/theme';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Icon from '@frontend/components/AppIcon';

const DataVisualization = () => {
  // Mock data for AI impact across industries
  const industryImpactData = [
    { industry: 'Comptabilité', productivity: 85, automation: 78, satisfaction: 92 },
    { industry: 'Commerce', productivity: 78, automation: 82, satisfaction: 88 },
    { industry: 'Finance', productivity: 90, automation: 85, satisfaction: 94 },
    { industry: 'Maintenance', productivity: 72, automation: 68, satisfaction: 86 },
    { industry: 'Marketing', productivity: 88, automation: 90, satisfaction: 91 },
  ];

  const adoptionTrendData = [
    { month: 'Jan', users: 1200, completion: 65 },
    { month: 'Fév', users: 1800, completion: 72 },
    { month: 'Mar', users: 2400, completion: 78 },
    { month: 'Avr', users: 3200, completion: 82 },
    { month: 'Mai', users: 4100, completion: 85 },
    { month: 'Jun', users: 5200, completion: 88 },
  ];

  const skillDistributionData = useMemo(
    () => [
      { name: 'Débutant', value: 45, color: colors['primary-500'] },
      { name: 'Intermédiaire', value: 35, color: colors['accent-600'] },
      { name: 'Avancé', value: 20, color: colors['warning-500'] },
    ],
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className='py-16 lg:py-20 bg-surface'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <div className='inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-6'>
            <Icon aria-hidden="true"  name='TrendingUp' size={16} className='mr-2' />
            Impact mesurable de l'IA
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold text-text-primary mb-6'>
            L'IA transforme les entreprises
          </h2>
          <p className='text-xl text-text-secondary max-w-3xl mx-auto'>
            Découvrez comment l'intelligence artificielle révolutionne la productivité dans
            différents secteurs professionnels
          </p>
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='grid lg:grid-cols-2 gap-8 mb-16'
        >
          {/* Industry Impact Chart */}
          <motion.div
            variants={itemVariants}
            className='bg-surface border border-border rounded-xl p-6 shadow-subtle hover:shadow-medium transition-shadow duration-300'
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-text-primary'>Impact par secteur</h3>
              <Icon aria-hidden="true"  name='BarChart3' size={24} className='text-primary' />
            </div>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={industryImpactData}>
                  <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
                  <XAxis dataKey='industry' tick={{ fontSize: 12 }} stroke={colors.secondary} />
                  <YAxis tick={{ fontSize: 12 }} stroke={colors.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '0.5rem',
                      boxShadow: theme.boxShadow.medium,
                    }}
                  />
                  <Bar
                    dataKey='productivity'
                    fill={colors['primary-500']}
                    name='Productivité %'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='automation'
                    fill={colors['accent-600']}
                    name='Automatisation %'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Adoption Trend Chart */}
          <motion.div
            variants={itemVariants}
            className='bg-surface border border-border rounded-xl p-6 shadow-subtle hover:shadow-medium transition-shadow duration-300'
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-text-primary'>
                Croissance des utilisateurs
              </h3>
              <Icon aria-hidden="true"  name='TrendingUp' size={24} className='text-accent' />
            </div>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={adoptionTrendData}>
                  <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
                  <XAxis dataKey='month' tick={{ fontSize: 12 }} stroke={colors.secondary} />
                  <YAxis tick={{ fontSize: 12 }} stroke={colors.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '0.5rem',
                      boxShadow: theme.boxShadow.medium,
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='users'
                    stroke={colors['primary-500']}
                    strokeWidth={3}
                    dot={{ fill: colors['primary-500'], strokeWidth: 2, r: 6 }}
                    name='Utilisateurs'
                  />
                  <Line
                    type='monotone'
                    dataKey='completion'
                    stroke={colors['accent-600']}
                    strokeWidth={3}
                    dot={{ fill: colors['accent-600'], strokeWidth: 2, r: 6 }}
                    name='Taux de completion %'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
        >
          {/* Skill Distribution */}
          <motion.div
            variants={itemVariants}
            className='bg-surface border border-border rounded-xl p-6 shadow-subtle hover:shadow-medium transition-shadow duration-300'
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-semibold text-text-primary'>Répartition des niveaux</h3>
              <Icon aria-hidden="true"  name='PieChart' size={20} className='text-warning' />
            </div>
            <div className='h-48'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={skillDistributionData}
                    cx='50%'
                    cy='50%'
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {skillDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='space-y-2'>
              {skillDistributionData.map((item, index) => (
                <div key={index} className='flex items-center justify-between text-sm'>
                  <div className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-full mr-2'
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className='text-text-secondary'>{item.name}</span>
                  </div>
                  <span className='font-medium text-text-primary'>{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            variants={itemVariants}
            className='bg-gradient-to-br from-primary-50 to-accent-50 border border-border rounded-xl p-6'
          >
            <div className='flex items-center mb-6'>
              <Icon aria-hidden="true"  name='Target' size={24} className='text-primary mr-3' />
              <h3 className='text-lg font-semibold text-text-primary'>Métriques clés</h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-text-secondary'>Temps d'apprentissage moyen</span>
                <span className='font-bold text-primary'>2.5h/semaine</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-text-secondary'>ROI moyen</span>
                <span className='font-bold text-accent'>340%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-text-secondary'>Certification obtenue</span>
                <span className='font-bold text-warning'>87%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-text-secondary'>Recommandation</span>
                <span className='font-bold text-primary'>9.2/10</span>
              </div>
            </div>
          </motion.div>

          {/* Success Story */}
          <motion.div
            variants={itemVariants}
            className='bg-surface border border-border rounded-xl p-6 shadow-subtle hover:shadow-medium transition-shadow duration-300'
          >
            <div className='flex items-center mb-4'>
              <Icon aria-hidden="true"  name='Quote' size={20} className='text-accent mr-2' />
              <h3 className='text-lg font-semibold text-text-primary'>Témoignage</h3>
            </div>
            <blockquote className='text-text-secondary mb-4 italic'>
              "Grâce à AI Foundations, j'ai automatisé 60% de mes tâches comptables. Un gain de
              temps incroyable !"
            </blockquote>
            <div className='flex items-center'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-3'>
                <Icon aria-hidden="true"  name='User' size={16} color='white' />
              </div>
              <div>
                <div className='font-medium text-text-primary'>Marie Dubois</div>
                <div className='text-sm text-text-secondary'>Expert-comptable</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DataVisualization;
