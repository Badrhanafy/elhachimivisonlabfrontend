import React, { useState } from 'react';
import { PhotoIcon, EyeIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';
import ImagePreviewModal from './ImagePreviewModal';

const ImageGallery = ({ images, reservationId, onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await fetch(`/api/admin/images/${imageId}`, {
          method: 'DELETE',
        });
        onImageUpload();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    
    if (window.confirm(`Delete ${selectedImages.length} selected images?`)) {
      try {
        await fetch('/api/admin/images/bulk-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_ids: selectedImages }),
        });
        onImageUpload();
        setSelectedImages([]);
      } catch (error) {
        console.error('Error deleting images:', error);
      }
    }
  };

  return (
    <div>
      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedImages([])}
                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`relative rounded-lg border ${
              selectedImages.includes(image.id)
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200'
            } overflow-hidden bg-gray-50 hover:shadow-md transition-shadow duration-200`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedImages.includes(image.id)}
                onChange={() => {
                  setSelectedImages(prev =>
                    prev.includes(image.id)
                      ? prev.filter(id => id !== image.id)
                      : [...prev, image.id]
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Image Preview */}
            <div
              className="relative h-40 cursor-pointer overflow-hidden bg-gray-100"
              onClick={() => {
                setSelectedImage(image);
                setIsPreviewOpen(true);
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <PhotoIcon className="h-10 w-10 text-gray-400" />
              </div>
            </div>

            {/* Image Info */}
            <div className="p-3">
              <div className="mb-2">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {image.filename}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {image.caption || 'No caption'}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(image.size)}</span>
                <span>{new Date(image.created_at).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(image.url || `/storage/${image.path}`);
                    alert('Image URL copied to clipboard!');
                  }}
                  className="text-gray-600 hover:text-gray-900"
                  title="Copy URL"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedImage(image);
                      setIsPreviewOpen(true);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                    title="Preview"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        image={selectedImage}
        onDelete={handleDeleteImage}
      />
    </div>
  );
};

export default ImageGallery;