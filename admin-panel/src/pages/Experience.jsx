import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { experienceService } from "../services/experienceService";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    location: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceService.getAll();
      // Handle paginated response structure { items, page, limit, total }
      setExperiences(Array.isArray(data) ? data : (data?.items || []));
    } catch (err) {
      console.error("Error fetching experiences:", err);
      setError("Failed to load experiences");
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingExp(null);
    setFormData({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: ""
    });
    setShowModal(true);
    setError("");
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      title: exp.title || "",
      company: exp.company || "",
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
      current: exp.current || false,
      location: exp.location || "",
      description: exp.description || ""
    });
    setShowModal(true);
    setError("");
  };

  const requestDelete = (id) => setConfirmState({ open: true, id });

  const handleDelete = async () => {
    if (!confirmState.id) return;
    try {
      setConfirmLoading(true);
      await experienceService.delete(confirmState.id);
      setSuccess("Experience deleted successfully");
      fetchExperiences();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting experience:", err);
      setError(err.response?.data?.error || "Failed to delete experience");
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

      const dataToSave = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.current ? null : (formData.endDate ? new Date(formData.endDate) : null)
      };

      if (editingExp) {
        await experienceService.update(editingExp._id, dataToSave);
        setSuccess("Experience updated successfully");
      } else {
        await experienceService.create(dataToSave);
        setSuccess("Experience added successfully");
      }

      setShowModal(false);
      fetchExperiences();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving experience:", err);
      setError(err.response?.data?.error || err.message || "Failed to save experience");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Experience</h1>
          <p className="text-gray-600 mt-1">Manage your professional work history</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Experience</span>
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

      {/* Experience Timeline */}
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No experiences yet. Add your first experience!</p>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <div key={exp._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                    {exp.current && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    {exp.company && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">{exp.company}</span>
                      </div>
                    )}
                    {(exp.startDate || exp.endDate) && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ""}
                          {exp.endDate ? ` - ${new Date(exp.endDate).toLocaleDateString()}` : exp.current ? " - Present" : ""}
                        </span>
                      </div>
                    )}
                    {exp.location && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => requestDelete(exp._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {index < experiences.length - 1 && (
                <div className="flex justify-center mt-6">
                  <div className="w-px h-8 bg-gray-200"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{experiences.length}</div>
          <div className="text-gray-600 text-sm">Total Positions</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {experiences.filter(e => e.current).length}
          </div>
          <div className="text-gray-600 text-sm">Current Positions</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {[...new Set(experiences.map(exp => exp.company))].length}
          </div>
          <div className="text-gray-600 text-sm">Companies</div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingExp ? "Edit Experience" : "Add Experience"}
        maxWidth="max-w-2xl"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    disabled={formData.current}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData({...formData, current: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="current" className="text-sm font-medium text-gray-700">
                  Currently working here
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                  {editingExp ? "Update" : "Add"} Experience
                </button>
              </div>
            </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmState.open}
        title="Delete this experience?"
        description="This experience entry will be permanently removed."
        confirmLabel={confirmLoading ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
        tone="danger"
      />
    </div>
  );
}
