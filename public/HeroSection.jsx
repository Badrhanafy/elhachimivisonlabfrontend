import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  return (
    <section
      ref={heroRef}
      className="relative flex items-center justify-center pt-20 pb-12 sm:pt-24 md:pt-28 lg:pt-32"
      style={{ minHeight: 'calc(100vh - 80px)' }} // Adjust based on navbar height
    >
      {/* Content Container with centered positioning */}
      <div className="container relative mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          {/* Top decorative line */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </motion.div>

          {/* Main Headline with responsive typography */}
          <motion.div 
            className=""
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="space-y-2 sm:space-y-3 md:space-y-2">
              <h1 className="text-3xl titles xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                <h2 className="block title  text-gray-100  ">EL HACHIMI</h2>
                <span className="block bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent ">
                  VISIONLAB
                </span>
              </h1>
              
              {/* Subtle divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: '80px' } : {}}
                transition={{ delay: 0.4, duration: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto"
              />
            </div>
          </motion.div>

          {/* Tagline - Responsive sizing and spacing */}
        

          {/* Description Text - Responsive and centered */}
          <motion.div 
            className="mb-8 sm:mb-10 md:mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 1.2 }}
          >
            <div className="max-w-xl md:max-w-2xl mx-auto px-2 sm:px-4">
              <p className="text-sm texts  xs:text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed sm:leading-loose font-light">
                We are a multidisciplinary sports agency. From cinematic visuals to 
                data-driven analysis, we craft compelling narratives that elevate 
                athletes, teams, and brands to new heights.
              </p>
            </div>
          </motion.div>

          {/* Main CTA Button - Responsive sizing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-white to-gray-100 text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg md:text-xl hover:from-gray-100 hover:to-white transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 whitespace-nowrap">
                <Link to={'/works'}>Explore Our Work</Link>
              </span>
              <FiArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" />
              
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Button border glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          </motion.div>

          {/* Secondary CTA link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <button
              onClick={() => navigate('/contact')}
              className="group text-xs sm:text-sm text-gray-400 hover:text-white font-medium transition-colors duration-300 inline-flex items-center"
            >
              <span>Start a project with us</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Responsive positioning */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          y: [0, 8, 0]
        }}
        transition={{ 
          opacity: { delay: 1.2, duration: 1 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
      >
        <span className="text-xs text-gray-500 mb-1 tracking-wider uppercase hidden xs:block">
          Scroll to discover
        </span>
        <div className="relative">
          <FiChevronDown className="text-gray-400 text-lg sm:text-xl" />
          
          {/* Animated dot trail */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              delay: 0.2
            }}
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced gradient overlays for better contrast */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient to separate from navbar */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent"></div>
        
        {/* Center gradient for text emphasis */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
        
        {/* Bottom gradient for scroll indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
    </section>
  );
};

export default HeroSection;