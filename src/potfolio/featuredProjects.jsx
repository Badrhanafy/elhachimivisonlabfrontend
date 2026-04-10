import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function FeaturedProjects() {
  const allProjects = [
    { id: 1, image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop" },
    { id: 2, image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=600&auto=format&fit=crop" },
    { id: 3, image: "https://images.unsplash.com/photo-1518605368461-1e1e38ce81ba?q=80&w=600&auto=format&fit=crop" },
    { id: 4, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop" },
    { id: 5, image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=600&auto=format&fit=crop" },
    { id: 6, image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=600&auto=format&fit=crop" },
    { id: 7, image: "https://images.unsplash.com/photo-1431324155629-1a6eda1943cf?q=80&w=600&auto=format&fit=crop" },
    { id: 8, image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=600&auto=format&fit=crop" },
  ];

  // Group projects into pages of 4
  const slides = [];
  for (let i = 0; i < allProjects.length; i += 4) {
    slides.push(allProjects.slice(i, i + 4));
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const cardFrames = [
    { translateY: "translate-y-4", zIndex: "z-10", margin: "" },
    { translateY: "-translate-y-2", zIndex: "z-20", margin: "-ml-8 sm:-ml-12 md:-ml-16 lg:-ml-20" },
    { translateY: "translate-y-2", zIndex: "z-30", margin: "-ml-8 sm:-ml-12 md:-ml-16 lg:-ml-20" },
    { translateY: "-translate-y-4", zIndex: "z-40", margin: "-ml-8 sm:-ml-12 md:-ml-16 lg:-ml-20" }
  ];

  // Fixed rotations for better visual stability during slide transitions
  const rotations = [-8, 6, -4, 10];

  return (
    <section className="relative w-full bg-white pb-32 overflow-hidden" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      
      {/* Global Section Glassmorphism Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#ADFF2F]/5 via-transparent to-[#ADFF2F]/5 opacity-30"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#ADFF2F]/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#ADFF2F]/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Black Header Area - Modern Brutalist */}
      <div className="relative z-10 w-full bg-[#0a0a0a] text-white pt-24 pb-48 px-6 md:px-16 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 border-b-8 border-[#ADFF2F] pb-4 inline-block">مشاريعنا</h2>
          <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
            اشتغلنا على عدة مشاريع ومحتويات رياضية، من تصوير وتغطية أحداث، إلى إنشاء فيديوهات ترويجية وتصاميم احترافية.
          </p>
        </motion.div>
      </div>
      
      {/* Interactive Slider Area */}
      <div className="relative z-20 w-full max-w-6xl mx-auto -mt-32 md:-mt-40">
        
        {/* Clipping Container - Hard masking at the borders with no padding */}
        <div className="relative w-full overflow-hidden min-h-[400px] md:min-h-[600px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-row justify-center items-center w-full"
              dir="ltr"
            >
              {slides[currentIndex].map((project, index) => (
                <motion.div
                  key={project.id}
                  className={`relative w-28 sm:w-44 md:w-56 lg:w-64 aspect-[3/4] rounded-none overflow-hidden bg-black ${cardFrames[index].translateY} ${cardFrames[index].zIndex} ${cardFrames[index].margin} transform-gpu origin-bottom border-0`}
                  style={{ rotate: `${rotations[index]}deg` }}
                >
                  <img
                    src={project.image}
                    alt={`Project ${project.id}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Gloss Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/20 pointer-events-none mix-blend-overlay"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Left Navigation - Consistent with Photos */}
        <div className="flex flex-col items-start mt-12 space-y-5 px-4 md:px-0">
          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="p-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-none shadow-xl border-0"
            >
              <ChevronRight size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-none shadow-xl border-0"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 transition-all duration-300 rounded-none ${
                  idx === currentIndex ? 'bg-[#ADFF2F] w-10' : 'bg-gray-300'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

export default FeaturedProjects;