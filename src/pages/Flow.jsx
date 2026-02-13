import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiTarget, FiLayers, FiEye, FiArrowRight } from 'react-icons/fi';

const FlowSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    {
      id: 1,
      title: "Planning",
      subtitle: "Strategy First",
      description: "Every masterpiece begins with meticulous preparation. We analyze, conceptualize, and architect the perfect approach for your unique narrative.",
      icon: FiTarget,
      color: "#b8e601",
      details: ["Research & Analysis", "Concept Development", "Timeline Architecture", "Resource Allocation"]
    },
    {
      id: 2,
      title: "Quality",
      subtitle: "Precision Execution",
      description: "We deploy cutting-edge technology and artisanal craftsmanship to capture every frame with uncompromising clarity and cinematic excellence.",
      icon: FiLayers,
      color: "#48bb78",
      details: ["4K/8K Acquisition", "HDR Color Science", "Advanced Stabilization", "Audio Mastery"]
    },
    {
      id: 3,
      title: "Vision",
      subtitle: "Artistic Direction",
      description: "Where raw footage transforms into emotive storytelling. Our editorial mastery brings your narrative to life with stunning visual impact.",
      icon: FiEye,
      color: "#34d399",
      details: ["Color Grading", "Motion Graphics", "Sound Design", "Final Delivery"]
    }
  ];

  // Arrow path for curvy connection
  const ArrowPath = ({ delay, index }) => (
    <motion.div 
      className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 hidden lg:block"
      style={{ zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay: delay + 0.3, duration: 0.8 }}
    >
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 100" 
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id={`arrowGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={steps[index].color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={steps[index].color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={steps[index + 1]?.color || steps[index].color} stopOpacity="0.2" />
          </linearGradient>
          <marker
            id={`arrowhead-${index}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill={steps[index].color} />
          </marker>
        </defs>
        
        {/* Curvy path */}
        <motion.path
          d="M 20 50 Q 100 20, 200 50 T 380 50"
          stroke={`url(#arrowGradient-${index})`}
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${index})`}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Animated particles on path */}
        <motion.circle
          r="4"
          fill={steps[index].color}
          filter="blur(2px)"
          initial={{ offsetDistance: "0%" }}
          animate={isInView ? { offsetDistance: "100%" } : {}}
          transition={{ 
            delay: delay + 1, 
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={{
            offsetPath: "path('M 20 50 Q 100 20, 200 50 T 380 50')",
          }}
        />
      </svg>
    </motion.div>
  );

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 overflow-hidden bg-black"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#b8e601]/10 to-transparent" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#b8e601]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-[#48bb78]/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#b8e601]/30 bg-[#b8e601]/5 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#b8e601] animate-pulse" />
            <span className="text-[#b8e601] text-sm font-semibold tracking-[0.2em] uppercase">
              Our Process
            </span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Transformation <span className="text-[#b8e601]">Flow</span>
          </motion.h2>
          
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-[#b8e601] to-[#48bb78] mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Curvy Arrows between steps - Desktop only */}
          <ArrowPath delay={0.3} index={0} />
          <ArrowPath delay={0.6} index={1} />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + (index * 0.2), duration: 0.6 }}
            >
              {/* Card Container */}
              <div className="relative h-full">
                {/* Glow Effect */}
                <div 
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: `linear-gradient(135deg, ${step.color}20, transparent)` }}
                />
                
                {/* Main Card */}
                <div className="relative h-full bg-[#0d1a0d]/80 backdrop-blur-sm border border-white/5 hover:border-[step.color]/30 rounded-2xl p-8 transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                  
                  {/* Background Gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ 
                      background: `radial-gradient(circle at 50% 0%, ${step.color}10, transparent 60%)` 
                    }}
                  />

                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-6xl font-black text-white/5 group-hover:text-[step.color]/10 transition-colors duration-300">
                    0{step.id}
                  </div>

                  {/* Icon */}
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center relative"
                      style={{ 
                        background: `linear-gradient(135deg, ${step.color}20, ${step.color}05)`,
                        border: `1px solid ${step.color}30`
                      }}
                    >
                      <step.icon 
                        className="w-8 h-8"
                        style={{ color: step.color }}
                      />
                      {/* Icon Glow */}
                      <div 
                        className="absolute inset-0 rounded-xl opacity-50 blur-md"
                        style={{ background: step.color }}
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="relative space-y-4">
                    <div>
                      <span 
                        className="text-xs font-bold tracking-[0.2em] uppercase mb-2 block"
                        style={{ color: step.color }}
                      >
                        {step.subtitle}
                      </span>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[step.color] transition-colors duration-300">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details List */}
                    <ul className="space-y-2 pt-4">
                      {step.details.map((detail, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-500"
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.8 + (index * 0.1) + (i * 0.05) }}
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: step.color }}
                          />
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Accent Line */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-[step.color] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ 
                      width: '100%',
                      background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`
                    }}
                  />
                </div>

                {/* Mobile Arrow Indicator */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-6 lg:hidden">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FiArrowRight className="w-8 h-8 text-[#b8e601] rotate-90" />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-[#b8e601]/30 bg-[#b8e601]/5 hover:bg-[#b8e601]/10 transition-colors duration-300 cursor-pointer group">
            <span className="text-white font-semibold">Start Your Journey</span>
            <FiArrowRight className="text-[#b8e601] group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FlowSection;