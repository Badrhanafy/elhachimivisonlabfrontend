import React from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiPlay, FiChevronUp } from 'react-icons/fi';
import logo2 from '../../../src/logo2.png';

const MainCard = ({ reservationInfo, imagesCount, hasVideo, onPreviewClick }) => {
  const clientName = reservationInfo?.user?.name?.split(' ')[0] || 'Guest';

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 w-32 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent" />
      <div className="absolute bottom-8 w-32 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent" />
      <div className="absolute left-8 h-32 w-px bg-gradient-to-b from-transparent via-[#22c55e]/30 to-transparent" />
      <div className="absolute right-8 h-32 w-px bg-gradient-to-b from-transparent via-[#22c55e]/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-[320px] sm:w-[360px] md:w-[400px] bg-black/80 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgb(204,255,0)] to-[rgb(204,255,0)] blur-xl opacity-30" />
            <div className="relative w-20 h-20 p-1 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <img src={logo2} alt="Logo" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-[#22c55e]/30 border-t-transparent"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Elhachimi Vision Lab
          </h1>
          <p className="text-gray-400 mb-6">Professional {hasVideo ? 'Video' : 'Photography'}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPreviewClick}
            className="w-full py-4 hover:bg-[rgb(204,255,0)] hover:text-black text-white rounded-xl font-bold text-lg shadow-md shadow-[rgb(204,255,0)]/30 hover:shadow-[rgb(204,255,0)]/50 transition-all duration-300 flex items-center justify-center gap-3"
          >
            {hasVideo ? (
              <>
                <FiPlay className="w-5 h-5" />
                Watch Video
                <FiChevronUp className="w-5 h-5" />
              </>
            ) : (
              <>
                <FiGrid className="w-5 h-5" />
                Preview Gallery
                <FiChevronUp className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">
                {hasVideo ? '1' : imagesCount}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {hasVideo ? 'Video' : 'Photos'}
              </div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">
                {clientName}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Client
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-white w-full text-lg arabicword">
              <marquee direction="left">بصحتكم الشباب</marquee>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainCard;