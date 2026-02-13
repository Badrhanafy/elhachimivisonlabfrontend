import React from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    pending: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: ClockIcon,
      label: 'Pending'
    },
    confirmed: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: CheckCircleIcon,
      label: 'Confirmed'
    },
    completed: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: CalendarIcon,
      label: 'Completed'
    },
    cancelled: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: XCircleIcon,
      label: 'Cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}>
      <Icon className="mr-1.5 h-4 w-4" />
      {config.label}
    </span>
  );
};

export default StatusBadge;