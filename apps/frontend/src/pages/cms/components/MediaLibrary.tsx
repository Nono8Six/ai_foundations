import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import logger from '../../../utils/logger';
import {
  BUCKETS,
  listBucketFiles,
  uploadToBucket,
  getPublicUrl,
} from '../../../services/storageService';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadDate: string;
  type: string;
}

const MediaLibrary = ({ onClose, onSelectMedia }) => {
  const [activeTab, setActiveTab] = useState('images');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaData, setMediaData] = useState<MediaItem[]>([]);
  const [tabCounts, setTabCounts] = useState({ images: 0, videos: 0, documents: 0 });

  const tabs = [
    { id: 'images', label: 'Images', icon: 'Image', count: tabCounts.images },
    { id: 'videos', label: 'Vidéos', icon: 'Video', count: tabCounts.videos },
    { id: 'documents', label: 'Documents', icon: 'FileText', count: tabCounts.documents },
  ];

  const fetchMedia = async tab => {
    try {
      const files = await listBucketFiles(BUCKETS[tab]);
      const items = (files || []).map(f => ({
        id: f.id || f.name,
        name: f.name,
        url: getPublicUrl(BUCKETS[tab], f.name),
        size: f.metadata?.size || f.size || 0,
        uploadDate: f.updated_at,
        type: tab.slice(0, -1),
      }));
      setMediaData(items);
      setTabCounts(prev => ({ ...prev, [tab]: items.length }));
    } catch (err) {
      logger.error('Failed to load media', err);
      setMediaData([]);
      setTabCounts(prev => ({ ...prev, [tab]: 0 }));
    }
  };

  useEffect(() => {
    fetchMedia(activeTab);
  }, [activeTab]);

  const handleFileUpload = async event => {
    const files = Array.from(event.target.files);
    if (files.length) {
      setIsUploading(true);
      try {
        await Promise.all(
          files.map(file => uploadToBucket(BUCKETS[activeTab], file))
        );
        fetchMedia(activeTab);
      } catch (err) {
        logger.error('Upload failed', err);
      }
      setIsUploading(false);
    }
  };

  const handleItemSelect = item => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter(id => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const handleSelectMedia = () => {
    const selectedMedia = mediaData.filter(item => selectedItems.includes(item.id));
    onSelectMedia(selectedMedia);
  };

  const filteredMedia = mediaData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMediaItem = item => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <div
        key={item.id}
        onClick={() => handleItemSelect(item)}
        className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-medium ${
          isSelected ? 'border-primary bg-primary-50' : 'border-border hover:border-secondary-300'
        }`}
      >
        {/* Selection Checkbox */}
        <div className='absolute top-2 right-2 z-10'>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected ? 'bg-primary border-primary' : 'bg-white border-secondary-300'
            }`}
          >
            {isSelected && <Icon aria-hidden="true"  name='Check' size={14} color='white' />}
          </div>
        </div>

        {/* Media Preview */}
        <div className='aspect-square bg-secondary-100 rounded-t-lg overflow-hidden'>
          {item.type === 'image' ? (
            <Image src={item.url} alt={item.name} className='w-full h-full object-cover' />
          ) : item.type === 'video' ? (
            <div className='w-full h-full flex items-center justify-center'>
              <Icon aria-hidden="true"  name='Play' size={32} className='text-secondary-400' />
            </div>
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <Icon aria-hidden="true"  name='FileText' size={32} className='text-secondary-400' />
            </div>
          )}
        </div>

        {/* Media Info */}
        <div className='p-3'>
          <h4 className='font-medium text-text-primary text-sm truncate mb-1'>{item.name}</h4>
          <div className='text-xs text-text-secondary space-y-1'>
            {item.size && (
              <div>{(item.size / 1024 / 1024).toFixed(2)} MB</div>
            )}
            {item.dimensions && <div>{item.dimensions}</div>}
            {item.duration && <div>{item.duration}</div>}
            {item.pages && <div>{item.pages} pages</div>}
            <div>{new Date(item.uploadDate).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-surface rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <div>
            <h2 className='text-xl font-semibold text-text-primary'>Bibliothèque multimédia</h2>
            <p className='text-text-secondary mt-1'>Gérez vos fichiers et ressources</p>
          </div>

          <button
            onClick={onClose}
            className='p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200'
          >
            <Icon name='X' size={20} aria-label='Fermer la bibliothèque' />
          </button>
        </div>

        {/* Tabs */}
        <div className='border-b border-border'>
          <nav className='flex px-6'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedItems([]);
                }}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon aria-hidden="true"  name={tab.icon} size={16} className='mr-2' />
                {tab.label}
                <span className='ml-2 px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded-full text-xs'>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Toolbar */}
        <div className='flex items-center justify-between p-6 border-b border-border bg-secondary-50'>
          {/* Search */}
          <div className='flex-1 max-w-md'>
            <div className='relative'>
              <Icon aria-hidden="true" 
                name='Search'
                size={20}
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400'
              />
              <input
                type='text'
                placeholder='Rechercher des fichiers...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>
          </div>

          {/* Upload Button */}
          <label className='ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 cursor-pointer font-medium'>
            <input
              type='file'
              multiple
              accept={
                activeTab === 'images'
                  ? 'image/*'
                  : activeTab === 'videos'
                    ? 'video/*'
                    : '.pdf,.doc,.docx,.txt'
              }
              onChange={handleFileUpload}
              className='hidden'
            />
            {isUploading ? (
              <div className='flex items-center'>
                <Icon aria-hidden="true"  name='Loader2' size={16} className='animate-spin mr-2' />
                Téléchargement...
              </div>
            ) : (
              <div className='flex items-center'>
                <Icon aria-hidden="true"  name='Upload' size={16} className='mr-2' />
                Télécharger
              </div>
            )}
          </label>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {filteredMedia.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {filteredMedia.map(renderMediaItem)}
            </div>
          ) : (
            <div className='text-center py-12'>
              <Icon aria-hidden="true" 
                name={tabs.find(t => t.id === activeTab)?.icon || 'File'}
                size={64}
                className='text-secondary-300 mx-auto mb-4'
              />
              <h3 className='text-lg font-medium text-text-primary mb-2'>
                {searchQuery ? 'Aucun fichier trouvé' : 'Aucun fichier'}
              </h3>
              <p className='text-text-secondary mb-6'>
                {searchQuery
                  ? 'Essayez de modifier votre recherche'
                  : 'Téléchargez vos premiers fichiers pour commencer'}
              </p>
              {!searchQuery && (
                <label className='inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 cursor-pointer font-medium'>
                  <input
                    type='file'
                    multiple
                    accept={
                      activeTab === 'images'
                        ? 'image/*'
                        : activeTab === 'videos'
                          ? 'video/*'
                          : '.pdf,.doc,.docx,.txt'
                    }
                    onChange={handleFileUpload}
                    className='hidden'
                  />
                  <Icon aria-hidden="true"  name='Upload' size={16} className='mr-2' />
                  Télécharger des fichiers
                </label>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedItems.length > 0 && (
          <div className='flex items-center justify-between p-6 border-t border-border bg-secondary-50'>
            <div className='text-sm text-text-secondary'>
              {selectedItems.length} fichier{selectedItems.length > 1 ? 's' : ''} sélectionné
              {selectedItems.length > 1 ? 's' : ''}
            </div>

            <div className='flex items-center space-x-3'>
              <button
                onClick={() => setSelectedItems([])}
                className='px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200'
              >
                Annuler
              </button>

              <button
                onClick={handleSelectMedia}
                className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'
              >
                <Icon aria-hidden="true"  name='Check' size={16} className='mr-2' />
                Sélectionner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
