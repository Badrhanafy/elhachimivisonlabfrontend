import React from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const LoadingState = ({ reservationId }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-6"
      >
        <FiLoader className="w-16 h-16 text-[#22c55e]" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">Loading Gallery</h2>
      <p className="text-gray-400">Reservation #{reservationId}</p>
    </div>
  );
};

export default LoadingState;