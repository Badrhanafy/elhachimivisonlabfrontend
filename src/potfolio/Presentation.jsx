import React from 'react';
import { motion } from 'framer-motion';

function Presentation() {
  const currentCaption = `Player Reveal
تقديم لاعبة جديدة بطريقة cinematic (تشويق + إظهار تدريجي) باش نخلقو hype بحال الأندية العالمية.

Player Identity
تعريف باللاعبة: الاسم، المركز، أسلوب اللعب، مع جملة قصيرة كتعبّر على شخصيتها.

First Day Experience
توثيق أول يوم للاعبة مع الفريق (الوصول، التدريب، الأجواء) باش نعطيو story واقعية وجذابة.

الخلاصة

كنحوّلو تقديم اللاعبات من حاجة عادية إلى تجربة إعلامية احترافية، كتخلي كل لاعبة عندها هوية وقصة خاصة`;

  return (
    <section className="relative w-full bg-white py-24 px-6 md:px-16 flex flex-col items-center justify-center min-h-screen" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center p-8 md:p-16 glass-theme-container bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_40px_100px_rgba(0,0,0,0.05)] rounded-none">
        
        {/* Background Glowing Orbs for Glass depth */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#ADFF2F]/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#facc15]/20 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col items-start mb-20 w-full">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-black text-3xl md:text-7xl font-black mb-4 pl-4 text-left"
          >
            تقديم اللاعبين
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "300px" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-[1px] bg-[#ADFF2F] ml-4 shadow-[0_0_10px_rgba(173,255,47,0.3)]"
          ></motion.div>
        </div>

        {/* Image Block with Wrong Badge */}
        <div className="relative w-full mb-16 group">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-video overflow-hidden rounded-none shadow-2xl"
          >
            <img 
              src="/images/pright.png" 
              alt="Professional Presentation" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </motion.div>

          {/* Wrong Mark Badge (X) */}
          <motion.div 
            initial={{ scale: 0, rotate: 15 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            className="absolute -top-10 -left-10 w-20 h-20 md:w-28 md:h-28 bg-[#ef4444] rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(239,68,68,0.4)] border-4 border-white z-20"
          >
            <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-14 md:h-14 text-white stroke-[3.5]" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
        </div>

        {/* Centered Caption */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-3xl text-center"
        >
          <p className="text-gray-800 text-lg md:text-xl leading-loose font-bold whitespace-pre-line">
            {currentCaption}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Presentation;
