import React from 'react';
import { motion } from 'framer-motion';

function DigitalIdentity() {
  return (
    <section className="relative w-full bg-white pt-8 pb-32 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-center" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Centered H1 Title - Tighter margin */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className=" text-center"
        >
          <h1 className="text-3xl md:text-6xl font-black text-black leading-tight border-b-6 border-black  inline-block">
            تطوير الهوية الرقمية
          </h1>
        </motion.div>

        {/* Scaled-down Centered Visual - More compact */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-lg flex justify-center items-center px-4"
        >
          <img 
            src="/images/phone-pag.png" 
            alt="Digital Identity Display" 
            className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)]"
          />
          
          {/* Subtle Ambient Glow behind phones */}
          <div className="absolute -z-10 w-64 h-64 bg-[#ADFF2F]/10 blur-[80px] rounded-full"></div>
        </motion.div>

      </div>
    </section>
  );
}

export default DigitalIdentity;
