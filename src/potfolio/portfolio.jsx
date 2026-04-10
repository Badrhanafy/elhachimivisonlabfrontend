import React from 'react';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import PostsDesign from './postsDesign';
import DigitalIdentity from './DigitalIdentity';
import Photos from './Photos';
import WhyUs from './Team';
import ServicesGrid from './ServicesGrid';
import FeaturedProjects from './featuredProjects';
import Process from './Presentation';

function Portfolio() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] font-sans">
      <Hero />
      <About />
      <Services />
      <FeaturedProjects />
      <PostsDesign />
      <DigitalIdentity />
      <Photos />
      
      <WhyUs />
      <ServicesGrid />
      
      <Process />
    </div>
  );
}

export default Portfolio;