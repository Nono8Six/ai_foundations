import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import VideoPlayer from './components/VideoPlayer';
import TextContent from './components/TextContent';
import LessonNavigation from './components/LessonNavigation';
import NoteTaking from './components/NoteTaking';
import ProgressBar from './components/ProgressBar';
import ActionBar from './components/ActionBar';
import XPCelebration from './components/XPCelebration';

const LessonViewer = () => {
  const navigate = useNavigate();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showXPCelebration, setShowXPCelebration] = useState(false);
  const [userNotes, setUserNotes] = useState([]);
  const [selectedText, setSelectedText] = useState('');

  // Mock data for lesson content
  const mockLessonData = {
    id: 1,
    title: 'Introduction aux Réseaux de Neurones',
    type: 'video', // video, text, interactive
    duration: '15 min',
    xpReward: 50,
    module: {
      id: 1,
      title: "Fondamentaux de l\'IA",
      course: {
        id: 1,
        title: 'Intelligence Artificielle pour Débutants',
      },
    },
    content: {
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      transcript: `Les réseaux de neurones sont l'épine dorsale de l'intelligence artificielle moderne. Dans cette leçon, nous explorerons les concepts fondamentaux qui permettent aux machines d'apprendre et de prendre des décisions.

Un réseau de neurones artificiel s'inspire du fonctionnement du cerveau humain. Tout comme notre cerveau contient des milliards de neurones interconnectés, un réseau de neurones artificiel est composé de nœuds (neurones artificiels) organisés en couches.

Chaque neurone reçoit des signaux d'entrée, les traite selon une fonction mathématique, puis transmet le résultat aux neurones de la couche suivante. Ce processus permet au réseau d'identifier des motifs complexes dans les données.`,
      textContent: `# Introduction aux Réseaux de Neurones

Les réseaux de neurones représentent une révolution dans le domaine de l'intelligence artificielle. Cette technologie, inspirée du fonctionnement du cerveau humain, permet aux machines d'apprendre et de résoudre des problèmes complexes.

## Qu'est-ce qu'un Réseau de Neurones ?

Un réseau de neurones artificiel est un système informatique conçu pour imiter la façon dont le cerveau humain traite l'information. Il est composé de :

- **Neurones artificiels** : Unités de traitement qui reçoivent, traitent et transmettent des informations
- **Connexions pondérées** : Liens entre les neurones qui déterminent l'importance des signaux
- **Couches** : Organisation hiérarchique des neurones (entrée, cachées, sortie)

## Applications Pratiques

Les réseaux de neurones sont utilisés dans de nombreux domaines :

1. **Reconnaissance d'images** - Identification d'objets, visages, texte
2. **Traitement du langage naturel** - Traduction, analyse de sentiment
3. **Prédiction** - Analyse financière, météorologie
4. **Automatisation** - Véhicules autonomes, robotique

Cette technologie transforme notre façon de travailler et d'interagir avec la technologie au quotidien.`,
    },
    resources: [
      {
        id: 1,
        title: 'Guide PDF - Réseaux de Neurones',
        type: 'pdf',
        url: '#',
        size: '2.3 MB',
      },
      {
        id: 2,
        title: "Code d\'exemple - Python",
        type: 'code',
        url: '#',
        size: '15 KB',
      },
    ],
  };

  const mockModuleStructure = [
    {
      id: 1,
      title: "Fondamentaux de l\'IA",
      lessons: [
        {
          id: 1,
          title: 'Introduction aux Réseaux de Neurones',
          duration: '15 min',
          completed: false,
          current: true,
        },
        {
          id: 2,
          title: 'Types de Réseaux de Neurones',
          duration: '20 min',
          completed: false,
          current: false,
        },
        {
          id: 3,
          title: 'Entraînement des Modèles',
          duration: '25 min',
          completed: false,
          current: false,
        },
      ],
    },
    {
      id: 2,
      title: 'Applications Pratiques',
      lessons: [
        {
          id: 4,
          title: 'IA dans la Comptabilité',
          duration: '18 min',
          completed: false,
          current: false,
        },
        {
          id: 5,
          title: 'Automatisation des Processus',
          duration: '22 min',
          completed: false,
          current: false,
        },
      ],
    },
  ];

  useEffect(() => {
    setCurrentLesson(mockLessonData);
  }, []);

  const handleLessonComplete = () => {
    setLessonProgress(100);
    setShowXPCelebration(true);
    setTimeout(() => setShowXPCelebration(false), 3000);
  };

  const handleNextLesson = () => {
    // Navigate to next lesson logic
    console.log('Navigating to next lesson');
  };

  const handlePreviousLesson = () => {
    // Navigate to previous lesson logic
    console.log('Navigating to previous lesson');
  };

  const handleAddNote = note => {
    const newNote = {
      id: Date.now(),
      content: note,
      timestamp: new Date().toISOString(),
      selectedText: selectedText,
    };
    setUserNotes([...userNotes, newNote]);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };

  if (!currentLesson) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <Icon name='Loader2' size={48} className='animate-spin text-primary mx-auto mb-4' />
          <p className='text-text-secondary'>Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* Header */}
      <header
        className={`bg-surface border-b border-border transition-all duration-300 ${isHeaderCollapsed ? 'h-12' : 'h-16'} flex items-center justify-between px-4 lg:px-6 relative z-50`}
      >
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='lg:hidden p-2 hover:bg-secondary-50 rounded-lg transition-colors'
          >
            <Icon name='Menu' size={20} />
          </button>

          <Link
            to='/user-dashboard'
            className='flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors'
          >
            <Icon name='ArrowLeft' size={20} />
            <span className='hidden sm:inline'>Retour au tableau de bord</span>
          </Link>
        </div>

        <div className='flex-1 max-w-md mx-4'>
          <ProgressBar progress={lessonProgress} />
        </div>

        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            className='p-2 hover:bg-secondary-50 rounded-lg transition-colors'
          >
            <Icon name={isHeaderCollapsed ? 'ChevronDown' : 'ChevronUp'} size={20} />
          </button>

          <button
            onClick={() => navigate('/user-dashboard')}
            className='p-2 hover:bg-secondary-50 rounded-lg transition-colors'
          >
            <Icon name='X' size={20} />
          </button>
        </div>
      </header>

      <div className='flex-1 flex overflow-hidden'>
        {/* Sidebar - Lesson Navigation */}
        <LessonNavigation
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          moduleStructure={mockModuleStructure}
          currentLessonId={currentLesson.id}
        />

        {/* Main Content Area */}
        <main className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
          {/* Content Display */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            <div className='flex-1 overflow-auto' onMouseUp={handleTextSelection}>
              {currentLesson.type === 'video' ? (
                <VideoPlayer
                  videoUrl={currentLesson.content.videoUrl}
                  transcript={currentLesson.content.transcript}
                  onProgress={setLessonProgress}
                />
              ) : (
                <TextContent
                  content={currentLesson.content.textContent}
                  onProgress={setLessonProgress}
                />
              )}
            </div>

            {/* Resources Section */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className='border-t border-border bg-surface p-4'>
                <h3 className='font-semibold text-text-primary mb-3 flex items-center'>
                  <Icon name='Download' size={20} className='mr-2' />
                  Ressources téléchargeables
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {currentLesson.resources.map(resource => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      className='flex items-center p-3 border border-border rounded-lg hover:bg-secondary-50 transition-colors group'
                    >
                      <Icon
                        name={resource.type === 'pdf' ? 'FileText' : 'Code'}
                        size={20}
                        className='text-primary mr-3'
                      />
                      <div className='flex-1'>
                        <p className='font-medium text-text-primary group-hover:text-primary transition-colors'>
                          {resource.title}
                        </p>
                        <p className='text-sm text-text-secondary'>{resource.size}</p>
                      </div>
                      <Icon
                        name='Download'
                        size={16}
                        className='text-text-secondary group-hover:text-primary transition-colors'
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes Panel */}
          <NoteTaking
            isOpen={isNotesOpen}
            onClose={() => setIsNotesOpen(false)}
            notes={userNotes}
            onAddNote={handleAddNote}
            selectedText={selectedText}
          />
        </main>
      </div>

      {/* Action Bar */}
      <ActionBar
        onPrevious={handlePreviousLesson}
        onNext={handleNextLesson}
        onComplete={handleLessonComplete}
        onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
        isCompleted={lessonProgress === 100}
        progress={lessonProgress}
      />

      {/* XP Celebration Modal */}
      {showXPCelebration && (
        <XPCelebration
          xpEarned={currentLesson.xpReward}
          onClose={() => setShowXPCelebration(false)}
        />
      )}
    </div>
  );
};

export default LessonViewer;
