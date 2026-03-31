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
  XCircle,
  Upload,
  RefreshCw,
  Camera,
  Film,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Copy,
  Link as LinkIcon,
  ExternalLink,
  X
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
  const [downloadingZip, setDownloadingZip] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const DOMAIN = 'https://elhachimivisionlab.com';
  const API_BASE = process.env.REACT_APP_API_URL || 'https://server.elhachimivisionlab.com/api';

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
      setError('Failed to load images. Please try again.');
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
      setSelectedImages(prev => prev.filter(id => !allImageIds.includes(id)));
    } else {
      setSelectedImages(prev => [...prev, ...allImageIds.filter(id => !prev.includes(id))]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedImages.length || !window.confirm(`Delete ${selectedImages.length} selected images?`)) return;
    
    try {
      // Implement bulk delete API call
       await Promise.all(selectedImages.map(id => reservationAPI.deleteImage(id)));
      setSelectedImages([]);
      setSuccess(`${selectedImages.length} images deleted successfully!`);
      fetchReservationsWithImages();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting images:', error);
      setError('Failed to delete images. Please try again.');
    }
  };

  const downloadAllImagesAsZip = async (reservationId, teamName) => {
    try {
      setDownloadingZip(reservationId);
      setError('');
      
      const response = await fetch(`${API_BASE}/admin/images/reservation/${reservationId}/download-zip`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `${teamName?.replace(/\s+/g, '_') || 'reservation'}_${reservationId}_images.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';]+)["']?/);
        if (filenameMatch && filenameMatch[1]) {
          if (filenameMatch[1].startsWith("UTF-8''")) {
            filename = decodeURIComponent(filenameMatch[1].substring(7));
          } else {
            filename = filenameMatch[1];
          }
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess(`Downloaded ${filename} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Failed to download images');
    } finally {
      setDownloadingZip(null);
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

  const slugify = (text) => {
    if (!text) return 'guest';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const getGalleryLink = (reservation) => {
    const username = slugify(reservation.user?.name);
    return `${DOMAIN}/${username}/${reservation.id}/results`;
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
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#B8E601]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#B8E601]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#B8E601]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Camera className="w-8 h-8 text-[#B8E601]" />
              Image Gallery
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage images organized by reservation ({totalImages} images total)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReservationsWithImages}
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:bg-black/60 hover:border-[#B8E601]/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-sm">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm">List</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-6 hover:border-[#B8E601]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Reservations</p>
                <p className="text-2xl font-semibold text-white">{reservations.length}</p>
              </div>
              <div className="p-3 bg-[#B8E601]/10 rounded-xl border border-[#B8E601]/20">
                <Folder className="w-5 h-5 text-[#B8E601]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-6 hover:border-[#B8E601]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Images</p>
                <p className="text-2xl font-semibold text-white">{totalImages}</p>
              </div>
              <div className="p-3 bg-[#B8E601]/10 rounded-xl border border-[#B8E601]/20">
                <Layers className="w-5 h-5 text-[#B8E601]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-6 hover:border-[#B8E601]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Selected</p>
                <p className="text-2xl font-semibold text-[#B8E601]">{totalSelected}</p>
              </div>
              <div className="p-3 bg-[#B8E601]/10 rounded-xl border border-[#B8E601]/20">
                <CheckCircle className="w-5 h-5 text-[#B8E601]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-6 hover:border-[#B8E601]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Actions</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleDeleteSelected}
                    disabled={!totalSelected}
                    className="px-3 py-1 bg-rose-500/20 text-rose-400 text-sm rounded-lg hover:bg-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedImages([])}
                    disabled={!totalSelected}
                    className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by team, client, stadium..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg focus:border-[#B8E601]/50 focus:outline-none text-sm text-white placeholder-gray-500"
            />
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-rose-500/20 text-rose-400 p-4 rounded-xl border border-rose-500/30"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError('')} className="hover:bg-rose-500/10 p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-[#B8E601]/20 text-[#B8E601] p-4 rounded-xl border border-[#B8E601]/30"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess('')} className="hover:bg-[#B8E601]/10 p-1 rounded">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reservations with Images */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-white/20 border-t-[#B8E601] rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-sm text-gray-400">Loading gallery...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl">
            <div className="w-20 h-20 rounded-2xl bg-[#B8E601]/10 border border-[#B8E601]/30 flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-[#B8E601]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No images found</h3>
            <p className="text-sm text-gray-400 max-w-md text-center">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Upload images from the reservations page to see them here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-[#B8E601]/30 transition-all"
              >
                {/* Reservation Header */}
                <div 
                  className="p-6 border-b border-white/10 bg-gradient-to-r from-[#B8E601]/5 to-transparent cursor-pointer hover:bg-[#B8E601]/10 transition-colors"
                  onClick={() => toggleReservationExpand(reservation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B8E601] to-[#B8E601]/70 flex items-center justify-center text-black font-bold text-lg shadow-lg">
                        {reservation.team?.charAt(0) || 'R'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{reservation.team}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-[#B8E601]" />
                            {reservation.user?.name || 'Guest'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#B8E601]" />
                            {formatDate(reservation.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#B8E601]" />
                            {reservation.stadium}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#B8E601]">
                          {reservation.images?.length || 0}
                        </span>
                        <p className="text-xs text-gray-400">images</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        {expandedReservations.includes(reservation.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
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
                      className="p-6"
                    >
                      {/* Bulk Actions */}
                      <div className="flex items-center justify-between mb-6 p-4 bg-black/40 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={reservation.images?.every(img => 
                                selectedImages.includes(img.id)
                              )}
                              onChange={() => selectAllImagesInReservation(reservation.id)}
                              className="w-4 h-4 bg-black/40 border border-white/30 rounded focus:ring-[#B8E601] focus:ring-offset-0 focus:ring-2 checked:bg-[#B8E601]"
                            />
                          </div>
                          <span className="text-sm text-gray-300">
                            Select all ({reservation.images?.length || 0}) images
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* Gallery Link */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getGalleryLink(reservation));
                              setSuccess('Gallery link copied!');
                              setTimeout(() => setSuccess(''), 2000);
                            }}
                            className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-[#B8E601] hover:border-[#B8E601]/30 transition-all flex items-center gap-1"
                          >
                            <LinkIcon className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy Link</span>
                          </button>
                          
                          {/* Download All Button */}
                          <button
                            onClick={() => downloadAllImagesAsZip(reservation.id, reservation.team)}
                            disabled={downloadingZip === reservation.id || !reservation.images?.length}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                              ${downloadingZip === reservation.id
                                ? 'bg-[#B8E601]/20 text-[#B8E601]/50 cursor-not-allowed border border-[#B8E601]/30'
                                : 'bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black hover:from-[#B8E601] hover:to-[#B8E601] border border-[#B8E601]/30'
                              }`}
                          >
                            {downloadingZip === reservation.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Download className="w-3 h-3" />
                                <span className="hidden sm:inline">Download All</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Images Grid */}
                      {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {reservation.images?.map((image) => (
                            <motion.div
                              key={image.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              whileHover={{ y: -2 }}
                              className={`group relative bg-black/40 border rounded-xl overflow-hidden cursor-pointer transition-all
                                ${selectedImages.includes(image.id) 
                                  ? 'border-[#B8E601] ring-2 ring-[#B8E601]/50' 
                                  : 'border-white/10 hover:border-[#B8E601]/30'}`}
                              onClick={() => toggleImageSelect(image.id)}
                            >
                              {/* Selection Checkbox */}
                              <div className="absolute top-2 left-2 z-10">
                                <input
                                  type="checkbox"
                                  checked={selectedImages.includes(image.id)}
                                  onChange={() => toggleImageSelect(image.id)}
                                  className="w-4 h-4 bg-black/40 border border-white/30 rounded focus:ring-[#B8E601] focus:ring-offset-0 focus:ring-2 checked:bg-[#B8E601]"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              {/* Image */}
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={image.url}
                                  alt={image.caption || `Image from ${reservation.team}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                              </div>

                              {/* Overlay Actions */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewImage(image.url);
                                    }}
                                    className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-[#B8E601]/80 hover:text-black transition-all"
                                    title="View full size"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <a
                                    href={image.url}
                                    download
                                    className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-[#B8E601]/80 hover:text-black transition-all"
                                    title="Download"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm('Delete this image?')) {
                                        // Handle delete
                                      }
                                    }}
                                    className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-rose-500/80 hover:text-white transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Image Info */}
                              <div className="p-3 border-t border-white/10 bg-black/40">
                                {image.caption ? (
                                  <p className="text-xs text-gray-300 truncate" title={image.caption}>
                                    {image.caption}
                                  </p>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">No caption</p>
                                )}
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[10px] text-gray-500">
                                    {new Date(image.created_at).toLocaleDateString()}
                                  </span>
                                  {selectedImages.includes(image.id) && (
                                    <CheckCircle className="w-3 h-3 text-[#B8E601]" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        // List View
                        <div className="border border-white/10 rounded-xl overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-black/60 border-b border-white/10">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#B8E601] uppercase">Select</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#B8E601] uppercase">Image</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#B8E601] uppercase">Caption</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-[#B8E601] uppercase">Date</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-[#B8E601] uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {reservation.images?.map((image) => (
                                <tr
                                  key={image.id}
                                  className={`hover:bg-[#B8E601]/5 transition-colors cursor-pointer
                                    ${selectedImages.includes(image.id) ? 'bg-[#B8E601]/10' : ''}`}
                                  onClick={() => toggleImageSelect(image.id)}
                                >
                                  <td className="px-4 py-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedImages.includes(image.id)}
                                      onChange={() => toggleImageSelect(image.id)}
                                      className="w-4 h-4 bg-black/40 border border-white/30 rounded focus:ring-[#B8E601] focus:ring-offset-0 focus:ring-2 checked:bg-[#B8E601]"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                        <img
                                          src={image.url}
                                          alt={image.caption}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="text-sm text-white">Image #{image.id}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-300">
                                    {image.caption || <span className="text-gray-500 italic">No caption</span>}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-300">
                                    {new Date(image.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewImage(image.url);
                                        }}
                                        className="p-1.5 text-[#B8E601] hover:bg-[#B8E601]/10 rounded-lg transition-all"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <a
                                        href={image.url}
                                        download
                                        className="p-1.5 text-[#B8E601] hover:bg-[#B8E601]/10 rounded-lg transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Download className="w-4 h-4" />
                                      </a>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (window.confirm('Delete this image?')) {
                                            // Handle delete
                                          }
                                        }}
                                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* No Images Message */}
                      {(!reservation.images || reservation.images.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                          <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No images uploaded for this reservation</p>
                          <button
                            onClick={() => window.location.href = `/admin/reservations`}
                            className="mt-3 text-sm text-[#B8E601] hover:text-[#B8E601]/80 transition-colors"
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

        {/* Selected Images Floating Summary */}
        <AnimatePresence>
          {totalSelected > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className="backdrop-blur-xl bg-gradient-to-r from-[#B8E601]/90 to-[#B8E601]/70 text-black rounded-xl shadow-2xl p-4 border border-[#B8E601]/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{totalSelected} images selected</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleDeleteSelected}
                        className="px-3 py-1 bg-black/30 text-black text-xs rounded-lg hover:bg-black/40 transition-all"
                      >
                        Delete Selected
                      </button>
                      <button
                        onClick={() => setSelectedImages([])}
                        className="px-3 py-1 bg-black/20 text-black text-xs rounded-lg hover:bg-black/30 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50"
                onClick={() => setPreviewImage(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={() => setPreviewImage(null)}
              >
                <div className="relative max-w-5xl max-h-[90vh]">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full max-h-[90vh] object-contain rounded-2xl"
                  />
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-[#B8E601]/80 hover:text-black transition-all border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Images;