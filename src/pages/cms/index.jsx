import React, { useState } from 'react';

import Icon from '../../components/AppIcon';
import ContentTree from './components/ContentTree';
import CourseEditor from './components/CourseEditor';
import ModuleEditor from './components/ModuleEditor';
import LessonEditor from './components/LessonEditor';
import BulkOperations from './components/BulkOperations';
import ContentSearch from './components/ContentSearch';
import MediaLibrary from './components/MediaLibrary';

const ContentManagementCoursesModulesLessons = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState('course');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

  // Mock data for content hierarchy
  const mockContentData = [
    {
      id: 1,
      type: 'course',
      title: "Introduction à l'Intelligence Artificielle",
      description:
        "Découvrez les fondamentaux de l'IA et ses applications pratiques dans le monde professionnel.",
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=400',
      price: 299,
      enrollments: 1247,
      rating: 4.8,
      modules: [
        {
          id: 11,
          type: 'module',
          title: "Concepts de base de l'IA",
          description: "Comprenez les principes fondamentaux de l'intelligence artificielle.",
          order: 1,
          lessons: [
            {
              id: 111,
              type: 'lesson',
              title: "Qu'est-ce que l'Intelligence Artificielle ?",
              content: `L'Intelligence Artificielle (IA) représente l'une des révolutions technologiques les plus importantes de notre époque. Cette discipline vise à créer des machines capables de simuler l'intelligence humaine pour résoudre des problèmes complexes.L'IA englobe plusieurs domaines comme l'apprentissage automatique, le traitement du langage naturel, la vision par ordinateur et la robotique. Ces technologies transforment déjà notre quotidien professionnel et personnel.`,
              duration: 15,
              videoUrl: 'https://example.com/video1.mp4',
              status: 'published',
              order: 1,
              completions: 892,
            },
            {
              id: 112,
              type: 'lesson',
              title: "Histoire et évolution de l'IA",
              content: `L'histoire de l'IA remonte aux années 1950 avec les travaux pionniers d'Alan Turing et John McCarthy. Depuis, cette discipline a connu plusieurs phases d'évolution marquées par des avancées technologiques majeures. Des premiers programmes de jeu d'échecs aux réseaux de neurones modernes, l'IA a progressé de manière exponentielle, particulièrement avec l'émergence du deep learning et des modèles de langage comme GPT.`,
              duration: 20,
              videoUrl: 'https://example.com/video2.mp4',
              status: 'published',
              order: 2,
              completions: 756,
            },
          ],
        },
        {
          id: 12,
          type: 'module',
          title: "Applications pratiques de l'IA",
          description: "Explorez les cas d'usage concrets de l'IA dans différents secteurs.",
          order: 2,
          lessons: [
            {
              id: 121,
              type: 'lesson',
              title: 'IA dans la finance et comptabilité',
              content: `L'intelligence artificielle révolutionne le secteur financier en automatisant les tâches répétitives et en améliorant la précision des analyses. Les algorithmes d'IA peuvent traiter des milliers de transactions en quelques secondes. Dans la comptabilité, l'IA aide à la détection de fraudes, à l'automatisation de la saisie comptable et à l'analyse prédictive des flux de trésorerie. Ces outils permettent aux professionnels de se concentrer sur des tâches à plus haute valeur ajoutée.`,
              duration: 25,
              videoUrl: 'https://example.com/video3.mp4',
              status: 'draft',
              order: 1,
              completions: 234,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      type: 'course',
      title: 'Machine Learning pour Débutants',
      description:
        'Apprenez les bases du machine learning avec des exemples pratiques et des exercices interactifs.',
      status: 'draft',
      thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?w=400',
      price: 399,
      enrollments: 0,
      rating: 0,
      modules: [],
    },
  ];

  const [contentData, setContentData] = useState(mockContentData);


  const handleContentSelect = content => {
    setSelectedContent(content);
    setContentType(content.type);
  };

  const handleSaveContent = updatedContent => {
    // Mock save functionality
    console.log('Saving content:', updatedContent);
    setSelectedContent(updatedContent);
  };

  const handleDeleteContent = contentId => {
    // Mock delete functionality
    console.log('Deleting content:', contentId);
    setSelectedContent(null);
  };

  const handleBulkOperation = (operation, items) => {
    console.log('Bulk operation:', operation, items);
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
            console.log('Selected media:', media);
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