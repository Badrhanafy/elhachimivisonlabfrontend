import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiArrowRight, FiX, FiChevronRight, FiLoader, FiYoutube } from 'react-icons/fi';

const VideoSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState("WdAACmrasok");
  const [showSimilar, setShowSimilar] = useState(false);
  const [isSimilarDismissed, setIsSimilarDismissed] = useState(false);
  const [channelVideos, setChannelVideos] = useState([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(true);

  // Elhachimivisionlab channel configuration
  const CHANNEL_USERNAME = "Elhachimivisionlab";
  const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";

  // Fallback videos
  const elhachimiVideos = [
    { 
      id: "EhVi1e3", 
      title: "Speed Training Session", 
      duration: "4:32",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    },
    { 
      id: "EhVi2e7", 
      title: "Agility Drills Pro", 
      duration: "6:15",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
    },
    { 
      id: "EhVi3e1", 
      title: "Power Development", 
      duration: "3:45",
      thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
    },
    { 
      id: "EhVi4e9", 
      title: "Recovery Techniques", 
      duration: "5:20",
      thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
    },
    { 
      id: "EhVi5e2", 
      title: "Nutrition for Athletes", 
      duration: "7:10",
      thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/mqdefault.jpg",
    },
  ];

  useEffect(() => {
    setChannelVideos(elhachimiVideos);
    setIsFetchingVideos(false);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setShowSimilar(false);
      setIsSimilarDismissed(false);
    }
  };

  const switchVideo = (videoId) => {
    if (videoId === currentVideoId) {
      togglePlay();
      return;
    }
    setCurrentVideoId(videoId);
    setIsLoading(true);
    setShowSimilar(false);
    setIsSimilarDismissed(false);
    setTimeout(() => setIsLoading(false), 800);
  };

  const dismissSimilar = () => {
    setShowSimilar(false);
  };

  const dontShowAgain = () => {
    setShowSimilar(false);
    setIsSimilarDismissed(true);
  };

  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setShowSimilar(false);
    } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      if (!isSimilarDismissed) {
        setShowSimilar(true);
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 overflow-hidden bg-black"
    >
      {/* Modern Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #22c55e22 1px, transparent 1px),
                             linear-gradient(to bottom, #22c55e22 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating Geometric Shapes */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-72 h-72 border border-[#22c55e]/20 rounded-3xl"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
        id=''
          className="absolute bottom-1/3 right-1/4 w-64 h-64 border border-[#16a34a]/20 rounded-full"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Neon Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-[#22c55e]/10 via-transparent to-[#16a34a]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-[#22c55e] rounded-full animate-ping opacity-75" />
                <div className="w-2 h-2 bg-[#22c55e] rounded-full" />
              </div>
              <span className="text-white/90 text-sm font-medium tracking-[0.2em] uppercase">
                Portfolio Showcase
              </span>
            </div>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">Visual</span>
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-transparent" />
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#22c55e]">Excellence</span>
          </motion.h2>
          
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            Premium video production and motion graphics showcasing our latest projects
          </motion.p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Video Column */}
          <motion.div
            className="lg:col-span-8 relative"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Modern Video Container with Glass Morphism */}
            <div className="relative">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#22c55e]/20 via-transparent to-[#16a34a]/20 blur-xl rounded-3xl opacity-50" />
              
              {/* Main Container */}
              <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-black/20 border border-white/10 overflow-hidden shadow-2xl">
                
                {/* Floating Corner Elements */}
                <div className="absolute top-0 left-0 w-20 h-20 -translate-x-10 -translate-y-10">
                  <div className="absolute inset-0 border-l-2 border-t-2 border-[#22c55e] rounded-tl-2xl" />
                  <motion.div 
                    className="absolute top-5 left-5 w-2 h-2 bg-[#22c55e] rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                <div className="absolute top-0 right-0 w-20 h-20 translate-x-10 -translate-y-10">
                  <div className="absolute inset-0 border-r-2 border-t-2 border-[#16a34a] rounded-tr-2xl" />
                  <motion.div 
                    className="absolute top-5 right-5 w-2 h-2 bg-[#16a34a] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 w-20 h-20 -translate-x-10 translate-y-10">
                  <div className="absolute inset-0 border-l-2 border-b-2 border-[#22c55e]/50 rounded-bl-2xl" />
                  <motion.div 
                    className="absolute bottom-5 left-5 w-2 h-2 bg-[#22c55e]/50 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                
                <div className="absolute bottom-0 right-0 w-20 h-20 translate-x-10 translate-y-10">
                  <div className="absolute inset-0 border-r-2 border-b-2 border-[#16a34a]/50 rounded-br-2xl" />
                  <motion.div 
                    className="absolute bottom-5 right-5 w-2 h-2 bg-[#16a34a]/50 rounded-full"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                {/* Animated Border Pulse */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl border border-transparent"
                  animate={{
                    borderColor: ['#22c55e00', '#22c55e40', '#22c55e00']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #22c55e00, #22c55e20, #22c55e00) border-box',
                    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude'
                  }}
                />

                {/* Video Container */}
                <div className="relative p-1">
                  {/* Native YouTube Player Container */}
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                    
                    {/* Loading State */}
                    <AnimatePresence>
                      {isLoading && (
                        <motion.div 
                          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-black z-40"
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="relative">
                            {/* Modern Loader */}
                            <motion.div
                              className="w-20 h-20 relative"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#22c55e] border-r-[#16a34a]" />
                              <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-[#22c55e] border-l-[#16a34a]" />
                            </motion.div>
                            
                            {/* Animated Rings */}
                            <motion.div
                              className="absolute inset-0 rounded-full border border-[#22c55e]/20"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          <motion.p 
                            className="mt-6 text-white/80 text-sm tracking-wider font-medium"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Loading Content
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Native YouTube Iframe */}
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1`}
                      title="YouTube video player"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      onLoad={() => setIsLoading(false)}
                    />


                   
                  </div>
                </div>

            
              </div>

              {/* Floating Status Indicator */}
              <motion.div
                className="absolute -top-3 -right-3 z-40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full blur-md" />
                  
                </div>
              </motion.div>
            </div>

            {/* Modern Video Suggestions */}
            <AnimatePresence>
              {showSimilar && !isLoading && (
                <motion.div
                  className="absolute -bottom-20 left-0 right-0 z-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#22c55e] to-[#16a34a] flex items-center justify-center">
                          <FiYoutube className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">More Videos</h4>
                          <p className="text-gray-400 text-xs">From @elhachimivisionlab</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={dontShowAgain}
                          className="text-xs text-gray-400 hover:text-[#22c55e] px-3 py-1 rounded-lg border border-white/10 hover:border-[#22c55e]/50 transition-colors"
                        >
                          Hide
                        </button>
                        <button 
                          onClick={dismissSimilar}
                          className="w-8 h-8 rounded-lg border border-white/10 hover:border-[#22c55e]/50 flex items-center justify-center transition-colors"
                        >
                          <FiX className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-5 gap-3">
                      {channelVideos.map((video) => (
                        <button
                          key={video.id}
                          onClick={() => switchVideo(video.id)}
                          className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-[#22c55e] transition-all duration-300"
                        >
                          <div className="aspect-video relative">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-2 right-2">
                              <span className="text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-white">
                                {video.duration}
                              </span>
                            </div>
                            {currentVideoId === video.id && (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/20 to-transparent flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg">
                                  <FiPlay className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-white text-xs font-medium text-left truncate">
                              {video.title}
                            </p>
                          </div>
                        </button>
                      ))}
                      
                      <a
                        href={`https://www.youtube.com/@${CHANNEL_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-[#22c55e] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FiChevronRight className="w-4 h-4 text-[#22c55e]" />
                        </div>
                        <span className="text-[10px] text-[#22c55e] font-medium">View All</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Column */}
          <motion.div
            className="lg:col-span-4 space-y-8"
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            

            {/* Description */}
            <motion.div
              className="rounded-2xl backdrop-blur-md bg-transparent  p-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-white font-bold text-lg mb-3">Production Quality</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Each frame is meticulously crafted with cinematic precision. 
                Our team utilizes state-of-the-art equipment and industry-leading 
                techniques to deliver unparalleled visual storytelling.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Color Accuracy</span>
                  <span>98%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
           
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;