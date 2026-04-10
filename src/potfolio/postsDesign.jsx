import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function PostsDesign() {
  const slides = [
    {
      id: 1,
      title: "تصميم المنشورات",
      subtitle: "تصميم بوستات احترافية:",
      images: [
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518605368461-1e1e38ce81ba?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=600&auto=format&fit=crop",
      ]
    },
    {
      id: 2,
      title: "تصميم المنشورات",
      subtitle: "تصميم بوستات احترافية:",
      images: [
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1431324155629-1a6eda1943cf?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
      ]
    }
  ];

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

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full bg-white py-24 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 text-right w-full">
          <motion.h2 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-black leading-tight"
          >
            {currentSlide.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-xl md:text-2xl mt-2 font-light"
          >
            {currentSlide.subtitle}
          </motion.p>
        </div>

        {/* Asymmetrical Slider Grid - No Gaps Style */}
        <div className="relative overflow-hidden w-full min-h-[500px] md:min-h-[700px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-0 items-center w-full h-full"
              dir="ltr"
            >
              <div className="md:col-span-3 flex flex-col h-full">
                <div className="aspect-square relative overflow-hidden">
                  <img src={currentSlide.images[0]} alt="Design 1" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="aspect-square relative overflow-hidden">
                  <img src={currentSlide.images[1]} alt="Design 2" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>

              <div className="md:col-span-6 h-full">
                <div className="h-full relative overflow-hidden">
                  <img src={currentSlide.images[2]} alt="Main Design" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col h-full">
                <div className="aspect-square relative overflow-hidden">
                  <img src={currentSlide.images[3]} alt="Design 3" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="aspect-square relative overflow-hidden">
                  <img src={currentSlide.images[4]} alt="Design 4" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows & Progress Moved Back to Bottom Left */}
        <div className="flex flex-col items-start mt-12 space-y-6">
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
                  idx === currentIndex ? 'bg-[#ADFF2F] w-10' : 'bg-gray-200'
                }`}
              ></button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default PostsDesign;
