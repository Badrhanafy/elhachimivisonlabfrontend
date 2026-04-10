import React from 'react';
import { motion } from 'framer-motion';

function Team() {
  return (
    <section className="relative w-full bg-white py-24 px-6 md:px-16 overflow-hidden flex flex-col items-center" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-start px-4">
        
        {/* RTL Header with Neon Underline */}
        <div className="flex flex-col items-start mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-black text-4xl md:text-7xl font-black mb-4 pl-4 text-left"
          >
            فريق العمل
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "300px" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-[1px] bg-[#ADFF2F] ml-4 shadow-[0_0_10px_rgba(173,255,47,0.3)]"
          ></motion.div>
        </div>

        {/* Simple 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-center justify-center">
          
          {/* Member 1: Hicham */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative w-full aspect-square overflow-hidden rounded-none shadow-xl border border-gray-100"
          >
            <img 
              src="/images/member1.png" 
              alt="هشام" 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[2px]"
            />
            {/* Centered Overlay with Name and Role */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-white text-4xl md:text-5xl font-black mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">هشام</span>
              <span className="text-[#ADFF2F] text-lg md:text-xl font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 uppercase tracking-widest">مؤسس</span>
            </div>
          </motion.div>

          {/* Member 2: Yassin */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative w-full aspect-square overflow-hidden rounded-none shadow-xl border border-gray-100"
          >
            <img 
              src="/images/member2.png" 
              alt="ياسين" 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[2px]"
            />
            {/* Centered Overlay with Name and Role */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-white text-4xl md:text-5xl font-black mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">ياسين</span>
              <span className="text-[#ADFF2F] text-lg md:text-xl font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 uppercase tracking-widest">مدير إبداعي</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default Team;
