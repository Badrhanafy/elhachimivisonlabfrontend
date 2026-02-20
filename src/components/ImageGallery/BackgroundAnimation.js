import React from 'react';
import { motion } from 'framer-motion';
import bg from '../../../src/Bgvideo.mp4';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={bg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/80 z-10"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-[#22c55e] rounded-full"
            animate={{
              y: [0, -200],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#22c55e]/20 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-[#22c55e]/20 to-transparent" />
      </div>
    </div>
  );
};

export default BackgroundAnimation;