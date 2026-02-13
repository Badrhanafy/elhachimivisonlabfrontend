// pages/Works.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Heart, 
  Download, 
  Share2,
  Camera,
  Tag,
  Grid,
  Instagram,
  Maximize2,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

const Works = () => {
  // Sample photography projects with different aspect ratios for varied grid
  const initialProjects = [
    {
      id: 1,
      title: "Urban Sunset",
      category: "urban",
      type: "image",
      year: "2024",
      description: "The city breathes in golden hour",
      tags: ["sunset", "city", "architecture"],
      aspect: "vertical",
      image: "https://images.unsplash.com/photo-1507149833265-60c372daea22?w=800&q=80",
      likes: 245,
      views: 1234,
      featured: true
    },
    {
      id: 2,
      title: "Mountain Majesty",
      category: "nature",
      type: "video",
      year: "2023",
      description: "Peaks touching the sky",
      tags: ["mountains", "landscape", "snow"],
      aspect: "horizontal",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-snowy-mountain-peak-41557-large.mp4",
      likes: 189,
      views: 987,
      featured: true
    },
    {
      id: 3,
      title: "Portrait Series",
      category: "portrait",
      type: "image",
      year: "2024",
      description: "Stories in their eyes",
      tags: ["portrait", "blackwhite", "human"],
      aspect: "square",
      image: "https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=800&q=80",
      likes: 312,
      views: 1567,
      featured: false
    },
    {
      id: 4,
      title: "Street Life",
      category: "street",
      type: "image",
      year: "2023",
      description: "The rhythm of the city",
      tags: ["street", "urban", "culture"],
      aspect: "horizontal",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
      likes: 178,
      views: 845,
      featured: false
    },
    {
      id: 5,
      title: "Wildlife Wonders",
      category: "wildlife",
      type: "video",
      year: "2024",
      description: "Wild hearts beating free",
      tags: ["wildlife", "animals", "nature"],
      aspect: "vertical",
      image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w-800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-wild-horses-running-in-the-mountains-41084-large.mp4",
      likes: 421,
      views: 2345,
      featured: true
    },
    {
      id: 6,
      title: "Abstract Architecture",
      category: "architecture",
      type: "image",
      year: "2023",
      description: "Geometry in motion",
      tags: ["architecture", "abstract", "geometry"],
      aspect: "square",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
      likes: 156,
      views: 756,
      featured: false
    },
    {
      id: 7,
      title: "Underwater World",
      category: "underwater",
      type: "video",
      year: "2024",
      description: "Colors of the deep",
      tags: ["underwater", "marine", "colorful"],
      aspect: "horizontal",
      image: "https://images.unsplash.com/photo-1566024287286-457246b56b8a?w=1200&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-fish-swimming-in-clear-underwater-4062-large.mp4",
      likes: 298,
      views: 1789,
      featured: true
    },
    {
      id: 8,
      title: "Night Photography",
      category: "night",
      type: "image",
      year: "2023",
      description: "Stars painting the dark",
      tags: ["night", "stars", "lights"],
      aspect: "vertical",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80",
      likes: 234,
      views: 1345,
      featured: false
    },
    {
      id: 9,
      title: "Desert Dreams",
      category: "landscape",
      type: "image",
      year: "2024",
      description: "Sands of time",
      tags: ["desert", "landscape", "golden"],
      aspect: "horizontal",
      image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80",
      likes: 187,
      views: 934,
      featured: false
    },
    {
      id: 10,
      title: "Urban Geometry",
      category: "architecture",
      type: "image",
      year: "2024",
      description: "Lines and shadows",
      tags: ["architecture", "urban", "lines"],
      aspect: "vertical",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
      likes: 165,
      views: 823,
      featured: false
    },
    {
      id: 11,
      title: "Forest Path",
      category: "nature",
      type: "video",
      year: "2023",
      description: "Whispers of the woods",
      tags: ["forest", "nature", "path"],
      aspect: "square",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
      video: "https://assets.mixkit.co/videos/preview/mixkit-walking-on-a-forest-path-41375-large.mp4",
      likes: 276,
      views: 1423,
      featured: true
    },
    {
      id: 12,
      title: "Modern Minimalism",
      category: "architecture",
      type: "image",
      year: "2024",
      description: "Less is more",
      tags: ["minimal", "architecture", "white"],
      aspect: "horizontal",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      likes: 198,
      views: 1045,
      featured: false
    }
  ];

  const [projects, setProjects] = useState(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedProjects, setLikedProjects] = useState(new Set());
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const [mutedVideos, setMutedVideos] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Works', color: 'from-white to-gray-300' },
    { id: 'featured', label: 'Featured', color: 'from-amber-500 to-yellow-500' },
    { id: 'urban', label: 'Urban', color: 'from-gray-700 to-gray-900' },
    { id: 'nature', label: 'Nature', color: 'from-emerald-500 to-green-500' },
    { id: 'portrait', label: 'Portrait', color: 'from-rose-500 to-pink-500' },
    { id: 'architecture', label: 'Architecture', color: 'from-blue-500 to-cyan-500' },
    { id: 'video', label: 'Videos', color: 'from-purple-500 to-violet-500' }
  ];

  // Filter projects
  useEffect(() => {
    let filtered = projects;
    
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'featured') {
        filtered = filtered.filter(project => project.featured);
      } else if (selectedCategory === 'video') {
        filtered = filtered.filter(project => project.type === 'video');
      } else {
        filtered = filtered.filter(project => project.category === selectedCategory);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredProjects(filtered);
  }, [selectedCategory, searchTerm, projects]);

  // Open lightbox
  const openLightbox = (project) => {
    setSelectedProject(project);
    setLightboxOpen(true);
    if (project.type === 'video' && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Close lightbox
  const closeLightbox = () => {
    if (selectedProject?.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setLightboxOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  // Toggle video play/pause
  const toggleVideoPlay = (projectId, e) => {
    e.stopPropagation();
    const newPlaying = new Set(playingVideos);
    if (newPlaying.has(projectId)) {
      newPlaying.delete(projectId);
    } else {
      newPlaying.add(projectId);
    }
    setPlayingVideos(newPlaying);
  };

  // Toggle video mute
  const toggleVideoMute = (projectId, e) => {
    e.stopPropagation();
    const newMuted = new Set(mutedVideos);
    if (newMuted.has(projectId)) {
      newMuted.delete(projectId);
    } else {
      newMuted.add(projectId);
    }
    setMutedVideos(newMuted);
  };

  // Toggle like
  const toggleLike = (projectId, e) => {
    if (e) e.stopPropagation();
    const newLiked = new Set(likedProjects);
    if (newLiked.has(projectId)) {
      newLiked.delete(projectId);
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, likes: p.likes - 1 } : p
      ));
    } else {
      newLiked.add(projectId);
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, likes: p.likes + 1 } : p
      ));
    }
    setLikedProjects(newLiked);
  };

  // Toggle lightbox video play
  const toggleLightboxVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Get grid column span based on aspect ratio
  const getColumnSpan = (aspect) => {
    switch (aspect) {
      case 'horizontal': return 'col-span-2';
      case 'vertical': return 'row-span-2';
      case 'square': return 'col-span-1 row-span-1';
      default: return 'col-span-1 row-span-1';
    }
  };

  // Project item component
  const ProjectItem = ({ project }) => {
    const isLiked = likedProjects.has(project.id);
    const isPlaying = playingVideos.has(project.id);
    const isMuted = mutedVideos.has(project.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        className={`relative ${getColumnSpan(project.aspect)} group cursor-pointer`}
        onClick={() => openLightbox(project)}
      >
        {/* Media Container */}
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black">
          {/* Image/Video */}
          {project.type === 'image' ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <>
              <video
                src={project.video}
                poster={project.image}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                autoPlay={isPlaying}
              />
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => toggleVideoPlay(project.id, e)}
                  className="p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={(e) => toggleVideoMute(project.id, e)}
                  className="p-2 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {project.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-semibold rounded-full">
                    Featured
                  </span>
                )}
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                  {project.category}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleLike(project.id, e)}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/20">
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-black/50 text-gray-300 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="px-2 py-1 bg-black/50 text-gray-400 text-xs rounded">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {project.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    {project.type === 'video' ? 'Video' : 'Photo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info (Always Visible) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {project.year} • {project.category}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Lightbox component
  const Lightbox = () => {
    if (!selectedProject) return null;
    
    return (
      <AnimatePresence>
        {lightboxOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 bg-black/95 z-50 backdrop-blur-lg"
            />
            
            {/* Lightbox content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-6xl bg-black rounded-2xl overflow-hidden border border-gray-800"
              >
                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors border border-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Main media */}
                <div className="relative h-[70vh] bg-gradient-to-br from-gray-900 to-black">
                  {selectedProject.type === 'image' ? (
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        src={selectedProject.video}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        loop
                      />
                      {/* Custom play button */}
                      <button
                        onClick={toggleLightboxVideo}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors border border-gray-700"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8" />
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Project info */}
                <div className="p-8 bg-gradient-to-b from-black to-gray-900">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">
                            {selectedProject.title}
                          </h2>
                          <div className="flex items-center gap-4 text-gray-400">
                            <span className="text-sm">{selectedProject.year}</span>
                            <span className="text-gray-600">•</span>
                            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                              {selectedProject.category}
                            </span>
                            <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                              {selectedProject.type === 'video' ? 'Video' : 'Photo'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => toggleLike(selectedProject.id, e)}
                            className={`p-3 rounded-full border ${
                              likedProjects.has(selectedProject.id)
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${likedProjects.has(selectedProject.id) ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = selectedProject.image || selectedProject.video;
                              link.download = `${selectedProject.title}.${selectedProject.type === 'image' ? 'jpg' : 'mp4'}`;
                              link.click();
                            }}
                            className="p-3 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white rounded-full"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: selectedProject.title,
                                  text: selectedProject.description,
                                  url: window.location.href,
                                });
                              } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                              }
                            }}
                            className="p-3 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white rounded-full"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-lg mb-6">
                        {selectedProject.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        {selectedProject.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-gray-800/50 text-gray-300 text-sm rounded-lg border border-gray-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Right column */}
                    <div className="space-y-6">
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Likes</span>
                            <div className="flex items-center gap-2">
                              <Heart className={`w-4 h-4 ${likedProjects.has(selectedProject.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                              <span className="text-white font-medium">{selectedProject.likes}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Views</span>
                            <span className="text-white font-medium">{selectedProject.views}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Type</span>
                            <span className="text-white font-medium capitalize">
                              {selectedProject.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Camera className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">
                              {selectedProject.type === 'video' ? 'Video Production' : 'Photography'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 capitalize">{selectedProject.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black" />
        <div className="relative container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Visual
              </span>{' '}
              <span className="text-gray-300">Archive</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              A curated collection of photography and videography projects.
              Each piece tells a unique story through light and perspective.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {projects.filter(p => p.type === 'video').length}
                </div>
                <div className="text-sm text-gray-400">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {projects.reduce((sum, p) => sum + p.likes, 0)}
                </div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {categories.length - 2}
                </div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search visual stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
              />
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <button className="px-6 py-3 bg-gradient-to-r from-white to-gray-100 text-black font-medium rounded-xl hover:from-gray-100 hover:to-white transition-all">
                Contact
              </button>
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap border ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-black border-transparent`
                      : 'bg-gray-900/50 text-gray-400 hover:text-white border-gray-700'
                  }`}
                >
                  <span className="font-medium">{category.label}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    selectedCategory === category.id
                      ? 'bg-black/20'
                      : 'bg-gray-800'
                  }`}>
                    {category.id === 'all' 
                      ? projects.length
                      : category.id === 'featured'
                      ? projects.filter(p => p.featured).length
                      : category.id === 'video'
                      ? projects.filter(p => p.type === 'video').length
                      : projects.filter(p => p.category === category.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-12">
        {/* Results info */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Visual' : 'Visuals'}
            </h2>
            <p className="text-gray-400">
              {selectedCategory !== 'all' && `in ${categories.find(c => c.id === selectedCategory)?.label}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
          <div className="text-sm text-gray-400">
            <Grid className="w-5 h-5 inline mr-2" />
            Masonry Grid
          </div>
        </div>

        {/* Projects Masonry Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-gray-600 text-6xl mb-6">📷</div>
            <h3 className="text-2xl font-medium text-gray-300 mb-3">No visuals found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or selecting a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-400 mb-6">
              "Photography is the story I fail to put into words."
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Visual Archive • All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox />
    </div>
  );
};

export default Works;