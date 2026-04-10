import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function ServicesGrid() {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section className="relative w-full bg-[#0a0a0a] py-24 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      
      {/* Immersive Ambient Glows */}
      <div className="absolute top-0 right-0 w-full h-full bg-[#ADFF2F]/5 z-0 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#ADFF2F]/10 blur-[150px] rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#ADFF2F]/10 blur-[120px] rounded-full"></div>

      <div ref={containerRef} className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-start">
        
        {/* Header with User's Manual border tweaks */}
        <div className="flex flex-col items-start mb-20">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white text-3xl md:text-5xl font-black mb-4 pl-4 text-left"
          >
            نظرتنا للحياة
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "500px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[1px] bg-[#ADFF2F] ml-4 shrink-0 shadow-[0_0_10px_rgba(173,255,47,0.5)]"
          ></motion.div>
        </div>

        {/* Staged "Push" Animation Container */}
        <div className="relative w-full flex flex-row items-center justify-center overflow-visible h-[500px] md:h-[700px]">
          
          {/* Wrong Column - Starts perfectly centered */}
          <motion.div
            animate={{ 
              x: isRevealed ? "-50%" : "0%",
            }}
            initial={{ x: "0%" }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: isRevealed ? 0 : 0 }}
            className="absolute w-full md:w-1/2 aspect-square md:aspect-[4/5] overflow-hidden rounded-none z-10 flex items-center justify-center"
          >
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/false.png')" }}
            ></div>
          </motion.div>

          {/* Right Column - Slides in from right and 'pushes' the first one */}
          <motion.div
            animate={{ 
              x: isRevealed ? "50%" : "150%",
              opacity: isRevealed ? 1 : 0
            }}
            initial={{ opacity: 0, x: "150%" }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute w-full md:w-1/2 aspect-square md:aspect-[4/5] overflow-hidden rounded-none z-20"
          >
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/right.png')" }}
            ></div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default ServicesGrid;
