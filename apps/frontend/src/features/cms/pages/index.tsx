import { useState, useEffect, ReactElement } from 'react';
import { useAdminCourses } from '@features/admin/contexts/AdminCourseContext';
import { toast } from 'sonner';
import { fetchCoursesForCMS, dbRowToCmsCourse } from '@shared/services/courseService';
import { log } from '@libs/logger';
import type { Database } from '@frontend/types/database.types';
import type { CmsCourse as CmsCourseType } from '@frontend/types/course.types';
import {
  type CmsContentItem,
  type CmsCourse,
  type CmsModule,
  type CmsLesson,
  type CourseWithContent,
} from '@libs/cms-utils';

import Icon from '@shared/components/AppIcon';
import ContentTree, { ContentNode } from './components/ContentTree';
import CourseEditor from './components/CourseEditor';
import ModuleEditor from './components/ModuleEditor';
import LessonEditor from './components/LessonEditor';
import BulkOperations from './components/BulkOperations';
import ContentSearch from './components/ContentSearch';
import MediaLibrary from './components/MediaLibrary';

// Helper to check if an item is CmsContentItem
const isCmsContentItem = (item: unknown): item is CmsContentItem =>
  typeof item === 'object' &&
  item !== null &&
  'type' in item &&
  ['course', 'module', 'lesson'].includes((item as { type?: string }).type ?? '');

const mapToContentNode = (item: CmsCourseType | CourseWithContent | CmsContentItem): ContentNode => {
  // Si c'est un CmsCourseType (nouveau format)
  if (item && typeof item === 'object' && 'modules_count' in item) {
    const cmsItem = item as CmsCourseType;
    const result: ContentNode = {
      id: cmsItem.id,
      title: cmsItem.title,
      type: 'course',
      status: cmsItem.status === 'published' ? 'published' : 'draft',
      price: cmsItem.price || 0,
      ...(cmsItem.description ? { description: cmsItem.description } : {})
    };
    
    // Si des modules sont présents
    if (cmsItem.modules?.length) {
      result.modules = cmsItem.modules.map(module => ({
        id: module.id,
        title: module.title,
        type: 'module' as const,
        status: module.is_published ? 'published' : 'draft',
        ...(module.description ? { description: module.description } : {}),
        ...(module.lessons?.length
          ? {
              lessons: module.lessons.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                type: 'lesson' as const,
                status: lesson.is_published ? 'published' : 'draft',
                ...(lesson.duration ? { duration: lesson.duration } : {})
              }))
            }
          : {})
      }));
    }
    return result;
  }
  
  // Si c'est un CmsContentItem (format existant)
  if (isCmsContentItem(item)) {
    const baseNode: Omit<ContentNode, 'type'> = {
      id: item.id,
      title: item.title,
      ...(item.description ? { description: item.description } : {})
    };
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
  
  // API fallback (ancien format)
  const result: ContentNode = {
    id: item.id,
    title: item.title,
    type: 'course',
    status: 'draft',
    ...(item.description ? { description: item.description } : {})
  };
  if (item.modules?.length) {
    result.modules = item.modules.map(module => ({
      id: module.id,
      title: module.title,
      type: 'module' as const,
      status: 'draft',
      ...(module.description ? { description: module.description } : {}),
      ...(module.lessons?.length
        ? {
            lessons: module.lessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              type: 'lesson' as const,
              status: 'draft',
              ...(lesson.duration ? { duration: lesson.duration } : {})
            }))
          }
        : {})
    }));
  }
  return result;
};


const ContentManagementCoursesModulesLessons = (): ReactElement => {
  const [selectedContent, setSelectedContent] = useState<CmsContentItem | CmsCourseType | null>(null);
  const [contentType, setContentType] = useState<'course' | 'module' | 'lesson'>('course');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

  const [contentData, setContentData] = useState<CmsCourseType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { createCourse, updateCourse, deleteCourse } = useAdminCourses();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        log.info('Starting to fetch courses for CMS using robust validation...');
        const cmsCourses = await fetchCoursesForCMS();
        log.info('CMS courses fetched successfully:', cmsCourses);
        
        setContentData(cmsCourses);
        log.info(`Content data set successfully: ${cmsCourses.length} courses`);
      } catch (err) {
        log.error('Failed to fetch courses for CMS', err);
        log.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          error: err
        });
        toast.error('Erreur lors du chargement du contenu CMS');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleContentSelect = (content: CmsContentItem | CmsCourseType) => {
    setSelectedContent(content);
    if ('type' in content) {
      setContentType(content.type);
    } else {
      setContentType('course');
    }
  };

  const handleSaveContent = async <T extends CmsContentItem>(
    updatedContent: T
  ): Promise<void> => {
    try {
      if (contentType === 'course') {
        const courseData = updatedContent as CmsCourse;
        let savedCourse: CmsCourse;

        // Génère slug à partir du titre
        const slug = courseData.title
          ? courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
          : `course-${Date.now()}`;

        // Préparation des données pour l'API (seulement les champs de la table courses)
        const courseDataForApi: Omit<Database['public']['Tables']['courses']['Row'], 'id'> & {
          id?: string;
        } = {
          title: courseData.title,
          description: courseData.description || null,
          slug,
          cover_image_url: (courseData as any).cover_image_url || null,
          thumbnail_url: (courseData as any).thumbnail_url || null,
          category: (courseData as any).category || null,
          difficulty: courseData.difficulty || null,
          is_published: courseData.status === 'published' ? true : false,
          updated_at: new Date().toISOString(),
          created_at: (courseData as any).created_at || new Date().toISOString()
        };
        if (courseData.id && !courseData.id.startsWith('temp-')) {
          courseDataForApi.id = courseData.id;
        }
        if (courseDataForApi.id) {
          // Update
          const { id, ...updates } = courseDataForApi;
          const result = await updateCourse({ id, updates });
          const baseCourse = dbRowToCmsCourse(result);
          savedCourse = { ...baseCourse, type: 'course' as const } as CmsCourseType;
          setContentData(prev => prev.map(c => (c.id === savedCourse.id ? savedCourse as unknown as CmsCourseType : c)));
          toast.success('Cours mis à jour avec succès !');
        } else {
          // Create
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _discard, ...newCourseData } = courseDataForApi;
          const result = await createCourse(newCourseData);
          const baseCourse = dbRowToCmsCourse(result);
          savedCourse = { ...baseCourse, type: 'course' as const } as CmsCourseType;
          setContentData(prev => [...prev, savedCourse as unknown as CmsCourseType]);
          toast.success('Cours créé avec succès !');
        }
        // Convertir en CmsContentItem compatible
        const contentItem: CmsCourse = {
          ...savedCourse as any,
          type: 'course' as const
        };
        setSelectedContent(contentItem);
      } else {
        // Modules/Leçons (local state uniquement)
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
              Choisissez un cours, module ou leçon dans l&apos;arbre de contenu pour commencer l&apos;édition.
            </p>
          </div>
        </div>
      );
    }

    const handleCourseSave = async (data: CmsCourse) => {
      try {
        await handleSaveContent(data);
      } catch (error) {
        log.error('Error saving content:', error);
        toast.error('Erreur lors de la sauvegarde du contenu');
      }
    };

    const handleModuleSave = async (data: CmsModule) => {
      try {
        await handleSaveContent(data);
      } catch (error) {
        log.error('Error saving content:', error);
        toast.error('Erreur lors de la sauvegarde du contenu');
      }
    };

    const handleLessonSave = async (data: CmsLesson) => {
      try {
        await handleSaveContent(data);
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
            course={selectedContent as CmsCourse | null}
            onSave={handleCourseSave}
            onDelete={handleDelete}
          />
        );
      case 'module':
        return (
          <ModuleEditor
            module={selectedContent as CmsModule | null}
            onSave={handleModuleSave}
            onDelete={handleDelete}
          />
        );
      case 'lesson':
        return (
          <LessonEditor
            lesson={selectedContent as CmsLesson | null}
            onSave={handleLessonSave}
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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Icon aria-hidden='true' name='Loader' className='animate-spin text-primary' size={48} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <main className='p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-text-primary mb-2'>Gestion du Contenu</h1>
          <p className='text-text-secondary'>
            Créez et gérez les cours, modules et leçons de votre plateforme
          </p>
        </div>
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
                onContentSelect={item => handleContentSelect(item as CmsContentItem)}
                onItemsSelect={setSelectedItems}
                onReorder={newOrder => {
                  const updatedData = newOrder.map(node => {
                    const existing = contentData.find(c => c.id === node.id);
                    return existing ?? ({
                      ...node,
                      slug: node.title?.toLowerCase().replace(/\s+/g, '-') || 'course',
                      is_published: false,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      modules_count: 0,
                      lessons_count: 0,
                      estimated_duration: 0
                    } as unknown as CmsCourseType);
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
    </div>
  );
};

export default ContentManagementCoursesModulesLessons;
