import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
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
  X,
  ExternalLink,
  Sparkles,
  Trash2
} from 'lucide-react';
import { reservationAPI } from '../../services/api';
import ImageUploadModal from './ImageUploadModal';

// Inline VideoUploadModal component with progress bar
const VideoUploadModal = ({ reservation, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file (mp4, mov, avi)');
        return;
      }
      // Fix: 100MB = 100 * 1024 * 1024 bytes
      if (file.size > 100 * 5024 * 5024) {
        setError('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
      setError('');
      setUploadProgress(0); // reset progress when new file selected
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('video', selectedFile);
    try {
      // Pass progress callback as third argument
      await onUpload(reservation.id, formData, (progress) => {
        setUploadProgress(progress);
      });
      onClose();
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B8E601] to-[#B8E601]/70 flex items-center justify-center shadow-2xl">
                  <Film className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Upload Video</h3>
                  <p className="text-sm text-gray-400">{reservation.team || 'Session'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Select Video</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#B8E601]/20 file:text-[#B8E601] hover:file:bg-[#B8E601]/30"
                  />
                </div>
                {error && <p className="text-sm text-rose-400">{error}</p>}
                {selectedFile && (
                  <p className="text-sm text-gray-400">Selected: {selectedFile.name}</p>
                )}
              </div>

              {/* Progress bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Uploading...</span>
                    <span className="text-[#B8E601]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-[#B8E601]/10 to-transparent border border-[#B8E601]/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#B8E601]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#B8E601]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Video Guidelines:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Supported formats: MP4, MOV, AVI</li>
                      <li>• Maximum file size: 100MB</li>
                      <li>• Ensure video quality is high</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black rounded-xl font-medium hover:from-[#B8E601] hover:to-[#B8E601] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading {uploadProgress}%...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Video
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={uploading}
                  className="px-4 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedReservationForDetails, setSelectedReservationForDetails] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentLink, setCurrentLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    thisMonth: 0
  });

  const DOMAIN = 'https://elhachimivisionlab.com';
  const API_BASE_URL = 'https://server.elhachimivisionlab.com/api'; // Adjust to your backend

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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthCount = reservationsArray.filter(r => {
      if (!r.date) return false;
      const date = new Date(r.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    setStats({
      total: reservationsArray.length,
      pending: reservationsArray.filter(r => r?.status === 'pending').length,
      confirmed: reservationsArray.filter(r => r?.status === 'confirmed').length,
      completed: reservationsArray.filter(r => r?.status === 'completed').length,
      cancelled: reservationsArray.filter(r => r?.status === 'cancelled').length,
      thisMonth: thisMonthCount
    });
  };

  const slugify = (text) => {
    if (!text) return 'guest';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
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

  const getGalleryLink = (reservation) => {
    const username = slugify(reservation.user?.name);
    return `${DOMAIN}/${username}/${reservation.id}/results`;
  };

  const getVideoGalleryLink = (reservation) => {
    const username = slugify(reservation.user?.name);
    return `${DOMAIN}/${username}/${reservation.id}/results`;
  };

  const copyGalleryLink = async (reservation, type = 'photo') => {
    try {
      const link = type === 'video' ? getVideoGalleryLink(reservation) : getGalleryLink(reservation);
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(`${type}-${reservation.id}`);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  // Modified uploadVideo to accept progress callback
  const uploadVideo = async (reservationId, formData, onProgress) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reservations/${reservationId}/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress?.(percentCompleted);
          }
        },
      });
      await fetchReservations();
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await reservationAPI.update(id, { status: newStatus });
      fetchReservations();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) {
      return;
    }
    try {
      await reservationAPI.delete(id);
      await fetchReservations();
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Failed to delete reservation. Please try again.');
    }
  };

  const openDetailsModal = (reservation) => {
    setSelectedReservationForDetails(reservation);
    setShowDetailsModal(true);
  };

  const generateLink = (reservation) => {
    const username = slugify(reservation.user?.name);
    return `${DOMAIN}/${username}/${reservation.id}/results`;
  };

  const openLinkModal = (reservation) => {
    const link = generateLink(reservation);
    setCurrentLink(link);
    setShowLinkModal(true);
    setCopied(false);
    setShowDetailsModal(false);
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const openLinkInNewTab = () => {
    window.open(currentLink, '_blank', 'noopener,noreferrer');
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
        return { color: 'text-[#B8E601]', bg: 'bg-[#B8E601]/10', border: 'border-[#B8E601]/20', icon: Clock };
      case 'confirmed':
        return { color: 'text-[#B8E601]', bg: 'bg-[#B8E601]/20', border: 'border-[#B8E601]/30', icon: CheckCircle };
      case 'completed':
        return { color: 'text-[#B8E601]', bg: 'bg-[#B8E601]/30', border: 'border-[#B8E601]/40', icon: CheckCircle };
      case 'cancelled':
        return { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: XCircle };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: AlertCircle };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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

  // Grid View
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredReservations.map((reservation) => {
        const statusConfig = getStatusConfig(reservation.status);
        const StatusIcon = statusConfig.icon;
        const useVideo = requiresVideoUpload(reservation);

        return (
          <motion.div
            key={reservation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-[#B8E601]/30 hover:shadow-[0_8px_32px_0_rgba(184,230,1,0.2)]"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B8E601]/20 to-[#B8E601]/5 border border-[#B8E601]/30 flex items-center justify-center text-[#B8E601] font-bold text-lg">
                      {getUserInitial(reservation)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${statusConfig.bg}`}>
                      <div className={`w-full h-full rounded-full ${statusConfig.bg}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{reservation.team || 'No team'}</h3>
                    <p className="text-sm text-gray-400">{getUserName(reservation)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {reservation.status || 'unknown'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#B8E601]/70" />
                  <span>{formatDate(reservation.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#B8E601]/70" />
                  <span>{formatTime(reservation.date)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${useVideo ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                    {useVideo ? <Film className="w-4 h-4 text-purple-400" /> : <Camera className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{reservation.service?.name || 'Unknown service'}</p>
                    <p className="text-gray-400 text-xs capitalize">{reservation.service?.type || 'session'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#B8E601]/10 border border-[#B8E601]/30 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#B8E601]" />
                  </div>
                  <span className="text-gray-300 truncate">{reservation.stadium || 'No stadium specified'}</span>
                </div>

                {reservation.opponent && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#B8E601]/10 border border-[#B8E601]/30 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-[#B8E601]" />
                    </div>
                    <span className="text-gray-300">vs {reservation.opponent}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-[#B8E601]/5 border border-[#B8E601]/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Price</span>
                  <span className="text-xl font-bold text-[#B8E601]">${reservation.service?.base_price || '0'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-2">
              <button
                onClick={() => openDetailsModal(reservation)}
                className="flex-1 px-4 py-2 bg-[#B8E601]/20 text-[#B8E601] rounded-xl text-sm font-medium hover:bg-[#B8E601]/30 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => copyGalleryLink(reservation, useVideo ? 'video' : 'photo')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  (copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`)
                    ? 'bg-[#B8E601]/20 text-[#B8E601] border border-[#B8E601]/30'
                    : 'bg-black/60 text-gray-400 border border-white/10 hover:border-[#B8E601]/30 hover:text-[#B8E601]'
                }`}
                title="Copy gallery link"
              >
                {(copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // List View
  const ListView = () => (
    <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/60 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredReservations.map((reservation) => {
              const statusConfig = getStatusConfig(reservation.status);
              const StatusIcon = statusConfig.icon;
              const useVideo = requiresVideoUpload(reservation);

              return (
                <motion.tr
                  key={reservation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[#B8E601]/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8E601]/20 to-[#B8E601]/5 border border-[#B8E601]/30 flex items-center justify-center text-[#B8E601] font-bold text-sm">
                        {getUserInitial(reservation)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{getUserName(reservation)}</div>
                        <div className="text-sm text-gray-400">{getUserEmail(reservation)}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        useVideo ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                      }`}>
                        {useVideo ? <Film className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{reservation.service?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-400 capitalize">{reservation.service?.type || 'session'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{formatDate(reservation.date)}</span>
                      <span className="text-sm text-gray-400">{formatTime(reservation.date)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="capitalize">{reservation.status || 'unknown'}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openDetailsModal(reservation)}
                        className="p-2 text-[#B8E601] hover:bg-[#B8E601]/10 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => copyGalleryLink(reservation, useVideo ? 'video' : 'photo')}
                        className={`p-2 rounded-lg transition-all ${
                          (copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`)
                            ? 'text-[#B8E601] bg-[#B8E601]/10'
                            : 'text-gray-400 hover:text-[#B8E601] hover:bg-[#B8E601]/10'
                        }`}
                        title="Copy gallery link"
                      >
                        {(copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`) ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
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
  );

  // Reservation Details Modal (with delete button)
  const ReservationDetailsModal = () => {
    const reservation = selectedReservationForDetails;
    if (!reservation) return null;

    const statusConfig = getStatusConfig(reservation.status);
    const StatusIcon = statusConfig.icon;
    const useVideo = requiresVideoUpload(reservation);
    const ServiceIcon = useVideo ? Film : Camera;

    return (
      <AnimatePresence>
        {showDetailsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowDetailsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B8E601] to-[#B8E601]/70 flex items-center justify-center text-black shadow-2xl">
                        <User className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Reservation Details</h3>
                        <p className="text-sm text-gray-400">ID: {reservation.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Current Status</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} flex items-center gap-2`}>
                        <StatusIcon className="w-4 h-4" />
                        {reservation.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-[#B8E601] uppercase tracking-wider">Client</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-white">{getUserName(reservation)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-white">{getUserEmail(reservation)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {reservation.user?.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-white">{reservation.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-[#B8E601] uppercase tracking-wider">Session</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-white">{formatDate(reservation.date)} at {formatTime(reservation.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-white">{reservation.stadium || 'Venue TBD'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-gray-500" />
                            <span className="text-white">{reservation.team || 'No team'} {reservation.opponent && `vs ${reservation.opponent}`}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span className="text-white capitalize">{reservation.service?.name || reservation.service_type?.replace('_', ' ') || 'Session'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {reservation.notes && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-[#B8E601] uppercase tracking-wider">Notes</h4>
                        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">{reservation.notes}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-[#B8E601] uppercase tracking-wider">Gallery Access</h4>
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-[#B8E601]" />
                            <span className="text-sm text-white">Client Gallery Link</span>
                          </div>
                          <button
                            onClick={() => copyGalleryLink(reservation, useVideo ? 'video' : 'photo')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                              (copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`)
                                ? 'bg-[#B8E601]/20 text-[#B8E601] border border-[#B8E601]/30'
                                : 'bg-white/10 text-gray-300 border border-white/10 hover:bg-white/20'
                            }`}
                          >
                            {(copiedLinkId === `video-${reservation.id}` || copiedLinkId === `photo-${reservation.id}`) ? (
                              <><Check className="w-3 h-3" /> Copied</>
                            ) : (
                              <><Copy className="w-3 h-3" /> Copy</>
                            )}
                          </button>
                        </div>
                        <code className="block text-xs text-gray-500 bg-black/40 rounded-lg p-2 truncate">
                          {useVideo ? getVideoGalleryLink(reservation) : getGalleryLink(reservation)}
                        </code>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-[#B8E601] uppercase tracking-wider">Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            if (useVideo) {
                              setShowVideoUploadModal(true);
                            } else {
                              setShowUploadModal(true);
                            }
                            setShowDetailsModal(false);
                          }}
                          className={`px-4 py-3 rounded-xl text-sm font-medium text-white transition-all flex items-center justify-center gap-2 ${
                            useVideo
                              ? 'bg-purple-600/80 hover:bg-purple-600 border border-purple-500/30'
                              : 'bg-blue-600/80 hover:bg-blue-600 border border-blue-500/30'
                          }`}
                        >
                          {useVideo ? <Film className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                          Upload {useVideo ? 'Video' : 'Images'}
                        </button>
                        <button
                          onClick={() => openLinkModal(reservation)}
                          className="px-4 py-3 bg-[#B8E601]/20 text-[#B8E601] rounded-xl text-sm font-medium hover:bg-[#B8E601]/30 transition-all flex items-center justify-center gap-2"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Generate Link
                        </button>
                      </div>

                      {/* Status update buttons and delete button */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reservation.status !== 'confirmed' && (
                          <button
                            onClick={() => updateStatus(reservation.id, 'confirmed')}
                            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {reservation.status !== 'completed' && (
                          <button
                            onClick={() => updateStatus(reservation.id, 'completed')}
                            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {reservation.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(reservation.id, 'cancelled')}
                            className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium hover:bg-rose-500/30 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {/* Delete button - always visible */}
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/10 bg-black/20">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="w-full px-4 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  // Link Modal
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
              <div className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B8E601] to-[#B8E601]/70 flex items-center justify-center shadow-2xl">
                      <LinkIcon className="w-7 h-7 text-black" />
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

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                      Generated Link
                    </label>
                    <div className="relative group">
                      <div className="bg-black/30 border border-white/10 rounded-xl p-4 pr-24 overflow-x-auto">
                        <code className="text-sm text-[#B8E601] font-mono whitespace-nowrap">
                          {currentLink}
                        </code>
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button
                          onClick={copyLinkToClipboard}
                          className={`p-2 rounded-lg transition-all ${
                            copied
                              ? 'bg-[#B8E601]/20 text-[#B8E601]'
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

                  <div className="bg-gradient-to-r from-[#B8E601]/10 to-transparent border border-[#B8E601]/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#B8E601]/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-[#B8E601]" />
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

                <div className="p-6 border-t border-white/10 bg-black/20">
                  <button
                    onClick={copyLinkToClipboard}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black rounded-xl font-medium hover:from-[#B8E601] hover:to-[#B8E601] transition-all flex items-center justify-center gap-2"
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
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#B8E601]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#B8E601]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#B8E601]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Reservations</h1>
            <p className="text-sm text-gray-400 mt-1">Manage all client bookings and galleries</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReservations}
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:bg-black/60 hover:border-[#B8E601]/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#B8E601] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  viewMode === 'list' ? 'bg-[#B8E601] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm">List</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: BarChart3 },
            { label: 'Pending', value: stats.pending, icon: Clock },
            { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle },
            { label: 'Completed', value: stats.completed, icon: CheckCircle },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle },
            { label: 'This Month', value: stats.thisMonth, icon: Calendar }
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-[#B8E601]/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-semibold text-white">{stat.value}</p>
                </div>
                <div className="p-2 bg-[#B8E601]/10 rounded-lg border border-[#B8E601]/20">
                  <stat.icon className="w-4 h-4 text-[#B8E601]" />
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
              className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg focus:border-[#B8E601]/50 focus:outline-none text-sm text-white placeholder-gray-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white appearance-none cursor-pointer focus:border-[#B8E601]/50 focus:outline-none"
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
                className="pl-9 pr-8 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white appearance-none cursor-pointer focus:border-[#B8E601]/50 focus:outline-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <button className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:bg-black/60 hover:border-[#B8E601]/30 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-black/40 border border-white/10 rounded-xl">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-gray-700 border-t-[#B8E601] rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-sm text-gray-400">Loading reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 bg-black/40 border border-white/10 rounded-xl">
            <Calendar className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No reservations found</h3>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && <GridView />}
            {viewMode === 'list' && <ListView />}
          </>
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

      {showVideoUploadModal && selectedReservation && (
        <VideoUploadModal
          reservation={selectedReservation}
          onClose={() => {
            setShowVideoUploadModal(false);
            setSelectedReservation(null);
          }}
          onUpload={uploadVideo}
        />
      )}

      <ReservationDetailsModal />
      <LinkModal />
    </div>
  );
};

export default Reservations;