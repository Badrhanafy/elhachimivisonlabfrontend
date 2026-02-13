import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  // Energy rings - concentric pulsing circles
  const energyRings = [
    { id: 0, size: 300, delay: 0, duration: 4 },
    { id: 1, size: 500, delay: 0.5, duration: 4.5 },
    { id: 2, size: 700, delay: 1, duration: 5 },
    { id: 3, size: 900, delay: 1.5, duration: 5.5 },
    { id: 4, size: 1100, delay: 2, duration: 6 },
  ];

  // Speed lines - diagonal streaks suggesting motion
  const speedLines = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    length: 100 + Math.random() * 200,
    angle: -35 + Math.random() * 10,
    opacity: 0.05 + Math.random() * 0.1,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 3,
  }));

  // Floating energy orbs
  const energyOrbs = [
    { id: 0, x: 10, y: 20, size: 150, color: 'rgba(184, 230, 1, 0.4)', blur: 50 },
    { id: 1, x: 85, y: 75, size: 200, color: 'rgba(72, 187, 120, 0.35)', blur: 60 },
    { id: 2, x: 75, y: 15, size: 120, color: 'rgba(167, 243, 208, 0.3)', blur: 40 },
    { id: 3, x: 20, y: 80, size: 180, color: 'rgba(52, 211, 153, 0.35)', blur: 55 },
    { id: 4, x: 50, y: 50, size: 250, color: 'rgba(184, 230, 1, 0.25)', blur: 80 },
  ];

  // Kinetic particles - fast moving dots
  const kineticParticles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: 50 + Math.random() * 50,
    speed: 3 + Math.random() * 4,
    size: 2 + Math.random() * 3,
  }));

  // Spotlight beams
  const spotlights = [
    { id: 0, x: 20, angle: -25, color: 'rgba(184, 230, 1, 0.08)' },
    { id: 1, x: 50, angle: 0, color: 'rgba(72, 187, 120, 0.06)' },
    { id: 2, x: 80, angle: 25, color: 'rgba(167, 243, 208, 0.07)' },
  ];

  return (
    <section
      ref={heroRef}
      className="relative flex items-center justify-center pt-20 pb-12 sm:pt-24 md:pt-28 lg:pt-32 overflow-hidden"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      {/* Deep dark gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0d 25%, #0a120a 50%, #0d1a12 75%, #0a0a0a 100%)',
        }}
      >
        {/* Central energy burst - pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {energyRings.map((ring) => (
            <motion.div
              key={`ring-${ring.id}`}
              className="absolute rounded-full border"
              style={{
                width: `${ring.size}px`,
                height: `${ring.size}px`,
                borderColor: 'rgba(184, 230, 1, 0.15)',
                borderWidth: '1px',
                boxShadow: '0 0 30px rgba(184, 230, 1, 0.1), inset 0 0 30px rgba(184, 230, 1, 0.05)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: ring.duration,
                repeat: Infinity,
                ease: 'easeOut',
                delay: ring.delay,
              }}
            />
          ))}
        </div>

        {/* Speed lines - diagonal motion streaks */}
        <div className="absolute inset-0 overflow-hidden">
          {speedLines.map((line) => (
            <motion.div
              key={`speed-${line.id}`}
              className="absolute"
              style={{
                left: `${line.x}%`,
                top: `${line.y}%`,
                width: `${line.length}px`,
                height: '1px',
                background: `linear-gradient(90deg, transparent, rgba(184, 230, 1, ${line.opacity}), rgba(72, 187, 120, ${line.opacity * 0.7}), transparent)`,
                transform: `rotate(${line.angle}deg)`,
                filter: 'blur(1px)',
              }}
              animate={{
                x: ['-100%', '200%'],
                opacity: [0, line.opacity * 2, 0],
              }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: line.delay,
              }}
            />
          ))}
        </div>

        {/* Energy orbs - glowing spheres */}
        <div className="absolute inset-0">
          {energyOrbs.map((orb) => (
            <motion.div
              key={`orb-${orb.id}`}
              className="absolute"
              style={{
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle at 50% 50%, ${orb.color} 0%, rgba(72, 187, 120, 0.1) 40%, transparent 70%)`,
                filter: `blur(${orb.blur}px)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
                x: [
                  '0px',
                  `${Math.sin(orb.id * 1.5) * 20}px`,
                  '0px',
                ],
                y: [
                  '0px',
                  `${Math.cos(orb.id * 1.3) * 15}px`,
                  '0px',
                ],
              }}
              transition={{
                duration: 8 + orb.id * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Kinetic particles - fast moving energy dots */}
        <div className="absolute inset-0 overflow-hidden">
          {kineticParticles.map((particle) => (
            <motion.div
              key={`kinetic-${particle.id}`}
              className="absolute rounded-full"
              style={{
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.id % 2 === 0 ? 'rgba(184, 230, 1, 0.7)' : 'rgba(167, 243, 208, 0.6)',
                filter: 'blur(1px)',
                boxShadow: `0 0 ${particle.size * 3}px ${particle.id % 2 === 0 ? 'rgba(184, 230, 1, 0.5)' : 'rgba(167, 243, 208, 0.4)'}`,
              }}
              animate={{
                x: ['-50vw', '50vw'],
                y: [
                  `${Math.sin(particle.id) * 20}px`,
                  `${Math.cos(particle.id) * 30}px`,
                ],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: particle.speed,
                repeat: Infinity,
                ease: 'linear',
                delay: particle.id * 0.3,
              }}
            />
          ))}
        </div>

        {/* Spotlight beams from top */}
        <div className="absolute inset-0 overflow-hidden">
          {spotlights.map((spot) => (
            <motion.div
              key={`spot-${spot.id}`}
              className="absolute"
              style={{
                left: `${spot.x}%`,
                top: '-10%',
                width: '150px',
                height: '120%',
                background: `linear-gradient(to bottom, ${spot.color}, transparent)`,
                transform: `rotate(${spot.angle}deg)`,
                transformOrigin: 'top center',
                filter: 'blur(20px)',
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                x: [
                  '0px',
                  `${Math.sin(spot.id * 2) * 30}px`,
                  '0px',
                ],
              }}
              transition={{
                duration: 10 + spot.id * 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Hexagonal grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, rgba(184, 230, 1, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(184, 230, 1, 0.5) 87.5%, rgba(184, 230, 1, 0.5)),
              linear-gradient(150deg, rgba(184, 230, 1, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(184, 230, 1, 0.5) 87.5%, rgba(184, 230, 1, 0.5)),
              linear-gradient(30deg, rgba(184, 230, 1, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(184, 230, 1, 0.5) 87.5%, rgba(184, 230, 1, 0.5)),
              linear-gradient(150deg, rgba(184, 230, 1, 0.5) 12%, transparent 12.5%, transparent 87%, rgba(184, 230, 1, 0.5) 87.5%, rgba(184, 230, 1, 0.5)),
              linear-gradient(60deg, rgba(184, 230, 1, 0.25) 25%, transparent 25.5%, transparent 75%, rgba(184, 230, 1, 0.25) 75%, rgba(184, 230, 1, 0.25)),
              linear-gradient(60deg, rgba(184, 230, 1, 0.25) 25%, transparent 25.5%, transparent 75%, rgba(184, 230, 1, 0.25) 75%, rgba(184, 230, 1, 0.25))
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
          }}
        />

        {/* Central glow core */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute"
            style={{
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle at 50% 50%, rgba(184, 230, 1, 0.15) 0%, rgba(72, 187, 120, 0.08) 30%, transparent 60%)',
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Edge vignette for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%)',
          }}
        />

        {/* Bottom gradient fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background: 'linear-gradient(to top, rgba(10, 10, 10, 0.9), transparent)',
          }}
        />
      </div>

      {/* Content Container with centered positioning */}
      <div className="container relative mx-auto px-4 sm:px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          {/* Top decorative line with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#b8e601]/60 to-transparent shadow-[0_0_8px_rgba(184,230,1,0.3)]"></div>
          </motion.div>

          {/* Main Headline with responsive typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="space-y-2 sm:space-y-3 md:space-y-2">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="block text-gray-100">EL HACHIMI</span>
                <span className="block bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(184,230,1,0.2)]">
                  VISION <span className="text-[#b8e601]">LAB</span>
                </span>
              </h1>

              {/* Subtle divider with glow */}
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: '80px' } : {}}
                transition={{ delay: 0.4, duration: 1 }}
                className="h-px bg-gradient-to-r from-transparent via-[#b8e601]/40 to-transparent mx-auto shadow-[0_0_6px_rgba(184,230,1,0.2)]"
              />
            </div>
          </motion.div>

          {/* Description Text - Responsive and centered */}
          <motion.div
            className="mb-8 sm:mb-10 md:mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 1.2 }}
          >
            <div className="max-w-xl md:max-w-2xl mx-auto px-2 sm:px-4">
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed sm:leading-loose font-light drop-shadow-[0_0_10px_rgba(184,230,1,0.1)]">
                We are a multidisciplinary sports agency. From cinematic visuals to
                data-driven analysis, we craft compelling narratives that elevate
                athletes, teams, and brands to new heights.
              </p>
            </div>
          </motion.div>

          {/* Main CTA Button - Responsive sizing with enhanced glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <button
              onClick={() => navigate('/works')}
              className="group relative inline-flex items-center justify-center bg-transparent border border-[#b8e601] text-white hover:text-black hover:bg-[#b8e601] px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg md:text-xl transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 whitespace-nowrap">
                Explore Our Work
              </span>
              <FiArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" />

              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-full bg-[#b8e601]/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
            </button>
          </motion.div>

          {/* Secondary CTA link with glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <button
              onClick={() => navigate('/contact')}
              className="group text-xs sm:text-sm text-gray-400 hover:text-[#b8e601] font-medium transition-all duration-300 inline-flex items-center hover:drop-shadow-[0_0_8px_rgba(184,230,1,0.3)]"
            >
              <span>Start a project with us</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Responsive positioning with glow */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          y: [0, 8, 0],
        }}
        transition={{
          opacity: { delay: 1.2, duration: 1 },
          y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }}
      >
        <span className="text-xs text-gray-500 mb-1 tracking-wider uppercase hidden xs:block">
          Scroll to discover
        </span>
        <div className="relative">
          <FiChevronDown className="text-gray-400 text-lg sm:text-xl" />

          {/* Animated dot trail with enhanced glow */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: 0.2,
            }}
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-1 h-1 bg-[#b8e601] rounded-full shadow-[0_0_6px_rgba(184,230,1,0.6)]"></div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;