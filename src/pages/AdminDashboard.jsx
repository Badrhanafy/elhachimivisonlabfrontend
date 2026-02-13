import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { ChartBarIcon, Copy } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Reservations', value: '124', icon: CalendarDaysIcon, color: 'bg-blue-500', href: '/admin/reservations' },
    { name: 'Pending Reservations', value: '12', icon: ClockIcon, color: 'bg-yellow-500', href: '/admin/reservations?status=pending' },
    { name: 'Confirmed Reservations', value: '89', icon: CheckCircleIcon, color: 'bg-green-500', href: '/admin/reservations?status=confirmed' },
    { name: 'Total Images', value: '1,248', icon: PhotoIcon, color: 'bg-purple-500', href: '/admin/images' },
    { name: 'Active Users', value: '56', icon: UserGroupIcon, color: 'bg-pink-500', href: '/admin/users' },
    { name: 'Revenue', value: '$12,480', icon: CurrencyDollarIcon, color: 'bg-emerald-500', href: '/admin/reports' },
  ];

  const recentReservations = [
    { id: 1, team: 'Real Madrid', stadium: 'Santiago Bernabéu', date: '2024-02-15', status: 'confirmed', service: 'Shooting Analysis' },
    { id: 2, team: 'FC Barcelona', stadium: 'Camp Nou', date: '2024-02-14', status: 'pending', service: 'Video Analysis' },
    { id: 3, team: 'Manchester United', stadium: 'Old Trafford', date: '2024-02-13', status: 'completed', service: 'Shooting Analysis' },
    { id: 4, team: 'Bayern Munich', stadium: 'Allianz Arena', date: '2024-02-12', status: 'confirmed', service: 'Performance Analysis' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-600">Welcome to VisionLab Admin Panel. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Reservations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentReservations.map((reservation) => (
              <div key={reservation.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      <Link to={`/admin/reservations/${reservation.id}`}>
                        {reservation.team}
                      </Link>
                    </p>
                    <p className="text-sm text-gray-500">{reservation.stadium}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {reservation.status}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">{reservation.date}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">{reservation.service}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Link
              to="/admin/reservations"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all reservations →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/reservations/new"
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <CalendarDaysIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">New Reservation</span>
              </Link>
              <Link
                to="/admin/images/upload"
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">Upload Images</span>
              </Link>
              <Link
                to="/admin/services"
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <Copy className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">Manage Services</span>
              </Link>
              <Link
                to="/admin/reports"
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <ChartBarIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">View Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;