import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCamera, 
  FiVideo, 
  FiZap, 
  FiEye, 
  FiTarget, 
  FiTrendingUp,
  FiShield,
  FiClock,
  FiAward
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

const About = () => {
  // Principles data
  const principles = [
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'Decisive Moments',
      description: 'Capturing the peak action with precision timing – freezing frames that tell the full story of athletic performance.'
    },
    {
      icon: <FiEye className="w-8 h-8" />,
      title: 'Tactical Clarity',
      description: 'Every frame is analysed for positional awareness, movement patterns, and strategic insights to improve team performance.'
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Data‑Driven Focus',
      description: 'We merge visual storytelling with performance metrics, turning raw footage into actionable intelligence.'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Progressive Analysis',
      description: 'From high‑speed bursts to slow‑motion breakdowns, we adapt to the unique demands of each sport.'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Unbiased Accuracy',
      description: 'Objective, frame‑by‑frame review ensures every observation is grounded in truth, not assumption.'
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: 'Rapid Turnaround',
      description: 'Time‑sensitive insights delivered within hours – because the next game is always just around the corner.'
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative bg-black py-24 overflow-hidden">
       <div className="absolute ">
         <Navbar/>
       </div>
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ccff00 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Logo and Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          {/* Logo Image - Replace with your actual logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative w-28 h-28 rounded-3xl bg-[#ccff00] p-1 shadow-2xl shadow-[#ccff00]/30"
            >
              <div className="w-full p-4 h-full rounded-3xl bg-black flex items-center justify-center border border-[#ccff00]">
                {/* Placeholder for your logo - replace with <img> if you have one */}
                <img src="/logo2.png" alt="" srcset="" />
              </div>
            </motion.div>
          </div>

          <h1 className="text-5xl lg:text-7xl  font-bold text-white mb-6">
            <span className="text-[#ccff00]">EL HACHIMI</span> <span>Visionlab</span>
          </h1>
          <div className="w-24 h-1 bg-[#ccff00] mx-auto mb-8" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We combine elite sports photography with advanced video analysis to reveal the unseen.
            Every image is a data point, every sequence a story waiting to be decoded.
          </p>
        </motion.div>

        {/* Services Overview - Two columns */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-32"
        >
          {/* Photography Service */}
          <motion.div variants={cardVariant} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full hover:border-[#ccff00]/30 transition-colors">
              <div className="w-16 h-16 bg-[#ccff00]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/20 transition-colors">
                <FiCamera className="w-8 h-8 text-[#ccff00]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sport Photography</h3>
              <p className="text-gray-400 leading-relaxed">
                High‑speed, high‑resolution imagery that captures the intensity and emotion of competition. 
                From peak action shots to candid sideline moments, our photography freezes the split‑second 
                details that define athletic excellence.
              </p>
              <ul className="mt-6 space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full" />
                  <span>4K burst mode & RAW capture</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full" />
                  <span>Multi‑angle remote camera setups</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full" />
                  <span>Instant tagging & metadata embedding</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Video Analysis Service */}
          <motion.div variants={cardVariant} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-l from-[#ccff00]/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full hover:border-[#ccff00]/30 transition-colors">
              <div className="w-16 h-16 bg-[#ccff00]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/20 transition-colors">
                <FiVideo className="w-8 h-8 text-[#ccff00]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Video Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                Frame‑by‑frame breakdown of tactics, player movements, and team formations. 
                We transform raw match footage into clear visual reports, complete with telestration, 
                heat maps, and synchronized performance metrics.
              </p>
              <ul className="mt-6 space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full" />
                  <span>Multi‑angle synced playback</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full" />
                  <span>Player tracking & event tagging</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ccff00] rounded-full" />
                  <span>Custom telestration & animated overlays</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Principles Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Our <span className="text-[#ccff00]">Principles</span> of Work
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Six pillars that define how we capture, analyse, and deliver visual insights.
          </p>
        </motion.div>

        {/* Principles Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/10 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:border-[#ccff00]/30 transition-all">
                <div className="w-14 h-14 bg-[#ccff00]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ccff00]/20 transition-colors">
                  <div className="text-[#ccff00] group-hover:scale-110 transition-transform duration-300">
                    {principle.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ccff00] transition-colors">
                  {principle.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Quote */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-32 text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#ccff00]/20 rounded-full blur-3xl" />
            <p className="relative text-2xl lg:text-3xl text-white/90 italic max-w-4xl mx-auto leading-relaxed">
              "We don't just document the game — we decode it, frame by frame, 
              so you can see what others miss."
            </p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <FiAward className="w-5 h-5 text-[#ccff00]" />
            <span className="text-gray-500">Precision. Insight. Excellence.</span>
          </div>
        </motion.div>

        {/* Bottom Border */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-600 text-sm">
            <span className="text-[#ccff00]">⚡</span> 2025 • Visual Intelligence Sport Analysis
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;