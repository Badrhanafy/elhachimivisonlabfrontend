import React from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import logo2 from '../../logo2.png'; // adjust path

const ModalHeader = ({
  reservationInfo,
  effectiveReservationId,
  hasVideo,
  imagesLength,
  onClose,
  onDownloadVideo
}) => {
  return (
    <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src={logo2} alt="Logo" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">
                {reservationInfo?.user?.name || 'Client'}
              </h1>
              <p className="text-gray-400 text-sm">
                Reservation #{effectiveReservationId} • {hasVideo ? '1 Video' : `${imagesLength} photos`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasVideo && (
              <button
                onClick={onDownloadVideo}
                className="px-4 py-2 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a] transition-colors flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Download Video
              </button>
            )}
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHeader;