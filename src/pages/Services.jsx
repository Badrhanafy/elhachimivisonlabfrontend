import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { serviceAPI } from '../services/api';
import ServiceForm from '../components/services/ServiceForm';
import ConfirmModal from '../components/common/ConfirmModal';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      await serviceAPI.delete(serviceToDelete.id);
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingService) {
        await serviceAPI.update(editingService.id, data);
        const updated = services.map(s => 
          s.id === editingService.id ? { ...s, ...data } : s
        );
        setServices(updated);
      } else {
        const response = await serviceAPI.create(data);
        setServices([...services, response.data]);
      }
      setShowForm(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="card group hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                  <span className={`badge badge-${service.type}`}>
                    {service.type}
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(service.price)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              
              <div className="flex justify-between items-center">
                <Link
                  to={`/services/${service.id}/reservations`}
                  className="text-sm text-gray-500 hover:text-black flex items-center space-x-1"
                >
                  <FiEye />
                  <span>View Reservations</span>
                </Link>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-500 hover:text-black"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => setServiceToDelete(service)}
                    className="p-2 text-gray-500 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <ConfirmModal
          title="Delete Service"
          message={`Are you sure you want to delete "${serviceToDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setServiceToDelete(null)}
        />
      )}
    </div>
  );
};

export default Services;