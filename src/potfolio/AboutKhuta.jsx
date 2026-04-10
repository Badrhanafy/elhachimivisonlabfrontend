import React from 'react';
import { motion } from 'framer-motion';

function AboutKhuta() {
  return (
    <section className="w-full bg-[#f8f9fa] py-24 px-6 font-sans text-[#1a1a1a]" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Top Centered Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            نحو مستقبل رقمي يصنع النجاح.
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            نحن في خطة نبتكر استراتيجيات تسويقية متجددة، ونصنع محتوى مؤثراً، لنمكن علامتك التجارية من التميز في عالم رقمي سريع التغير.
          </p>
        </motion.div>

        {/* Brand Card & About Text */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Right Side (Black Glowing Card) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-square md:aspect-video lg:aspect-square bg-black rounded-xl relative flex flex-col justify-center items-center shadow-xl overflow-hidden"
          >
            {/* Inner Green Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] bg-[#ADFF2F]/40 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
            </div>
            
            <h1 className="relative z-10 text-white text-5xl md:text-7xl font-black tracking-wider flex flex-col items-center">
              خطة<span className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase mt-2">Khuta</span>
            </h1>
          </motion.div>
          
          {/* Left Side (About Text) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-start text-right space-y-6"
          >
            <div className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-bold">من نحن</div>
            <h3 className="text-3xl md:text-4xl font-bold pt-2">من نحن!</h3>
            <p className="text-gray-600 text-lg leading-loose font-light">
              خطة شركة سعودية متخصصة في التسويق الرقمي والحلول الإبداعية. نساعد العلامات التجارية على التميز من خلال استراتيجيات مدروسة، محتوى مبتكر، وحملات رقمية متكاملة. نؤمن أن النجاح يقوم على فكرة مبتكرة تتحول إلى خطة عملية تحقق تأثيراً حقيقياً ونمواً مستداماً.
            </p>
          </motion.div>

        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-300 my-8"></div>

        {/* Vision and Mission */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 py-12">
          
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-right p-8 bg-green-50/50 rounded-2xl relative overflow-hidden group"
          >
            {/* Subtle glow on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ADFF2F]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
            <h4 className="text-2xl font-bold mb-4 relative z-10">الرؤية</h4>
            <p className="text-gray-600 leading-relaxed font-light relative z-10">
              أن نكون الشريك الإبداعي الأول في المملكة والمنطقة، الذي يبتكر حلولاً تسويقية متجددة تُحدث فرقاً حقيقياً في رحلة نجاح عملائنا.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-right p-8 bg-green-50/50 rounded-2xl relative overflow-hidden group"
          >
             {/* Subtle glow on hover */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#ADFF2F]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
            <h4 className="text-2xl font-bold mb-4 relative z-10">الرسالة</h4>
            <p className="text-gray-600 leading-relaxed font-light relative z-10">
              تمكين العلامات التجارية من الوصول إلى جمهورها بفعالية عبر الجمع بين الإبداع، التقنية، والتحليل الدقيق، لتصنع تجربة متكاملة تعزز الثقة وتخلق أهداف النمو.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default AboutKhuta;
