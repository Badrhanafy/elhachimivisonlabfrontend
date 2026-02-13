import React from 'react';
import { motion } from 'framer-motion';

const QuoteSection = () => {
  return (
    <section className="min-h-[60vh] relative flex items-center justify-center py-20 overflow-hidden bg-black/90">
      <motion.div 
        className="container relative mx-auto px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2 }}
      >
        <p className="text-3xl md:text-5xl font-light italic max-w-4xl mx-auto text-gray-200 leading-snug">
          "Whether on the field, in the studio, or on location, we are committed to delivering high-quality content that informs, engages, and inspires."
        </p>
      </motion.div>
    </section>
  );
};

export default QuoteSection;