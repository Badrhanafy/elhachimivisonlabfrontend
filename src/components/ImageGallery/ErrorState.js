import React from 'react';
import { FiX } from 'react-icons/fi';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <FiX className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Error Loading Gallery</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-[#22c55e] text-white rounded-full font-semibold hover:bg-[#16a34a] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;