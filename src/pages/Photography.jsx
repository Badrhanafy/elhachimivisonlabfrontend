import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FiX, FiZoomIn, FiZoomOut, FiMaximize, FiDownload, 
  FiHeart, FiEye, FiChevronLeft, FiChevronRight, FiInfo,
  FiCamera, FiMapPin, FiCalendar, FiUser, FiLoader
} from 'react-icons/fi';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

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
          featured: index < 4, // First 4 images as featured
          aspect: Math.random() > 0.3 ? 'landscape' : 'portrait', // Random aspect ratio
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

  // Extract unique teams/stadiums for categories
  const categories = ['All', ...new Set(images.map(img => img.reservation?.team || 'Sports').filter(Boolean))];
  
  const featuredPhotos = images.filter(img => img.featured);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => 
        (img.reservation?.team || '').toLowerCase() === activeCategory.toLowerCase() ||
        (img.reservation?.stadium || '').toLowerCase() === activeCategory.toLowerCase()
      );

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const cameraScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [50, -50]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / 30;
      const y = (clientY - innerHeight / 2) / 30;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Set loaded state after initial render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const openPhotoModal = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(images.findIndex(img => img.id === photo.id));
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
    setIsZooming(false);
    setIsInfoVisible(false);
    document.body.style.overflow = 'hidden';
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
    setIsZooming(false);
    setIsInfoVisible(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  };

  const navigatePhoto = (direction) => {
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
  };

  const toggleLike = (photoId) => {
    setLikedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
    setIsZooming(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
    if (zoomLevel - 0.5 <= 1) {
      setDragOffset({ x: 0, y: 0 });
      setIsZooming(false);
    }
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
    setIsZooming(false);
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const x = e.clientX - dragStartRef.current.x;
      const y = e.clientY - dragStartRef.current.y;
      setDragOffset({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = async () => {
    if (selectedPhoto) {
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
    }
  };

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
      else if (e.key === 'i') setIsInfoVisible(!isInfoVisible);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, isInfoVisible, zoomLevel]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <FiLoader className="w-16 h-16 text-[#22c55e]" />
          </motion.div>
          <p className="text-white text-lg">Loading amazing sports moments...</p>
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
      {/* Hero Section with Camera */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#22c55e]/20" />
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(34,197,94,0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Camera with Parallax */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto px-4"
          style={{
            scale: cameraScale,
            opacity: cameraOpacity,
            x: mousePosition.x,
            y: mousePosition.y,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isLoaded ? 1 : 0.8, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Camera SVG */}
            <svg viewBox="0 0 800 400" className="w-full h-auto filter drop-shadow-2xl">
              {/* Camera Body */}
              <g>
                <defs>
                  <linearGradient id="bodyGradient" x1="200" y1="120" x2="600" y2="280">
                    <stop offset="0%" stopColor="#333" />
                    <stop offset="100%" stopColor="#666" />
                  </linearGradient>
                  <linearGradient id="lensGradient" x1="360" y1="160" x2="440" y2="240">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>

                {/* Camera Body */}
                <motion.rect
                  x="200" y="120" width="400" height="160" rx="20"
                  fill="url(#bodyGradient)"
                  stroke="#22c55e"
                  strokeWidth="2"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                />

                {/* Lens Mount */}
                <circle cx="400" cy="200" r="70" fill="#1a1a1a" stroke="#22c55e" strokeWidth="3"/>
                <circle cx="400" cy="200" r="55" fill="#2a2a2a" stroke="#22c55e" strokeWidth="2"/>
                
                {/* Animated Lens */}
                <motion.circle
                  cx="400" cy="200" r="40"
                  fill="url(#lensGradient)"
                  animate={{ r: [40, 42, 40] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Lens Reflection */}
                <motion.circle
                  cx="380" cy="180" r="8"
                  fill="white"
                  opacity="0.6"
                  animate={{ opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Shutter Button */}
                <motion.rect
                  x="550" y="100" width="30" height="20" rx="5"
                  fill="#22c55e"
                  animate={{ y: [100, 98, 100] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Mode Dial */}
                <circle cx="500" cy="100" r="15" fill="#333" stroke="#22c55e" strokeWidth="2"/>
                <circle cx="500" cy="100" r="8" fill="#22c55e"/>
                
                {/* Strap Lugs */}
                <rect x="220" y="110" width="20" height="30" fill="#666"/>
                <rect x="560" y="110" width="20" height="30" fill="#666"/>
                
                {/* Camera Strap */}
                <path d="M240 125 Q 320 50, 400 125" stroke="#444" strokeWidth="8" fill="none"/>
                <path d="M560 125 Q 640 50, 720 125" stroke="#444" strokeWidth="8" fill="none"/>
                
                {/* Flash */}
                <rect x="620" y="80" width="30" height="40" rx="5" fill="#444" stroke="#22c55e" strokeWidth="1"/>
                <rect x="625" y="85" width="20" height="30" rx="3" fill="#666"/>
              </g>
            </svg>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-[#22c55e]/20 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#16a34a]/20 blur-xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Overlay Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="text-center max-w-4xl px-4">
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">SPORTS</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#16a34a]">
                MOMENTS
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Capturing the intensity, emotion, and beauty of sports through professional photography.
              {images.length} moments captured and counting.
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

            {/* Image Count Badge */}
            <motion.div 
              className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <FiCamera className="text-[#22c55e]" />
              <span className="text-white text-sm">{images.length} Images</span>
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

      {/* Gallery Section */}
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
                    className="group relative cursor-pointer overflow-hidden rounded-2xl"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img 
                        src={photo.image} 
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                  className="group relative cursor-pointer overflow-hidden rounded-xl break-inside-avoid mb-6"
                >
                  <div className="relative">
                    <img 
                      src={photo.image} 
                      alt={photo.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Hover Info */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === photo.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: hoveredId === photo.id ? 0 : 20, opacity: hoveredId === photo.id ? 1 : 0 }}
                          transition={{ delay: 0.1 }}
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
                        </motion.div>
                      </div>
                    </motion.div>

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

      {/* Photo Modal */}
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
                  animate={{ scale: zoomLevel, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                    cursor: isZooming ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
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
    </div>
  );
};

export default Photography;