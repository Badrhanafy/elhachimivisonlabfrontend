// components/admin/ReservationDetailsModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Trophy, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Save
} from 'lucide-react';
import { reservationAPI } from '../../services/api';

const ReservationDetailsModal = ({ reservation, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState(reservation.notes || '');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateStatus = async (newStatus) => {
    try {
      setIsLoading(true);
      await reservationAPI.update(reservation.id, { status: newStatus });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = async () => {
    try {
      setIsLoading(true);
      await reservationAPI.update(reservation.id, { notes });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Reservation Details</h3>
                <p className="text-gray-500">ID: #{reservation.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Client Info */}
              <div className="space-y-6">
                {/* Client Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Client Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{reservation.user?.name || 'Guest'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {reservation.user?.email || 'No email provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {reservation.user?.phone || 'No phone provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Service Details</h4>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${reservation.service?.type === 'shooting' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {reservation.service?.type === 'shooting' ? '🎥' : '📊'}
                    </div>
                    <div>
                      <p className="font-medium">{reservation.service?.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{reservation.service?.type} Session</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Session Info */}
              <div className="space-y-6">
                {/* Session Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Session Information</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(reservation.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stadium</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {reservation.stadium}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Team</p>
                      <p className="font-medium flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {reservation.team}
                      </p>
                    </div>
                    {reservation.opponent && (
                      <div>
                        <p className="text-sm text-gray-500">Opponent</p>
                        <p className="font-medium flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-gray-400" />
                          {reservation.opponent}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(status)}
                        disabled={isLoading || reservation.status === status}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          reservation.status === status
                            ? status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Notes
                </h4>
                {isEditing ? (
                  <button
                    onClick={saveNotes}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Notes'}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Notes
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add notes about this reservation..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {notes || 'No notes added yet.'}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReservationDetailsModal;