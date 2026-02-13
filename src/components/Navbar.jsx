import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronRight } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import logo from '../../src/logo1.png';

const Navbar = ({ openModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle modal open/close
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsOpen(false); // Close mobile menu if open
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/Photography', label: 'Photography' },
    { path: '/analysis', label: 'Analysis' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaYoutube />, url: 'https://youtube.com', label: 'YouTube' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  // Sample modal component
  const BookingModal = () => (
    <AnimatePresence>
      {isModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                damping: 25,
                stiffness: 300
              }}
              className="bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <button className="text-2xl font-bold text-white">
                      Get Started with Us
                    </button>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                  >
                    <FiX className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300">
                  This is where your booking modal content would go.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/90 backdrop-blur-lg py-3 shadow-lg shadow-black/30 border-b border-white/10' 
            : 'bg-gradient-to-b from-black/95 via-black/80 to-transparent py-4'
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo Only - Smaller */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className={`flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'h-8' : 'h-10'
              }`}>
                <img 
                  src={logo} 
                  alt="El Hachimi Vision Lab Logo"
                  className={`transition-all duration-300 ${
                    scrolled ? 'h-8' : 'h-10'
                  } w-auto object-contain opacity-90 hover:opacity-100`}
                />
              </div>
            </motion.div>

            {/* Desktop Navigation Links - Text Only, Reduced Gap */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative"
                >
                  <Link
                    to={item.path}
                  
                    className={`px-2 texts font-extrabold py-1 text-sm  tracking-wide transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-white font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#22c55e] to-[#16a34a]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
              
              {/* Get Started Button - Desktop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2"
              >
                <button
                  onClick={handleOpenModal}
                  className="group flex items-center text-black justify-center gap-1.5 bg-[#ccff00] hover:bg-transparent  hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl  border border-[#b8e601] whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              {/* Mobile Get Started Button - Compact */}
              <motion.button
                onClick={handleOpenModal}
                className="mr-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                whileTap={{ scale: 0.95 }}
              >
                Start
              </motion.button>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 top-0 z-[60] lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div 
              className="absolute right-0 top-0 h-full w-full max-w-xs bg-gradient-to-b from-black/95 to-gray-900/95 backdrop-blur-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <motion.button
                  onClick={handleOpenModal}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  Get Started
                  <FiChevronRight className="w-4 h-4" />
                </motion.button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Logo */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-center">
                  <div className="h-12 w-auto">
                    <img 
                      src={logo}
                      alt="El Hachimi Vision Lab Logo"
                      className="h-full w-auto object-contain opacity-90"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Links - Text Only */}
              <nav className="px-4 space-y-0.5">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-[#22c55e]/20 to-transparent text-white border-l-4 border-[#b8e601]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="font-medium text-base">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Social Links Mobile */}
              <div className="absolute bottom-16 left-0 right-0 px-4">
                <p className="text-gray-400 mb-3 font-medium text-sm">Connect With Us</p>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center text-gray-400 hover:text-white p-3 hover:bg-gradient-to-r from-white/10 to-transparent rounded-lg transition-colors border border-white/5"
                      aria-label={social.label}
                    >
                      <span className="text-lg">{social.icon}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Footer Text */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 border-t border-white/10">
                <p className="text-gray-500 text-xs text-center">
                  © {new Date().getFullYear()} El Hachimi Vision Lab
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={`transition-all duration-300 ${
        scrolled ? 'h-12' : 'h-14'
      }`} />

      {/* Booking Modal */}
      <BookingModal />
    </>
  );
};

export default Navbar;