import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Trophy, 
  Eye, 
  Upload, 
  CheckCircle, 
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Tag,
  AlertCircle,
  BarChart3,
  Link as LinkIcon,
  Copy,
  Check,
  X,
  ExternalLink,
  MoreVertical,
  Play,
  Pause,
  Download,
  Share2,
  Star,
  Sparkles,
  Activity,
  Target,
  Zap,
  Camera,
  Video,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  ArrowRight,
  Globe,
  Shield,
  Award
} from 'lucide-react';
import { reservationAPI } from '../../services/api';
import ImageUploadModal from './ImageUploadModal';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentLink, setCurrentLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState('timeline');
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [hoveredReservation, setHoveredReservation] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
    growth: 0
  });

  // Your static domain
  const DOMAIN = 'http://localhost:3000/';

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    updateStats();
  }, [reservations]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationAPI.getAll();
      
      let data = [];
      
      if (Array.isArray(response)) {
        data = response;
      } else if (response && response.data !== undefined) {
        if (Array.isArray(response.data)) {
          data = response.data;
        } else {
          data = [response.data];
        }
      }
      
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const reservationsArray = Array.isArray(reservations) ? reservations : [];
    
    const total = reservationsArray.length;
    const pending = reservationsArray.filter(r => r && r.status === 'pending').length;
    const confirmed = reservationsArray.filter(r => r && r.status === 'confirmed').length;
    const completed = reservationsArray.filter(r => r && r.status === 'completed').length;
    const cancelled = reservationsArray.filter(r => r && r.status === 'cancelled').length;
    
    // Calculate revenue (assuming each service has a price)
    const revenue = reservationsArray.reduce((acc, r) => {
      if (r.status === 'completed') {
        return acc + (r.service?.base_price || 299);
      }
      return acc;
    }, 0);
    
    // Calculate growth (compare with last month)
    const growth = 23.5; // This would be calculated based on actual data
    
    setStats({ total, pending, confirmed, completed, cancelled, revenue, growth });
  };

  // Generate static link for a reservation
  const generateLink = (reservationId) => {
    return `${DOMAIN}/${reservationId}/images`;
  };

  // Open link modal for a specific reservation
  const openLinkModal = (reservation) => {
    const link = generateLink(reservation.id);
    setCurrentLink(link);
    setShowLinkModal(true);
    setCopied(false);
  };

  // Copy link to clipboard
  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  // Open link in new tab
  const openLinkInNewTab = () => {
    window.open(currentLink, '_blank', 'noopener,noreferrer');
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await reservationAPI.update(id, { status: newStatus });
      fetchReservations();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (!reservation) return false;

    const matchesSearch = 
      (reservation.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (reservation.team?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (reservation.stadium?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (reservation.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    if (!reservation.date) return matchesSearch && matchesStatus;
    
    const now = new Date();
    const reservationDate = new Date(reservation.date);
    let matchesDate = true;
    
    if (dateFilter === 'today') {
      matchesDate = reservationDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'upcoming') {
      matchesDate = reservationDate > now;
    } else if (dateFilter === 'past') {
      matchesDate = reservationDate < now;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'completed': return Award;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'No time';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid time';
    }
  };

  const getUserInitial = (reservation) => {
    if (reservation.user?.name) {
      return reservation.user.name.charAt(0).toUpperCase();
    }
    if (reservation.user?.email) {
      return reservation.user.email.charAt(0).toUpperCase();
    }
    return 'G';
  };

  const getUserName = (reservation) => {
    if (reservation.user?.name) {
      return reservation.user.name;
    }
    if (reservation.user?.email) {
      return reservation.user.email.split('@')[0];
    }
    return 'Guest';
  };

  const getUserEmail = (reservation) => {
    return reservation.user?.email || 'No email';
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'sport_photography':
      case 'photography':
        return Camera;
      case 'video_services_option':
      case 'video':
        return Video;
      default:
        return Target;
    }
  };

  // Timeline View Component
  const TimelineView = () => (
    <div className="space-y-4">
      {filteredReservations.map((reservation, index) => {
        const StatusIcon = getStatusIcon(reservation.status);
        const ServiceIcon = getServiceIcon(reservation.service?.type || reservation.service_type);
        const isUpcoming = new Date(reservation.date) > new Date();
        
        return (
          <motion.div
            key={reservation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onHoverStart={() => setHoveredReservation(reservation.id)}
            onHoverEnd={() => setHoveredReservation(null)}
            className="relative group"
          >
            {/* Timeline Line */}
            {index < filteredReservations.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#22c55e]/30 to-transparent" />
            )}
            
            {/* Reservation Card */}
            <div className={`relative flex gap-6 p-6 rounded-2xl transition-all duration-500 ${
              hoveredReservation === reservation.id
                ? 'bg-gradient-to-r from-[#22c55e]/20 via-transparent to-transparent scale-[1.02]'
                : 'bg-white/5'
            } backdrop-blur-xl border border-white/10 hover:border-[#22c55e]/30`}>
              
              {/* Time Indicator */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  isUpcoming ? 'from-[#22c55e] to-emerald-400' : 'from-gray-500 to-gray-600'
                } flex flex-col items-center justify-center text-white shadow-2xl`}>
                  <span className="text-xs font-medium opacity-90">
                    {new Date(reservation.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-bold">
                    {new Date(reservation.date).getDate()}
                  </span>
                </div>
                
                {/* Pulse Effect for Upcoming */}
                {isUpcoming && (
                  <div className="absolute inset-0 rounded-2xl animate-ping bg-[#22c55e]/30" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {reservation.team || 'Team Session'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(reservation.status)}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {reservation.status || 'unknown'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{getUserName(reservation)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{reservation.stadium || 'Venue TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(reservation.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Badge */}
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                      <ServiceIcon className="w-4 h-4 text-[#22c55e]" />
                      <span className="text-white capitalize">
                        {reservation.service?.name || reservation.service_type?.replace('_', ' ') || 'Session'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {reservation.opponent && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#22c55e]" />
                      vs {reservation.opponent}
                    </span>
                  )}
                  {reservation.video_service && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10">
                      {reservation.video_service.replace('_', ' ')}
                    </span>
                  )}
                  {reservation.notes && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10">
                      📝 Notes included
                    </span>
                  )}
                </div>
                
                {/* Action Buttons - Animated on Hover */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hoveredReservation === reservation.id ? 1 : 0, y: hoveredReservation === reservation.id ? 0 : 10 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={() => openLinkModal(reservation)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Generate Link
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowUploadModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Images
                  </button>
                  
                  {reservation.status !== 'completed' && (
                    <button
                      onClick={() => updateStatus(reservation.id, 'completed')}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredReservations.map((reservation, index) => {
        const StatusIcon = getStatusIcon(reservation.status);
        const ServiceIcon = getServiceIcon(reservation.service?.type || reservation.service_type);
        
        return (
          <motion.div
            key={reservation.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="group relative"
          >
            {/* Card Background with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
            
            {/* Main Card */}
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#22c55e]/30 transition-all">
              {/* Header with Status */}
              <div className="p-5 border-b border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-emerald-400 flex items-center justify-center text-white font-bold text-lg">
                      {getUserInitial(reservation)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{getUserName(reservation)}</h4>
                      <p className="text-sm text-gray-400">{reservation.team || 'No team'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(reservation.status)}`}>
                    <StatusIcon className="w-3 h-3 inline mr-1" />
                    {reservation.status}
                  </span>
                </div>
                
                {/* Service Type */}
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <ServiceIcon className="w-4 h-4" />
                  <span className="capitalize">
                    {reservation.service?.name || reservation.service_type?.replace('_', ' ') || 'Session'}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Date and Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#22c55e]" />
                    <span className="text-gray-300">{formatDate(reservation.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#22c55e]" />
                    <span className="text-gray-300 truncate">{reservation.stadium || 'Venue TBD'}</span>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openLinkModal(reservation)}
                    className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-xl text-sm font-medium hover:bg-purple-500/30 transition-all flex items-center justify-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    Link
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowUploadModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-all flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    Upload
                  </button>
                  <button
                    onClick={() => setSelectedReservation(reservation)}
                    className="px-3 py-2 bg-white/5 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-5 py-3 bg-black/20 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Client email</span>
                  <span className="text-gray-300 truncate ml-2">{getUserEmail(reservation)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // Kanban View Component
  const KanbanView = () => {
    const columns = [
      { id: 'pending', title: 'Pending', icon: Clock, color: 'amber' },
      { id: 'confirmed', title: 'Confirmed', icon: CheckCircle, color: 'blue' },
      { id: 'completed', title: 'Completed', icon: Award, color: 'emerald' },
      { id: 'cancelled', title: 'Cancelled', icon: XCircle, color: 'rose' }
    ];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(column => {
          const columnReservations = filteredReservations.filter(r => r.status === column.id);
          const ColumnIcon = column.icon;
          
          return (
            <div key={column.id} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <ColumnIcon className={`w-4 h-4 text-${column.color}-400`} />
                  <h3 className="font-medium text-white">{column.title}</h3>
                </div>
                <span className={`px-2 py-1 rounded-lg bg-${column.color}-500/20 text-${column.color}-400 text-xs font-medium`}>
                  {columnReservations.length}
                </span>
              </div>
              
              {/* Cards */}
              <div className="space-y-2">
                {columnReservations.map((reservation, index) => {
                  const ServiceIcon = getServiceIcon(reservation.service?.type || reservation.service_type);
                  
                  return (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#22c55e]/30 backdrop-blur-xl cursor-pointer transition-all"
                      onClick={() => setSelectedReservation(reservation)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22c55e] to-emerald-400 flex items-center justify-center text-white font-bold text-sm">
                            {getUserInitial(reservation)}
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-sm">{getUserName(reservation)}</h4>
                            <p className="text-xs text-gray-400">{reservation.team || 'No team'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <ServiceIcon className="w-3 h-3" />
                          <span className="truncate">
                            {reservation.service?.name || reservation.service_type?.replace('_', ' ') || 'Session'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatTime(reservation.date)}</span>
                        </div>
                      </div>
                      
                      {/* Quick Action Icons */}
                      <div className="flex gap-1 mt-3 pt-2 border-t border-white/5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openLinkModal(reservation);
                          }}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"
                        >
                          <LinkIcon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReservation(reservation);
                            setShowUploadModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Link Modal Component
  const LinkModal = () => (
    <AnimatePresence>
      {showLinkModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowLinkModal(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              {/* Glass Card */}
              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl">
                      <LinkIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Gallery Access Link</h3>
                      <p className="text-sm text-gray-400">Share this link with your client</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Link Display */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      Generated Link
                    </label>
                    <div className="relative group">
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4 pr-24 overflow-x-auto">
                        <code className="text-sm text-[#22c55e] font-mono whitespace-nowrap">
                          {currentLink}
                        </code>
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button
                          onClick={copyLinkToClipboard}
                          className={`p-2 rounded-lg transition-all ${
                            copied
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 text-gray-400 hover:bg-white/20'
                          }`}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={openLinkInNewTab}
                          className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">How to use this link:</h4>
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>• Copy the link and share it with your client</li>
                          <li>• Clients can view and download their images</li>
                          <li>• The link is unique to this reservation</li>
                          <li>• No login required for client access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/20">
                  <button
                    onClick={copyLinkToClipboard}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link to Clipboard
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#22c55e]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#22c55e] to-emerald-400 bg-clip-text text-transparent">
                Reservations Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Manage and track all your bookings in one place</p>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              {['timeline', 'grid', 'kanban'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    activeView === view
                      ? 'bg-[#22c55e] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-5 h-5 text-[#22c55e]" />
                  <span className="text-xs text-gray-400">Total</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400 mt-1">All reservations</p>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-xs text-gray-400">Pending</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-gray-400 mt-1">Awaiting confirmation</p>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-gray-400">Revenue</span>
                </div>
                <p className="text-3xl font-bold text-white">${stats.revenue}</p>
                <p className="text-sm text-gray-400 mt-1">
                  <span className="text-emerald-400">+{stats.growth}%</span> vs last month
                </p>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-gray-400">Active</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.confirmed + stats.pending}</p>
                <p className="text-sm text-gray-400 mt-1">Active sessions</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, team, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all outline-none appearance-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={fetchReservations}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#22c55e] to-emerald-400 text-white rounded-xl font-medium hover:from-[#22c55e] hover:to-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Reservations Display */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#22c55e]/20 border-t-[#22c55e] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#22c55e] to-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">No reservations found</h3>
            <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="mt-4 px-6 py-2 bg-[#22c55e]/20 text-[#22c55e] rounded-xl hover:bg-[#22c55e]/30 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {activeView === 'timeline' && <TimelineView />}
            {activeView === 'grid' && <GridView />}
            {activeView === 'kanban' && <KanbanView />}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showUploadModal && selectedReservation && (
        <ImageUploadModal
          reservation={selectedReservation}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedReservation(null);
          }}
          onUpload={fetchReservations}
        />
      )}

      <LinkModal />
    </div>
  );
};

export default Reservations;