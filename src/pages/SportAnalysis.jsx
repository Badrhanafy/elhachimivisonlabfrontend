import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlay, 
  FiBarChart2, 
  FiUsers, 
  FiTarget, 
  FiTrendingUp,
  FiClock,
  FiAward,
  FiCamera,
  FiVideo,
  FiArrowRight,
  FiYoutube
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

const SportAnalysis = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  // Analysis items with alternating layouts - YouTube links
  const analysisItems = [
    {
      id: 1,
      type: 'image-left',
      title: 'Tactical Formation Analysis',
      subtitle: '4-3-3 Attacking Pattern',
      description: 'The 4-3-3 formation creates natural triangles in midfield, allowing for quick passing combinations and effective pressing triggers. Notice how the wingers maintain width while the full-backs provide overlapping runs.',
      media: {
        type: 'image',
        url: '/formation.avif',
        caption: 'Tactical formation analysis'
      },
      stats: {
        possession: '58%',
        passes: '423',
        accuracy: '87%'
      },
      tags: ['Tactical', 'Formation', 'Premier League']
    },
    {
      id: 2,
      type: 'video-right',
      title: 'Player Movement Analysis',
      subtitle: 'Striker Positioning & Runs',
      description: 'Exceptional off-ball movement patterns: The striker consistently checks his shoulder before making runs, allowing him to time his attacks perfectly. Shot placement analysis shows a preference for low, driven shots.',
      media: {
        type: 'video',
        youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube ID
        thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop',
        caption: 'Player movement visualization'
      },
      stats: {
        distance: '10.2km',
        sprints: '24',
        touches: '52'
      },
      tags: ['Individual', 'Performance', 'Striker']
    },
    {
      id: 3,
      type: 'image-right',
      title: 'Set Piece Strategy',
      subtitle: 'Corners & Free Kicks',
      description: 'Innovative corner routine: The near-post flick-on creates chaos in the six-yard box. Three players attack different zones, making it difficult for zonal marking systems to track all threats effectively.',
      media: {
        type: 'image',
        url: '/corner.jpg',
        caption: 'Set piece positioning'
      },
      stats: {
        corners: '3',
        goals: '1',
        xG: '1.28'
      },
      tags: ['Set Pieces', 'Corners', 'Strategy']
    },
    {
      id: 4,
      type: 'video-left',
      title: 'Defensive Organization',
      subtitle: 'High Press & Recovery',
      description: 'Defensive organization shows a compact block of 7 players when out of possession, with the front 3 triggering the press. This system has proven effective against teams building from the back.',
      media: {
        type: 'video',
        youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube ID
        thumbnail: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1200&auto=format&fit=crop',
        caption: 'Defensive shape analysis'
      },
      stats: {
        tackles: '18',
        interceptions: '12',
        recovery: '24'
      },
      tags: ['Defense', 'Pressing', 'Organization']
    }
  ];

  // Animation variants
  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (youtubeId) => {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0&controls=1`;
  };

  return (
    <section className="relative bg-black py-24 overflow-hidden">
      <Navbar/>
      {/* Minimal Black Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle Green Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #ccff00 1px, transparent 1px),
                           linear-gradient(to bottom, #ccff00 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Green Gradient Orbs - Very Subtle */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Black & White with Green Accent */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-[#ffff] font-semibold">
            Sport Science
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mt-4 mb-6">
            Analysis{' '}
            <span className="text-[#ccff00]">Reimagined</span>
          </h2>
          <div className="w-20 h-1 bg-[#ccff00] mx-auto" />
          <p className="text-xl text-gray-400 mt-6">
            Every analysis tells a unique story through dynamic layouts and immersive media
          </p>
        </motion.div>

        {/* Alternating Grid Items */}
        <div className="space-y-32 lg:space-y-40">
          {analysisItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              {/* Grid Container */}
              <div className={`
                grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center
                ${item.type.includes('left') ? '' : 'lg:flex-row-reverse'}
              `}>
                {/* Text Content */}
                <motion.div
                  variants={item.type.includes('left') ? slideInLeft : slideInRight}
                  transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
                  className={`
                    lg:col-span-5 space-y-6
                    ${item.type.includes('right') ? 'lg:order-2' : 'lg:order-1'}
                  `}
                >
                  {/* Category Badge - Black & White with Green Icon */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                      {item.media.type === 'video' ? (
                        <FiYoutube className="w-6 h-6 text-[#ccff00]" />
                      ) : (
                        <FiCamera className="w-6 h-6 text-[#ccff00]" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-white/10 text-gray-300 text-xs rounded-full border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title - Black & White */}
                  <motion.h3
                    variants={fadeInUp}
                    className="text-3xl lg:text-4xl font-bold text-white"
                  >
                    {item.title}
                  </motion.h3>
                  
                  {/* Subtitle - Green */}
                  <motion.h4
                    variants={fadeInUp}
                    className="text-xl font-semibold text-[#ccff00]"
                  >
                    {item.subtitle}
                  </motion.h4>
                  
                  {/* Description - Gray */}
                  <motion.p
                    variants={fadeInUp}
                    className="text-gray-400 leading-relaxed text-lg"
                  >
                    {item.description}
                  </motion.p>

                  {/* Stats Grid - Black & White with Green Numbers */}
                  <motion.div
                    variants={scaleIn}
                    className="grid grid-cols-3 gap-4 pt-4"
                  >
                    {Object.entries(item.stats).map(([key, value], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="text-center p-4 bg-white/5 rounded-2xl border border-white/10"
                      >
                        <p className="text-2xl lg:text-3xl font-bold text-[#ccff00]">{value}</p>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mt-1">{key}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* View on YouTube Button - For video items */}
                  {item.media.type === 'video' && (
                    <motion.a
                      href={`https://youtube.com/watch?v=${item.media.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 inline-flex items-center gap-2 text-[#ccff00] hover:text-white transition-colors"
                    >
                      <FiYoutube className="w-5 h-5" />
                      <span className="text-sm font-medium">Watch on YouTube</span>
                      <FiArrowRight className="w-4 h-4" />
                    </motion.a>
                  )}
                </motion.div>

                {/* Media Column */}
                <motion.div
                  variants={scaleIn}
                  transition={{ duration: 0.6 }}
                  className={`
                    lg:col-span-7 relative
                    ${item.type.includes('right') ? 'lg:order-1' : 'lg:order-2'}
                  `}
                >
                  {/* Media Container - Black & White with Green Border */}
                  <div className="relative group">
                    {/* Green Border Accent */}
                    <div className="absolute -inset-1 bg-[#ccff00] rounded-3xl opacity-20 group-hover:opacity-30 blur-md transition-all duration-500" />
                    
                    {/* Main Media Card - Black Background */}
                    <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10 aspect-video shadow-2xl">
                      {item.media.type === 'video' ? (
                        activeVideo === item.id ? (
                          // YouTube Iframe when active
                          <iframe
                            src={getYouTubeEmbedUrl(item.media.youtubeId)}
                            title={item.title}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          // YouTube Thumbnail with Play Button
                          <>
                            <img
                              src={getYouTubeThumbnail(item.media.youtubeId)}
                              alt={item.media.caption}
                              className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 opacity-90"
                            />
                            
                            {/* YouTube Brand Indicator */}
                            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                              <FiYoutube className="w-4 h-4 text-[#ccff00]" />
                              <span className="text-white text-xs">YouTube</span>
                            </div>
                            
                            {/* Video Overlay Play Button - Green */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveVideo(item.id)}
                                className="w-20 h-20 rounded-full bg-[#ccff00] flex items-center justify-center cursor-pointer shadow-lg shadow-[#ccff00]/30"
                              >
                                <FiPlay className="w-8 h-8 text-black ml-1.5" />
                              </motion.button>
                            </div>
                          </>
                        )
                      ) : (
                        <>
                          <img
                            src={item.media.url}
                            alt={item.media.caption}
                            className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 opacity-90"
                          />
                          
                          {/* Image Overlay - Subtle Green Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </>
                      )}

                      {/* Media Caption - White on Black */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            {item.media.type === 'video' ? (
                              <FiYoutube className="w-5 h-5 text-[#ccff00]" />
                            ) : (
                              <FiCamera className="w-5 h-5 text-[#ccff00]" />
                            )}
                          </div>
                          <span className="text-white/90 text-sm font-medium">
                            {item.media.caption}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>

              {/* Separator Line - Green (except last) */}
              {index < analysisItems.length - 1 && (
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#ccff00] to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - Green on Black */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-32"
        >
          <div className="relative inline-block">
            {/* Green Glow */}
            <div className="absolute inset-0 bg-[#ccff00] rounded-full blur-2xl opacity-20" />
            <button className="relative px-12 py-5 bg-[#ccff00] text-black font-bold text-lg rounded-full hover:bg-[#b3ff00] transition-all flex items-center gap-3 mx-auto group">
              <FiAward className="w-6 h-6" />
              Explore All Analysis
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Footer Credit - Minimal */}
        <div className="text-center mt-16 pt-16 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            <span className="text-[#ccff00]">●</span> Professional Sport Analysis
          </p>
        </div>
      </div>
    </section>
  );
};

export default SportAnalysis;