import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiImage, 
  FiLoader, 
  FiExternalLink, 
  FiMaximize,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiCamera,
  FiInfo,
  FiEye,
  FiGrid,
  FiPlay,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiPhone,
  FiStar,
  FiLock,
  FiUnlock,
  FiChevronUp,
  FiCameraOff,
  FiVideo,
  FiFilm // added for video
} from 'react-icons/fi';
import bg from '../../src/Bgvideo.mp4';
import axios from 'axios';
import logo from '../../src/logo1.png';
import logo2 from '../../src/logo2.png';

const ImageGallery = ({ reservationId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reservationInfo, setReservationInfo] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  // New state for video
  const [hasVideo, setHasVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // Extract reservationId from URL if not provided as prop
  const effectiveReservationId = reservationId || extractReservationIdFromPath();

  function extractReservationIdFromPath() {
    const path = window.location.pathname;
    const parts = path.split('/');
    
    // Try to find ID in the path
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (part && part !== 'images' && part !== 'reservation' && part !== 'gallery' && part !== 'api') {
        return part;
      }
    }
    
    return null;
  }

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || 'http://localhost:8000/storage';

  // Fetch reservation info and images/video
  const fetchData = useCallback(async () => {
    if (!effectiveReservationId) {
      setError('No reservation ID found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch reservation information
      const reservationResponse = await axios.get(
        `${API_BASE}/public/reservation/${effectiveReservationId}`
      );
      
      // Handle response format
      const reservationData = reservationResponse.data.success 
        ? reservationResponse.data.data 
        : reservationResponse.data;
      
      setReservationInfo(reservationData);
      
      // Check if reservation has a video
      if (reservationData.video_path) {
        setHasVideo(true);
        const videoFullUrl = `${STORAGE_URL}/${reservationData.video_path}`;
        setVideoUrl(videoFullUrl);
        setLoading(false);
        return; // Skip fetching images
      }
      
      // Fetch images for this reservation (only if no video)
      const imagesResponse = await axios.get(
        `${API_BASE}/public/reservation/${effectiveReservationId}/images`
      );
      
      // Handle response format
      let imagesData = [];
      if (imagesResponse.data.success && imagesResponse.data.data && imagesResponse.data.data.images) {
        imagesData = imagesResponse.data.data.images;
      } else if (Array.isArray(imagesResponse.data)) {
        imagesData = imagesResponse.data;
      } else if (imagesResponse.data && imagesResponse.data.data) {
        imagesData = imagesResponse.data.data;
      }
      
      setImages(imagesData);
      
      // Set random images for background slideshow (max 5)
      if (imagesData.length > 0) {
        const bgImages = [];
        const shuffled = [...imagesData].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(5, shuffled.length); i++) {
          const img = shuffled[i];
          bgImages.push(
            img.url || 
            `${STORAGE_URL}/${img.path}`
          );
        }
        setBackgroundImages(bgImages);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      
      let errorMessage = 'Failed to load gallery';
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 404) {
          errorMessage = 'Reservation not found';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [effectiveReservationId, API_BASE, STORAGE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Background slideshow effect (only for images)
  useEffect(() => {
    if (backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backgroundImages.length]);

  const openGalleryModal = () => {
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `reservation_${effectiveReservationId}_video.mp4`; // or extract filename from path
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-6"
        >
          <FiLoader className="w-16 h-16 text-[#22c55e]" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Gallery</h2>
        <p className="text-gray-400">Reservation #{effectiveReservationId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <FiX className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Error Loading Gallery</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-[#22c55e] text-white rounded-full font-semibold hover:bg-[#16a34a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasImages = Array.isArray(images) && images.length > 0;

  return (
    <>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background images with crossfade */}
        <AnimatePresence>
          <div className="absolute inset-0">
            {/* Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src={bg} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/80 z-10"></div>
          </div>
        </AnimatePresence>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[1px] bg-[#22c55e] rounded-full"
              animate={{
                y: [0, -200],
                x: [0, Math.random() * 100 - 50],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
              }}
            />
          ))}
        </div>

        {/* Light beams */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#22c55e]/20 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[#22c55e]/20 to-transparent" />
        </div>
      </div>

      {/* Main Content - Centered Card */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Decorative elements */}
        <div className="absolute top-8 w-32 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent" />
        <div className="absolute bottom-8 w-32 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent" />
        <div className="absolute left-8 h-32 w-px bg-gradient-to-b from-transparent via-[#22c55e]/30 to-transparent" />
        <div className="absolute right-8 h-32 w-px bg-gradient-to-b from-transparent via-[#22c55e]/30 to-transparent" />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-[320px] sm:w-[360px] md:w-[400px] bg-black/80 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Card Header */}
          <div className="p-8 text-center">
            {/* Logo */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgb(204,255,0)] to-[rgb(204,255,0)] blur-xl opacity-30" />
              <div className="relative w-20 h-20 p-1 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <img src={logo2} alt="Logo" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-[#22c55e]/30 border-t-transparent"
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Elhachimi Vision Lab
            </h1>
            <p className="text-gray-400 mb-6">Professional {hasVideo ? 'Video' : 'Photography'}</p>

            {/* Preview Button - changes based on media type */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openGalleryModal}
              className="w-full py-4 hover:bg-[rgb(204,255,0)] hover:text-black text-white rounded-xl font-bold text-lg shadow-md shadow-[rgb(204,255,0)]/30 hover:shadow-[rgb(204,255,0)]/50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              {hasVideo ? (
                <>
                  <FiPlay className="w-5 h-5" />
                  Watch Video
                  <FiChevronUp className="w-5 h-5" />
                </>
              ) : (
                <>
                  <FiGrid className="w-5 h-5" />
                  Preview Gallery
                  <FiChevronUp className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Info Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">
                  {hasVideo ? '1' : images.length}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  {hasVideo ? 'Video' : 'Photos'}
                </div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white mb-1">
                  {reservationInfo?.user?.name?.split(' ')[0] || 'Guest'}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  Client
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-white w-full text-lg arabicword">
                <marquee direction="left">بصحتكم الشباب</marquee>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50"
              onClick={closeGalleryModal}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 overflow-auto">
              {/* Modal Header */}
              <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <img src={logo2} alt="Logo" />
                      </div>
                      <div>
                        <h1 className="text-white font-bold text-lg">
                          {reservationInfo?.user?.name || 'Client'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                          Reservation #{effectiveReservationId} • {hasVideo ? '1 Video' : `${images.length} photos`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {hasVideo ? (
                        <button
                          onClick={downloadVideo}
                          className="px-4 py-2 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a] transition-colors flex items-center gap-2"
                        >
                          <FiDownload className="w-4 h-4" />
                          Download Video
                        </button>
                      ) : (
                        hasImages && (
                          <button
                            onClick={() => {
                              const downloadUrl = `${API_BASE}/public/reservation/${effectiveReservationId}/download-zip`;
                              window.open(downloadUrl, '_blank');
                            }}
                            className="px-4 py-2 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a] transition-colors flex items-center gap-2"
                          >
                            <FiDownload className="w-4 h-4" />
                            Download All
                          </button>
                        )
                      )}
                      <button
                        onClick={closeGalleryModal}
                        className="p-3 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <FiX className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="container mx-auto px-4 py-8">
                {/* Info Bar */}
                {reservationInfo && (
                  <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <FiCalendar className="w-5 h-5 text-[#22c55e]" />
                        <div>
                          <p className="text-gray-400 text-sm">Date</p>
                          <p className="text-white font-medium">
                            {reservationInfo.date ? new Date(reservationInfo.date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <FiMapPin className="w-5 h-5 text-[#22c55e]" />
                        <div>
                          <p className="text-gray-400 text-sm">Location</p>
                          <p className="text-white font-medium">{reservationInfo.stadium || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        {hasVideo ? (
                          <FiVideo className="w-5 h-5 text-[#22c55e]" />
                        ) : (
                          <FiCamera className="w-5 h-5 text-[#22c55e]" />
                        )}
                        <div>
                          <p className="text-gray-400 text-sm">Service</p>
                          <p className="text-white font-medium">{reservationInfo.service?.type || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        {hasVideo ? (
                          <FiFilm className="w-5 h-5 text-[#22c55e]" />
                        ) : (
                          <FiImage className="w-5 h-5 text-[#22c55e]" />
                        )}
                        <div>
                          <p className="text-gray-400 text-sm">Total</p>
                          <p className="text-white font-medium">{hasVideo ? '1 Video' : `${images.length} Photos`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Display */}
                {hasVideo ? (
                  <div className="flex justify-center items-center">
                    <div className="relative w-full max-w-4xl bg-black/50 rounded-xl overflow-hidden border border-white/10">
                      <video
                        controls
                        autoPlay={false}
                        className="w-full h-auto max-h-[70vh]"
                        src={videoUrl}
                        poster={backgroundImages[0] || undefined}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                ) : (
                  hasImages ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <motion.div
                          key={image.id || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group relative cursor-pointer"
                          onClick={() => setSelectedImage(image)}
                        >
                          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-black/20 aspect-square">
                            <img
                              src={image.url || image.thumbnail_url || `${STORAGE_URL}/${image.path}`}
                              alt={image.caption || image.filename || `Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/400/1a2c1a/22c55e?text=Image+${index + 1}`;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                              #{index + 1}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
                        <FiCameraOff className="w-10 h-10 text-[#22c55e]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">No Images Available</h3>
                      <p className="text-gray-400">No photos found for this reservation.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Image Detail Modal (only for images) */}
      <AnimatePresence>
        {selectedImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[60]"
              onClick={() => setSelectedImage(null)}
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-6xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <img
                    src={selectedImage.url || `${STORAGE_URL}/${selectedImage.path}`}
                    alt={selectedImage.caption || selectedImage.filename || 'Selected Image'}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800/1a2c1a/22c55e?text=Image+Not+Available';
                    }}
                  />
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;