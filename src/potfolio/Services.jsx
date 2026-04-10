import React from 'react';
import { motion } from 'framer-motion';

function Services() {
  const cards = [
    {
      title: "إدارة السوشيال ميديا",
      desc: "إدارة كاملة لصفحات النادي (Facebook – TikTok – Instagram)، نشر منتظم وتفاعل مع الجمهور.",
      isDark: true,
    },
    {
      title: "صناعة المحتوى الرياضي",
      desc: "تصوير احترافي للمباريات والتمارين، وإنتاج فيديوهات قصيرة (Reels) بجودة عالية كتبين أهم اللحظات.",
      isDark: false,
    },
    {
      title: "تطوير الهوية الرقمية",
      desc: "بناء صورة قوية للنادي تساعد على زيادة المتابعين وجلب سبونسور.",
      isDark: true,
    },
    {
      title: "تصميم المنشورات",
      desc: "تصميم بوستات احترافية: Match Day – Results – Lineup – Announcements.",
      isDark: false,
    }
  ];

  return (
    <section className="relative w-full bg-white py-20 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-center min-h-[80vh]" dir="rtl" style={{ fontFamily: 'ae_arab' }}>

      {/* Subtle Background Accent for Glassmorphism Context */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b8e601]/5 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-start mb-12 w-full"
        >
          <h2 className="text-4xl md:text-6xl font-black text-black leading-tight border-b-8 border-black pb-2 text-right">
            ماذا نقدم؟
          </h2>
        </motion.div>

        {/* 2x2 Grid with Professional Glassmorphism on Dark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 md:gap-10">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`p-8 md:p-10 flex flex-col items-start justify-center text-right min-h-[240px] md:min-h-[280px] transition-all duration-700 shadow-xl ${card.isDark
                  ? 'bg-black/90 backdrop-blur-md border border-[#b8e601]/30 text-white shadow-[#b8e601]/5'
                  : 'bg-white text-black border-2 border-black'
                } rounded-none`}
            >
              <h3 className={`text-2xl md:text-3xl font-black mb-4 leading-tight w-full ${card.isDark ? 'text-[#b8e601]' : 'text-black'}`}>
                {card.title}
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed w-full opacity-90">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}

export default Services;
