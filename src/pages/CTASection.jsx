import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Loader2, Check, Calendar, MapPin, Camera, Video, 
  Film, Zap, UserCheck, ChevronDown, Sparkles, ArrowRight
} from 'lucide-react';
import { reservationAPI } from '../services/api';

const CTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  
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

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.service_type === 'video_services_option' && !formData.video_service) {
      setSubmitStatus('error');
      showAlertMessage('Please select a video service.', 'error');
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
      showAlertMessage('Booking request sent successfully! We\'ll contact you within 24 hours.', 'success');
      setTimeout(() => {
        closeModal();
        resetForm();
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      showAlertMessage('Error submitting booking. Please try again or contact us directly.', 'error');
    } finally {
      setIsLoading(false);
    }
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

  const openModal = () => {
    resetForm();
    document.body.style.overflow = 'hidden';
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setIsModalOpen(false);
  };

  const selectedVideoService = videoServiceOptions.find(s => s.id === formData.video_service);

  return (
    <>
      <section className="py-16 md:py-20 bg-black relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#22c55e]/10 via-transparent to-transparent" />
        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
              Book Your <span className="text-[#22c55e]">Professional</span> Session
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto">
              Get expert sports analysis, professional photography, or video production for your team.
            </p>
            <button
              onClick={openModal}
              className="group relative inline-flex items-center bg-[#22c55e] text-white hover:bg-[#16a34a] px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Book Now
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Alert Notification */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`fixed bottom-6 right-6 z-[100] max-w-sm ${
              alertType === 'success' ? 'bg-[#22c55e]' : 'bg-red-600'
            } rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm`}
          >
            <div className="flex items-start p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                {alertType === 'success' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1 text-white">
                  {alertType === 'success' ? 'Booking Confirmed!' : 'Booking Error'}
                </h4>
                <p className="text-sm text-white/90">{alertMessage}</p>
              </div>
              <button onClick={() => setShowAlert(false)} className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0a] border border-[#22c55e]/20 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#22c55e]/10 to-transparent border-b border-[#22c55e]/20 p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#22c55e] flex items-center justify-center shadow-lg shadow-[#22c55e]/20">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Book Your Session</h3>
                    <p className="text-sm text-gray-400">We'll confirm within 24 hours</p>
                  </div>
                </div>
                <button 
                  onClick={closeModal} 
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Form Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Success Message */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[#22c55e] font-semibold">Booking Request Sent!</p>
                          <p className="text-gray-400 text-sm">We'll contact you within 24 hours.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                        <span className="text-[#22c55e] text-sm font-bold">1</span>
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
                          className="peer w-full px-4 py-3 bg-black/50 border border-[#22c55e]/30 rounded-xl text-white focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none"
                        />
                        <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#22c55e] peer-focus:bg-[#0a0a0a] peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-[#0a0a0a] peer-not-placeholder-shown:px-1 pointer-events-none">
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
                          className="peer w-full px-4 py-3 bg-black/50 border border-[#22c55e]/30 rounded-xl text-white focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none"
                        />
                        <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#22c55e] peer-focus:bg-[#0a0a0a] peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-[#0a0a0a] peer-not-placeholder-shown:px-1 pointer-events-none">
                          Phone Number *
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Service Selection - Innovative Layout */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                        <span className="text-[#22c55e] text-sm font-bold">2</span>
                      </div>
                      <h4 className="text-lg font-semibold text-white">Select Service Type</h4>
                    </div>

                    {/* Main Service Cards - Horizontal Scroll on Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Photography Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleServiceTypeChange('sport_photography')}
                        className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden group ${
                          formData.service_type === 'sport_photography'
                            ? 'border-[#22c55e] bg-[#22c55e]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                              formData.service_type === 'sport_photography' 
                                ? 'bg-[#22c55e] shadow-lg shadow-[#22c55e]/30' 
                                : 'bg-[#22c55e]/20'
                            }`}>
                              <Camera className={`w-7 h-7 ${formData.service_type === 'sport_photography' ? 'text-white' : 'text-[#22c55e]'}`} />
                            </div>
                            <div>
                              <h5 className="font-bold text-white text-lg">Sports Photography</h5>
                              <p className="text-sm text-gray-400 mt-1">High-quality action shots</p>
                            </div>
                          </div>
                          
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.service_type === 'sport_photography'
                              ? 'border-[#22c55e] bg-[#22c55e]'
                              : 'border-white/20'
                          }`}>
                            {formData.service_type === 'sport_photography' && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <span className="px-3 py-1 rounded-full bg-black/30 text-xs text-gray-400 border border-white/5">Action Shots</span>
                          <span className="px-3 py-1 rounded-full bg-black/30 text-xs text-gray-400 border border-white/5">Portraits</span>
                        </div>
                      </motion.div>

                      {/* Video Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleServiceTypeChange('video_services_option')}
                        className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden group ${
                          formData.service_type === 'video_services_option'
                            ? 'border-[#22c55e] bg-[#22c55e]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                              formData.service_type === 'video_services_option' 
                                ? 'bg-[#22c55e] shadow-lg shadow-[#22c55e]/30' 
                                : 'bg-[#22c55e]/20'
                            }`}>
                              <Video className={`w-7 h-7 ${formData.service_type === 'video_services_option' ? 'text-white' : 'text-[#22c55e]'}`} />
                            </div>
                            <div>
                              <h5 className="font-bold text-white text-lg">Video Services</h5>
                              <p className="text-sm text-gray-400 mt-1">Analysis & highlights</p>
                            </div>
                          </div>
                          
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.service_type === 'video_services_option'
                              ? 'border-[#22c55e] bg-[#22c55e]'
                              : 'border-white/20'
                          }`}>
                            {formData.service_type === 'video_services_option' && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <span className="px-3 py-1 rounded-full bg-black/30 text-xs text-gray-400 border border-white/5">Analysis</span>
                          <span className="px-3 py-1 rounded-full bg-black/30 text-xs text-gray-400 border border-white/5">Highlights</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Video Service Selection - Accordion Style */}
                    <AnimatePresence>
                      {formData.service_type === 'video_services_option' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-black/40 rounded-2xl p-6 border border-[#22c55e]/20 space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-4 h-4 text-[#22c55e]" />
                              <h5 className="text-sm font-semibold text-[#22c55e] uppercase tracking-wider">Select Video Package</h5>
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
                                    className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-300 group ${
                                      isSelected
                                        ? 'border-[#22c55e] bg-gradient-to-r from-[#22c55e]/20 to-transparent'
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
                                            isSelected ? 'border-[#22c55e] bg-[#22c55e]' : 'border-white/20'
                                          }`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                                        
                                        {/* Feature Tags */}
                                        <div className="flex gap-2 mt-3">
                                          {service.features.map((feature, idx) => (
                                            <span key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                                              <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
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

                            {/* Selected Service Summary */}
                            {selectedVideoService && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedVideoService.color} flex items-center justify-center`}>
                                    <selectedVideoService.icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#22c55e] uppercase tracking-wider font-semibold">Selected Package</p>
                                    <p className="text-white font-medium">{selectedVideoService.label}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVideoServiceSelect('');
                                  }}
                                  className="p-2 hover:bg-[#22c55e]/20 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4 text-[#22c55e]" />
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
                      <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
                        <span className="text-[#22c55e] text-sm font-bold">3</span>
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
                            className="w-full px-4 py-3 bg-black/50 border border-[#22c55e]/30 rounded-xl text-white focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none [color-scheme:dark]"
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
                            className="w-full px-4 py-3 pl-10 bg-black/50 border border-[#22c55e]/30 rounded-xl text-white placeholder-gray-600 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none"
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
                          className="w-full px-4 py-3 bg-black/50 border border-[#22c55e]/30 rounded-xl text-white placeholder-gray-600 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none"
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
                          className="w-full px-4 py-3 bg-black/50 border border-[#22c55e]/30 rounded-xl text-white placeholder-gray-600 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none"
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
                          className="w-full px-4 py-3 bg-black/50 border border-[#22c55e]/30 rounded-xl text-white placeholder-gray-600 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-[#22c55e]/20 p-6 bg-black/20 backdrop-blur-sm shrink-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-[#22c55e] text-white hover:bg-[#16a34a] rounded-xl font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40 hover:scale-[1.02] active:scale-[0.98]"
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

export default CTASection;