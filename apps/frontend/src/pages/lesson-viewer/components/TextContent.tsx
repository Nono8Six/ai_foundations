import React, { useState, useEffect, useRef } from 'react';
import Icon from '@frontend/components/AppIcon';

interface Bookmark {
  id: number;
  position: number;
  timestamp: string;
  preview: string;
}

export interface TextContentProps {
  content: string;
  onProgress: (percent: number) => void;
}

const TextContent: React.FC<TextContentProps> = ({ content, onProgress }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [fontSize, setFontSize] = useState('base');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const handleScroll = () => {
      const element = contentRef.current;
      if (!element) return;

      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setReadingProgress(progress);
      onProgress(progress);
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [onProgress]);

  const addBookmark = () => {
    const element = contentRef.current;
    if (!element) return;

    const scrollPosition = element.scrollTop;
    const newBookmark = {
      id: Date.now(),
      position: scrollPosition,
      timestamp: new Date().toISOString(),
      preview: 'Signet ajouté',
    };

    setBookmarks([...bookmarks, newBookmark]);
  };

  const goToBookmark = (bookmark: Bookmark): void => {
    const element = contentRef.current;
    if (element) {
      element.scrollTo({ top: bookmark.position, behavior: 'smooth' });
    }
  };

  const removeBookmark = (bookmarkId: number): void => {
    setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
  };

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const themeClasses = {
    light: 'bg-surface text-text-primary',
    dark: 'bg-secondary-800 text-white',
    sepia: 'bg-amber-50 text-amber-900',
  };

  // Parse markdown-like content
  const parseContent = (text: string) => {
    return text.split('\n').map((line: string, index: number) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className='text-3xl font-bold mb-6 text-text-primary'>
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className='text-2xl font-semibold mb-4 text-text-primary'>
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className='text-xl font-semibold mb-3 text-text-primary'>
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className='mb-2'>
            {line.slice(2)}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className='mb-2'>
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className='mb-4'></div>;
      }
      return (
        <p key={index} className='mb-4 leading-relaxed'>
          {line}
        </p>
      );
    });
  };

  return (
    <div className='h-full flex flex-col'>
      {/* Reading Controls */}
      <div className='bg-surface border-b border-border p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <Icon aria-hidden='true' name='Type' size={16} className='text-text-secondary' />
            <select
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
              className='text-sm border border-border rounded px-2 py-1 bg-surface'
            >
              <option value='sm'>Petit</option>
              <option value='base'>Normal</option>
              <option value='lg'>Grand</option>
              <option value='xl'>Très grand</option>
            </select>
          </div>

          <div className='flex items-center space-x-2'>
            <Icon aria-hidden='true' name='Palette' size={16} className='text-text-secondary' />
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className='text-sm border border-border rounded px-2 py-1 bg-surface'
            >
              <option value='light'>Clair</option>
              <option value='dark'>Sombre</option>
              <option value='sepia'>Sépia</option>
            </select>
          </div>

          <button
            onClick={addBookmark}
            className='flex items-center space-x-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary-700 transition-colors'
          >
            <Icon aria-hidden='true' name='Bookmark' size={16} />
            <span className='text-sm'>Signet</span>
          </button>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <Icon aria-hidden='true' name='BookOpen' size={16} className='text-text-secondary' />
            <span className='text-sm text-text-secondary'>{Math.round(readingProgress)}% lu</span>
          </div>

          <div className='w-32 h-2 bg-secondary-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-300'
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className='flex-1 flex overflow-hidden'>
        {/* Main Content */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-auto p-8 ${themeClasses[theme as keyof typeof themeClasses]} ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}
        >
          <div className='max-w-4xl mx-auto'>
            <div className='prose prose-lg max-w-none'>{parseContent(content)}</div>
          </div>
        </div>

        {/* Bookmarks Sidebar */}
        {bookmarks.length > 0 && (
          <div className='w-64 bg-surface border-l border-border flex flex-col'>
            <div className='p-4 border-b border-border'>
              <h3 className='font-semibold text-text-primary flex items-center'>
                <Icon aria-hidden='true' name='Bookmark' size={16} className='mr-2' />
                Signets ({bookmarks.length})
              </h3>
            </div>

            <div className='flex-1 overflow-auto p-4 space-y-3'>
              {bookmarks.map(bookmark => (
                <div
                  key={bookmark.id}
                  className='p-3 border border-border rounded-lg hover:bg-secondary-50 transition-colors group cursor-pointer'
                  onClick={() => goToBookmark(bookmark)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-text-primary mb-1'>
                        {bookmark.preview}
                      </p>
                      <p className='text-xs text-text-secondary'>
                        {new Date(bookmark.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeBookmark(bookmark.id);
                      }}
                      className='opacity-0 group-hover:opacity-100 p-1 hover:bg-error-100 rounded transition-all'
                    >
                      <Icon
                        name='X'
                        size={12}
                        className='text-error'
                        aria-label='Supprimer signet'
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextContent;
