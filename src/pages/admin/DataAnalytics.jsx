// pages/admin/DataAnalytics.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  RefreshCw,
  Calendar,
  Download,
  ChevronDown,
  Loader2,
  DollarSign,
  Camera,
  Film,
  Target,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { reservationAPI } from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const DataAnalytics = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [serviceStats, setServiceStats] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalReservations: 0,
    totalRevenue: 0,
    uniqueServices: 0,
    averagePrice: 0
  });
  const [dateRange, setDateRange] = useState('all');

  const green = '#B8E601';
  const chartContainerRef = useRef(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    processServiceStats();
  }, [reservations, dateRange]);

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

  const filterByDateRange = (reservations) => {
    if (dateRange === 'all') return reservations;
    const now = new Date();
    const start = new Date();
    if (dateRange === 'week') {
      start.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      start.setMonth(now.getMonth() - 1);
    }
    return reservations.filter(r => {
      if (!r.date) return false;
      const date = new Date(r.date);
      return date >= start && date <= now;
    });
  };

  const processServiceStats = () => {
    const filtered = filterByDateRange(reservations);
    const serviceMap = new Map();

    filtered.forEach(res => {
      const service = res.service || {};
      const type = service.type || 'unknown';
      const name = service.name || 'Unknown';
      const price = parseFloat(service.base_price) || 0;

      if (!serviceMap.has(type)) {
        serviceMap.set(type, {
          type,
          name,
          count: 0,
          revenue: 0,
          color: getRandomGreenShade(type)
        });
      }
      const stat = serviceMap.get(type);
      stat.count += 1;
      stat.revenue += price;
    });

    const statsArray = Array.from(serviceMap.values()).sort((a, b) => b.count - a.count);
    setServiceStats(statsArray);

    const totalReservations = filtered.length;
    const totalRevenue = statsArray.reduce((sum, s) => sum + s.revenue, 0);
    const uniqueServices = statsArray.length;
    const averagePrice = uniqueServices > 0 ? totalRevenue / uniqueServices : 0;

    setTotalStats({
      totalReservations,
      totalRevenue,
      uniqueServices,
      averagePrice
    });
  };

  const getRandomGreenShade = (type) => {
    const hash = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const opacity = 0.3 + (hash % 7) * 0.1;
    return `rgba(184, 230, 1, ${opacity})`;
  };

  const getChartData = () => {
    const labels = serviceStats.map(s => s.name);
    const counts = serviceStats.map(s => s.count);
    const revenues = serviceStats.map(s => s.revenue);
    const backgroundColors = serviceStats.map(s => s.color);
    const borderColors = serviceStats.map(() => green);

    if (chartType === 'bar' || chartType === 'line') {
      return {
        labels,
        datasets: [
          {
            label: 'Number of Reservations',
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 8,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
            tension: 0.4,
            fill: chartType === 'line' ? false : undefined
          }
        ]
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: 'Revenue (Dhs)',
            data: revenues,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            hoverOffset: 4
          }
        ]
      };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartType === 'pie',
        position: 'bottom',
        labels: {
          color: '#9CA3AF',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: green,
        borderWidth: 1
      }
    },
    scales: chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#9CA3AF' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF', maxRotation: 45, minRotation: 30 }
      }
    } : {}
  };

  const lineOptions = {
    ...chartOptions,
    elements: { line: { tension: 0.4 } }
  };

  const renderChart = () => {
    const data = getChartData();
    if (chartType === 'bar') return <Bar data={data} options={chartOptions} />;
    if (chartType === 'pie') return <Pie data={data} options={chartOptions} />;
    if (chartType === 'line') return <Line data={data} options={lineOptions} />;
    return null;
  };

  const getServiceIcon = (type) => {
    if (type.includes('photo') || type === 'photography') return Camera;
    if (type.includes('video') || type === 'shooting' || type === 'analyse') return Film;
    return Target;
  };

  // Export / Print function
  const handleExport = () => {
    const chartCanvas = chartContainerRef.current?.querySelector('canvas');
    if (!chartCanvas) return;

    // Capture chart as image
    const chartImage = chartCanvas.toDataURL('image/png');

    // Generate stats cards HTML
    const statsCards = [
      { label: 'Total Reservations', value: totalStats.totalReservations },
      { label: 'Total Revenue', value: `Dhs ${totalStats.totalRevenue.toLocaleString()}` },
      { label: 'Service Types', value: totalStats.uniqueServices },
      { label: 'Avg Price/Service', value: ` Dhs ${totalStats.averagePrice.toFixed(2)}` }
    ];

    const statsHtml = statsCards.map(stat => `
      <div class="stat-card">
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
      </div>
    `).join('');

    // Generate table HTML
    const tableRows = serviceStats.map(stat => {
      const percentage = ((stat.count / totalStats.totalReservations) * 100).toFixed(1);
      return `
        <tr>
          <td>${stat.name}</td>
          <td>${stat.count}</td>
          <td>Dhs ${stat.revenue.toLocaleString()}</td>
          <td>${percentage}%</td>
        </tr>
      `;
    }).join('');

    const tableHtml = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Service Type</th>
            <th>Reservations</th>
            <th>Revenue</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    // Get logo URL (assuming logo is in public folder)
    const logoUrl = `${window.location.origin}/logo.png`; // adjust path if needed

    // Build full HTML document
    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Analytics Report - El Hachimi Vision Lab</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: white;
              color: #111;
              margin: 0;
              padding: 20px;
            }
            .report-container {
              max-width: 1200px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              align-items: center;
              gap: 20px;
              margin-bottom: 30px;
              border-bottom: 2px solid #B8E601;
              padding-bottom: 20px;
            }
            .logo {
              height: 60px;
              width: auto;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              color: #000;
            }
            .header p {
              margin: 5px 0 0;
              color: #666;
              font-size: 14px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin: 30px 0;
            }
            .stat-card {
              background: #f5f5f5;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            .stat-label {
              font-size: 12px;
              text-transform: uppercase;
              color: #666;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #B8E601;
            }
            .chart {
              margin: 30px 0;
              text-align: center;
            }
            .chart img {
              max-width: 100%;
              height: auto;
              border: 1px solid #eee;
              border-radius: 8px;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 30px;
            }
            .data-table th {
              background: #f0f0f0;
              padding: 10px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
              color: #B8E601;
              border-bottom: 2px solid #B8E601;
            }
            .data-table td {
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            .data-table tr:last-child td {
              border-bottom: none;
            }
            @media print {
              body { background: white; }
              .stat-card { background: #f9f9f9; }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="header">
              <img src="${logoUrl}" alt="Logo" class="logo" onerror="this.style.display='none'" />
              <div>
                <h1>Service Analytics Report</h1>
                <p>Generated on ${new Date().toLocaleDateString()} • ${dateRange === 'all' ? 'All Time' : dateRange === 'month' ? 'Last Month' : 'Last Week'}</p>
              </div>
            </div>

            <div class="stats-grid">
              ${statsHtml}
            </div>

            <div class="chart">
              <img src="${chartImage}" alt="Analytics Chart" />
            </div>

            <h2 style="margin-top: 30px;">Service Type Breakdown</h2>
            ${tableHtml}
          </div>
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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
            <h1 className="text-3xl font-semibold tracking-tight text-white">Service Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Reservations breakdown by service type</p>
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
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  chartType === 'bar' ? 'bg-[#B8E601] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Bar</span>
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  chartType === 'pie' ? 'bg-[#B8E601] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span className="text-sm">Pie</span>
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  chartType === 'line' ? 'bg-[#B8E601] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Line</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Reservations', value: totalStats.totalReservations, icon: Users },
            { label: 'Total Revenue', value: `Dhs ${totalStats.totalRevenue.toLocaleString()}`, icon: DollarSign },
            { label: 'Service Types', value: totalStats.uniqueServices, icon: Activity },
            { label: 'Avg Price/Service', value: `Dhs ${totalStats.averagePrice.toFixed(2)}`, icon: TrendingUp }
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
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white appearance-none cursor-pointer focus:border-[#B8E601]/50 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="month">Last Month</option>
                <option value="week">Last Week</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:bg-black/60 hover:border-[#B8E601]/30 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="text-sm text-gray-400">
            Showing {totalStats.totalReservations} reservations across {totalStats.uniqueServices} service types
          </div>
        </div>

        {/* Chart Area with ref */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-black/40 border border-white/10 rounded-xl">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-gray-700 border-t-[#B8E601] rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-sm text-gray-400">Loading analytics...</p>
          </div>
        ) : serviceStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 bg-black/40 border border-white/10 rounded-xl">
            <BarChart3 className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No data available</h3>
            <p className="text-sm text-gray-400">No reservations found for the selected period</p>
          </div>
        ) : (
          <motion.div
            ref={chartContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 border border-white/10 rounded-xl p-6"
          >
            <div className="h-96 w-full">
              {renderChart()}
            </div>
          </motion.div>
        )}

        {/* Service Breakdown Table */}
        {serviceStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 border border-white/10 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Service Type Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/60 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Service Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Reservations</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase tracking-wider">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {serviceStats.map((stat) => {
                    const Icon = getServiceIcon(stat.type);
                    const percentage = ((stat.count / totalStats.totalReservations) * 100).toFixed(1);
                    return (
                      <motion.tr
                        key={stat.type}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-[#B8E601]/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#B8E601]/10 border border-[#B8E601]/30 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#B8E601]" />
                            </div>
                            <div>
                              <div className="font-medium text-white capitalize">{stat.name}</div>
                              <div className="text-xs text-gray-400">{stat.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">{stat.count}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">${stat.revenue.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#B8E601] rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{percentage}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DataAnalytics;