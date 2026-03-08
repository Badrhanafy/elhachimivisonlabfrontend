import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Instagram, Linkedin, Twitter, Navigation, Maximize2, MinusCircle, PlusCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [mapZoom, setMapZoom] = useState(15);

  const mapRef = useRef(null);
  const smallMapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const smallMapContainerRef = useRef(null);

  const limeGreen = '#b3ff00';
  const limeGreen50 = 'rgba(179, 255, 0, 0.5)';
  const limeGreen20 = 'rgba(179, 255, 0, 0.2)';
  const limeGreen10 = 'rgba(179, 255, 0, 0.1)';
  const limeGreen5 = 'rgba(179, 255, 0, 0.05)';

  // Paris coordinates (Place Vendôme)
  const centerCoords = [48.8684, 2.3290];

  // Custom marker icon
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  // Initialize main map
  useEffect(() => {
    if (!mapContainerRef.current || mapInitialized) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // We'll use custom controls
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true
    }).setView(centerCoords, mapZoom);
    
    mapRef.current = map;

    // Add custom dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 2
    }).addTo(map);

    // Add marker
    const marker = L.marker(centerCoords, { 
      icon: createCustomIcon(limeGreen),
      riseOnHover: true
    }).addTo(map);
    
    // Add popup that appears on marker click
    marker.bindPopup(`
      <div style="font-family: sans-serif; padding: 8px; background: #1a1a1a; color: white; border: 1px solid ${limeGreen};">
        <strong style="color: ${limeGreen};">Maison Parfum</strong><br>
        <span style="color: #999;">8 Place Vendôme, Paris</span><br>
        <span style="color: ${limeGreen}; font-size: 12px;">By appointment only</span>
      </div>
    `);

    // Handle zoom changes
    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
    });

    setMapInitialized(true);

    return () => {
      map.remove();
    };
  }, [mapInitialized, centerCoords, limeGreen]);

  // Initialize small map in contact info
  useEffect(() => {
    if (!smallMapContainerRef.current) return;

    const smallMap = L.map(smallMapContainerRef.current, {
      zoomControl: false,
      dragging: true, // Allow dragging for better UX
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      tap: true
    }).setView(centerCoords, 16); // Slightly closer zoom for the card

    smallMapRef.current = smallMap;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
    }).addTo(smallMap);

    const marker = L.marker(centerCoords, { 
      icon: createCustomIcon(limeGreen) 
    }).addTo(smallMap);

    marker.bindPopup(`
      <div style="font-family: sans-serif; padding: 8px; background: #1a1a1a; color: white; border: 1px solid ${limeGreen};">
        <strong style="color: ${limeGreen};">Maison Parfum</strong><br>
        <span style="color: #999;">8 Place Vendôme, Paris</span>
      </div>
    `);

    return () => {
      smallMap.remove();
    };
  }, [centerCoords, limeGreen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapZoom = (direction) => {
    if (mapRef.current) {
      const newZoom = mapZoom + direction;
      mapRef.current.setZoom(newZoom);
      setMapZoom(newZoom);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Visit Us",
      value: "8 Place Vendôme, 75001 Paris",
      detail: "By appointment only",
      isMap: true,
      coords: centerCoords
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+33 1 42 60 00 00",
      detail: "Mon-Fri, 10am - 7pm CET",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: Mail,
      label: "Write Us",
      value: "concierge@maisonparfum.com",
      detail: "We reply within 24 hours",
      image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=60"
    },
    {
      icon: Clock,
      label: "Atelier Hours",
      value: "Private Consultations",
      detail: "Tuesday - Saturday",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const inputFields = [
    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Jean Dupont' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jean@example.com' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Private consultation request' },
  ];

  return (
    <section className="min-h-screen bg-black relative overflow-hidden">
      <style jsx>{`
        .leaflet-container {
          font-family: inherit;
          background: #1a1a1a;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 4px;
          background: #1a1a1a;
          color: white;
          border: 1px solid ${limeGreen20};
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .leaflet-popup-tip {
          background: #1a1a1a;
          border: 1px solid ${limeGreen20};
        }
        .leaflet-popup-close-button {
          color: ${limeGreen} !important;
        }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.7) !important;
          color: #666 !important;
          font-size: 9px !important;
          padding: 2px 5px !important;
          border-radius: 3px !important;
          backdrop-filter: blur(5px);
        }
        .leaflet-control-attribution a {
          color: ${limeGreen} !important;
        }
        .custom-map-controls {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .custom-map-controls button {
          border: none;
          background: transparent;
          color: white;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-map-controls button:hover {
          background: ${limeGreen20};
          color: ${limeGreen};
        }
        .custom-map-controls button:first-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Animated ambient orbs */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse"
        style={{ backgroundColor: limeGreen10 }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[128px] animate-pulse delay-1000"
        style={{ backgroundColor: 'rgba(179, 255, 0, 0.05)' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{ backgroundColor: limeGreen5 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-20 lg:py-32 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-24"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
                style={{ color: limeGreen50 }}
              >
                Get in Touch
              </motion.p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[0.9] tracking-tight">
                Let's create<br />
                something <span className="font-serif italic" style={{ color: limeGreen }}>extraordinary</span>
              </h1>
            </div>
            <p className="text-neutral-500 max-w-md text-base leading-relaxed lg:text-right">
              Whether you seek a private consultation, bespoke fragrance creation, 
              or simply wish to learn more about our atelier.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Side: Contact Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredInfo(index)}
                onMouseLeave={() => setHoveredInfo(null)}
                className="group relative backdrop-blur-md border border-white/10 p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:border-[#b3ff00]/50"
                style={{ 
                  backgroundColor: hoveredInfo === index ? limeGreen5 : 'rgba(255, 255, 255, 0.03)'
                }}
              >
                {/* Hover gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to right, transparent, ${limeGreen5}, transparent)` }}
                />
                
                {/* Hover Image Reveal for non-map items */}
                <AnimatePresence>
                  {hoveredInfo === index && !info.isMap && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-0"
                    >
                      <img src={info.image} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10 flex items-start gap-6">
                  <div 
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-[#b3ff00] group-hover:bg-[#b3ff00]/10"
                  >
                    <info.icon size={20} className="text-neutral-500 group-hover:text-[#b3ff00] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p 
                      className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
                      style={{ color: limeGreen50 }}
                    >
                      {info.label}
                    </p>
                    <h3 className="text-lg font-medium text-white mb-1 group-hover:translate-x-2 transition-transform duration-300">
                      {info.value}
                    </h3>
                    <p className="text-sm text-neutral-600 group-hover:text-neutral-400 transition-colors">
                      {info.detail}
                    </p>
                  </div>
                  <ArrowRight 
                    size={20} 
                    className="text-neutral-700 group-hover:text-[#b3ff00] group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" 
                  />
                </div>

                {/* Fully Interactive Map for Visit Us section - No Overlays */}
                {info.isMap && (
                  <div className="mt-4 relative overflow-hidden rounded-sm border border-white/10 h-64 group/map">
                    <div 
                      ref={smallMapContainerRef}
                      className="w-full h-full"
                      style={{ background: '#1a1a1a' }}
                    />
                    
                    {/* Only minimal controls for directions, no visual overlays */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-black/80 backdrop-blur-sm border border-white/20 rounded-sm flex items-center justify-center hover:border-[#b3ff00] hover:text-[#b3ff00] transition-colors shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.google.com/maps/search/?api=1&query=${info.coords[0]},${info.coords[1]}`, '_blank');
                        }}
                        title="Open in Google Maps"
                      >
                        <Navigation size={16} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="pt-8 flex items-center gap-6">
              <span 
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{ color: limeGreen50 }}
              >
                Follow
              </span>
              <div className="h-px flex-1 bg-white/10" />
              <div className="flex gap-4">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-[#b3ff00] hover:bg-[#b3ff00]/10 group transition-all duration-300"
                  >
                    <Icon size={18} className="text-neutral-500 group-hover:text-[#b3ff00] transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div 
              className="backdrop-blur-xl border border-white/10 p-8 lg:p-12 relative overflow-hidden"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            >
              {/* Subtle gradient orbs */}
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32"
                style={{ backgroundColor: limeGreen10 }}
              />
              <div 
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl -ml-32 -mb-32"
                style={{ backgroundColor: limeGreen5 }}
              />

              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                {inputFields.map((field) => (
                  <div key={field.name} className="relative">
                    <motion.label
                      initial={false}
                      animate={{
                        y: focusedField === field.name || formData[field.name] ? -24 : 0,
                        scale: focusedField === field.name || formData[field.name] ? 0.85 : 1,
                        color: focusedField === field.name ? limeGreen : '#6b7280'
                      }}
                      className="absolute left-0 top-3 origin-left pointer-events-none font-medium transition-colors"
                    >
                      {field.label}
                    </motion.label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-b-2 border-white/20 py-3 text-white focus:outline-none transition-colors duration-300 placeholder:text-neutral-700"
                      style={{ borderColor: focusedField === field.name ? limeGreen : 'rgba(255, 255, 255, 0.2)' }}
                      required
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5"
                      style={{ backgroundColor: limeGreen }}
                      initial={{ width: 0 }}
                      animate={{ width: focusedField === field.name ? '100%' : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                ))}

                {/* Message Textarea */}
                <div className="relative">
                  <motion.label
                    initial={false}
                    animate={{
                      y: focusedField === 'message' || formData.message ? -24 : 0,
                      scale: focusedField === 'message' || formData.message ? 0.85 : 1,
                      color: focusedField === 'message' ? limeGreen : '#6b7280'
                    }}
                    className="absolute left-0 top-3 origin-left pointer-events-none font-medium transition-colors"
                  >
                    Your Message
                  </motion.label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent border-b-2 border-white/20 py-3 text-white focus:outline-none transition-colors duration-300 resize-none placeholder:text-neutral-700"
                    style={{ borderColor: focusedField === 'message' ? limeGreen : 'rgba(255, 255, 255, 0.2)' }}
                    required
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5"
                    style={{ backgroundColor: limeGreen }}
                    initial={{ width: 0 }}
                    animate={{ width: focusedField === 'message' ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-black py-4 px-8 flex items-center justify-center gap-3 group relative overflow-hidden rounded-sm font-medium tracking-wide"
                  style={{ backgroundColor: limeGreen }}
                >
                  <span className="relative z-10">
                    {isSubmitted ? 'Message Sent' : 'Send Message'}
                  </span>
                  {isSubmitted ? (
                    <CheckCircle size={20} className="relative z-10" />
                  ) : (
                    <Send size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              </form>

              {/* Success Message */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 backdrop-blur-xl flex items-center justify-center z-20"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                      >
                        <CheckCircle size={64} style={{ color: limeGreen }} className="mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-light text-white mb-2">Thank You</h3>
                      <p className="text-neutral-500">We will respond within 24 hours</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Decorative quote */}
            <div className="mt-8 pl-8 border-l-2" style={{ borderColor: limeGreen20 }}>
              <p className="text-neutral-500 italic font-serif text-lg leading-relaxed">
                "Every great fragrance begins with a conversation."
              </p>
              <p className="text-sm mt-2" style={{ color: limeGreen50 }}>— House Philosophy</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Large Fully Interactive Map Section - No Overlays */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 lg:mt-32 relative"
        >
          <div 
            className={`aspect-[21/9] w-full relative overflow-hidden group rounded-sm border border-white/10 bg-neutral-950 transition-all duration-500 ${
              isMapFullscreen ? 'fixed inset-0 z-50 aspect-auto' : ''
            }`}
          >
            {/* Map Container - Fully Interactive */}
            <div 
              ref={mapContainerRef}
              className="w-full h-full"
              style={{ background: '#1a1a1a' }}
            />

            {/* Minimal Map Controls - Only essential UI, no visual overlays on the map itself */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <div className="custom-map-controls">
                <button onClick={() => handleMapZoom(1)} title="Zoom in">
                  <PlusCircle size={16} />
                </button>
                <button onClick={() => handleMapZoom(-1)} title="Zoom out">
                  <MinusCircle size={16} />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                className="bg-black/80 backdrop-blur-sm border border-white/20 p-2 rounded-sm hover:border-[#b3ff00] hover:text-[#b3ff00] transition-colors"
                title="Toggle fullscreen"
              >
                <Maximize2 size={16} />
              </motion.button>
            </div>

            {/* Minimal Location Info - Small card that doesn't obstruct the map */}
            <div className="absolute bottom-4 left-4 z-10">
              <div 
                className="backdrop-blur-md border border-white/20 px-4 py-2 rounded-sm"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              >
                <p className="text-xs text-white">
                  <span className="font-bold" style={{ color: limeGreen }}>Maison Parfum</span> • 8 Place Vendôme, Paris
                </p>
              </div>
            </div>

            {/* Get Directions Button - Subtle and non-obstructive */}
            <div className="absolute bottom-4 right-4 z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${centerCoords[0]},${centerCoords[1]}`, '_blank')}
                className="bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-sm hover:border-[#b3ff00] hover:text-[#b3ff00] transition-colors flex items-center gap-2 text-sm"
              >
                <Navigation size={14} />
                <span>Directions</span>
              </motion.button>
            </div>

            {/* Fullscreen close button */}
            {isMapFullscreen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMapFullscreen(false)}
                className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-sm hover:border-[#b3ff00] hover:text-[#b3ff00] transition-colors z-[1000]"
              >
                Close Map
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;