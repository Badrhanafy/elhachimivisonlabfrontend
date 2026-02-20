import React from 'react';
import { motion } from 'framer-motion';
import { FiCameraOff } from 'react-icons/fi';

const ImageGrid = ({ images, onImageClick, STORAGE_URL }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
          <FiCameraOff className="w-10 h-10 text-[#22c55e]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Images Available</h3>
        <p className="text-gray-400">No photos found for this reservation.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={image.id || index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group relative cursor-pointer"
          onClick={() => onImageClick(image)}
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-black/20 aspect-square">
            <img
              src={image.url || image.thumbnail_url || `${STORAGE_URL}/${image.path}`}
              alt={image.caption || image.filename || `Image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/400/1a2c1a/22c55e?text=Image+${index + 1}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              #{index + 1}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGrid;