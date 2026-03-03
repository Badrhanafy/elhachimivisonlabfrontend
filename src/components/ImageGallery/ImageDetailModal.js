// components/ImageGallery/ImageDetailModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Loader2,
  CheckCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const ImageDetailModal = ({ selectedImage, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!selectedImage) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadError(null);
      
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const filename = selectedImage.caption 
        ? `${selectedImage.caption.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`
        : `image_${selectedImage.id || 'download'}.jpg`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError('Failed to download image');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {selectedImage && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div 
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B8E601]/10 via-black/60 to-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-3 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-[#B8E601]/80 hover:text-black transition-all border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={`absolute top-4 right-20 z-10 px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 backdrop-blur-sm
                  ${downloading 
                    ? 'bg-[#B8E601]/20 text-[#B8E601]/50 cursor-not-allowed border border-[#B8E601]/30' 
                    : downloadSuccess
                      ? 'bg-[#B8E601] text-black border border-[#B8E601]'
                      : 'bg-black/60 text-white hover:bg-[#B8E601]/80 hover:text-black border border-white/10 hover:border-[#B8E601]'
                  }`}
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Downloading...
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Image
                  </>
                )}
              </button>

              {/* Error Message */}
              <AnimatePresence>
                {downloadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-24 right-4 z-10 flex items-center gap-2 bg-rose-500/20 text-rose-400 p-3 rounded-xl border border-rose-500/30 backdrop-blur-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{downloadError}</span>
                    <button onClick={() => setDownloadError(null)} className="ml-2 hover:bg-rose-500/10 p-1 rounded">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Container */}
              <div className="relative flex items-center justify-center p-8 min-h-[80vh]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption || 'Gallery image'}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />

                {/* Caption Overlay */}
                {selectedImage.caption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="px-6 py-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl">
                      <p className="text-white text-lg font-medium flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#B8E601]" />
                        {selectedImage.caption}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageDetailModal;