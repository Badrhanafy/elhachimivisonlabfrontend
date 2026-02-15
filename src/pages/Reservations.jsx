import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Eye,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Mail,
  Phone,
  Tag,
  AlertCircle,
  BarChart3,
  Link as LinkIcon,
  Copy,
  Check,
  Video,
  Image,
  MoreHorizontal,
  Users,
  Camera,
  Film,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Zap,
  Activity,
  DollarSign,
  Star,
  Shield,
  User,
  CalendarDays,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { reservationAPI } from '../../services/api';
import ImageUploadModal from './ImageUploadModal';
import VideoUploadModal from './VideoUploadModal';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [expandedReservations, setExpandedReservations] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0
  });

  const DOMAIN = 'https://elhachimivisionlab.com';

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
        data = Array.isArray(response.data) ? response.data : [response.data];
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

    const totalRevenue = reservationsArray.reduce((sum, r) =>
      sum + (parseFloat(r.service?.base_price) || 0), 0
    );

    setStats({
      total: reservationsArray.length,
      pending: reservationsArray.filter(r => r?.status === 'pending').length,
      confirmed: reservationsArray.filter(r => r?.status === 'confirmed').length,
      completed: reservationsArray.filter(r => r?.status === 'completed').length,
      cancelled: reservationsArray.filter(r => r?.status === 'cancelled').length,
      revenue: totalRevenue
    });
  };

  const requiresVideoUpload = (reservation) => {
    const serviceType = reservation?.service?.type?.toLowerCase() || '';
    const serviceName = reservation?.service?.name?.toLowerCase() || '';
    const isPhotoService =
      serviceType === 'photography' ||
      serviceType.includes('photo') ||
      serviceName.includes('photography') ||
      serviceName.includes('photo') ||
      serviceType === 'sport photography' ||
      serviceType === 'sports photography';
    return !isPhotoService;
  };

  const getGalleryLink = (reservationId) => `${DOMAIN}/gallery/${reservationId}`;
  const getVideoGalleryLink = (reservationId) => `${DOMAIN}/video-gallery/${reservationId}`;

  const copyGalleryLink = async (reservationId) => {
    try {
      const link = getGalleryLink(reservationId);
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(`photo-${reservationId}`);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const copyVideoGalleryLink = async (reservationId) => {
    try {
      const link = getVideoGalleryLink(reservationId);
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(`video-${reservationId}`);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error('Error copying video link:', error);
    }
  };

  const handleUploadVideo = async (reservationId, formData) => {
    try {
      await reservationAPI.uploadVideo(reservationId, formData);
      fetchReservations();
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  const toggleReservationExpand = (id) => {
    setExpandedReservations(prev =>
      prev.includes(id) ? prev.filter(resId => resId !== id) : [...prev, id]
    );
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-400/10',
          border: 'border-amber-400/20',
          icon: Clock
        };
      case 'confirmed':
        return {
          color: 'text-blue-400',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/20',
          icon: CheckCircle
        };
      case 'completed':
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-400/10',
          border: 'border-emerald-400/20',
          icon: CheckCircle
        };
      case 'cancelled':
        return {
          color: 'text-rose-400',
          bg: 'bg-rose-400/10',
          border: 'border-rose-400/20',
          icon: XCircle
        };
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-400/10',
          border: 'border-gray-400/20',
          icon: AlertCircle
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const getUserInitial = (reservation) => {
    if (reservation.user?.name) return reservation.user.name.charAt(0).toUpperCase();
    if (reservation.user?.email) return reservation.user.email.charAt(0).toUpperCase();
    return 'G';
  };

  const getUserName = (reservation) => {
    if (reservation.user?.name) return reservation.user.name;
    if (reservation.user?.email) return reservation.user.email.split('@')[0];
    return 'Guest';
  };

  const getUserEmail = (reservation) => reservation.user?.email || 'No email';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Reservations</h1>
            <p className="text-sm text-gray-400 mt-1">Manage all client bookings and galleries</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReservations}
              className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#222] hover:border-gray-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#2a2a2a] text-blue-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  viewMode === 'list' ? 'bg-[#2a2a2a] text-blue-400' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: BarChart3, color: 'blue' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
            { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'blue' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'emerald' },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'rose' },
            { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'purple' }
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-[#111] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-semibold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 bg-${stat.color}-500/10 rounded-lg border border-${stat.color}-500/20`}>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by client, team, or stadium..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-gray-800 rounded-lg focus:border-blue-500/50 focus:outline-none text-sm text-white placeholder-gray-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-[#111] border border-gray-800 rounded-lg text-sm text-white appearance-none cursor-pointer focus:border-blue-500/50 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-[#111] border border-gray-800 rounded-lg text-sm text-white appearance-none cursor-pointer focus:border-blue-500/50 focus:outline-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <button className="px-4 py-2.5 bg-[#111] border border-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a1a1a] hover:border-gray-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-[#111] border border-gray-800 rounded-xl">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-sm text-gray-400">Loading reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 bg-[#111] border border-gray-800 rounded-xl">
            <Calendar className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No reservations found</h3>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReservations.map((reservation, index) => {
              const statusConfig = getStatusConfig(reservation.status);
              const StatusIcon = statusConfig.icon;
              const useVideo = requiresVideoUpload(reservation);
              const isExpanded = expandedReservations.includes(reservation.id);

              return (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all"
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-medium text-sm border border-gray-600">
                          {getUserInitial(reservation)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{reservation.team || 'No team'}</h3>
                          <p className="text-xs text-gray-400">{getUserName(reservation)}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {reservation.status || 'unknown'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-300 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span>{formatDate(reservation.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span>{formatTime(reservation.date)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          useVideo ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-blue-500/10 border border-blue-500/20'
                        }`}>
                          {useVideo ? <Film className="w-3.5 h-3.5 text-purple-400" /> : <Camera className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <span className="text-gray-300 truncate">{reservation.service?.name || 'Unknown service'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="text-gray-300 truncate">{reservation.stadium || 'No stadium'}</span>
                      </div>
                      {reservation.opponent && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-gray-800 border border-gray-700 flex items-center justify-center">
                            <Trophy className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <span className="text-gray-300">vs {reservation.opponent}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Total</span>
                      <span className="text-lg font-semibold text-white">${reservation.service?.base_price || '0'}</span>
                    </div>
                  </div>

                  {/* Expandable Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-800"
                      >
                        <div className="p-5 space-y-5">
                          {/* Client Details */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Client</h4>
                            <div className="space-y-1.5 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-300">{getUserEmail(reservation)}</span>
                              </div>
                              {reservation.user?.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-300">{reservation.user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Gallery Links */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Gallery</h4>
                            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <LinkIcon className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm text-white">{useVideo ? 'Video Gallery' : 'Photo Gallery'}</span>
                                </div>
                                <button
                                  onClick={() => useVideo ? copyVideoGalleryLink(reservation.id) : copyGalleryLink(reservation.id)}
                                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                                    (copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`)
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                                  }`}
                                >
                                  {(copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`) ? (
                                    <><Check className="w-3 h-3" /> Copied</>
                                  ) : (
                                    <><Copy className="w-3 h-3" /> Copy</>
                                  )}
                                </button>
                              </div>
                              <code className="block text-xs text-gray-500 bg-[#111] rounded px-2 py-1.5 truncate">
                                {useVideo ? getVideoGalleryLink(reservation.id) : getGalleryLink(reservation.id)}
                              </code>
                            </div>
                          </div>

                          {/* Notes */}
                          {reservation.notes && (
                            <div>
                              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Notes</h4>
                              <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-sm text-gray-300">
                                {reservation.notes}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setSelectedReservation(reservation);
                                useVideo ? setShowVideoUploadModal(true) : setShowUploadModal(true);
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                                useVideo
                                  ? 'bg-purple-600/80 hover:bg-purple-600 border border-purple-500/30'
                                  : 'bg-blue-600/80 hover:bg-blue-600 border border-blue-500/30'
                              }`}
                            >
                              {useVideo ? <Film className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                              Upload {useVideo ? 'Video' : 'Images'}
                            </button>
                            {reservation.status !== 'completed' && (
                              <button
                                onClick={() => updateStatus(reservation.id, 'completed')}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => toggleReservationExpand(reservation.id)}
                    className="w-full py-2.5 bg-[#0a0a0a] border-t border-gray-800 flex items-center justify-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {isExpanded ? (
                      <><ChevronUp className="w-4 h-4" /> Show less</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> View details</>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-gray-800">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gallery</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredReservations.map((reservation, index) => {
                    const statusConfig = getStatusConfig(reservation.status);
                    const StatusIcon = statusConfig.icon;
                    const useVideo = requiresVideoUpload(reservation);

                    return (
                      <motion.tr
                        key={reservation.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-[#1a1a1a] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-medium border border-gray-700">
                              {getUserInitial(reservation)}
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm">{getUserName(reservation)}</div>
                              <div className="text-xs text-gray-400">{getUserEmail(reservation)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${
                              useVideo ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-blue-500/10 border border-blue-500/20'
                            }`}>
                              {useVideo ? <Film className="w-4 h-4 text-purple-400" /> : <Camera className="w-4 h-4 text-blue-400" />}
                            </div>
                            <div>
                              <div className="text-sm text-white">{reservation.service?.name || 'Unknown'}</div>
                              <div className="text-xs text-gray-400 capitalize">{reservation.service?.type || 'session'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-white">{formatDate(reservation.date)}</div>
                          <div className="text-xs text-gray-400">{formatTime(reservation.date)}</div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => useVideo ? copyVideoGalleryLink(reservation.id) : copyGalleryLink(reservation.id)}
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              (copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`)
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                : useVideo
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                            }`}
                          >
                            {(copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`) ? (
                              <><Check className="w-3 h-3" /> Copied</>
                            ) : (
                              <><Copy className="w-3 h-3" /> Copy</>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {reservation.status || 'unknown'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedReservation(reservation);
                                useVideo ? setShowVideoUploadModal(true) : setShowUploadModal(true);
                              }}
                              className={`p-1.5 rounded transition-colors ${
                                useVideo
                                  ? 'text-purple-400 hover:bg-purple-500/10'
                                  : 'text-blue-400 hover:bg-blue-500/10'
                              }`}
                              title={`Upload ${useVideo ? 'Video' : 'Images'}`}
                            >
                              {useVideo ? <Film className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => toggleReservationExpand(reservation.id)}
                              className="p-1.5 text-gray-400 hover:bg-gray-800 rounded transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:bg-gray-800 rounded transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {showVideoUploadModal && selectedReservation && (
          <VideoUploadModal
            reservation={selectedReservation}
            onClose={() => {
              setShowVideoUploadModal(false);
              setSelectedReservation(null);
            }}
            onUpload={handleUploadVideo}
          />
        )}
      </div>
    </div>
  );
};

export default Reservations;