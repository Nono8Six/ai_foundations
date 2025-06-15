import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';

import Icon from '../../components/AppIcon';
import ContentTree from './components/ContentTree';
import CourseEditor from './components/CourseEditor';
import ModuleEditor from './components/ModuleEditor';
import LessonEditor from './components/LessonEditor';
import BulkOperations from './components/BulkOperations';
import ContentSearch from './components/ContentSearch';
import MediaLibrary from './components/MediaLibrary';
import { useAdminCourses } from '../../context/AdminCourseContext';
import { fetchCoursesWithContent } from '../../services/courseService';

const ContentManagementCoursesModulesLessons = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState('course');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

  const [contentData, setContentData] = useState([]);

  const { createCourse, updateCourse, deleteCourse } = useAdminCourses();

  useEffect(() => {
    const load = async () => {
      try {
        const courses = await fetchCoursesWithContent();
        setContentData(courses);
      } catch (err) {
        logger.error('Failed to fetch courses', err);
      }
    };
    load();
  }, []);


  const handleContentSelect = content => {
    setSelectedContent(content);
    setContentType(content.type);
  };

  const handleSaveContent = async updatedContent => {
    try {
      if (updatedContent.type === 'course') {
        let saved;
        if (updatedContent.id) {
          saved = await updateCourse(updatedContent.id, updatedContent);
          setContentData(prev =>
            prev.map(c => (c.id === saved.id ? { ...saved, modules: c.modules } : c))
          );
        } else {
          saved = await createCourse(updatedContent);
          setContentData(prev => [...prev, { ...saved, modules: [] }]);
        }
        setSelectedContent(saved);
      } else {
        setSelectedContent(updatedContent);
      }
    } catch (err) {
      logger.error('Failed to save content', err);
    }
  };

  const handleDeleteContent = async contentId => {
    try {
      if (selectedContent?.type === 'course') {
        await deleteCourse(contentId);
        setContentData(prev => prev.filter(c => c.id !== contentId));
      }
      setSelectedContent(null);
    } catch (err) {
      logger.error('Failed to delete content', err);
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

  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='flex h-[calc(100vh-4rem)]'>
        {/* Content Tree Sidebar */}
        <div className='w-80 bg-surface border-r border-border flex flex-col'>
          {/* Search and Actions */}
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

          {/* Content Tree */}
          <div className='flex-1 overflow-y-auto'>
            <ContentTree
              contentData={contentData}
              searchQuery={searchQuery}
              selectedContent={selectedContent}
              selectedItems={selectedItems}
              onContentSelect={handleContentSelect}
              onItemsSelect={setSelectedItems}
              onReorder={newOrder => setContentData(newOrder)}
            />
          </div>

          {/* Stats */}
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

        {/* Main Content Editor */}
        <div className='flex-1 flex flex-col'>{renderContentEditor()}</div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onClose={() => setShowMediaLibrary(false)}
          onSelectMedia={media => {
            logger.info('Selected media:', media);
            setShowMediaLibrary(false);
          }}
        />
      )}

      {/* Bulk Operations Modal */}
      {showBulkOperations && (
        <BulkOperations
          selectedItems={selectedItems}
          onClose={() => setShowBulkOperations(false)}
          onExecute={handleBulkOperation}
        />
      )}
    </div>
  );
};

export default ContentManagementCoursesModulesLessons;