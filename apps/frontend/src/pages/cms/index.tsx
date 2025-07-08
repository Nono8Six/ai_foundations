import React, { useState, useEffect, ReactElement } from 'react';
import { useAdminCourses } from '@frontend/context/AdminCourseContext';
import { toast } from 'sonner';
import { fetchCoursesWithContent } from '@frontend/services/courseService';
import { log } from '@libs/logger';
import type { CourseRow } from '@frontend/types/courseRow';
import type { ModuleRow } from '@frontend/types/moduleRow';
import type { LessonRow } from '@frontend/types/lessonRow';

// Base content item type with common fields
interface BaseContentItem {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Specific content types
interface CmsLesson extends BaseContentItem {
  type: 'lesson';
  duration?: number;
  status?: string;
  completions?: number;
  moduleId?: string;
}

interface CmsModule extends BaseContentItem {
  type: 'module';
  courseId?: string;
  lessons?: CmsLesson[];
}

interface CmsCourse extends BaseContentItem {
  type: 'course';
  price?: number;
  status?: string;
  enrollments?: number;
  modules?: CmsModule[];
}

type CmsContentItem = CmsCourse | CmsModule | CmsLesson;

type ContentItemToRow<T extends CmsContentItem> = T extends CmsCourse
  ? CourseRow
  : T extends CmsModule
  ? ModuleRow
  : T extends CmsLesson
  ? LessonRow
  : never;

import Icon from '@frontend/components/AppIcon';
import AdminLayout, { useAdminSidebar } from '@frontend/components/AdminLayout';
import ContentTree, { ContentNode } from './components/ContentTree';
import CourseEditor from './components/CourseEditor';
import ModuleEditor from './components/ModuleEditor';
import LessonEditor from './components/LessonEditor';
import BulkOperations from './components/BulkOperations';
import ContentSearch from './components/ContentSearch';
import MediaLibrary from './components/MediaLibrary';

type CourseWithContent = Awaited<ReturnType<typeof fetchCoursesWithContent>>[number];

// Helper function to map between CourseWithContent and ContentNode
// Type guard to check if an item is CmsContentItem
const isCmsContentItem = (item: unknown): item is CmsContentItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    ['course', 'module', 'lesson'].includes((item as { type?: string }).type ?? '')
  );
};

const mapToContentNode = (item: CourseWithContent | CmsContentItem): ContentNode => {
  // Handle CmsContentItem (local state)
  if (isCmsContentItem(item)) {
    // Base properties that are always present
    const baseNode: Omit<ContentNode, 'type'> = {
      id: item.id,
      title: item.title,
      ...(item.description ? { description: item.description } : {})
    };

    // Add type-specific properties with proper typing
    if (item.type === 'course') {
      return {
        ...baseNode,
        type: 'course',
        status: 'draft',
        price: item.price || 0,
      };
    } else if (item.type === 'module') {
      return {
        ...baseNode,
        type: 'module',
        status: 'draft',
        lessons: [],
      };
    } else {
      return {
        ...baseNode,
        type: 'lesson',
        status: 'draft',
        duration: item.duration || 0,
      };
    }
  }

  // Handle CourseWithContent (from API)
  const result: ContentNode = {
    id: item.id,
    title: item.title,
    type: 'course',
    status: 'draft',
    ...(item.description ? { description: item.description } : {})
  };

  // Add modules if they exist
  if (item.modules?.length) {
    result.modules = item.modules.map(module => ({
      id: module.id,
      title: module.title,
      type: 'module' as const,
      status: 'draft',
      ...(module.description ? { description: module.description } : {}),
      ...(module.lessons?.length ? {
        lessons: module.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          type: 'lesson' as const,
          status: 'draft',
          ...(lesson.duration ? { duration: lesson.duration } : {})
        }))
      } : {})
    }));
  }
  return result;
};

const ContentManagementCoursesModulesLessonsContent = (): ReactElement => {
  const { setSidebarOpen } = useAdminSidebar();
  const [selectedContent, setSelectedContent] = useState<CmsContentItem | null>(null);
  const [contentType, setContentType] = useState('course');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

  const [contentData, setContentData] = useState<CourseWithContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { createCourse, updateCourse, deleteCourse } = useAdminCourses();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const courses = await fetchCoursesWithContent();
        setContentData(courses);
      } catch (err) {
        log.error('Failed to fetch courses', err);
        toast.error('Erreur lors du chargement du contenu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleContentSelect = (content: CmsContentItem) => {
    setSelectedContent(content);
    setContentType(content.type);
  };

  const handleSaveContent = async <T extends CmsContentItem>(
    updatedContent: T
  ): Promise<void> => {
    try {
      if (contentType === 'course') {
        const courseData = updatedContent as CmsCourse;
        let savedCourse: CourseWithContent;
        
        // Create slug from title if not provided
        const slug = courseData.title 
          ? courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
          : `course-${Date.now()}`;
        
        // Convert to CourseRow format for API
        const updates = {
          title: courseData.title,
          description: courseData.description || '',
          price: courseData.price || 0,
          status: courseData.status || 'draft',
          slug,
          updated_at: new Date().toISOString()
        } as const;
        
        // Create course data for API with proper type handling
        const courseDataForApi: Omit<CourseRow, 'id'> & { id?: string } = {
          title: updates.title,
          description: updates.description,
          price: updates.price,
          status: updates.status as 'draft' | 'published' | 'archived', // Explicit status type
          slug: updates.slug,
          updated_at: updates.updated_at,
          // Default values for required fields
          category: null,
          cover_image_url: null,
          difficulty: null,
          is_published: false,
          thumbnail_url: null,
          created_at: courseData.createdAt || new Date().toISOString()
        };
        
        // Add id only if it exists and is not a temp id
        if (courseData.id && !courseData.id.startsWith('temp-')) {
          courseDataForApi.id = courseData.id;
        }
        
        try {
          if (courseDataForApi.id) {
            // For updates, use the updateCourse function with the correct parameter structure
            const { id, ...updates } = courseDataForApi;
            const result = await updateCourse({
              id,
              updates
            });
            savedCourse = result as CourseWithContent;
            setContentData(prev => 
              prev.map(c => (c.id === savedCourse.id ? savedCourse : c))
            );
            toast.success('Cours mis à jour avec succès !');
          } else {
            // For new courses, use createCourse with the full course data
            const { id, ...newCourseData } = courseDataForApi;
            const result = await createCourse(newCourseData);
            savedCourse = result as CourseWithContent;
            setContentData(prev => [...prev, savedCourse]);
            toast.success('Cours créé avec succès !');
          }
        } catch (error) {
          log.error('Erreur lors de la sauvegarde du cours:', error);
          throw error; // Re-throw pour le catch parent
        }
        setSelectedContent(savedCourse as T);
      } else {
        // Handle module or lesson save locally for now
        log.info('Saving non-course content (local state only):', updatedContent);
        setSelectedContent(updatedContent);
      }
    } catch (error) {
      log.error('Erreur lors de la sauvegarde du contenu:', error);
      toast.error('Erreur lors de la sauvegarde du contenu');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      if (contentType === 'course') {
        await deleteCourse(contentId);
        setContentData(prev => prev.filter(c => c.id !== contentId));
        setSelectedContent(null);
        toast.success('Cours supprimé avec succès !');
      } else {
        // Handle module or lesson deletion locally for now
        log.info('Deleting non-course content (local state only):', contentId);
        setSelectedContent(null);
      }
    } catch (error) {
      log.error('Erreur lors de la suppression du contenu:', error);
      toast.error('Erreur lors de la suppression du contenu');
    }
  };

  const handleBulkOperation = (operation: string, items: string[]) => {
    log.info('Bulk operation:', operation, items);
    setSelectedItems([]);
    setShowBulkOperations(false);
  };

  const renderContentEditor = (): ReactElement => {
    if (!selectedContent) {
      return (
        <div className='flex-1 flex items-center justify-center bg-surface'>
          <div className='text-center'>
            <Icon
              aria-hidden='true'
              name='FileText'
              size={64}
              className='text-secondary-300 mx-auto mb-4'
            />
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

    const handleSave = async <T extends CmsContentItem>(
      data: ContentItemToRow<T>
    ): Promise<void> => {
      try {
        await handleSaveContent(data as T);
      } catch (error) {
        log.error('Error saving content:', error);
        toast.error('Erreur lors de la sauvegarde du contenu');
      }
    };

    const handleDelete = () => {
      if (selectedContent.id) {
        handleDeleteContent(selectedContent.id);
      }
    };

    switch (contentType) {
      case 'course':
        return (
          <CourseEditor
            course={selectedContent as CourseRow}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case 'module':
        return (
          <ModuleEditor
            module={selectedContent as ModuleRow}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      case 'lesson':
        return (
          <LessonEditor
            lesson={selectedContent as LessonRow}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      default:
        return (
          <div className='flex-1 flex items-center justify-center bg-surface'>
            <div className='text-center'>
              <h3 className='text-xl font-semibold text-text-primary mb-2'>
                Type de contenu non pris en charge
              </h3>
            </div>
          </div>
        );
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Icon aria-hidden='true' name='Loader' className='animate-spin text-primary' size={48} />
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
            <Icon aria-hidden='true' name='Menu' size={20} />
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
                onCreateNew={() =>
                  setSelectedContent({ 
                    id: `temp-${Date.now()}`,
                    type: 'course', 
                    title: '', 
                    description: '',
                    price: 0,
                    status: 'draft'
                  } as CmsCourse)
                }
              />
              {selectedItems.length > 0 && (
                <button
                  onClick={() => setShowBulkOperations(true)}
                  className='mt-3 w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center'
                >
                  <Icon aria-hidden='true' name='Edit' size={16} className='mr-2' />
                  Actions groupées ({selectedItems.length})
                </button>
              )}
            </div>
            <div className='flex-1 overflow-y-auto'>
              <ContentTree
                contentData={contentData.map(mapToContentNode)}
                searchQuery={searchQuery}
                selectedContent={selectedContent ? mapToContentNode(selectedContent) : null}
                selectedItems={selectedItems}
                onContentSelect={(item) => handleContentSelect(item as CmsContentItem)}
                onItemsSelect={setSelectedItems}
                onReorder={(newOrder) => {
                  // Convert back from ContentNode to CourseWithContent
                  const updatedData = newOrder.map(node => {
                    const original = contentData.find(c => c.id === node.id);
                    return original || (node as CourseWithContent);
                  });
                  setContentData(updatedData);
                }}
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
            onSelectMedia={media => {
              log.info('Selected media:', media);
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

interface ContentManagementCoursesModulesLessonsProps {}

const ContentManagementCoursesModulesLessons: React.FC<ContentManagementCoursesModulesLessonsProps> = () => (
  <AdminLayout>
    <ContentManagementCoursesModulesLessonsContent />
  </AdminLayout>
);

export default ContentManagementCoursesModulesLessons;
