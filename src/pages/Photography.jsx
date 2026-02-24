import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FiX, FiZoomIn, FiZoomOut, FiMaximize, FiDownload, 
  FiHeart, FiEye, FiChevronLeft, FiChevronRight, FiInfo,
  FiCamera, FiMapPin, FiCalendar, FiUser, FiLoader
} from 'react-icons/fi';
import Navbar from '../components/Navbar';


const Photography = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/images');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        
        // Transform API data to match our component structure
        const transformedImages = data.images.map((img, index) => ({
          id: img.id,
          title: img.caption || `Image ${img.id}`,
          description: `Captured during ${img.reservation?.team || 'sports'} event`,
          category: img.reservation?.team || 'Sports',
          image: img.url,
          date: new Date(img.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          location: img.reservation?.stadium || 'Unknown Location',
          photographer: 'Sports Photographer',
          camera: 'Professional Camera',
          lens: 'Various',
          stats: {
            views: Math.floor(Math.random() * 5000 + 1000).toLocaleString(),
            likes: Math.floor(Math.random() * 1000 + 100)
          },
          featured: index < 4,
          aspect: Math.random() > 0.3 ? 'landscape' : 'portrait',
          reservation: img.reservation,
          mime_type: img.mime_type,
          size: img.size,
          filename: img.filename
        }));
        
        setImages(transformedImages);
        setError(null);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Memoized categories
  const categories = useMemo(() => {
    return ['All', ...new Set(images.map(img => img.reservation?.team || 'Sports').filter(Boolean))];
  }, [images]);

  // Memoized featured photos
  const featuredPhotos = useMemo(() => images.filter(img => img.featured), [images]);

  // Memoized filtered images
  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return images;
    return images.filter(img => 
      (img.reservation?.team || '').toLowerCase() === activeCategory.toLowerCase() ||
      (img.reservation?.stadium || '').toLowerCase() === activeCategory.toLowerCase()
    );
  }, [images, activeCategory]);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const cameraScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [50, -50]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const openPhotoModal = useCallback((photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(images.findIndex(img => img.id === photo.id));
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
    setIsZooming(false);
    setIsInfoVisible(false);
    document.body.style.overflow = 'hidden';
  }, [images]);

  const closePhotoModal = useCallback(() => {
    setSelectedPhoto(null);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
    setIsZooming(false);
    setIsInfoVisible(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const navigatePhoto = useCallback((direction) => {
    if (!selectedPhoto) return;
    const currentIdx = images.findIndex(img => img.id === selectedPhoto.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIdx + 1) % images.length;
    } else {
      newIndex = (currentIdx - 1 + images.length) % images.length;
    }
    setSelectedPhoto(images[newIndex]);
    setCurrentIndex(newIndex);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
    setIsZooming(false);
  }, [images, selectedPhoto]);

  const toggleLike = useCallback((photoId) => {
    setLikedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
    setIsZooming(true);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom <= 1) {
        setDragOffset({ x: 0, y: 0 });
        setIsZooming(false);
      }
      return newZoom;
    });
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
    setIsZooming(false);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
    }
  }, [zoomLevel, dragOffset]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && zoomLevel > 1) {
      const x = e.clientX - dragStartRef.current.x;
      const y = e.clientY - dragStartRef.current.y;
      setDragOffset({ x, y });
    }
  }, [isDragging, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  }, [handleZoomIn, handleZoomOut]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!selectedPhoto) return;
    try {
      const response = await fetch(selectedPhoto.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedPhoto.filename || `image-${selectedPhoto.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [selectedPhoto]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      
      if (e.key === 'Escape') closePhotoModal();
      else if (e.key === 'ArrowRight') navigatePhoto('next');
      else if (e.key === 'ArrowLeft') navigatePhoto('prev');
      else if (e.key === '+') handleZoomIn();
      else if (e.key === '-') handleZoomOut();
      else if (e.key === '0') handleZoomReset();
      else if (e.key === 'f') toggleFullscreen();
      else if (e.key === 'i') setIsInfoVisible(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, closePhotoModal, navigatePhoto, handleZoomIn, handleZoomOut, handleZoomReset, toggleFullscreen]);

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

// Loading State
if (loading) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">

        {/* Logo Reveal From Bottom */}
        <div className="w-28 h-28 mx-auto mb-6 overflow-hidden relative">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img
              src="/logo2.png"
              alt="Logo"
              className="w-full h-full object-contain "
            />
          </motion.div>
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-white text-xl font-semibold tracking-wide"
        >
          Preparing your experience...
        </motion.p>

        {/* Animated Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ delay: 1.3, duration: 1 }}
          className="h-[2px] bg-white mx-auto mt-3"
        />

        {/* Dots Loader Under Line */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white rounded-full font-medium hover:shadow-lg transition-shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-x-hidden">
      
     <div className='absolute'>
        <Navbar/>
     </div>
      {/* Hero Section with Floating Background Animations */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dark background with floating CSS shapes */}
        <div className="absolute inset-0 bg-black">
          <div className="floating-shape shape-1" />
          <div className="floating-shape shape-2" />
          <div className="floating-shape shape-3" />
          <div className="floating-shape shape-4" />
          <div className="floating-shape shape-5" />
        </div>

        {/* Logo Container with Glassmorphism and subtle floating animation */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto px-4 floating-logo"
          style={{
            scale: cameraScale,
            opacity: cameraOpacity,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isLoaded ? 1 : 0.8, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Glass panel */}
            <div className="backdrop-blur-xl bg-black/40 border border-[#22c55e]/30 rounded-3xl p-12 shadow-2xl">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6 ">
                  <img src="/logo2.png" alt="Logo" className="w-32  h-32 object-contain" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white text-center">
                  <span className="block">SPORTS</span>
                  <span className="text-transparent bg-clip-text bg-[rgb(115,255,0)]">
                    MOMENTS
                  </span>
                </h1>
                
                <p className="mt-4 text-gray-300 text-lg max-w-md text-center">
                  Professional sports photography
                </p>
                
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <FiCamera className="text-[#22c55e]" />
                  <span className="text-white text-sm">{images.length} Images</span>
                </div>
              </div>
            </div>

            {/* Floating decorative accents */}
            <div className="floating-accent accent-1" />
            <div className="floating-accent accent-2" />
          </motion.div>
        </motion.div>

        {/* Overlay Text (appears on scroll) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="text-center max-w-4xl px-4">
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Capturing the intensity, emotion, and beauty of sports through professional photography.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {featuredPhotos.slice(0, 3).map((photo) => (
                <motion.button
                  key={photo.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openPhotoModal(photo, images.indexOf(photo))}
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                           text-white hover:bg-[#22c55e] hover:border-[#22c55e] transition-all duration-300
                           font-medium"
                >
                  {photo.reservation?.team || 'Sports'}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-[#22c55e] rounded-full mt-2"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Strip */}
      {categories.length > 1 && (
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-y border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveCategory(category.toLowerCase())}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${activeCategory === category.toLowerCase() 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {activeCategory === category.toLowerCase() && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

           <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Featured Grid */}
          {featuredPhotos.length > 0 && (
            <div className="mb-20">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Featured <span className="text-[#22c55e]">Moments</span>
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    onClick={() => openPhotoModal(photo, images.indexOf(photo))}
                    className="group relative  border-rotate cursor-pointer overflow-hidden "
                  > 
                    <div className="aspect-[16/9] overflow-hidden">
                      <img 
                        src={photo.image} 
                        alt={photo.title}
                        className="w-full h-full   object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 
                                    group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-[#22c55e] text-white text-xs font-semibold">
                            {photo.reservation?.team || 'Sports'}
                          </span>
                          <span className="text-white/70 text-sm">{photo.date}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{photo.title}</h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{photo.description}</p>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <FiMapPin /> {photo.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiEye /> {photo.stats.views}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MIME Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 
                                     text-white text-xs font-medium">
                        {photo.mime_type?.split('/')[1]?.toUpperCase() || 'Image'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Masonry Grid */}
          {filteredImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredImages.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredId(photo.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={() => openPhotoModal(photo, images.indexOf(photo))}
                  className="group relative cursor-pointer overflow-hidden  break-inside-avoid mb-6"
                >
                  <div className="relative ">
                    <img 
                      src={photo.image} 
                      alt={photo.title}
                      className="w-full h-auto  object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Hover Info - use CSS transition for better performance */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300 ${
                        hoveredId === photo.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div
                          className={`transform transition-all duration-300 delay-100 ${
                            hoveredId === photo.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-full bg-[#22c55e] text-white text-xs font-semibold">
                              {photo.reservation?.team || 'Sports'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(photo.id);
                              }}
                              className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                            >
                              <FiHeart className={`w-4 h-4 ${likedPhotos.includes(photo.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                            </button>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1">{photo.title}</h3>
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{photo.description}</p>
                          <div className="flex items-center gap-3 text-white/70 text-xs">
                            <span className="flex items-center gap-1">
                              <FiMapPin /> {photo.location.split(',')[0]}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar /> {photo.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Info Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 
                                     text-white text-xs font-medium">
                        {photo.reservation?.stadium?.split(',')[0] || 'Stadium'}
                      </span>
                    </div>

                    {/* Like Count */}
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm 
                                     border border-white/20 text-white text-xs">
                        <FiHeart className={likedPhotos.includes(photo.id) ? 'text-red-500 fill-red-500' : ''} />
                        {photo.stats.likes + (likedPhotos.includes(photo.id) ? 1 : 0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No images found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Photo Modal - Optimized */}
      <AnimatePresence>
        {selectedPhoto && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50"
              onClick={closePhotoModal}
            />

            {/* Modal Content */}
            <div 
              className={`fixed inset-0 z-50 ${isZooming ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* Top Bar */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white text-sm font-medium">
                  {zoomLevel.toFixed(1)}x
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsInfoVisible(!isInfoVisible)}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      isInfoVisible 
                        ? 'bg-[#22c55e] text-white' 
                        : 'bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80'
                    }`}
                  >
                    <FiInfo className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors"
                  >
                    <FiDownload className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors"
                  >
                    <FiMaximize className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={closePhotoModal}
                    className="p-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className={`p-2.5 rounded-full transition-colors ${
                      zoomLevel <= 1 
                        ? 'bg-white/10 text-white/30 cursor-not-allowed' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <FiZoomOut className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleZoomReset}
                    className="px-4 py-2 text-white text-sm font-medium hover:text-[#22c55e] transition-colors"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 4}
                    className={`p-2.5 rounded-full transition-colors ${
                      zoomLevel >= 4 
                        ? 'bg-white/10 text-white/30 cursor-not-allowed' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <FiZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={() => navigatePhoto('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => navigatePhoto('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.div
                  ref={imageRef}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                    cursor: isZooming ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                    willChange: 'transform',
                  }}
                  onMouseDown={handleMouseDown}
                  onClick={(e) => {
                    if (!isZooming && zoomLevel === 1) {
                      handleZoomIn();
                    }
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  />
                </motion.div>
              </div>

              {/* Info Panel */}
              <AnimatePresence>
                {isInfoVisible && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute bottom-4 left-4 max-w-sm z-10"
                  >
                    <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-xs font-semibold">
                              {selectedPhoto.reservation?.team || 'Sports'}
                            </span>
                          </div>
                          <h3 className="text-white font-bold text-lg mb-1">
                            {selectedPhoto.title}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {selectedPhoto.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-gray-400 text-xs mt-3">
                        <div className="flex items-center gap-1">
                          <FiMapPin className="w-3 h-3" />
                          <span>{selectedPhoto.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>{selectedPhoto.date}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <span className="text-[#22c55e]">•</span>
                          <span>Size: {(selectedPhoto.size / 1024).toFixed(2)} KB</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Counter */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                <span className="text-white text-sm font-medium">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>

              {/* Help Text */}
              <div className="absolute bottom-4 right-4 z-10">
                <div className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                  <span className="text-white/60 text-xs">
                    {isZooming ? 'Drag to pan • Scroll to zoom' : 'Click to zoom • Scroll to zoom'}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
      <style jsx>{`
        .floating-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
          animation: float 30s infinite ease-in-out;
        }
        .shape-1 {
          top: 25%;
          left: 25%;
          width: 600px;
          height: 600px;
          background: linear-gradient(to bottom right, rgba(204, 255, 0, 0.6), transparent);
          animation-duration: 30s;
        }
        .shape-2 {
          bottom: 33%;
          right: 25%;
          width: 500px;
          height: 500px;
          background: linear-gradient(to top, rgba(204, 255, 0, 0.6), transparent);
          animation-duration: 25s;
          animation-delay: 2s;
        }
        .shape-3 {
          top: 50%;
          right: 33%;
          width: 400px;
          height: 400px;
          background: rgba(0, 0, 0, 0.5);
          animation-duration: 20s;
          animation-delay: 1s;
        }
        .shape-4 {
          bottom: 25%;
          left: 33%;
          width: 700px;
          height: 700px;
          background: rgba(34, 197, 94, 0.1);
          animation-duration: 35s;
          animation-delay: 3s;
        }
        .shape-5 {
          top: 33%;
          left: 50%;
          width: 450px;
          height: 450px;
          background: rgba(0, 0, 0, 0.7);
          animation-duration: 28s;
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(150px, -200px) scale(1.3); }
          50% { transform: translate(-100px, 150px) scale(0.9); }
          75% { transform: translate(50px, -100px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }

        /* Floating logo animation */
        .floating-logo {
          animation: logoFloat 6s infinite ease-in-out;
          will-change: transform;
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .floating-accent {
          position: absolute;
          border-radius: 50%;
          filter: blur(30px);
          will-change: transform;
          animation: pulse 4s infinite ease-in-out;
        }
        .accent-1 {
          top: -10px;
          right: -10px;
          width: 80px;
          height: 80px;
          background: rgba(204, 255, 0, 0.6);
        }
        .accent-2 {
          bottom: -10px;
          left: -10px;
          width: 128px;
          height: 128px;
          background: rgba(204, 255, 0, 0.6);
          animation-delay: 1s;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(10px, -10px); }
        }
      `}</style>
    </div>
  );
};

export default Photography;