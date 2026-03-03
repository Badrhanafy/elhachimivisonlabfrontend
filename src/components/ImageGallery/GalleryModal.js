// components/ImageGallery/GalleryModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Film, 
  Camera,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  Sparkles,
  Eye,
  FolderDown,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const GalleryModal = ({ 
  isOpen, 
  onClose, 
  reservationInfo, 
  effectiveReservationId, 
  images, 
  hasVideo, 
  videoUrl, 
  onDownloadVideo,
  onImageSelect 
}) => {
  const [downloadingImage, setDownloadingImage] = useState(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'https://server.elhachimivisionlab.com/api';

  // Download all images as zip using the backend route
  const downloadAllAsZip = async () => {
    if (!effectiveReservationId) {
      setDownloadError('Invalid reservation ID');
      return;
    }

    try {
      setDownloadingZip(true);
      setDownloadError(null);
      
      // Make request to backend zip download endpoint
      const response = await axios.get(
        `${API_BASE}/public/reservation/${effectiveReservationId}/download-zip`,
        {
          responseType: 'blob', // Important: receive as blob
          headers: {
            'Accept': 'application/zip,application/json',
          },
        }
      );

      // Check if response is actually an error (JSON) instead of zip
      if (response.data.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            setDownloadError(errorData.message || 'Failed to download zip');
          } catch {
            setDownloadError('Failed to download images');
          }
        };
        reader.readAsText(response.data);
        return;
      }

      // Create download link for the zip file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `reservation_${effectiveReservationId}_images.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';]+)["']?/);
        if (filenameMatch && filenameMatch[1]) {
          // Handle encoded filenames
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
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
      
    } catch (error) {
      console.error('Download all error:', error);
      
      // Handle error response
      if (error.response?.data) {
        // Try to read error message from blob
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            setDownloadError(errorData.message || 'Failed to download zip');
          } catch {
            setDownloadError('Failed to download images');
          }
        };
        reader.readAsText(error.response.data);
      } else if (error.response?.status === 404) {
        setDownloadError('No images found for this reservation');
      } else {
        setDownloadError('Failed to download images. Please try again.');
      }
    } finally {
      setDownloadingZip(false);
    }
  };

  // Download single image
  const downloadImage = async (image, e) => {
    e.stopPropagation();
    setDownloadingImage(image.id);
    setDownloadError(null);
    
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const filename = image.caption 
        ? `${image.caption.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`
        : `image_${image.id || 'download'}.jpg`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError('Failed to download image');
    } finally {
      setDownloadingImage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div 
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#B8E601]/20 via-black/60 to-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full max-h-[90vh] overflow-hidden rounded-3xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B8E601] to-[#B8E601]/70 flex items-center justify-center">
                      {hasVideo ? (
                        <Film className="w-6 h-6 text-black" />
                      ) : (
                        <Camera className="w-6 h-6 text-black" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {hasVideo ? 'Video Gallery' : 'Photo Gallery'}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {reservationInfo?.team || 'Session'} • {images.length} {images.length === 1 ? 'image' : 'images'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Download All Button */}
                    {!hasVideo && images.length > 0 && (
                      <button
                        onClick={downloadAllAsZip}
                        disabled={downloadingZip}
                        className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 backdrop-blur-sm
                          ${downloadingZip 
                            ? 'bg-[#B8E601]/20 text-[#B8E601]/50 cursor-not-allowed border border-[#B8E601]/30' 
                            : downloadSuccess
                              ? 'bg-[#B8E601] text-black border border-[#B8E601]'
                              : 'bg-black/60 text-white hover:bg-[#B8E601]/80 hover:text-black border border-white/10 hover:border-[#B8E601]'
                          }`}
                        title="Download all images as ZIP"
                      >
                        {downloadingZip ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating ZIP...
                          </>
                        ) : downloadSuccess ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Downloaded!
                          </>
                        ) : (
                          <>
                            <FolderDown className="w-4 h-4" />
                            Download All
                          </>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={onClose}
                      className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {downloadError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mx-6 mt-4 flex items-center justify-between bg-rose-500/20 text-rose-400 p-3 rounded-xl border border-rose-500/30"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{downloadError}</span>
                      </div>
                      <button onClick={() => setDownloadError(null)} className="hover:bg-rose-500/10 p-1 rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  {hasVideo ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-full"
                          poster="/video-thumbnail.jpg"
                        />
                      </div>
                      <button
                        onClick={onDownloadVideo}
                        className="w-full px-6 py-4 bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black rounded-xl font-medium hover:from-[#B8E601] hover:to-[#B8E601] transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download Video
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -4 }}
                          className="group relative aspect-square bg-black/40 border border-white/10 rounded-xl overflow-hidden cursor-pointer"
                          onClick={() => onImageSelect(image)}
                        >
                          <img
                            src={image.url}
                            alt={image.caption || 'Gallery image'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          
                          {/* Overlay with actions */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onImageSelect(image);
                                }}
                                className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-[#B8E601]/80 hover:text-black transition-all"
                                title="View full size"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => downloadImage(image, e)}
                                disabled={downloadingImage === image.id}
                                className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-[#B8E601]/80 hover:text-black transition-all disabled:opacity-50"
                                title="Download image"
                              >
                                {downloadingImage === image.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Caption */}
                          {image.caption && (
                            <div className="absolute top-3 left-3 right-3">
                              <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white truncate block">
                                {image.caption}
                              </span>
                            </div>
                          )}
                          
                          {/* Image count indicator (for multi-image sets) */}
                          {images.length > 1 && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 bg-[#B8E601]/20 backdrop-blur-sm border border-[#B8E601]/30 rounded-lg text-xs text-[#B8E601]">
                                #{images.findIndex(img => img.id === image.id) + 1}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with info */}
                <div className="border-t border-white/10 p-4 bg-black/40">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-400">
                      <Sparkles className="w-4 h-4 inline mr-1 text-[#B8E601]" />
                      Click any image to view full size
                    </p>
                    {!hasVideo && images.length > 0 && (
                      <p className="text-gray-400">
                        <FolderDown className="w-4 h-4 inline mr-1 text-[#B8E601]" />
                        Download all as ZIP with README and summary
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;