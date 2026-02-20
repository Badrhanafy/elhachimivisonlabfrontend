import React from 'react';

const VideoDisplay = ({ videoUrl, poster }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-4xl bg-black/50 rounded-xl overflow-hidden border border-white/10">
        <video
          controls
          autoPlay={false}
          className="w-full h-auto max-h-[70vh]"
          src={videoUrl}
          poster={poster}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoDisplay;