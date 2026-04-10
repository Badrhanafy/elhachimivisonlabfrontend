import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function About() {
  const descriptionText = "خطة شركة سعودية متخصصة في التسويق الرقمي والحلول الإبداعية. نساعد العلامات التجارية على التميز من خلال استراتيجيات مدروسة، محتوى مبتكر، وحملات رقمية متكاملة. نؤمن أن النجاح يقوم على فكرة مبتكرة تتحول إلى خطة عملية تحقق تأثيراً حقيقياً ونمواً مستداماً.";
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < descriptionText.length) {
          current++;
          setVisibleCount(current);
        } else {
          clearInterval(interval);
        }
      }, 30); // Typing speed
      return () => clearInterval(interval);
    }
  }, [isInView, descriptionText.length]);

  return (
    <section className="relative w-full bg-white py-12 md:py-16 px-6 md:px-16 overflow-hidden flex items-center justify-center min-h-[90vh]" dir="rtl" style={{ fontFamily: 'ae_arab' }}>
      
      {/* Global Section Glassmorphism Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#ADFF2F]/10 via-transparent to-[#ADFF2F]/5 opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#ADFF2F]/15 blur-[120px] rounded-full"></div>
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#ADFF2F]/10 blur-[100px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ADFF2F]/5 blur-[150px] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Main Section: Brand Card & About Text */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          
          {/* Text Area (Right Side in RTL) */}
          <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-start text-right space-y-3 order-2 lg:order-1"
          >
            <div className="bg-gray-100/80 backdrop-blur-sm text-gray-500 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest inline-block mb-2">
              من خطة
            </div>
            <h3 className="text-4xl md:text-6xl font-black pb-1" style={{ fontFamily: 'ae_arab' }}>من نحن!</h3>
            
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light max-w-md min-h-[6em]">
              {descriptionText.slice(0, visibleCount)}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-[2px] h-[1.2em]  bg-[#93f304] align-middle mr-1"
              >
              </motion.span>
            </p>
          </motion.div>





          {/* Sharp Glowing Brand Card (Left Side in RTL) */}
          <div className="flex justify-center order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-56 md:w-72 lg:w-80 aspect-square bg-black rounded-none relative flex flex-col justify-center items-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              {/* Inner Gradient Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[120%] h-[120%] bg-gradient-to-br from-[#ADFF2F] via-transparent to-transparent blur-[80px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#ADFF2F] blur-[70px] rounded-full"></div>
              </div>
              
              <div className="relative z-10 text-white flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: 'ae_arab' }}>
                  خطة
                </h1>
                <span className="text-base md:text-lg font-light tracking-[0.3em] uppercase opacity-80 -mt-1">Khuta</span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Thin Divider Line */}
        <div className="w-full h-px bg-gray-100 mb-10"></div>

        {/* Vision and Mission Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-6 md:p-8 bg-gray-50/50 rounded-none overflow-hidden group border border-gray-100/50"
          >
            <h4 className="text-2xl font-black mb-3 relative z-10" style={{ fontFamily: 'ae_arab' }}>الرؤية</h4>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light relative z-10">
              أن نكون الشريك الإبداعي الأول في المملكة والمنطقة، الذي يبتكر حلولاً تسويقية متجددة تُحدث فرقاً حقيقياً في رحلة نجاح عملائنا.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-6 md:p-8 bg-gray-50/50 rounded-none overflow-hidden group border border-gray-100/50"
          >
            <h4 className="text-2xl font-black mb-3 relative z-10" style={{ fontFamily: 'ae_arab' }}>الرسالة</h4>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light relative z-10">
              تمكين العلامات التجارية من الوصول إلى جمهورها بفعالية عبر الجمع بين الإبداع، التقنية، والتحليل الدقيق، لتصنع تجربة متكاملة تعزز الثقة وتخلق أهداف النمو.
            </p>
          </motion.div>

        </div>




      </div>
    </section>
  );
}

export default About;


