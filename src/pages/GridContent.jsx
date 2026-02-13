import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import videodata from '../../src/videohomepage.mp4'

const GridContent = () => {
  return (
    <section className="relative min-h-screen py-16 bg-white flex items-center lg:py-0">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white" />
      </div>

      <div className="container py-11 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Grid with video column larger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Content Column - Takes 5 columns */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="content max-w-xl">
          
              <h1 className="titles text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
                Tell your story <br />
                <span className="text-[#22c55e]">in a creative way</span>
              </h1>
              <p className="texts text-black/60 text-lg leading-relaxed">
              Take your game to the next level with our advanced sports video analysis service. We break down every movement, every play, and every decision to give you clear, actionable insights.
              </p>
              
              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#22c55e]/20 transition-all flex items-center gap-3 rounded-full"
              >
                <FiPlay className="w-5 h-5" />
                Watch Our Story
              </motion.button>
            </div>
          </motion.div>
          
          {/* Video Column - Takes 7 columns (larger, contained) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 relative"
          >
            {/* Main Video Container - Larger but still contained */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-video w-full max-w-4xl mx-auto lg:mr-0 lg:ml-auto">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
              >
                <source src={videodata} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Gradient Overlay - Subtle */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
  
              
              {/* Video Info - Enhanced */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center  ml-[60%] justify-between">
                  <div className="flex items-center  ">
                    <div className="w-5 h-5 rounded-full relative left-20 bg-[#22c55e] flex items-center justify-center shadow-lg shadow-[#22c55e]/30">
                      <FiPlay className="w-3 h-3  text-white ml-1" />
                    </div>
                    <div className=''>
                      
                      <p className="text-gray-300 relative left-24 text-sm ">Behind the scenes • 4K</p>
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>

            {/* Decorative Elements - Enhanced for larger video */}
            <div className="absolute -bottom-6 -left-8 w-36 h-36 border-4 border-[#22c55e]/20 rounded-2xl rotate-12" />
            <div className="absolute -top-6 -right-8 w-32 h-32 border-4 border-[#16a34a]/20 rounded-full" />
            
            {/* Additional Decorative Dots */}
            <div className="absolute bottom-16 -right-10 w-20 h-20 bg-[#22c55e]/10 rounded-full blur-xl" />
            <div className="absolute top-16 -left-10 w-24 h-24 bg-[#16a34a]/10 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GridContent;