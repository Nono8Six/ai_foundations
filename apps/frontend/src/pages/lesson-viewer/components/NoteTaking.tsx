import React, { useState } from 'react';
import Icon from '@frontend/components/AppIcon';

interface Note {
  id: number;
  content: string;
  timestamp: string;
  selectedText?: string;
}

export interface NoteTakingProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onAddNote: (note: string) => void;
  selectedText?: string;
}

const NoteTaking: React.FC<NoteTakingProps> = ({
  isOpen,
  onClose,
  notes,
  onAddNote,
  selectedText,
}) => {
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [noteFilter, setNoteFilter] = useState('all'); // all, highlights, personal

  const handleSubmitNote = e => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.selectedText && note.selectedText.toLowerCase().includes(searchTerm.toLowerCase()));

    if (noteFilter === 'highlights') {
      return matchesSearch && note.selectedText;
    }
    if (noteFilter === 'personal') {
      return matchesSearch && !note.selectedText;
    }
    return matchesSearch;
  });

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={onClose} />}

      {/* Notes Panel */}
      <div
        className={`
        fixed lg:relative inset-y-0 right-0 z-50 w-80 bg-surface border-l border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        flex flex-col
      `}
      >
        {/* Header */}
        <div className='p-4 border-b border-border flex items-center justify-between'>
          <h3 className='font-semibold text-text-primary flex items-center'>
            <Icon aria-hidden='true' name='StickyNote' size={20} className='mr-2' />
            Mes notes ({notes.length})
          </h3>
          <button
            onClick={onClose}
            className='lg:hidden p-1 hover:bg-secondary-50 rounded transition-colors'
          >
            <Icon name='X' size={20} aria-label='Fermer' />
          </button>
        </div>

        {/* Search and Filter */}
        <div className='p-4 border-b border-border space-y-3'>
          <div className='relative'>
            <Icon
              aria-hidden='true'
              name='Search'
              size={16}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary'
            />
            <input
              type='text'
              placeholder='Rechercher dans les notes...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          <div className='flex space-x-1'>
            {[
              { key: 'all', label: 'Toutes', icon: 'FileText' },
              { key: 'highlights', label: 'Surlignages', icon: 'Highlighter' },
              { key: 'personal', label: 'Personnelles', icon: 'Edit3' },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setNoteFilter(filter.key)}
                className={`
                  flex-1 flex items-center justify-center px-2 py-1 text-xs rounded transition-colors
                  ${
                    noteFilter === filter.key
                      ? 'bg-primary text-white'
                      : 'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
                  }
                `}
              >
                <Icon aria-hidden='true' name={filter.icon} size={12} className='mr-1' />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Note Form */}
        <div className='p-4 border-b border-border'>
          {selectedText && (
            <div className='mb-3 p-2 bg-warning-50 border border-warning-200 rounded text-sm'>
              <p className='text-warning-800 font-medium mb-1'>Texte sélectionné :</p>
              <p className='text-warning-700 italic'>"{selectedText}"</p>
            </div>
          )}

          <form onSubmit={handleSubmitNote} className='space-y-3'>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder={
                selectedText ? 'Ajouter une note sur ce passage...' : 'Écrire une nouvelle note...'
              }
              className='w-full h-20 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
            <button
              type='submit'
              disabled={!newNote.trim()}
              className='w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <Icon aria-hidden='true' name='Plus' size={16} className='mr-2' />
              Ajouter la note
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className='flex-1 overflow-auto'>
          {filteredNotes.length === 0 ? (
            <div className='p-8 text-center'>
              <Icon
                aria-hidden='true'
                name='StickyNote'
                size={48}
                className='mx-auto text-secondary-300 mb-4'
              />
              <p className='text-text-secondary mb-2'>
                {searchTerm ? 'Aucune note trouvée' : 'Aucune note pour le moment'}
              </p>
              <p className='text-sm text-text-secondary'>
                {searchTerm
                  ? 'Essayez un autre terme de recherche'
                  : 'Sélectionnez du texte ou ajoutez une note personnelle'}
              </p>
            </div>
          ) : (
            <div className='p-4 space-y-4'>
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className='p-3 border border-border rounded-lg hover:bg-secondary-50 transition-colors group'
                >
                  {/* Note Header */}
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center space-x-2'>
                      <Icon
                        aria-hidden='true'
                        name={note.selectedText ? 'Highlighter' : 'Edit3'}
                        size={14}
                        className={note.selectedText ? 'text-warning' : 'text-primary'}
                      />
                      <span className='text-xs text-text-secondary'>
                        {formatTimestamp(note.timestamp)}
                      </span>
                    </div>
                    <button className='opacity-0 group-hover:opacity-100 p-1 hover:bg-error-100 rounded transition-all'>
                      <Icon aria-hidden='true' name='Trash2' size={12} className='text-error' />
                    </button>
                  </div>

                  {/* Selected Text (if any) */}
                  {note.selectedText && (
                    <div className='mb-2 p-2 bg-warning-50 border-l-2 border-warning rounded text-sm'>
                      <p className='text-warning-800 italic'>"{note.selectedText}"</p>
                    </div>
                  )}

                  {/* Note Content */}
                  <p className='text-sm text-text-primary leading-relaxed'>{note.content}</p>

                  {/* Note Actions */}
                  <div className='mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button className='text-xs text-text-secondary hover:text-primary transition-colors flex items-center'>
                      <Icon aria-hidden='true' name='Edit2' size={12} className='mr-1' />
                      Modifier
                    </button>
                    <button className='text-xs text-text-secondary hover:text-primary transition-colors flex items-center'>
                      <Icon aria-hidden='true' name='Share' size={12} className='mr-1' />
                      Partager
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-border bg-secondary-50'>
          <button className='w-full flex items-center justify-center px-4 py-2 text-sm text-text-secondary hover:text-primary transition-colors'>
            <Icon aria-hidden='true' name='Download' size={16} className='mr-2' />
            Exporter toutes les notes
          </button>
        </div>
      </div>
    </>
  );
};

export default NoteTaking;
