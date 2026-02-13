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
  Download,
  Mail,
  Phone,
  Tag,
  AlertCircle,
  BarChart3,
  Link as LinkIcon,
  Copy,
  Check
} from 'lucide-react';
import { reservationAPI } from '../../services/api';
import ImageUploadModal from './ImageUploadModal';

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
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  // Your domain - change this to your actual domain
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
    
    const stats = {
      total: reservationsArray.length,
      pending: reservationsArray.filter(r => r && r.status === 'pending').length,
      confirmed: reservationsArray.filter(r => r && r.status === 'confirmed').length,
      completed: reservationsArray.filter(r => r && r.status === 'completed').length,
      cancelled: reservationsArray.filter(r => r && r.status === 'cancelled').length
    };
    setStats(stats);
  };

  // Generate static gallery link for a reservation
  const getGalleryLink = (reservationId) => {
    return `${DOMAIN}/gallery/${reservationId}`;
  };

  // Generate static download link for a reservation
  const getDownloadLink = (reservationId) => {
    return `${DOMAIN}/gallery/${reservationId}/download`;
  };

  // Copy gallery link to clipboard
  const copyGalleryLink = async (reservationId) => {
    try {
      const link = getGalleryLink(reservationId);
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(reservationId);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedLinkId(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error copying link:', error);
      alert('Failed to copy link');
    }
  };

  // Copy download link to clipboard
  const copyDownloadLink = async (reservationId) => {
    try {
      const link = getDownloadLink(reservationId);
      await navigator.clipboard.writeText(link);
      alert('Download link copied to clipboard!');
    } catch (error) {
      console.error('Error copying download link:', error);
      alert('Failed to copy download link');
    }
  };

  const toggleReservationExpand = (id) => {
    setExpandedReservations(prev =>
      prev.includes(id)
        ? prev.filter(resId => resId !== id)
        : [...prev, id]
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
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
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) > new Date();
    } catch (error) {
      console.error('Error checking date:', error);
      return false;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
          <p className="text-gray-500">Interactive management of all bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={fetchReservations}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-gray-900">No reservations found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter</p>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                expandedReservations.includes(reservation.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Reservation Header */}
              <div 
                className={`p-4 border-b ${getStatusColor(reservation.status)} cursor-pointer`}
                onClick={() => toggleReservationExpand(reservation.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {getUserInitial(reservation)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{reservation.team || 'No team'}</h4>
                      <p className="text-sm opacity-75">{getUserName(reservation)}</p>
                    </div>
                  </div>
                  <button>
                    {expandedReservations.includes(reservation.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{formatDate(reservation.date)}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status || 'unknown'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{reservation.stadium || 'No stadium'}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 capitalize">{reservation.service?.type || 'session'}</span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedReservations.includes(reservation.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t"
                  >
                    <div className="p-4 space-y-4">
                      {/* Client Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Client Information</h5>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{getUserEmail(reservation)}</span>
                          </div>
                          {reservation.user?.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm">{reservation.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Service</h5>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">{reservation.service?.name || 'Unknown service'}</p>
                          <p className="text-sm text-gray-600">{reservation.service?.description || 'No description'}</p>
                          <p className="text-sm font-medium mt-1">${reservation.service?.base_price || '0.00'}</p>
                        </div>
                      </div>

                      {/* Opponent Info */}
                      {reservation.opponent && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-2">Opponent</h5>
                          <div className="flex items-center">
                            <Trophy className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{reservation.opponent}</span>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {reservation.notes && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-2">Notes</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                            {reservation.notes}
                          </p>
                        </div>
                      )}

                      {/* Gallery Links Section */}
                      <div className="pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-500 mb-3">Gallery Links</h5>
                        
                        <div className="space-y-3">
                          {/* Gallery Link */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Gallery Link</span>
                              </div>
                              <button
                                onClick={() => copyGalleryLink(reservation.id)}
                                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                  copiedLinkId === reservation.id
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                {copiedLinkId === reservation.id ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-100 overflow-x-auto">
                              {getGalleryLink(reservation.id)}
                            </div>
                          </div>

                          {/* Download Link */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Download className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Download Link</span>
                              </div>
                              <button
                                onClick={() => copyDownloadLink(reservation.id)}
                                className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs flex items-center gap-1 hover:bg-amber-200"
                              >
                                <Copy className="w-3 h-3" />
                                Copy
                              </button>
                            </div>
                            <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-100 overflow-x-auto">
                              {getDownloadLink(reservation.id)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Management Actions */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowUploadModal(true);
                            }}
                            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-1"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload Images</span>
                          </button>
                          
                          {reservation.status !== 'completed' && (
                            <button
                              onClick={() => updateStatus(reservation.id, 'completed')}
                              className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        // List View (Table) with Gallery Links
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery Links</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <motion.tr
                    key={reservation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {getUserInitial(reservation)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{getUserName(reservation)}</div>
                          <div className="text-sm text-gray-500">{getUserEmail(reservation)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${reservation.service?.type === 'shooting' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {reservation.service?.type === 'shooting' ? '🎥' : '📊'}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{reservation.service?.name || 'Unknown service'}</div>
                          <div className="text-sm text-gray-500 capitalize">{reservation.service?.type || 'unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div>{formatDate(reservation.date)}</div>
                          <div className="text-sm text-gray-500">{formatTime(reservation.date)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyGalleryLink(reservation.id)}
                            className={`flex-1 px-3 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${
                              copiedLinkId === reservation.id
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                            }`}
                          >
                            {copiedLinkId === reservation.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy Gallery Link
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {getGalleryLink(reservation.id)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
                          {reservation.status === 'confirmed' && <CheckCircle className="w-4 h-4 mr-1" />}
                          {reservation.status === 'completed' && <CheckCircle className="w-4 h-4 mr-1" />}
                          {reservation.status === 'cancelled' && <XCircle className="w-4 h-4 mr-1" />}
                          <span className="capitalize">{reservation.status || 'unknown'}</span>
                        </span>
                        {isUpcoming(reservation.date) && reservation.status !== 'cancelled' && (
                          <AlertCircle className="w-4 h-4 text-blue-500" title="Upcoming" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowUploadModal(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Upload Images"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleReservationExpand(reservation.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
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
    </div>
  );
};

export default Reservations;