import { useState, useEffect } from "react";
import { aboutService } from "../services/aboutService";

export default function About() {
  const [aboutData, setAboutData] = useState({
    title: "About Me",
    description: "",
    image: "",
    skills: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch about data on component mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await aboutService.get();
        
        // Handle both old and new data structures
        if (data) {
          setAboutData({
            title: data.title || "About Me",
            description: data.description || data.content || "",
            image: data.image || "",
            skills: data.skills || data.highlights || []
          });
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError("Failed to load about data. You can still edit and save.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      // Prepare data for backend
      const dataToSave = {
        title: aboutData.title,
        description: aboutData.description,
        image: aboutData.image,
        skills: aboutData.skills,
        updatedAt: new Date()
      };

      await aboutService.update(dataToSave);
      setSuccess("About section updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving about data:", err);
      setError(err.response?.data?.error || err.message || "Failed to save about data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSkillAdd = (skill) => {
    if (skill.trim() && !aboutData.skills.includes(skill.trim())) {
      setAboutData({
        ...aboutData,
        skills: [...aboutData.skills, skill.trim()]
      });
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setAboutData({
      ...aboutData,
      skills: aboutData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading about data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Section</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio about section content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Success/Error Messages */}
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

      {/* Content Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={6}
              value={aboutData.description}
              onChange={(e) => setAboutData({...aboutData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              value={aboutData.image}
              onChange={(e) => setAboutData({...aboutData, image: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {aboutData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSkillAdd(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{aboutData.title}</h2>
          <p className="text-gray-600 leading-relaxed">{aboutData.description}</p>
          {aboutData.image && (
            <img
              src={aboutData.image}
              alt="Profile"
              className="w-32 h-32 rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
