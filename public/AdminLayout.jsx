import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  CalendarIcon,
  PhotoIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // New state for collapse on desktop
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Reservations', href: '/admin/reservations', icon: CalendarIcon },
    { name: 'Images', href: '/admin/images', icon: PhotoIcon },
    { name: 'Services', href: '/admin/services', icon: ClipboardDocumentCheckIcon },
  ];

  const isActive = (path) => location.pathname === path;

  // Toggle collapse on desktop
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 max-w-full">
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-black pt-5 pb-4">
            <div className="flex items-center justify-between px-6">
              <h1 className="text-2xl font-bold text-[#B8E601]">VisionLab Admin</h1>
              <button
                type="button"
                className="ml-2 rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8 px-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium ${
                        isActive(item.href)
                          ? 'bg-[#B8E601] text-black'
                          : 'text-gray-300 hover:bg-[#B8E601]/20 hover:text-[#B8E601]'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto border-t border-gray-800 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-300">Admin User</p>
                  <p className="text-xs text-gray-500">admin@visionlab.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - collapsible */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-black transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        }`}
      >
        <div className="flex flex-1 flex-col border-r border-gray-800 bg-black pt-5">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4">
           <div className="flex items-center justify-between px-4">
  <div className="flex items-center justify-center w-full">
    <img
      src={sidebarCollapsed ? "/logo2.png" : "/logo1.png"}
      alt="Logo"
      className={`transition-all duration-300 ${
        sidebarCollapsed ? "h-10 w-10" : "h-12 object-contain"
      }`}
    />
  </div>

  <button
    onClick={toggleSidebar}
    className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-[#B8E601] transition-colors"
  >
    {sidebarCollapsed ? (
      <ChevronRightIcon className="h-5 w-5" />
    ) : (
      <ChevronLeftIcon className="h-5 w-5" />
    )}
  </button>
</div>
            </div>

            <nav className="mt-8 flex-1 space-y-2 px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#B8E601] text-black'
                      : 'text-gray-400 hover:bg-[#B8E601]/20 hover:text-[#B8E601]'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 border-t border-gray-800 p-4">
            {!sidebarCollapsed ? (
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-300">Admin User</p>
                  <p className="text-xs text-gray-500">admin@visionlab.com</p>
                </div>
              </div>
            ) : (
              <div className="w-full text-center text-gray-400">
                <UserGroupIcon className="h-6 w-6 mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-black/90 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-x-4">
            <div className="relative w-64">
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg border border-gray-800 bg-black/50 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#B8E601] focus:outline-none focus:ring-1 focus:ring-[#B8E601]"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;