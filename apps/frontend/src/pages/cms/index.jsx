import React, { useState, useEffect } from 'react';
import { useAdminCourses } from '../../context/AdminCourseContext';
import { useToast } from '../../context/ToastContext';
import { fetchCoursesWithContent } from '../../services/courseService';
import logger from '../../utils/logger';

import Icon from '../../components/AppIcon';
import AdminLayout, { useAdminSidebar } from "../../components/AdminLayout";
import ContentTree from './components/ContentTree';
import CourseEditor from './components/CourseEditor';
import ModuleEditor from './components/ModuleEditor';
import LessonEditor from './components/LessonEditor';
import BulkOperations from './components/BulkOperations';
import ContentSearch from './components/ContentSearch';
import MediaLibrary from './components/MediaLibrary';

const ContentManagementCoursesModulesLessonsContent = () => {
  const { setSidebarOpen } = useAdminSidebar();
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState('course');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { createCourse, updateCourse, deleteCourse } = useAdminCourses();
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const courses = await fetchCoursesWithContent();
        setContentData(courses);
      } catch (err) {
        logger.error('Failed to fetch courses', err);
        addToast("Erreur lors du chargement du contenu", 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [addToast]);

  const handleContentSelect = content => {
    setSelectedContent(content);
    setContentType(content.type);
  };

  const handleSaveContent = async (updatedContent) => {
    // Note: This logic currently only handles the 'course' type.
    // It should be expanded to handle modules and lessons.
    if (contentType !== 'course') {
      logger.info('Saving non-course content (local state only):', updatedContent);
      setSelectedContent(updatedContent);
      return;
    }

    try {
      let savedCourse;
      if (updatedContent.id) {
        savedCourse = await updateCourse(updatedContent.id, updatedContent);
        setContentData(prev => prev.map(c => (c.id === savedCourse.id ? savedCourse : c)));
        addToast('Cours mis à jour avec succès !', 'success');
      } else {
        savedCourse = await createCourse(updatedContent);
        setContentData(prev => [...prev, savedCourse]);
        addToast('Cours créé avec succès !', 'success');
      }
      setSelectedContent(savedCourse);
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde du cours:', error);
      addToast("Erreur lors de la sauvegarde du cours", 'error');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (contentType !== 'course') {
      logger.info('Deleting non-course content (local state only):', contentId);
      setSelectedContent(null);
      return;
    }

    try {
      await deleteCourse(contentId);
      setContentData(prev => prev.filter(c => c.id !== contentId));
      setSelectedContent(null);
      addToast('Cours supprimé avec succès !', 'success');
    } catch (error) {
      logger.error('Erreur lors de la suppression du cours:', error);
      addToast("Erreur lors de la suppression du cours", 'error');
    }
  };


  const handleBulkOperation = (operation, items) => {
    logger.info('Bulk operation:', operation, items);
    setSelectedItems([]);
    setShowBulkOperations(false);
  };

  const renderContentEditor = () => {
    if (!selectedContent) {
      return (
        <div className='flex-1 flex items-center justify-center bg-surface'>
          <div className='text-center'>
            <Icon name='FileText' size={64} className='text-secondary-300 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-text-primary mb-2'>
              Sélectionnez un contenu à modifier
            </h3>
            <p className='text-text-secondary'>
              Choisissez un cours, module ou leçon dans l'arbre de contenu pour commencer l'édition.
            </p>
          </div>
        </div>
      );
    }

    switch (contentType) {
      case 'course':
        return (
          <CourseEditor
            course={selectedContent}
            onSave={handleSaveContent}
            onDelete={handleDeleteContent}
          />
        );
      case 'module':
        return (
          <ModuleEditor
            module={selectedContent}
            onSave={handleSaveContent}
            onDelete={handleDeleteContent}
          />
        );
      case 'lesson':
        return (
          <LessonEditor
            lesson={selectedContent}
            onSave={handleSaveContent}
            onDelete={handleDeleteContent}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Icon name="Loader" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      <header className='bg-surface shadow-subtle border-b border-border fixed top-16 left-0 right-0 z-30 lg:left-64'>
        <div className='flex items-center h-16 px-6'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='lg:hidden p-2 rounded-md hover:bg-secondary-100 transition-colors'
          >
            <Icon name='Menu' size={20} />
          </button>
          <h1 className='text-xl font-semibold text-text-primary ml-4'>Gestion du Contenu</h1>
        </div>
      </header>
        <main className='p-6 pt-16'>
        <div className='flex h-[calc(100vh-4rem)]'>
        <div className='w-80 bg-surface border-r border-border flex flex-col'>
          <div className='p-4 border-b border-border'>
            <ContentSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCreateNew={() => setSelectedContent({ type: 'course', title: '', description: '' })}
            />
            {selectedItems.length > 0 && (
              <button
                onClick={() => setShowBulkOperations(true)}
                className='mt-3 w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center'
              >
                <Icon name='Edit' size={16} className='mr-2' />
                Actions groupées ({selectedItems.length})
              </button>
            )}
          </div>
          <div className='flex-1 overflow-y-auto'>
            <ContentTree
              contentData={contentData}
              searchQuery={searchQuery}
              selectedContent={selectedContent}
              selectedItems={selectedItems}
              onContentSelect={handleContentSelect}
              onItemsSelect={setSelectedItems}
              onReorder={(newOrder) => setContentData(newOrder)}
            />
          </div>
          <div className='p-4 border-t border-border bg-secondary-50'>
            <div className='grid grid-cols-2 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-primary'>{contentData.length}</div>
                <div className='text-xs text-text-secondary'>Cours</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-accent'>
                  {contentData.reduce((acc, course) => acc + (course.modules?.length || 0), 0)}
                </div>
                <div className='text-xs text-text-secondary'>Modules</div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-1 flex flex-col'>{renderContentEditor()}</div>
      </div>
      {showMediaLibrary && (
        <MediaLibrary
          onClose={() => setShowMediaLibrary(false)}
          onSelectMedia={(media) => {
            logger.info('Selected media:', media);
            setShowMediaLibrary(false);
          }}
        />
      )}
      {showBulkOperations && (
        <BulkOperations
          selectedItems={selectedItems}
          onClose={() => setShowBulkOperations(false)}
          onExecute={handleBulkOperation}
        />
        )}
        </main>
      </>
    );
  };

const ContentManagementCoursesModulesLessons = () => (
  <AdminLayout>
    <ContentManagementCoursesModulesLessonsContent />
  </AdminLayout>
);

export default ContentManagementCoursesModulesLessons;
