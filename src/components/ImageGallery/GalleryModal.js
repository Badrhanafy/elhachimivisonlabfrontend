import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalHeader from './ModalHeader';
import InfoBar from './InfoBar';
import VideoDisplay from './VideoDisplay';
import ImageGrid from './ImageGrid';

const GalleryModal = ({
  isOpen,
  onClose,
  reservationInfo,
  effectiveReservationId,
  images,
  hasVideo,
  videoUrl,
  STORAGE_URL,
  onDownloadVideo,
  onImageSelect
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 overflow-auto">
            <ModalHeader
              reservationInfo={reservationInfo}
              effectiveReservationId={effectiveReservationId}
              hasVideo={hasVideo}
              imagesLength={images.length}
              onClose={onClose}
              onDownloadVideo={onDownloadVideo}
              // onDownloadAll removed
            />

            <div className="container mx-auto px-4 py-8">
              <InfoBar
                reservationInfo={reservationInfo}
                hasVideo={hasVideo}
                imagesLength={images.length}
              />

              {hasVideo ? (
                <VideoDisplay
                  videoUrl={videoUrl}
                  poster={images.length > 0 ? images[0].url || `${STORAGE_URL}/${images[0].path}` : undefined}
                />
              ) : (
                <ImageGrid
                  images={images}
                  onImageClick={onImageSelect}
                  STORAGE_URL={STORAGE_URL}
                />
              )}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;