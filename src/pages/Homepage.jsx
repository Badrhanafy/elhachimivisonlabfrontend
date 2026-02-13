import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import VideoBackground from './VideoBackground';
import HeroSection from './HeroSection';

import QuoteSection from './QuoteSection';
import CTASection from './CTASection';
import Footer from './Footer';
import Navbar from '../components/Navbar';
import ClientsSectionWithRealLogos from './ClientsSection';
import ServicesSection from './ServicesSection';
import VideoSection from './Video';
import FlowSection from './Flow';
import GridContent from './GridContent';

const Homepage = () => {
  const containerRef = useRef(null);

  // Hook for scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress into values for opacity and position
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.8, 0]);

  return (
    <div ref={containerRef} className=" text-white">
      <div className="absolute">
         <Navbar />
      </div>
      {/* Fixed Video Background */}
      

      {/* Main Content that Scrolls Over Video */}
      <div className=" bg-black z-10">
        <HeroSection textY={textY} opacity={opacity} />
        <ClientsSectionWithRealLogos/>
        <ServicesSection />
        <GridContent/>
        
        <center>
          <div className='w-96 h-[1px] bg-center  border-[#d1f406] border-t'>ss</div>
        </center>
        <VideoSection/>
        <QuoteSection />

        
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;