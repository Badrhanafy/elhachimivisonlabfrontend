import React from 'react';
import {
  FiCalendar,
  FiMapPin,
  FiCamera,
  FiImage,
  FiVideo,
  FiFilm
} from 'react-icons/fi';

const InfoBar = ({ reservationInfo, hasVideo, imagesLength }) => {
  if (!reservationInfo) return null;

  return (
    <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FiCalendar className="w-5 h-5 text-[#22c55e]" />
          <div>
            <p className="text-gray-400 text-sm">Date</p>
            <p className="text-white font-medium">
              {reservationInfo.date ? new Date(reservationInfo.date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FiMapPin className="w-5 h-5 text-[#22c55e]" />
          <div>
            <p className="text-gray-400 text-sm">Location</p>
            <p className="text-white font-medium">{reservationInfo.stadium || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {hasVideo ? (
            <FiVideo className="w-5 h-5 text-[#22c55e]" />
          ) : (
            <FiCamera className="w-5 h-5 text-[#22c55e]" />
          )}
          <div>
            <p className="text-gray-400 text-sm">Service</p>
            <p className="text-white font-medium">{reservationInfo.service?.type || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {hasVideo ? (
            <FiFilm className="w-5 h-5 text-[#22c55e]" />
          ) : (
            <FiImage className="w-5 h-5 text-[#22c55e]" />
          )}
          <div>
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-white font-medium">{hasVideo ? '1 Video' : `${imagesLength} Photos`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBar;