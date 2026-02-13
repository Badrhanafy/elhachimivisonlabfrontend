import React from 'react';
import video from '../Herovideo.mp4';

const VideoBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-black/90 to-transparent">
      <video
        autoPlay
        loop
        muted
        playsInline
        vocab='50%'
        className="w-full h-full object-cover"
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
};

export default VideoBackground;