import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@frontend/components/AppIcon';
import { supabase } from '@frontend/lib/supabase';
import logger from '@frontend/utils/logger';

import VideoPlayer from './components/VideoPlayer';
import TextContent from './components/TextContent';
import LessonNavigation from './components/LessonNavigation';
import NoteTaking from './components/NoteTaking';
import ProgressBar from './components/ProgressBar';
import ActionBar from './components/ActionBar';
import XPCelebration from './components/XPCelebration';

interface Note {
  id: number;
  content: string;
  timestamp: string;
  selectedText: string;
}

interface LessonItem {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  current: boolean;
}

interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

interface LessonResource {
  id: string;
  title: string;
  url: string;
  size: string;
  type: string;
}

interface CurrentLesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  xpReward: number;
  module: { id: string; title: string; course: { id: string; title: string } };
  content: {
    videoUrl: string | null;
    transcript: string | null;
    textContent: string | null;
  };
  resources: LessonResource[];
}

const LessonViewer = () => {
  const navigate = useNavigate();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<CurrentLesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showXPCelebration, setShowXPCelebration] = useState(false);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [selectedText, setSelectedText] = useState('');

  const [moduleStructure, setModuleStructure] = useState<ModuleItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .limit(1)
        .single();

      if (lessonError) {
        console.error('Error fetching lesson:', lessonError);
      } else if (lessonData) {
        setCurrentLesson({
          id: lessonData.id,
          title: lessonData.title,
          type: lessonData.type || 'video',
          duration: lessonData.duration || '',
          xpReward: lessonData.xp_reward || 0,
          module: { id: lessonData.module_id, title: '', course: { id: '', title: '' } },
          content: {
            videoUrl: lessonData.video_url,
            transcript: lessonData.transcript,
            textContent: lessonData.text_content,
          },
          resources: lessonData.resources || [],
        });
      }

      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('id, title, lessons(id, title, duration)')
        .order('id');

      if (modulesError) {
        console.error('Error fetching modules:', modulesError);
      } else if (modulesData) {
        setModuleStructure(
          modulesData.map(m => ({
            id: m.id,
            title: m.title,
            lessons: (m.lessons || []).map(l => ({
              id: l.id,
              title: l.title,
              duration: l.duration || '',
              completed: false,
              current: false,
            })),
          }))
        );
      }
    };

    fetchData();
  }, []);

  const handleLessonComplete = () => {
    setLessonProgress(100);
    setShowXPCelebration(true);
    setTimeout(() => setShowXPCelebration(false), 3000);
  };

  const handleNextLesson = () => {
    // Navigate to next lesson logic
    logger.debug('Navigating to next lesson');
  };

  const handlePreviousLesson = () => {
    // Navigate to previous lesson logic
    logger.debug('Navigating to previous lesson');
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
          <Icon aria-hidden="true"  name='Loader2' size={48} className='animate-spin text-primary mx-auto mb-4' />
          <p className='text-text-secondary'>Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background flex flex-col pt-16'>
      {/* Header */}
      <header
        className={`bg-surface border-b border-border transition-all duration-300 ${isHeaderCollapsed ? 'h-12' : 'h-16'} flex items-center justify-between px-4 lg:px-6 relative z-40 fixed top-16 left-0 right-0`}
      >
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='lg:hidden p-2 hover:bg-secondary-50 rounded-lg transition-colors'
          >
            <Icon name='Menu' size={20} aria-label='Basculer le menu' />
          </button>

          <Link
            to='/espace'
            className='flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors'
          >
            <Icon aria-hidden="true"  name='ArrowLeft' size={20} />
            <span className='hidden sm:inline'>Retour à mon espace</span>
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
            <Icon
              name={isHeaderCollapsed ? 'ChevronDown' : 'ChevronUp'}
              size={20}
              aria-label={isHeaderCollapsed ? "Déployer l'en-tête" : "Réduire l'en-tête"}
            />
          </button>

          <button
            onClick={() => navigate('/espace')}
            className='p-2 hover:bg-secondary-50 rounded-lg transition-colors'
          >
            <Icon name='X' size={20} aria-label='Quitter le cours' />
          </button>
        </div>
      </header>

      <div className='flex-1 flex overflow-hidden mt-16'>
        {/* Sidebar - Lesson Navigation */}
        <LessonNavigation
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          moduleStructure={moduleStructure}
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
                  <Icon aria-hidden="true"  name='Download' size={20} className='mr-2' />
                  Ressources téléchargeables
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {currentLesson.resources.map(resource => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      className='flex items-center p-3 border border-border rounded-lg hover:bg-secondary-50 transition-colors group'
                    >
                      <Icon aria-hidden="true" 
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
                      <Icon aria-hidden="true" 
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
