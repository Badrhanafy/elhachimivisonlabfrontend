// pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Upload,
  Camera,
  Film,
  Target,
  Activity,
  Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { reservationAPI } from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [serviceStats, setServiceStats] = useState([]);

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

  const green = '#ccff00'; // or '#B8E601' – choose your shade

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    processServiceStats();
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

  const processServiceStats = () => {
    const serviceMap = new Map();

    reservations.forEach(res => {
      const service = res.service || {};
      const type = service.type || 'unknown';
      const name = service.name || 'Unknown';

      if (!serviceMap.has(type)) {
        serviceMap.set(type, {
          type,
          name,
          count: 0,
          color: `rgba(184, 230, 1, ${0.3 + (type.length % 7) * 0.1})`
        });
      }
      const stat = serviceMap.get(type);
      stat.count += 1;
    });

    const statsArray = Array.from(serviceMap.values()).sort((a, b) => b.count - a.count);
    setServiceStats(statsArray);
  };

  const chartData = {
    labels: serviceStats.map(s => s.name),
    datasets: [
      {
        label: 'Reservations',
        data: serviceStats.map(s => s.count),
        backgroundColor: serviceStats.map(s => s.color),
        borderColor: green,
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: green,
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#9CA3AF' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF', maxRotation: 45, minRotation: 30 }
      }
    }
  };

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
      case 'pending': return 'text-[#ccff00] bg-[#ccff00]/10 border-[#ccff00]/20';
      case 'confirmed': return 'text-[#ccff00] bg-[#ccff00]/20 border-[#ccff00]/30';
      case 'completed': return 'text-[#ccff00] bg-[#ccff00]/30 border-[#ccff00]/40';
      case 'cancelled': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-gray-700 border-t-[#ccff00] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#ccff00]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#ccff00]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#ccff00]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard Overview</h1>
            <p className="text-sm text-gray-400 mt-1">Welcome back, Admin! Here's what's happening.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReservations}
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:bg-black/60 hover:border-[#ccff00]/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              to="/admin/data"
              className="px-4 py-2 bg-[#ccff00] text-black rounded-lg text-sm font-medium hover:bg-[#ccff00]/90 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              See More Analytics
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Reservations', value: stats.totalReservations, icon: Calendar, change: '+12%' },
            { label: 'Pending', value: stats.pending, icon: Clock, change: 'Require action' },
            { label: 'Total Clients', value: stats.totalClients, icon: Users, change: '+5 new' },
            { label: 'Total Images', value: stats.totalImages, icon: ImageIcon, change: '+24 uploads' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-[#ccff00]/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-[#ccff00] mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-[#ccff00]/10 rounded-lg border border-[#ccff00]/20">
                  <stat.icon className="w-5 h-5 text-[#ccff00]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart + Quick Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-black/40 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Reservations by Service</h3>
              <Link
                to="/admin/data"
                className="text-sm text-[#ccff00] hover:text-[#ccff00]/80 flex items-center gap-1"
              >
                Detailed Analytics
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="h-64 w-full">
              {serviceStats.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 border border-white/10 rounded-xl p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#ccff00]" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-bold text-[#ccff00]">{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-bold text-yellow-400">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span className="text-sm">Cancelled</span>
                </div>
                <span className="font-bold text-rose-400">{stats.cancelled}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#ccff00]" />
                  <span className="text-sm">Estimated Revenue</span>
                </div>
                <span className="font-bold text-[#ccff00]">${stats.revenue.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Link
                  to="/admin/reservations"
                  className="block w-full px-4 py-3 bg-[#ccff00]/10 text-[#ccff00] rounded-lg hover:bg-[#ccff00]/20 transition-colors text-sm flex items-center gap-3"
                >
                  <Eye className="w-4 h-4" />
                  Review pending reservations
                </Link>
                <Link
                  to="/admin/images"
                  className="block w-full px-4 py-3 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors text-sm flex items-center gap-3"
                >
                  <Upload className="w-4 h-4" />
                  Upload new images
                </Link>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center gap-3"
                >
                  <Eye className="w-4 h-4" />
                  View public website
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/40 border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Reservations</h3>
              <p className="text-sm text-gray-400">Latest booking requests</p>
            </div>
            <Link
              to="/admin/reservations"
              className="text-sm text-[#ccff00] hover:text-[#ccff00]/80 flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {recentReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-[#ccff00]/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ccff00]/20 to-[#ccff00]/5 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] font-bold text-sm flex-shrink-0">
                      {reservation.team.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-white truncate">{reservation.team}</h4>
                      <p className="text-xs text-gray-400 truncate">
                        {reservation.user} • {formatDate(reservation.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;