// pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Image as ImageIcon,
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  RefreshCw,
  ArrowUpRight,
  Eye,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const stats = {
    totalReservations: 24,
    pending: 8,
    confirmed: 12,
    completed: 4,
    cancelled: 0,
    totalClients: 18,
    totalImages: 156,
    revenue: 12000
  };

  const recentReservations = [
    { id: 1, team: 'Real Madrid FC', user: 'John Doe', date: '2024-01-30T14:00:00', status: 'pending' },
    { id: 2, team: 'Barcelona FC', user: 'Jane Smith', date: '2024-01-29T16:30:00', status: 'confirmed' },
    { id: 3, team: 'Manchester United', user: 'Bob Wilson', date: '2024-01-28T10:00:00', status: 'completed' },
    { id: 4, team: 'Liverpool FC', user: 'Alice Johnson', date: '2024-01-27T19:00:00', status: 'pending' },
    { id: 5, team: 'Bayern Munich', user: 'Charlie Brown', date: '2024-01-26T15:30:00', status: 'confirmed' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Welcome back, Admin! Here's what's happening.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Last 30 days
          </button>
          <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalReservations}</p>
              <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        {/* Pending Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Require action</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>

        {/* Total Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-4 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalClients}</p>
              <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                +5 new this month
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* Total Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-4 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Images</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalImages}</p>
              <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                +24 new uploads
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 sm:p-6 border-b flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Reservations</h3>
              <p className="text-sm text-gray-500">Latest booking requests</p>
            </div>
            <Link
              to="/admin/reservations"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y">
            {recentReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 sm:p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {reservation.team.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{reservation.team}</h4>
                      <p className="text-xs text-gray-500 truncate">
                        {reservation.user} • {formatDate(reservation.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-bold text-green-600">{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2 sm:mr-3" />
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-bold text-yellow-600">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3" />
                  <span className="text-sm">Cancelled</span>
                </div>
                <span className="font-bold text-red-600">{stats.cancelled}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 sm:mr-3" />
                  <span className="text-sm">Estimated Revenue</span>
                </div>
                <span className="font-bold text-blue-600">${stats.revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Link
                to="/admin/reservations"
                className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-3" />
                  <span>Review pending reservations</span>
                </div>
              </Link>
              <Link
                to="/admin/images"
                className="block w-full text-left px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
              >
                <div className="flex items-center">
                  <Upload className="w-4 h-4 mr-3" />
                  <span>Upload new images</span>
                </div>
              </Link>
              <button
                onClick={() => window.location.href = '/'}
                className="block w-full text-left px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-3" />
                  <span>View public website</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Stats Cards */}
      {isMobile && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-xs text-gray-500">Cancelled</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;