import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PhotoIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  LinkIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import ImageUploadModal from '../components/Images/UploadImageModal';
import ImagePreviewModal from '../components/Images/ImagePreviewModal';

const Images = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchImages();
    fetchReservations();
  }, []);

  const fetchImages = async () => {
    try {
      // In a real app, you'd fetch from your API
      // const response = await fetch('/api/admin/images');
      // const data = await response.json();
      // setImages(data);
      
      // Mock data for demonstration
      const mockImages = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        filename: `match_analysis_${i + 1}.jpg`,
        path: `/uploads/reservations/${Math.floor(i / 6) + 1}/${i + 1}.jpg`,
        mime_type: 'image/jpeg',
        size: Math.floor(Math.random() * 5000000) + 1000000,
        caption: `Match analysis image ${i + 1}`,
        created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        reservation: {
          id: Math.floor(i / 6) + 1,
          team: ['Real Madrid', 'FC Barcelona', 'Manchester United', 'Bayern Munich'][Math.floor(Math.random() * 4)]
        }
      }));
      setImages(mockImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = 
      image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.reservation?.team.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReservation = !selectedReservation || image.reservation?.id == selectedReservation;
    
    return matchesSearch && matchesReservation;
  });

  const handleSelectImage = (id) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imgId => imgId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const handleDeleteSelected = async () => {
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
        setImages(images.filter(img => !selectedImages.includes(img.id)));
        setSelectedImages([]);
      } catch (error) {
        console.error('Error deleting images:', error);
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

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Images</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all uploaded match analysis images
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
          Upload Images
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedReservation}
              onChange={(e) => setSelectedReservation(e.target.value)}
              className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Reservations</option>
              {reservations.map(reservation => (
                <option key={reservation.id} value={reservation.id}>
                  {reservation.team} - {new Date(reservation.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
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

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <PhotoIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-xl font-semibold text-gray-900">{images.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <InformationCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-2 mr-3">
              <LinkIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Reservations</p>
              <p className="text-xl font-semibold text-gray-900">
                {[...new Set(images.map(img => img.reservation?.id))].length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="rounded-lg bg-white shadow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading new images.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
                Upload Images
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`relative rounded-lg border ${selectedImages.includes(image.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} overflow-hidden bg-gray-50 hover:shadow-md transition-shadow duration-200`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => handleSelectImage(image.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div
                  className="relative h-48 cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => {
                    setPreviewImage(image);
                    setIsPreviewModalOpen(true);
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.filename}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {image.caption || 'No caption'}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className="truncate">{image.reservation?.team}</span>
                        <span className="mx-1">•</span>
                        <span>{formatFileSize(image.size)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(image.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setPreviewImage(image);
                          setIsPreviewModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Preview"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this image?')) {
                            // Handle delete
                          }
                        }}
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
        )}
      </div>

      {/* Modals */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={fetchImages}
        reservations={reservations}
      />

      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        image={previewImage}
      />
    </div>
  );
};

export default Images;