import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const BrandLogos = () => {
  const [logoErrors, setLogoErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Brand logos with local paths - LARGER SIZES
  const brandLogos = [
    { 
      id: 1, 
      name: 'Team', 
      url: '/logos/team.png',
      width: 160,
      height: 80
    },
    { 
      id: 2, 
      name: 'JSM', 
      url: '/logos/jsm.png',
      width: 160,
      height: 80
    },
    { 
      id: 3, 
      name: 'OCP', 
      url: '/logos/ocp.jpg',
      width: 150,
      height: 75
    },
    { 
      id: 4, 
      name: 'EASF', 
      url: '/logos/easf.png',
      width: 170,
      height: 80
    },
    { 
      id: 5, 
      name: 'Chada', 
      url: '/logos/chada.png',
      width: 165,
      height: 80
    },
  ];

  // Duplicate logos twice for seamless marquee (need less duplication with this method)
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  // Calculate total width of one set
  const GAP = 100; // Increased gap for larger logos
  const singleSetWidth = brandLogos.reduce((acc, logo) => acc + (logo.width || 160) + GAP, 0);

  // Get container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Start the animation
  useEffect(() => {
    if (containerWidth > 0) {
      startAnimation();
    }
  }, [containerWidth]);

  // Handle hover state changes smoothly
  useEffect(() => {
    if (containerWidth > 0) {
      if (isHovered) {
        controls.stop();
      } else {
        startAnimation();
      }
    }
  }, [isHovered, containerWidth]);

  const startAnimation = async () => {
    // True marquee effect: start at 0, end at -singleSetWidth
    // This creates the illusion of logos disappearing on the left and reappearing on the right
    await controls.start({
      x: [0, -singleSetWidth],
      transition: {
        x: {
          duration: 25, // Smooth, moderate speed
          repeat: Infinity,
          ease: "linear",
          repeatType: "marquee",
          repeatDelay: 0
        }
      }
    });
  };

  // Handle logo load error with fallback
  const handleLogoError = (logoId) => {
    setLogoErrors(prev => ({ ...prev, [logoId]: true }));
  };

  return (
    <div className="w-full bg-black py-16 overflow-hidden relative">
      {/* Multiple gradient layers for ultra-smooth fade effect - WIDER for better disappearance */}
      <div className="absolute left-0 top-0 w-64 h-full z-30 pointer-events-none bg-gradient-to-r from-black via-black to-transparent" />
      <div className="absolute right-0 top-0 w-64 h-full z-30 pointer-events-none bg-gradient-to-l from-black via-black to-transparent" />
      
      {/* Secondary gradient for depth */}
      <div className="absolute left-0 top-0 w-80 h-full z-20 pointer-events-none bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute right-0 top-0 w-80 h-full z-20 pointer-events-none bg-gradient-to-l from-black/90 via-black/60 to-transparent" />
      
      {/* Tertiary gradient for ultimate smoothness */}
      <div className="absolute left-0 top-0 w-96 h-full z-10 pointer-events-none bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute right-0 top-0 w-96 h-full z-10 pointer-events-none bg-gradient-to-l from-black/80 via-black/40 to-transparent" />

      {/* Header Section - Enhanced */}
      <div className="relative z-40 text-center mb-12 px-4">
      
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-white mt-3"
        >
          Our Trusted clients
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-24 h-0.5 bg-gradient-to-r from-[#22c55e] to-transparent mx-auto mt-5"
        />
      </div>

      {/* Logos Marquee - True disappearing/reappearing effect */}
      <div 
        ref={containerRef}
        className="relative flex items-center overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated marquee container */}
        <motion.div
          className="flex items-center"
          style={{ gap: `${GAP}px` }}
          animate={controls}
          initial={{ x: 0 }}
        >
          {/* Render duplicated logos for seamless loop */}
          {duplicatedLogos.map((logo, index) => {
            const hasError = logoErrors[`${logo.id}-${index}`];
            
            return (
              <motion.div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 group relative"
                whileHover={{ 
                  scale: 1.15,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
              >
                {/* Logo container - LARGER */}
                <div className="relative flex items-center justify-center">
                  {/* Animated glow effect on hover - Enhanced */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[rgb(204,255,0)]/0 via-[#22c55e]/25 to-[#22c55e]/0 rounded-full blur-3xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ 
                      opacity: 1, 
                      scale: 2.0,
                      transition: { duration: 0.5 }
                    }}
                  />
                  
                  {/* Logo image - LARGER with original colors */}
                  {!hasError ? (
                    <motion.img
                      src={logo.url}
                      alt={logo.name}
                      className="h-20 md:h-24 w-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
                      style={{ 
                        maxWidth: `${logo.width}px`,
                        maxHeight: `${logo.height}px`,
                      }}
                      onError={() => handleLogoError(`${logo.id}-${index}`)}
                      whileHover={{
                        filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.7))',
                      }}
                    />
                  ) : (
                    <motion.div 
                      className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700"
                      style={{ 
                        width: `${logo.width}px`, 
                        height: `${logo.height}px`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-white font-bold text-xl">
                        {logo.name}
                      </span>
                    </motion.div>
                  )}

                  {/* Premium tooltip on hover - Enhanced */}
                  <motion.div 
                    className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap"
                    initial={{ y: 15 }}
                    whileHover={{ y: 0 }}
                  >
                    <div className="relative">
                      <span className="text-sm bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white px-5 py-2.5 rounded-full shadow-lg shadow-[#22c55e]/40 font-medium tracking-wide">
                        {logo.name}
                      </span>
                      <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-[#22c55e] rotate-45" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom gradient border with animation */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent"
      />

      {/* Marquee effect indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3">
       

       
      </div>

     
    </div>
  );
};

export default BrandLogos;