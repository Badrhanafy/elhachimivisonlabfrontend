import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Photos = () => {
  const slides = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518605368461-1e1e38ce81ba?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop",
      ]
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1431324155629-1a6eda1943cf?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533443908861-125055227167?q=80&w=800&auto=format&fit=crop",
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full bg-white py-16 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Title */}
        <div className="flex justify-start mb-10">
          <motion.h2 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-black border-b-6 border-black pb-1"
          >
            صور من الميدان
          </motion.h2>
        </div>

        {/* 2x2 Grid with Precision Clipping */}
        <div className="relative overflow-hidden w-full max-w-4xl mx-auto min-h-[400px] md:min-h-[500px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ 
                duration: 0.8, 
                ease: [0.23, 1, 0.32, 1] 
              }}
              className="absolute inset-0 grid grid-cols-2 gap-4 md:gap-6"
            >
              {slides[currentIndex].images.slice(0, 4).map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  className="aspect-video relative rounded-none overflow-hidden group cursor-pointer shadow-lg border border-gray-100"
                >
                  <img 
                    src={img} 
                    alt={`Field photo ${idx + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Left Navigation - Compact */}
        <div className="flex flex-col items-start mt-8 space-y-4 w-full max-w-4xl mx-auto">
          <div className="flex gap-3">
            <button 
              onClick={prevSlide}
              className="p-2.5 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-none shadow-lg border-0"
            >
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2.5 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-none shadow-lg border-0"
            >
              <ChevronLeft size={20} />
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
};
export default Photos;
