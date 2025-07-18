import React, { useState } from 'react';
import Icon from '@frontend/components/AppIcon';
import { log } from '@libs/logger';

// Unified representation of a content node in the tree
export interface ContentNode {
  id: string;
  title: string;
  type: 'course' | 'module' | 'lesson';
  status?: string;
  description?: string;
  price?: number;
  enrollments?: number;
  duration?: number;
  completions?: number;
  children?: ContentNode[];
  modules?: ContentNode[];
  lessons?: ContentNode[];
}

interface ContentTreeProps {
  contentData: ContentNode[];
  searchQuery: string;
  selectedContent: ContentNode | null;
  selectedItems: string[];
  onContentSelect: (item: ContentNode) => void;
  onItemsSelect: (items: string[]) => void;
  onReorder?: (newOrder: ContentNode[]) => void;
}

const ContentTree: React.FC<ContentTreeProps> = ({
  contentData,
  searchQuery,
  selectedContent,
  selectedItems,
  onContentSelect,
  onItemsSelect,
  onReorder,
}) => {
  // Par défaut, aucun élément n'est déplié
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<ContentNode | null>(null);

  const toggleExpanded = (id: string): void => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemSelect = (
    item: ContentNode,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (event.ctrlKey || event.metaKey) {
      const newSelected = selectedItems.includes(item.id)
        ? selectedItems.filter(id => id !== item.id)
        : [...selectedItems, item.id];
      onItemsSelect(newSelected);
    } else {
      onContentSelect(item);
      onItemsSelect([]);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ContentNode): void => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetItem: ContentNode): void => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== targetItem.id) {
      log.debug('Reordering:', draggedItem, 'to', targetItem);
      // Ici tu peux insérer ta logique de reorder réelle si besoin
      if (onReorder) {
        // Appelle onReorder avec le nouvel ordre souhaité
      }
    }
    setDraggedItem(null);
  };

  const getStatusIcon = (status?: string): JSX.Element => {
    switch (status) {
      case 'published':
        return <Icon aria-hidden='true' name='CheckCircle' size={16} className='text-accent' />;
      case 'draft':
        return <Icon aria-hidden='true' name='Clock' size={16} className='text-warning' />;
      default:
        return <Icon aria-hidden='true' name='Circle' size={16} className='text-secondary-400' />;
    }
  };

  const getTypeIcon = (type?: string): JSX.Element => {
    switch (type) {
      case 'course':
        return <Icon aria-hidden='true' name='BookOpen' size={16} className='text-primary' />;
      case 'module':
        return <Icon aria-hidden='true' name='Folder' size={16} className='text-secondary-600' />;
      case 'lesson':
        return <Icon aria-hidden='true' name='FileText' size={16} className='text-secondary-500' />;
      default:
        return <Icon aria-hidden='true' name='File' size={16} className='text-secondary-400' />;
    }
  };

  // Recherche plein texte (intitulé ou description)
  const filterContent = (items: ContentNode[], query: string): ContentNode[] => {
    if (!query) return items;
    return items.filter(
      item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Affiche les leçons d'un module
  const renderLessons = (lessons?: ContentNode[]): React.ReactNode => {
    if (!lessons || lessons.length === 0) return null;
    return (
      <div className='ml-6'>
        {lessons.map(lesson => (
          <div
            key={lesson.id}
            draggable
            onDragStart={e => handleDragStart(e, lesson)}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, lesson)}
            onClick={e => handleItemSelect(lesson, e)}
            className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 group ${
              selectedContent?.id === lesson.id
                ? 'bg-primary-50 border border-primary-200'
                : selectedItems.includes(lesson.id)
                  ? 'bg-accent-50 border border-accent-200'
                  : 'hover:bg-secondary-50'
            }`}
          >
            <input
              type='checkbox'
              checked={selectedItems.includes(lesson.id)}
              onChange={e => {
                e.stopPropagation();
                const newSelected = e.target.checked
                  ? [...selectedItems, lesson.id]
                  : selectedItems.filter(id => id !== lesson.id);
                onItemsSelect(newSelected);
              }}
              className='mr-2 rounded border-secondary-300 text-primary focus:ring-primary'
            />

            {getTypeIcon(lesson.type)}

            <div className='flex-1 ml-2 min-w-0'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-text-primary truncate'>
                  {lesson.title}
                </span>
                <div className='flex items-center space-x-1 ml-2'>
                  {getStatusIcon(lesson.status)}
                  <span className='text-xs text-text-secondary'>{lesson.duration}min</span>
                </div>
              </div>
              <div className='text-xs text-text-secondary mt-1'>
                {lesson.completions} complétions
              </div>
            </div>

            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2'>
              <button className='p-1 hover:bg-secondary-100 rounded'>
                <Icon
                  name='MoreVertical'
                  size={14}
                  aria-label="Plus d'options"
                  className='text-secondary-500'
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Affiche les modules d'un cours
  const renderModules = (modules?: ContentNode[]): React.ReactNode => {
    if (!modules || modules.length === 0) return null;
    return (
      <div className='ml-6'>
        {modules.map(module => (
          <div key={module.id} className='mb-1'>
            <div
              draggable
              onDragStart={e => handleDragStart(e, module)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, module)}
              onClick={e => handleItemSelect(module, e)}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 group ${
                selectedContent?.id === module.id
                  ? 'bg-primary-50 border border-primary-200'
                  : selectedItems.includes(module.id)
                    ? 'bg-accent-50 border border-accent-200'
                    : 'hover:bg-secondary-50'
              }`}
            >
              <input
                type='checkbox'
                checked={selectedItems.includes(module.id)}
                onChange={e => {
                  e.stopPropagation();
                  const newSelected = e.target.checked
                    ? [...selectedItems, module.id]
                    : selectedItems.filter(id => id !== module.id);
                  onItemsSelect(newSelected);
                }}
                className='mr-2 rounded border-secondary-300 text-primary focus:ring-primary'
              />

              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleExpanded(module.id);
                }}
                className='mr-2 p-1 hover:bg-secondary-100 rounded transition-colors duration-200'
              >
                <Icon
                  aria-hidden='true'
                  name={expandedItems.has(module.id) ? 'ChevronDown' : 'ChevronRight'}
                  size={14}
                  className='text-secondary-500'
                />
              </button>

              {getTypeIcon(module.type)}

              <div className='flex-1 ml-2 min-w-0'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-text-primary truncate'>
                    {module.title}
                  </span>
                  <div className='flex items-center space-x-1 ml-2'>
                    <span className='text-xs text-text-secondary'>
                      {module.lessons?.length || 0} leçons
                    </span>
                  </div>
                </div>
              </div>

              <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2'>
                <button className='p-1 hover:bg-secondary-100 rounded'>
                  <Icon
                    name='MoreVertical'
                    size={14}
                    aria-label="Plus d'options"
                    className='text-secondary-500'
                  />
                </button>
              </div>
            </div>
            {expandedItems.has(module.id) && renderLessons(module.lessons)}
          </div>
        ))}
      </div>
    );
  };

  const filteredContent = filterContent(contentData, searchQuery);

  return (
    <div className='p-4 space-y-2'>
      {filteredContent.map(course => (
        <div key={course.id} className='mb-2'>
          <div
            draggable
            onDragStart={e => handleDragStart(e, course)}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, course)}
            onClick={e => handleItemSelect(course, e)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 group ${
              selectedContent?.id === course.id
                ? 'bg-primary-50 border border-primary-200'
                : selectedItems.includes(course.id)
                  ? 'bg-accent-50 border border-accent-200'
                  : 'hover:bg-secondary-50'
            }`}
          >
            <input
              type='checkbox'
              checked={selectedItems.includes(course.id)}
              onChange={e => {
                e.stopPropagation();
                const newSelected = e.target.checked
                  ? [...selectedItems, course.id]
                  : selectedItems.filter(id => id !== course.id);
                onItemsSelect(newSelected);
              }}
              className='mr-3 rounded border-secondary-300 text-primary focus:ring-primary'
            />

            <button
              onClick={e => {
                e.stopPropagation();
                toggleExpanded(course.id);
              }}
              className='mr-3 p-1 hover:bg-secondary-100 rounded transition-colors duration-200'
            >
              <Icon
                aria-hidden='true'
                name={expandedItems.has(course.id) ? 'ChevronDown' : 'ChevronRight'}
                size={16}
                className='text-secondary-500'
              />
            </button>

            {getTypeIcon(course.type)}

            <div className='flex-1 ml-3 min-w-0'>
              <div className='flex items-center justify-between'>
                <span className='font-medium text-text-primary truncate'>{course.title}</span>
                <div className='flex items-center space-x-2 ml-2'>
                  {getStatusIcon(course.status)}
                  <span className='text-xs text-text-secondary'>{course.enrollments} inscrits</span>
                </div>
              </div>
              <div className='text-sm text-text-secondary mt-1 truncate'>
                {course.modules?.length || 0} modules • {course.price}€
              </div>
            </div>

            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2'>
              <button className='p-1 hover:bg-secondary-100 rounded'>
                <Icon
                  name='MoreVertical'
                  size={16}
                  aria-label="Plus d'options"
                  className='text-secondary-500'
                />
              </button>
            </div>
          </div>
          {expandedItems.has(course.id) && renderModules(course.modules)}
        </div>
      ))}

      {filteredContent.length === 0 && (
        <div className='text-center py-8'>
          <Icon
            aria-hidden='true'
            name='Search'
            size={48}
            className='text-secondary-300 mx-auto mb-4'
          />
          <p className='text-text-secondary'>
            {searchQuery ? 'Aucun contenu trouvé' : 'Aucun contenu disponible'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentTree;
