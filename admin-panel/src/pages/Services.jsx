import { useEffect, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "../components/Modal";
import { serviceService } from "../services/serviceService";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    order: 0
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAll();
      // Handle paginated response structure { items, page, limit, total }
      const servicesList = Array.isArray(data) ? data : (data?.items || []);
      // Sort by order
      setServices(servicesList.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      icon: "",
      order: services.length
    });
    setShowModal(true);
    setError("");
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      order: service.order || 0
    });
    setShowModal(true);
    setError("");
  };

  const requestDelete = (id) => setConfirmState({ open: true, id });

  const handleDelete = async () => {
    if (!confirmState.id) return;
    try {
      setConfirmLoading(true);
      await serviceService.delete(confirmState.id);
      setSuccess("Service deleted successfully");
      fetchServices();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting service:", err);
      setError(err.response?.data?.error || "Failed to delete service");
    } finally {
      setConfirmLoading(false);
      setConfirmState({ open: false, id: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      if (editingService) {
        await serviceService.update(editingService._id, formData);
        setSuccess("Service updated successfully");
      } else {
        await serviceService.create(formData);
        setSuccess("Service added successfully");
      }

      setShowModal(false);
      fetchServices();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving service:", err);
      setError(err.response?.data?.error || err.message || "Failed to save service");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Add and update services you offer</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Service</span>
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No services yet. Add your first service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {service.icon ? (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                    {service.order !== undefined && (
                      <p className="text-xs text-gray-500">Order: {service.order}</p>
                    )}
                  </div>
                </div>
              </div>
              {service.description && (
                <p className="text-gray-600 mb-4">{service.description}</p>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => requestDelete(service._id)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{services.length}</div>
          <div className="text-gray-600 text-sm">Total Services</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {services.filter(s => s.icon).length}
          </div>
          <div className="text-gray-600 text-sm">With Icons</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {services.filter(s => s.description).length}
          </div>
          <div className="text-gray-600 text-sm">With Descriptions</div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingService ? "Edit Service" : "Add Service"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                <input
                  type="url"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/icon.svg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded">
                  {error}
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {editingService ? "Update" : "Add"} Service
                </button>
              </div>
            </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmState.open}
        title="Delete this service?"
        description="Clients will no longer see this service on the site."
        confirmLabel={confirmLoading ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
        tone="danger"
      />
    </div>
  );
}
