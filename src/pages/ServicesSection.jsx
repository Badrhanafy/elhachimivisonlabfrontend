import React from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiVideo, FiMonitor } from 'react-icons/fi';

const ServicesSection = () => {
  const services = [
    {
      icon: <FiCamera />,
      title: 'Sport Videography',
      desc: 'Cinematic match highlights, player profiles, and documentary-style features.'
    },
    {
      icon: <FiVideo />,
      title: 'Match Analysis',
      desc: 'Detailed tactical breakdowns and performance analytics for teams and coaches.'
    },
    {
      icon: <FiMonitor />,
      title: 'Live Broadcasting',
      desc: 'Professional live production for tournaments, matches, and sporting events.'
    }
  ];

  return (
    <section className="py-24 bg-black titles backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-gray-400">OUR</span> CREATIVE FIELDS
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group hover:bg-gradient-to-b from-gray-900/80 to-black/80 p-8 rounded-2xl border hover:shadow-[0_0_30px_#c0e628] border-[#c0e628] hover:border-gray-600 transition-all backdrop-blur-sm"
            >
              <div className="text-4xl mb-6 text-gray-300 group-hover:text-white">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 texts leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;