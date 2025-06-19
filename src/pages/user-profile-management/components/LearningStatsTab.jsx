import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../../../utils/theme';
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
import { useAuth } from '../../../context/AuthContext';
import { useCourses } from '../../../context/CourseContext';
import useAchievements from '../../../hooks/useAchievements';
import useRecentActivity from '../../../hooks/useRecentActivity';
import Icon from '../../../components/AppIcon';

const LearningStatsTab = () => {
  const { user, userProfile } = useAuth();
  const { courses, isLoading: coursesLoading } = useCourses();
  const { achievements } = useAchievements(user?.id, { order: 'desc' });
  const { activities } = useRecentActivity(user?.id, { limit: 50, order: 'desc' });

  const stats = useMemo(() => {
    if (coursesLoading || !courses || courses.length === 0) {
      return {
        hasData: false,
        completedLessonsCount: 0,
        inProgressLessonsCount: 0,
        totalLearningTime: 0,
        coursesCompleted: 0,
        weeklyData: [],
        subjectData: [],
      };
    }

    const userProgress = courses.flatMap(course =>
        course.lessons?.map(lesson => lesson.progress).filter(p => p) || []
    );

    const completedLessons = userProgress.filter(p => p?.status === 'completed');
    const inProgressLessons = userProgress.filter(p => p?.status === 'in_progress');

    // --- Weekly Progress ---
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const weeklyData = days.map(day => ({ day, minutes: 0, xp: 0, lessons: 0 }));
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    activities.forEach(activity => {
      const activityDate = new Date(activity.created_at);
      if (activityDate >= lastWeek) {
        const dayIndex = (activityDate.getDay() + 6) % 7;
        if (activity.type === 'lesson_completed') {
          weeklyData[dayIndex].lessons += 1;
          weeklyData[dayIndex].minutes += 15;
          weeklyData[dayIndex].xp += 50;
        }
      }
    });
    
    // --- Subject Distribution ---
    const subjects = {};
    courses.forEach(course => {
      const category = course.category || 'IA Générale';
      subjects[category] = (subjects[category] || 0) + 1;
    });
    const chartColors = [colors.primary, colors.accent, colors.warning, colors.error, colors.info, colors.secondary];
    const subjectData = Object.entries(subjects).map(([name, value], index) => ({
      name,
      value,
      fill: chartColors[index % chartColors.length],
    }));

    // --- Overview Stats ---
    const totalLearningTime = Math.floor(completedLessons.length * 0.25);
    const coursesCompleted = courses.filter(course => course.progress?.completed === course.progress?.total).length;
    
    return {
      hasData: userProgress.length > 0,
      completedLessonsCount: completedLessons.length,
      inProgressLessonsCount: inProgressLessons.length,
      totalLearningTime,
      coursesCompleted,
      weeklyData,
      subjectData,
    };
  }, [courses, activities, coursesLoading]);

  const currentStreak = userProfile?.current_streak || 0;
  const currentLevel = userProfile?.level || 1;

  if (coursesLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Icon name='Loader' className='animate-spin text-primary' size={40} />
        <p className='ml-4 text-text-secondary'>Chargement de vos statistiques...</p>
      </div>
    );
  }

  if (!stats.hasData) {
    return (
        <div className='bg-surface rounded-lg border border-border p-12 text-center'>
          <Icon name='BarChart3' size={64} className='mx-auto mb-6 text-secondary-300' />
          <h3 className='text-xl font-semibold text-text-primary mb-2'>
            Commencez votre parcours d'apprentissage
          </h3>
          <p className='text-text-secondary mb-6'>
            Vos statistiques d'apprentissage apparaîtront ici une fois que vous aurez commencé des cours.
          </p>
          <Link
            to='/programmes'
            className='inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors'
          >
            <Icon name='BookOpen' size={20} className='mr-2' />
            Découvrir les cours
          </Link>
        </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h3 className='text-lg font-semibold text-text-primary'>Statistiques d'apprentissage</h3>
        <p className='text-text-secondary text-sm mt-1'>
          Suivez vos progrès et analysez vos performances d'apprentissage
        </p>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-primary-600 text-sm font-medium'>Temps total</p>
              <p className='text-2xl font-bold text-primary-700'>{stats.totalLearningTime}h</p>
            </div>
            <div className='w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center'>
              <Icon name='Clock' size={24} color='white' />
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg p-6 border border-accent-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-accent-600 text-sm font-medium'>Cours terminés</p>
              <p className='text-2xl font-bold text-accent-700'>{stats.coursesCompleted}</p>
            </div>
            <div className='w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center'>
              <Icon name='BookOpen' size={24} color='white' />
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-600 text-sm font-medium'>Série actuelle</p>
              <p className='text-2xl font-bold text-orange-700'>{currentStreak} jours</p>
            </div>
            <div className='w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center'>
              <Icon name='Flame' size={24} color='white' />
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-600 text-sm font-medium'>Niveau actuel</p>
              <p className='text-2xl font-bold text-purple-700'>{currentLevel}</p>
            </div>
            <div className='w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center'>
              <Icon name='Trophy' size={24} color='white' />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Weekly Progress */}
          <div className='bg-surface rounded-lg border border-border p-6'>
            <h4 className='text-base font-semibold text-text-primary mb-4'>Progrès hebdomadaire</h4>
            {stats.weeklyData.length > 0 ? (
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={stats.weeklyData}>
                    <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
                    <XAxis dataKey='day' stroke={colors.secondary} fontSize={12} />
                    <YAxis stroke={colors.secondary} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey='minutes' fill={colors.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className='h-64 flex items-center justify-center text-text-secondary'>
                <div className='text-center'>
                  <Icon name='BarChart3' size={48} className='mx-auto mb-4 opacity-50' />
                  <p>Aucune donnée d'apprentissage cette semaine</p>
                  <p className='text-sm'>Commencez une leçon pour voir vos statistiques</p>
                </div>
              </div>
            )}
          </div>

          {/* XP Progress */}
          <div className='bg-surface rounded-lg border border-border p-6'>
            <h4 className='text-base font-semibold text-text-primary mb-4'>Évolution XP</h4>
            {stats.weeklyData.length > 0 && stats.weeklyData.some(d => d.xp > 0) ? (
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={stats.weeklyData}>
                    <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
                    <XAxis dataKey='day' stroke={colors.secondary} fontSize={12} />
                    <YAxis stroke={colors.secondary} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='xp'
                      stroke={colors.accent}
                      strokeWidth={3}
                      dot={{ fill: colors.accent, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className='h-64 flex items-center justify-center text-text-secondary'>
                <div className='text-center'>
                  <Icon name='TrendingUp' size={48} className='mx-auto mb-4 opacity-50' />
                  <p>Aucun XP gagné cette semaine</p>
                  <p className='text-sm'>Terminez des leçons pour gagner de l'XP</p>
                </div>
              </div>
            )}
          </div>

          {/* Subject Distribution */}
          <div className='bg-surface rounded-lg border border-border p-6'>
            <h4 className='text-base font-semibold text-text-primary mb-4'>
              Répartition des cours
            </h4>
            {stats.subjectData.length > 0 ? (
              <>
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={stats.subjectData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey='value'
                      >
                        {stats.subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className='grid grid-cols-2 gap-2 mt-4'>
                  {stats.subjectData.map((subject, index) => (
                    <div key={index} className='flex items-center space-x-2'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: subject.fill }}
                      ></div>
                      <span className='text-xs text-text-secondary'>{subject.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='h-64 flex items-center justify-center text-text-secondary'>
                <div className='text-center'>
                  <Icon name='PieChart' size={48} className='mx-auto mb-4 opacity-50' />
                  <p>Aucun cours inscrit</p>
                  <p className='text-sm'>Inscrivez-vous à des cours pour voir la répartition</p>
                </div>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div className='bg-surface rounded-lg border border-border p-6'>
            <h4 className='text-base font-semibold text-text-primary mb-4'>Résumé d'activité</h4>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-secondary-50 rounded-lg'>
                <div className='flex items-center space-x-3'>
                  <Icon name='BookOpen' size={20} className='text-primary' />
                  <span className='text-sm font-medium text-text-primary'>Leçons terminées</span>
                </div>
                <span className='text-lg font-bold text-primary'>
                  {stats.completedLessonsCount}
                </span>
              </div>
              
              <div className='flex items-center justify-between p-3 bg-secondary-50 rounded-lg'>
                <div className='flex items-center space-x-3'>
                  <Icon name='Clock' size={20} className='text-accent' />
                  <span className='text-sm font-medium text-text-primary'>Leçons en cours</span>
                </div>
                <span className='text-lg font-bold text-accent'>
                  {stats.inProgressLessonsCount}
                </span>
              </div>

              <div className='flex items-center justify-between p-3 bg-secondary-50 rounded-lg'>
                <div className='flex items-center space-x-3'>
                  <Icon name='Award' size={20} className='text-warning' />
                  <span className='text-sm font-medium text-text-primary'>Réalisations</span>
                </div>
                <span className='text-lg font-bold text-warning'>
                  {achievements.length}
                </span>
              </div>
            </div>
          </div>
        </div>

      {/* Achievements Gallery */}
      {achievements.length > 0 && (
        <div className='bg-surface rounded-lg border border-border p-6'>
          <h4 className='text-base font-semibold text-text-primary mb-6'>Réalisations débloquées</h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className='bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-4 border border-secondary-200'
              >
                <div className='flex items-start space-x-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <Icon name='Award' size={24} color='white' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h5 className='text-sm font-semibold text-text-primary mb-1'>
                      {achievement.title}
                    </h5>
                    <p className='text-xs text-text-secondary mb-2'>{achievement.description}</p>
                    <div className='flex items-center justify-between'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700'>
                        {achievement.rarity}
                      </span>
                      <span className='text-xs text-text-secondary'>
                        {new Date(achievement.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Goals */}
      <div className='bg-surface rounded-lg border border-border p-6'>
        <h4 className='text-base font-semibold text-text-primary mb-4'>
          Objectifs d'apprentissage
        </h4>
        <div className='space-y-4'>
          <div className='flex items-center justify-between p-4 bg-secondary-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <Icon name='Target' size={20} className='text-primary' />
              <div>
                <p className='text-sm font-medium text-text-primary'>Objectif quotidien</p>
                <p className='text-xs text-text-secondary'>Maintenir votre série d'apprentissage</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm font-semibold text-accent'>{currentStreak} jours</p>
              <p className='text-xs text-text-secondary'>Série actuelle</p>
            </div>
          </div>

          <div className='flex items-center justify-between p-4 bg-secondary-50 rounded-lg'>
            <div className='flex items-center space-x-3'>
              <Icon name='Calendar' size={20} className='text-primary' />
              <div>
                <p className='text-sm font-medium text-text-primary'>Progression niveau</p>
                <p className='text-xs text-text-secondary'>Vers le niveau {currentLevel + 1}</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-sm font-semibold text-primary'>{userProfile?.xp || 0} XP</p>
              <p className='text-xs text-text-secondary'>Points actuels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStatsTab;
