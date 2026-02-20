import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const BrandLogos = () => {
  const [logoErrors, setLogoErrors] = useState({});
  const [hoveredLogo, setHoveredLogo] = useState(null);
  const controls = useAnimation();
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  
  // Brand logos with local paths
  const brandLogos = [
    { 
      id: 1, 
      name: 'Team', 
      whiteUrl: '/logos/teamwhite.png',
      colorUrl: '/logos/team.png',
      width: 160,
      height: 80
    },
    { 
      id: 2, 
      name: 'JSM', 
      whiteUrl: '/logos/jsmwhite.png',
      colorUrl: '/logos/jsm.png',
      width: 160,
      height: 80
    },
    { 
      id: 3, 
      name: 'OCP', 
      whiteUrl: '/logos/ocpwhite.png',
      colorUrl: '/logos/ocp.jpg',
      width: 150,
      height: 75
    },
    { 
      id: 4, 
      name: 'EASF', 
      whiteUrl: '/logos/easfwhite.png',
      colorUrl: '/logos/easf.png',
      width: 170,
      height: 80
    },
    { 
      id: 5, 
      name: 'Chada', 
      whiteUrl: '/logos/chadawhite.png',
      colorUrl: '/logos/chada.png',
      width: 165,
      height: 80
    },
  ];

  const GAP = 100;
  
  // Calculate total width of one set including gaps
  const singleSetWidth = brandLogos.reduce((acc, logo) => acc + (logo.width || 160) + GAP, 0);

  // Create duplicated set for infinite loop (2x is enough for true disappearance/reappearance)
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  // Get container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      if (marqueeRef.current) {
        setMarqueeWidth(marqueeRef.current.scrollWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Start the animation
  useEffect(() => {
    if (containerWidth > 0 && marqueeWidth > 0) {
      startAnimation();
    }
  }, [containerWidth, marqueeWidth]);

  // Handle hover state changes smoothly
  useEffect(() => {
    if (containerWidth > 0 && marqueeWidth > 0) {
      if (hoveredLogo) {
        controls.stop();
      } else {
        startAnimation();
      }
    }
  }, [hoveredLogo, containerWidth, marqueeWidth]);

  const startAnimation = async () => {
    // Calculate the distance to move (half of marquee width for true loop)
    const moveDistance = marqueeWidth / 2;
    
    await controls.start({
      x: [0, -moveDistance],
      transition: {
        x: {
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
          repeatDelay: 0
        }
      }
    });
  };

  // Handle logo load error with fallback
  const handleLogoError = (logoId, version) => {
    setLogoErrors(prev => ({ ...prev, [`${logoId}-${version}`]: true }));
  };

  // Get current logo URL based on hover state
  const getLogoUrl = (logo, index, isHovered) => {
    const logoId = `${logo.id}-${index}`;
    
    if (isHovered) {
      return !logoErrors[`${logoId}-color`] ? logo.colorUrl : logo.whiteUrl;
    } else {
      return !logoErrors[`${logoId}-white`] ? logo.whiteUrl : logo.colorUrl;
    }
  };

  return (
    <div className="w-full bg-black py-16 overflow-hidden relative">
      {/* Simple fade edges */}
      <div className="absolute left-0 top-0 w-32 h-full z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />
      <div className="absolute right-0 top-0 w-32 h-full z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />

      {/* Header Section */}
      <div className="relative z-20 text-center mb-12 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-white mt-3"
        >
          Our Trusted Clients
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-24 h-0.5 bg-white/20 mx-auto mt-5"
        />
      </div>

      {/* Logos Marquee */}
      <div 
        ref={containerRef}
        className="relative flex items-center overflow-hidden"
      >
        {/* Animated marquee container */}
        <motion.div
          ref={marqueeRef}
          className="flex items-center"
          style={{ gap: `${GAP}px` }}
          animate={controls}
          initial={{ x: 0 }}
        >
          {/* Render duplicated logos */}
          {duplicatedLogos.map((logo, index) => {
            const uniqueId = `${logo.id}-${index}`;
            const isThisLogoHovered = hoveredLogo === uniqueId;
            
            // Determine which URL to use
            const currentUrl = getLogoUrl(logo, index, isThisLogoHovered);
            
            return (
              <motion.div
                key={uniqueId}
                className="flex-shrink-0 group relative cursor-pointer"
                onHoverStart={() => setHoveredLogo(uniqueId)}
                onHoverEnd={() => setHoveredLogo(null)}
                whileHover={{ 
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
              >
                {/* Logo container */}
                <div className="relative flex items-center justify-center">
                  {/* Clean image */}
                  <motion.img
                    src={currentUrl}
                    alt={logo.name}
                    className="h-20 md:h-24 w-auto object-contain transition-all duration-300 ease-in-out"
                    style={{ 
                      maxWidth: `${logo.width}px`,
                      maxHeight: `${logo.height}px`,
                      filter: isThisLogoHovered ? 'brightness(1.05)' : 'brightness(1)',
                    }}
                    onError={() => {
                      handleLogoError(logo.id, 'white');
                      handleLogoError(logo.id, 'color');
                    }}
                  />

                  {/* Simple tooltip on hover */}
                  {isThisLogoHovered && (
                    <motion.div 
                      className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none whitespace-nowrap z-30"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                    >
                      <div className="relative">
                        <span className="text-xs bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-full border border-white/20 font-medium">
                          {logo.name}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Subtle bottom border */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
};

export default BrandLogos;