import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiChevronRight } from 'react-icons/fi';
import { 
  X, Loader2, Check, Calendar, MapPin, Camera, Video, 
  Film, Zap, UserCheck, Sparkles, ArrowRight 
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import logo from '../../src/logo1.png';
import { reservationAPI } from '../services/api';   // adjust path if needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service_type: 'sport_photography',
    video_service: '',
    date: '',
    stadium: '',
    team: '',
    opponent: '',
    notes: ''
  });
// comment siple for commit 
  const videoServiceOptions = [
    { 
      id: 'wide_analysis', 
      label: 'Wide Video Analysis', 
      icon: Film, 
      description: 'Tactical overview & team positioning',
      color: 'from-blue-500 to-cyan-400',
      features: ['Full pitch coverage', 'Tactical patterns', 'Team movement analysis']
    },
    { 
      id: 'zoom_video', 
      label: 'Zoom Video Analysis', 
      icon: Zap, 
      description: 'Close-up skill focus on individual player',
      color: 'from-amber-500 to-orange-400',
      features: ['Individual tracking', 'Technical skills', 'Performance metrics']
    },
    { 
      id: 'visual_cv', 
      label: 'Visual CV Video', 
      icon: UserCheck, 
      description: 'Professional player highlight reel',
      color: 'from-purple-500 to-pink-400',
      features: ['Highlight compilation', 'Professional editing', 'Recruitment ready']
    }
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      service_type: value,
      video_service: ''
    }));
  };

  const handleVideoServiceSelect = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      video_service: prev.video_service === serviceId ? '' : serviceId
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      service_type: 'sport_photography',
      video_service: '',
      date: '',
      stadium: '',
      team: '',
      opponent: '',
      notes: ''
    });
    setSubmitStatus(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.service_type === 'video_services_option' && !formData.video_service) {
      setSubmitStatus('error');
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const apiData = {
        name: formData.name,
        phone: formData.phone,
        service_type: formData.service_type,
        date: formData.date,
        stadium: formData.stadium,
        team: formData.team,
        opponent: formData.opponent,
        notes: formData.notes,
        ...(formData.service_type === 'video_services_option' && {
          video_service: formData.video_service
        })
      };
      
      await reservationAPI.create(apiData);
      
      setSubmitStatus('success');
      setTimeout(() => {
        handleCloseModal();
        resetForm();
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVideoService = videoServiceOptions.find(s => s.id === formData.video_service);

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
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer cursor-target"
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

            {/* Desktop Navigation */}
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
                    className={`px-2 texts font-extrabold py-1 text-sm tracking-wide transition-all duration-200 ${
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
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ccff00] to-[#b3ff00]"
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
                  className="group cursor-target flex items-center text-black justify-center gap-1.5 bg-[#ccff00] hover:bg-transparent hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-[#ccff00] whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <motion.button
                onClick={handleOpenModal}
                className="mr-3 bg-[#ccff00] text-black px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                whileTap={{ scale: 0.95 }}
              >
                Start
              </motion.button>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={22} /> : <FiMenu size={22} />}
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
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              className="absolute right-0 top-0 h-full w-full max-w-xs bg-gradient-to-b from-black/95 to-gray-900/95 backdrop-blur-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <motion.button
                  onClick={handleOpenModal}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#ccff00] text-black px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  Get Started
                  <FiChevronRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
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

              {/* Mobile Nav Links */}
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
                          ? 'bg-gradient-to-r from-[#ccff00]/20 to-transparent text-white border-l-4 border-[#ccff00]'
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
      <div className={`transition-all duration-300 ${scrolled ? 'h-12' : 'h-14'}`} />

      {/* Booking Modal - Glassmorphism style */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ccff00]/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Calendar className="w-5 h-5 text-[#ccff00]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Book Your Session</h3>
                    <p className="text-sm text-gray-400">We'll confirm within 24 hours</p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseModal} 
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Form Content */}
              <div className="overflow-y-auto flex-1 p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Success Message */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#ccff00]/10 backdrop-blur-sm border border-[#ccff00]/30 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <p className="text-[#ccff00] font-semibold">Booking Request Sent!</p>
                          <p className="text-gray-400 text-sm">We'll contact you within 24 hours.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#ccff00]/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-[#ccff00] text-sm font-bold">1</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">Contact Details</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder=" "
                          className="peer w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-transparent focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all outline-none"
                        />
                        <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#ccff00] peer-focus:bg-black/50 peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-black/50 peer-not-placeholder-shown:px-1 pointer-events-none">
                          Full Name *
                        </label>
                      </div>
                      <div className="relative group">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder=" "
                          className="peer w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-transparent focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all outline-none"
                        />
                        <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#ccff00] peer-focus:bg-black/50 peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-black/50 peer-not-placeholder-shown:px-1 pointer-events-none">
                          Phone Number *
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ccff00]/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-[#ccff00] text-sm font-bold">2</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">Select Service Type</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Photography Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleServiceTypeChange('sport_photography')}
                        className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden group backdrop-blur-sm ${
                          formData.service_type === 'sport_photography'
                            ? 'border-[#ccff00] bg-[#ccff00]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm ${
                              formData.service_type === 'sport_photography' 
                                ? 'bg-[#ccff00] shadow-lg shadow-[#ccff00]/30' 
                                : 'bg-white/10'
                            }`}>
                              <Camera className={`w-7 h-7 ${formData.service_type === 'sport_photography' ? 'text-black' : 'text-[#ccff00]'}`} />
                            </div>
                            <div>
                              <h5 className="font-bold text-white text-lg">Sports Photography</h5>
                              <p className="text-sm text-gray-400 mt-1">High-quality action shots</p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.service_type === 'sport_photography'
                              ? 'border-[#ccff00] bg-[#ccff00]'
                              : 'border-white/20'
                          }`}>
                            {formData.service_type === 'sport_photography' && <Check className="w-4 h-4 text-black" />}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs text-gray-400 border border-white/5">Action Shots</span>
                          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs text-gray-400 border border-white/5">Portraits</span>
                        </div>
                      </motion.div>

                      {/* Video Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleServiceTypeChange('video_services_option')}
                        className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden group backdrop-blur-sm ${
                          formData.service_type === 'video_services_option'
                            ? 'border-[#ccff00] bg-[#ccff00]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm ${
                              formData.service_type === 'video_services_option' 
                                ? 'bg-[#ccff00] shadow-lg shadow-[#ccff00]/30' 
                                : 'bg-white/10'
                            }`}>
                              <Video className={`w-7 h-7 ${formData.service_type === 'video_services_option' ? 'text-black' : 'text-[#ccff00]'}`} />
                            </div>
                            <div>
                              <h5 className="font-bold text-white text-lg">Video Services</h5>
                              <p className="text-sm text-gray-400 mt-1">Analysis & highlights</p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.service_type === 'video_services_option'
                              ? 'border-[#ccff00] bg-[#ccff00]'
                              : 'border-white/20'
                          }`}>
                            {formData.service_type === 'video_services_option' && <Check className="w-4 h-4 text-black" />}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs text-gray-400 border border-white/5">Analysis</span>
                          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs text-gray-400 border border-white/5">Highlights</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Video Service Selection */}
                    <AnimatePresence>
                      {formData.service_type === 'video_services_option' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4 text-[#ccff00]" />
                              <h5 className="text-sm font-semibold text-[#ccff00] uppercase tracking-wider">Select Video Package</h5>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              {videoServiceOptions.map((service, index) => {
                                const Icon = service.icon;
                                const isSelected = formData.video_service === service.id;
                                
                                return (
                                  <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleVideoServiceSelect(service.id)}
                                    className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-300 group backdrop-blur-sm ${
                                      isSelected
                                        ? 'border-[#ccff00] bg-[#ccff00]/10'
                                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                    }`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                                        <Icon className="w-6 h-6 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <h6 className="font-semibold text-white text-lg">{service.label}</h6>
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                            isSelected ? 'border-[#ccff00] bg-[#ccff00]' : 'border-white/20'
                                          }`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                                        <div className="flex gap-2 mt-3">
                                          {service.features.map((feature, idx) => (
                                            <span key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                                              <span className="w-1 h-1 rounded-full bg-[#ccff00]" />
                                              {feature}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>

                            {selectedVideoService && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-[#ccff00]/10 backdrop-blur-sm border border-[#ccff00]/30 rounded-xl flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedVideoService.color} flex items-center justify-center`}>
                                    <selectedVideoService.icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#ccff00] uppercase tracking-wider font-semibold">Selected Package</p>
                                    <p className="text-white font-medium">{selectedVideoService.label}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVideoServiceSelect('');
                                  }}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4 text-[#ccff00]" />
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#ccff00]/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-[#ccff00] text-sm font-bold">3</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">Event Details</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Date & Time *</label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all outline-none [color-scheme:dark]"
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Stadium/Venue *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="stadium"
                            value={formData.stadium}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter venue name"
                            className="w-full px-4 py-3 pl-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all outline-none"
                          />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Your Team *</label>
                        <input
                          type="text"
                          name="team"
                          value={formData.team}
                          onChange={handleInputChange}
                          required
                          placeholder="Team name"
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all outline-none"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Opponent (Optional)</label>
                        <input
                          type="text"
                          name="opponent"
                          value={formData.opponent}
                          onChange={handleInputChange}
                          placeholder="Opponent team"
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Additional Notes</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Special requirements, specific focus areas, equipment needs..."
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-white/10 p-6 bg-black/20 backdrop-blur-sm shrink-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-[#ccff00] text-black hover:bg-[#b3ff00] rounded-xl font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 shadow-lg shadow-[#ccff00]/20 hover:shadow-[#ccff00]/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Booking
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;