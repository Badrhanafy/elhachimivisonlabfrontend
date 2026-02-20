import { Globe } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-10 border-t border-gray-900 text-center text-[#b8e601] text-sm bg-black">
      <div className="container mx-auto px-6">
        <p>© {new Date().getFullYear()} El Hachimi VisionLab. Crafting the future of sports media.</p>
      </div>
      
    </footer>
  );
};

export default Footer;