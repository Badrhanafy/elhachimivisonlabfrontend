// pages/admin/Images.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Image as ImageIcon,
  Calendar,
  User,
  MapPin,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Grid,
  List,
  Folder,
  Layers,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { reservationAPI } from '../../services/api';

const Images = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [expandedReservations, setExpandedReservations] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    fetchReservationsWithImages();
  }, []);

  const fetchReservationsWithImages = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAll();
      // Filter reservations that have images
      const reservationsWithImages = response.data.filter(res => 
        res.images && res.images.length > 0
      );
      setReservations(reservationsWithImages);
    } catch (error) {
      console.error('Error fetching reservations with images:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReservationExpand = (id) => {
    setExpandedReservations(prev =>
      prev.includes(id)
        ? prev.filter(resId => resId !== id)
        : [...prev, id]
    );
  };

  const toggleImageSelect = (imageId) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImagesInReservation = (reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation?.images) return;

    const allImageIds = reservation.images.map(img => img.id);
    const allSelected = allImageIds.every(id => selectedImages.includes(id));
    
    if (allSelected) {
      // Deselect all
      setSelectedImages(prev => prev.filter(id => !allImageIds.includes(id)));
    } else {
      // Select all
      setSelectedImages(prev => [...prev, ...allImageIds.filter(id => !prev.includes(id))]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedImages.length || !window.confirm(`Delete ${selectedImages.length} selected images?`)) return;
    
    try {
      // Implement bulk delete API call
      // await Promise.all(selectedImages.map(id => reservationAPI.deleteImage(id)));
      setSelectedImages([]);
      fetchReservationsWithImages();
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredReservations = reservations.filter(reservation => {
    return (
      reservation.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.stadium?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.service?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalImages = reservations.reduce((total, res) => 
    total + (res.images?.length || 0), 0
  );

  const totalSelected = selectedImages.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Images Gallery</h2>
          <p className="text-gray-500">Organized by reservation ({totalImages} images)</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4 mr-2" /> : <Grid className="w-4 h-4 mr-2" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={fetchReservationsWithImages}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-800">{reservations.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Images</p>
              <p className="text-2xl font-bold text-gray-800">{totalImages}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Selected</p>
              <p className="text-2xl font-bold text-yellow-600">{totalSelected}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Actions</p>
              <div className="flex space-x-2 mt-1">
                <button
                  onClick={handleDeleteSelected}
                  disabled={!totalSelected}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedImages([])}
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reservations with images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reservations with Images */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading images...</p>
          </div>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="text-gray-400 text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-gray-900">No images found</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm ? 'Try a different search term' : 'Upload images from the reservations page'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              {/* Reservation Header */}
              <div 
                className="p-4 border-b bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleReservationExpand(reservation.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {reservation.team?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{reservation.team}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {reservation.user?.name || 'Guest'}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(reservation.date)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {reservation.stadium}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{reservation.images?.length || 0}</span> images
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      {expandedReservations.includes(reservation.id) ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reservation Images */}
              <AnimatePresence>
                {expandedReservations.includes(reservation.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4"
                  >
                    {/* Bulk Actions */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={reservation.images?.every(img => 
                            selectedImages.includes(img.id)
                          )}
                          onChange={() => selectAllImagesInReservation(reservation.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">
                          Select all ({reservation.images?.length || 0}) images
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Download All
                        </button>
                      </div>
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {reservation.images?.map((image) => (
                        <div
                          key={image.id}
                          className="relative group rounded-lg overflow-hidden border border-gray-200"
                        >
                          {/* Selection Checkbox */}
                          <div className="absolute top-2 left-2 z-10">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(image.id)}
                              onChange={() => toggleImageSelect(image.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm"
                            />
                          </div>

                          {/* Image */}
                          <div className="aspect-square bg-gray-100 overflow-hidden">
                            <img
                              src={image.url || 'https://via.placeholder.com/300'}
                              alt={image.caption || `Image from ${reservation.team}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              loading="lazy"
                            />
                          </div>

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <a
                              href={image.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                              title="View Full Size"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => toggleImageSelect(image.id)}
                              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                              title="Select"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                // Handle single image delete
                                if (window.confirm('Delete this image?')) {
                                  // reservationAPI.deleteImage(image.id)
                                  fetchReservationsWithImages();
                                }
                              }}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Image Info */}
                          <div className="p-3 bg-white">
                            {image.caption && (
                              <p className="text-sm text-gray-600 truncate" title={image.caption}>
                                {image.caption}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {image.size ? `${Math.round(image.size / 1024)}KB` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* No Images Message */}
                    {(!reservation.images || reservation.images.length === 0) && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No images uploaded for this reservation</p>
                        <button
                          onClick={() => {
                            // Navigate to reservations page or open upload modal
                            window.location.href = `/admin/reservations#upload-${reservation.id}`;
                          }}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Upload images →
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected Images Summary */}
      {totalSelected > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-xl p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{totalSelected} images selected</p>
                <div className="flex space-x-2 mt-1">
                  <button
                    onClick={handleDeleteSelected}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedImages([])}
                    className="px-3 py-1 bg-white/20 text-white text-xs rounded-lg hover:bg-white/30"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Images;