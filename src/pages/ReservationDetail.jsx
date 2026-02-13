import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  PhotoIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  LinkIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import StatusBadge from '../components/Reservations/StatusBadge';
import ImageGallery from '../components/Images/ImageGallery';
import EditReservationModal from '../components/Reservations/EditReservationModal';
import UploadImageModal from '../components/Images/UploadImageModal';

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    fetchReservationDetails();
  }, [id]);

  const fetchReservationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/reservations/${id}`);
      if (!response.ok) {
        throw new Error('Reservation not found');
      }
      const data = await response.json();
      setReservation(data);
      
      // Fetch status history (you'll need to implement this endpoint)
      // const historyResponse = await fetch(`/api/admin/reservations/${id}/history`);
      // const historyData = await historyResponse.json();
      // setStatusHistory(historyData);
      
      setStatusHistory([
        { status: 'pending', changed_at: data.created_at, changed_by: 'System' },
        { status: 'confirmed', changed_at: new Date(Date.now() - 86400000).toISOString(), changed_by: 'Admin' },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        fetchReservationDetails();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/reservations/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          navigate('/admin/reservations');
        }
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate('/admin/reservations')}
                className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Reservations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', name: 'Details', icon: DocumentTextIcon },
    { id: 'images', name: 'Images', icon: PhotoIcon, count: reservation?.images?.length || 0 },
    { id: 'history', name: 'History', icon: ClockIcon },
    { id: 'notes', name: 'Notes', icon: TagIcon },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/reservations')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Reservation #{reservation?.id}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {reservation?.team} vs {reservation?.opponent || 'Opponent'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <StatusBadge status={reservation?.status} />
              <p className="mt-1 text-xs text-gray-500">
                Created {formatDateTime(reservation?.created_at)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status Actions */}
      <div className="mb-6">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleUpdateStatus(status)}
                disabled={reservation?.status === status}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                  reservation?.status === status
                    ? 'bg-blue-100 text-blue-800 cursor-default'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-300'
                }`}
              >
                {status === 'confirmed' && <CheckCircleIcon className="mr-2 h-4 w-4" />}
                {status === 'cancelled' && <XCircleIcon className="mr-2 h-4 w-4" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
              {tab.count !== undefined && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Reservation Info Card */}
              <div className="rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Reservation Information</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Event Details</h4>
                      <dl className="space-y-4">
                        <div className="flex items-start">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Date & Time</dt>
                            <dd className="text-sm text-gray-600">{formatDate(reservation?.date)}</dd>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Stadium</dt>
                            <dd className="text-sm text-gray-600">{reservation?.stadium}</dd>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <TagIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Service Type</dt>
                            <dd className="text-sm text-gray-600 capitalize">{reservation?.service?.type}</dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Team Information</h4>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-900">Team</dt>
                          <dd className="text-sm text-gray-600">{reservation?.team}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-900">Opponent</dt>
                          <dd className="text-sm text-gray-600">{reservation?.opponent || 'Not specified'}</dd>
                        </div>
                        {reservation?.service && (
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Service Price</dt>
                            <dd className="text-sm text-gray-600">${reservation.service.base_price}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{reservation?.user?.name}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          {reservation?.user?.email}
                        </div>
                        {reservation?.user?.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            {reservation?.user?.phone}
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/admin/users/${reservation?.user?.id}`}
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View customer profile
                          <LinkIcon className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div>
              <div className="mb-6 rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Images ({reservation?.images?.length || 0})
                  </h3>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
                    Upload Images
                  </button>
                </div>
                <div className="p-6">
                  {reservation?.images && reservation.images.length > 0 ? (
                    <ImageGallery 
                      images={reservation.images}
                      reservationId={reservation.id}
                      onImageUpload={fetchReservationDetails}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No images uploaded</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Upload match analysis images for this reservation.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => setIsUploadModalOpen(true)}
                          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                          <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
                          Upload Images
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="rounded-lg bg-white shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Status History</h3>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-4">
                  {statusHistory.map((history, index) => (
                    <li key={index} className="relative pb-4">
                      {index < statusHistory.length - 1 && (
                        <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                      )}
                      <div className="relative flex items-start">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          history.status === 'confirmed' ? 'bg-green-100' :
                          history.status === 'cancelled' ? 'bg-red-100' :
                          history.status === 'completed' ? 'bg-blue-100' :
                          'bg-yellow-100'
                        }`}>
                          {history.status === 'confirmed' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                          {history.status === 'cancelled' && <XCircleIcon className="h-5 w-5 text-red-600" />}
                          {history.status === 'pending' && <ClockIcon className="h-5 w-5 text-yellow-600" />}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              Status changed to {history.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDateTime(history.changed_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Changed by {history.changed_by}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="rounded-lg bg-white shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notes</h3>
              </div>
              <div className="px-6 py-4">
                {reservation?.notes ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-600">
                      {reservation.notes}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No notes added for this reservation.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-lg bg-white shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
              >
                <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
                Upload Images
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Details
              </button>
              <button className="flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <EnvelopeIcon className="mr-2 h-4 w-4" />
                Send Email
              </button>
            </div>
          </div>

          {/* Reservation Stats */}
          <div className="rounded-lg bg-white shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Reservation Stats</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Days until event</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {Math.ceil((new Date(reservation?.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Images uploaded</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {reservation?.images?.length || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Service type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{reservation?.service?.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDateTime(reservation?.created_at)}
                </dd>
              </div>
            </div>
          </div>

          {/* Service Details */}
          {reservation?.service && (
            <div className="rounded-lg bg-white shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Service Details</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <p className="text-sm text-gray-900 capitalize">{reservation.service.type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Base Price</span>
                    <p className="text-sm text-gray-900">${reservation.service.base_price}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Description</span>
                    <p className="text-sm text-gray-900">{reservation.service.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditReservationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reservation={reservation}
        onSave={fetchReservationDetails}
      />

      <UploadImageModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        reservationId={reservation?.id}
        onUpload={fetchReservationDetails}
      />
    </div>
  );
};

export default ReservationDetail;