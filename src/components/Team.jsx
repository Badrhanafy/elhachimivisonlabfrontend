import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Mail, ArrowUpRight, X } from 'lucide-react';

const Team = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const team = [
    {
      id: 1,
      name: "Isabella Chen",
      role: "Creative Director",
      bio: "With 15 years in luxury brand development, Isabella crafts the olfactory narratives that define our collections. Formerly at Chanel and Hermès.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
      social: { linkedin: "#", twitter: "#", email: "isabella@perfumes.com" }
    },
    {
      id: 2,
      name: "Marcus Sterling",
      role: "Master Perfumer",
      bio: "Trained in Grasse, Marcus brings classical French technique to contemporary compositions. Creator of our signature Noir Élégant series.",
      image: "/images/badrphoto.png",
      social: { linkedin: "#", twitter: "#", email: "marcus@perfumes.com" }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase mb-4">
            The Artisans
          </h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-black leading-[0.9] tracking-tight">
              Meet the<br />
              <span className="font-serif italic">visionaries</span> behind<br />
              every scent
            </h1>
            <p className="text-neutral-600 max-w-md text-sm md:text-base leading-relaxed md:text-right">
              A collective of master perfumers, creative strategists, and sustainability 
              advocates united by an obsession with exceptional fragrance.
            </p>
          </div>
        </motion.div>

        {/* Innovative Asymmetric Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className={`group relative cursor-pointer ${index === 0 || index === 3 ? 'lg:col-span-2' : ''}`}
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative overflow-hidden bg-neutral-100 aspect-[4/5] md:aspect-auto md:h-[500px] lg:h-[600px]">
                {/* Image with hover zoom */}
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                      {member.role}
                    </p>
                    <h3 className="text-white text-2xl md:text-3xl font-light mb-4">
                      {member.name}
                    </h3>
                    
                    {/* Expanded content on hover */}
                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">
                        {member.bio}
                      </p>
                      <div className="flex items-center gap-4 text-white/60">
                        <button className="hover:text-white transition-colors">
                          <Linkedin size={18} />
                        </button>
                        <button className="hover:text-white transition-colors">
                          <Twitter size={18} />
                        </button>
                        <button className="hover:text-white transition-colors">
                          <Mail size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner indicator */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal for detailed view */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="grid md:grid-cols-2">
                  <div className="aspect-square md:aspect-auto">
                    <img 
                      src={selectedMember.image} 
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <p className="text-neutral-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
                      {selectedMember.role}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
                      {selectedMember.name}
                    </h2>
                    <p className="text-neutral-600 leading-relaxed mb-8 text-lg">
                      {selectedMember.bio}
                    </p>
                    <div className="flex items-center gap-6">
                      <a href={selectedMember.social.linkedin} className="text-black hover:text-neutral-600 transition-colors">
                        <Linkedin size={24} />
                      </a>
                      <a href={selectedMember.social.twitter} className="text-black hover:text-neutral-600 transition-colors">
                        <Twitter size={24} />
                      </a>
                      <a href={`mailto:${selectedMember.social.email}`} className="text-black hover:text-neutral-600 transition-colors">
                        <Mail size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom decorative element */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 md:mt-32 flex justify-center"
        >
          <div className="text-center">
            <div className="w-px h-24 bg-neutral-300 mx-auto mb-8" />
            <p className="text-neutral-400 text-xs tracking-[0.3em] uppercase">
              Crafted with passion in Paris
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;