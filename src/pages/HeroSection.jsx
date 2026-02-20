import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useInView, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import TargetCursor from '../components/ui/TargetCursor';

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  // Smooth spring-based mouse tracking for fluid movement
  const springConfig = { damping: 25, stiffness: 80, mass: 0.3 };
  const smoothX = useSpring(0, springConfig);
  const smoothY = useSpring(0, springConfig);

  // Transform spring values for smooth rotations
  const rotateY = useTransform(smoothX, [-1, 1], [-3, 3]);
  const rotateX = useTransform(smoothY, [-1, 1], [3, -3]);

  // Individual spring values for each light beam - called at top level, not inside callbacks
  const beamRotation1 = useSpring(0, { damping: 30, stiffness: 40 });
  const beamRotation2 = useSpring(0, { damping: 30, stiffness: 40 });
  const beamRotation3 = useSpring(0, { damping: 30, stiffness: 40 });
  const beamRotation4 = useSpring(0, { damping: 30, stiffness: 40 });
  
  const beamRotations = [beamRotation1, beamRotation2, beamRotation3, beamRotation4];

  useEffect(() => {
    let ticking = false;
    
    const handleMouseMove = (e) => {
      if (!ticking && heroRef.current) {
        window.requestAnimationFrame(() => {
          const rect = heroRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          
          smoothX.set(x);
          smoothY.set(y);
          setMousePosition({ x, y });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [smoothX, smoothY]);

  // Set beam rotations
  useEffect(() => {
    if (!prefersReducedMotion) {
      beamRotations.forEach((spring) => {
        spring.set(360);
      });
    }
  }, [beamRotations, prefersReducedMotion]);

  // Memoized grid lines with optimized animation values
  const gridLines = useMemo(() => 
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: (i / 10) * 100,
      delay: i * 0.05,
      speed: prefersReducedMotion ? 0 : 12 + Math.sin(i) * 5,
      opacity: 0.12 + Math.sin(i) * 0.03
    })), [prefersReducedMotion]
  );

  // Memoized light beams with fluid parameters
  const lightBeams = useMemo(() => [
    { id: 0, angle: 15, color: 'rgba(184, 230, 1, 0.1)', width: 280, speed: 18, scale: 1.08 },
    { id: 1, angle: 45, color: 'rgba(34, 197, 94, 0.08)', width: 380, speed: 24, scale: 1.15 },
    { id: 2, angle: 75, color: 'rgba(168, 239, 161, 0.06)', width: 330, speed: 22, scale: 1.12 },
    { id: 3, angle: 105, color: 'rgba(184, 230, 1, 0.06)', width: 420, speed: 28, scale: 1.18 },
  ], []);

  // Memoized floating shapes with smoother motion paths
  const floatingShapes = useMemo(() => [
    { 
      id: 0, 
      type: 'circle', 
      size: 160, 
      x: 15, 
      y: 25, 
      color: 'rgba(184, 230, 1, 0.05)', 
      duration: 22, 
      delay: 0,
      moveRange: 6 
    },
    { 
      id: 1, 
      type: 'square', 
      size: 120, 
      x: 75, 
      y: 60, 
      color: 'rgba(34, 197, 94, 0.04)', 
      duration: 26, 
      delay: 2,
      moveRange: 5
    },
    { 
      id: 2, 
      type: 'circle', 
      size: 200, 
      x: 85, 
      y: 15, 
      color: 'rgba(168, 239, 161, 0.03)', 
      duration: 30, 
      delay: 1,
      moveRange: 7
    },
    { 
      id: 3, 
      type: 'diamond', 
      size: 140, 
      x: 25, 
      y: 75, 
      color: 'rgba(184, 230, 1, 0.04)', 
      duration: 24, 
      delay: 3,
      moveRange: 5.5
    },
  ], []);

  // Fluid animation variants for content
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.2, 
        ease: [0.22, 0.03, 0.2, 1], // Custom cubic-bezier for smoother ease
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 0.03, 0.2, 1] }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative flex items-center justify-center pt-20 pb-12 sm:pt-24 md:pt-28 lg:pt-32 overflow-hidden"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #0f0f0f 0%, #030303 70%, #000000 100%)',
        }}
      />
        <div className="absolute inset-0 bg-black">
          <div className="floating-shape shape-1" />
          <div className="floating-shape shape-2" />
          <div className="floating-shape shape-3" />
          <div className="floating-shape shape-4" />
          <div className="floating-shape shape-5" />
        </div>
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
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
  hoverDuration={0.2}
/>

      {!prefersReducedMotion && (
        <>
          {/* Dynamic grid with spring-based mouse interaction */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            style={{ 
              perspective: '800px',
              rotateX: rotateX,
              rotateY: rotateY,
            }}
          >
            {gridLines.map((line) => (
              <React.Fragment key={`grid-${line.id}`}>
                {/* Vertical lines */}
                <motion.div
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${line.x}%`,
                    background: `linear-gradient(180deg, 
                      transparent 0%, 
                      rgba(184, 230, 1, ${line.opacity}) 20%, 
                      rgba(34, 197, 94, ${line.opacity * 1.2}) 50%, 
                      rgba(184, 230, 1, ${line.opacity}) 80%, 
                      transparent 100%
                    )`,
                    boxShadow: '0 0 6px rgba(184, 230, 1, 0.1)',
                  }}
                  animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scaleY: [0.97, 1.03, 0.97],
                  }}
                  transition={{
                    duration: 12 + line.id * 0.5,
                    delay: line.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }}
                />
                {/* Horizontal lines */}
                <motion.div
                  className="absolute left-0 right-0 h-px"
                  style={{
                    top: `${line.x}%`,
                    background: `linear-gradient(90deg, 
                      transparent 0%, 
                      rgba(184, 230, 1, ${line.opacity}) 20%, 
                      rgba(34, 197, 94, ${line.opacity * 1.2}) 50%, 
                      rgba(184, 230, 1, ${line.opacity}) 80%, 
                      transparent 100%
                    )`,
                    boxShadow: '0 0 6px rgba(184, 230, 1, 0.1)',
                  }}
                  animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scaleX: [0.97, 1.03, 0.97],
                  }}
                  transition={{
                    duration: 14 + line.id * 0.5,
                    delay: line.delay + 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }}
                />
              </React.Fragment>
            ))}
          </motion.div>

          {/* Light beams with fluid rotation */}
          <div className="absolute inset-0 overflow-hidden">
            {lightBeams.map((beam, index) => (
              <motion.div
                key={`beam-${beam.id}`}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: beam.width,
                  height: '200%',
                  background: `linear-gradient(${beam.angle + mousePosition.x * 8}deg, 
                    transparent 0%, 
                    ${beam.color} 20%, 
                    ${beam.color} 50%, 
                    transparent 80%, 
                    transparent 100%
                  )`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(40px)',
                  mixBlendMode: 'screen',
                  rotate: beamRotations[index],
                }}
                animate={{
                  scale: [beam.scale * 0.92, beam.scale, beam.scale * 0.92],
                  opacity: [0.18, 0.32, 0.18],
                }}
                transition={{
                  scale: {
                    duration: beam.speed,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  },
                  opacity: {
                    duration: beam.speed * 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
              />
            ))}
          </div>

          {/* Floating shapes with smooth organic motion */}
          <div className="absolute inset-0">
            {floatingShapes.map((shape) => (
              <motion.div
                key={`shape-${shape.id}`}
                className="absolute"
                style={{
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: shape.size,
                  height: shape.size,
                  border: shape.type === 'circle' ? `1px solid ${shape.color}` : 'none',
                  ...(shape.type === 'circle' && { borderRadius: '50%' }),
                  ...(shape.type === 'square' && { 
                    background: shape.color,
                    borderRadius: '20%',
                  }),
                  ...(shape.type === 'diamond' && {
                    transform: `rotate(45deg)`,
                    background: shape.color,
                    border: 'none',
                  }),
                  boxShadow: `0 0 30px ${shape.color}`,
                  filter: 'blur(1px)',
                  mixBlendMode: 'screen',
                }}
                animate={{
                  x: [
                    '0%',
                    `${Math.sin(shape.id * 1.5) * shape.moveRange}%`,
                    `${Math.cos(shape.id * 2) * shape.moveRange}%`,
                    `${Math.sin(shape.id * 1.8) * shape.moveRange}%`,
                    '0%',
                  ],
                  y: [
                    '0%',
                    `${Math.cos(shape.id * 1.8) * shape.moveRange}%`,
                    `${Math.sin(shape.id * 2.2) * shape.moveRange}%`,
                    `${Math.cos(shape.id * 1.5) * shape.moveRange}%`,
                    '0%',
                  ],
                  scale: [1, 1.06, 0.97, 1.03, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.12, 0.2, 0.16, 0.22, 0.12],
                }}
                transition={{
                  duration: shape.duration,
                  delay: shape.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                }}
              />
            ))}
          </div>

          {/* Subtle energy vortex */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '450px',
              height: '450px',
              background: 'conic-gradient(from 0deg, rgba(184,230,1,0.04), rgba(34,197,94,0.04), rgba(168,239,161,0.04), rgba(184,230,1,0.04))',
              borderRadius: '50%',
              filter: 'blur(25px)',
              mixBlendMode: 'screen',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.08, 1],
            }}
            transition={{
              rotate: {
                duration: 45,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }
            }}
          />
        </>
      )}

      {/* Simplified static background for reduced motion */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-20" />
      )}

      {/* Mouse-reactive light field */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%, 
            rgba(184, 230, 1, 0.03) 0%, 
            transparent 50%
          )`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content Container - Original button preserved exactly */}
      <div className="container relative mx-auto px-4 sm:px-6 z-10">
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          {/* Top decorative line */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6 sm:mb-8">
            <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#b8e601]/50 to-transparent shadow-[0_0_6px_rgba(184,230,1,0.2)]" />
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants}>
            <div className="space-y-2 sm:space-y-3 md:space-y-2">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="block text-gray-100 ">EL HACHIMI</span>
                <span className="block bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(184,230,1,0.15)]">
                  VISION <span className="text-[#b8e601]">LAB</span>
                </span>
              </h1>

              {/* Subtle divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: '70px' } : {}}
                transition={{ delay: 0.4, duration: 1, ease: [0.22, 0.03, 0.2, 1] }}
                className="h-px bg-gradient-to-r from-transparent via-[#b8e601]/30 to-transparent mx-auto shadow-[0_0_4px_rgba(184,230,1,0.15)]"
              />
            </div>
          </motion.div>

          {/* Description Text */}
          <motion.div
            variants={itemVariants}
            className="mb-8 sm:mb-10 md:mb-6"
          >
            <div className="max-w-xl md:max-w-2xl mx-auto px-2 sm:px-4">
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed sm:leading-loose font-light drop-shadow-[0_0_8px_rgba(184,230,1,0.08)]">
                We are a multidisciplinary sports agency. From cinematic visuals to
                data-driven analysis, we craft compelling narratives that elevate
                athletes, teams, and brands to new heights.
              </p>
            </div>
          </motion.div>

          {/* Main CTA Button - COMPLETELY UNCHANGED - original button preserved exactly */}
          <motion.div
            variants={itemVariants}
            className="mb-6 sm:mb-8"
          >
            <button
              onClick={() => navigate('/photography')}
              className="group relative inline-flex items-center justify-center bg-transparent border border-[#b8e601] text-white hover:text-black hover:bg-[#b8e601] px-6 sm:px-8 md:px-10 py-3 sm:py-4  font-semibold text-base sm:text-lg md:text-xl transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative cursor-target z-10 whitespace-nowrap">
                Explore Our Work
              </span>
              <FiArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0" />

              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-full bg-[#b8e601]/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
            </button>
          </motion.div>

          {/* Secondary CTA link */}
          <motion.div
            variants={itemVariants}
          >
            <button
              onClick={() => navigate('/contact')}
              className="group text-xs sm:text-sm text-gray-400 hover:text-[#b8e601] font-medium transition-all duration-300 inline-flex items-center hover:drop-shadow-[0_0_6px_rgba(184,230,1,0.2)]"
            >
              <span>Start a project with us</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          y: [0, 5, 0],
        }}
        transition={{
          opacity: { delay: 1.2, duration: 1 },
          y: { 
            repeat: Infinity, 
            duration: 2.2, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          },
        }}
      >
        <span className="text-xs text-gray-500 mb-1 tracking-wider uppercase hidden xs:block">
          Scroll to discover
        </span>
        <div className="relative">
          <FiChevronDown className="text-gray-400 text-lg sm:text-xl" />

          {/* Animated dot trail */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              delay: 0.2,
              ease: "easeInOut",
            }}
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-1 h-1 bg-[#b8e601] rounded-full shadow-[0_0_4px_rgba(184,230,1,0.4)]" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;