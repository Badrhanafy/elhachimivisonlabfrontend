import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const ImageDetailModal = ({ selectedImage, onClose, STORAGE_URL }) => {
  return (
    <AnimatePresence>
      {selectedImage && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-xl overflow-hidden bg-black">
                <img
                  src={selectedImage.url || `${STORAGE_URL}/${selectedImage.path}`}
                  alt={selectedImage.caption || selectedImage.filename || 'Selected Image'}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800/1a2c1a/22c55e?text=Image+Not+Available';
                  }}
                />
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/80 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageDetailModal;