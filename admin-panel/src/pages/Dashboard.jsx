import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { projectService, blogService, skillService, testimonialService, activityService } from "../services";
import { useSocket } from "../context/SocketContext";
import { formatRelativeTime } from "../utils/formatTime";

export default function Dashboard() {
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { name: 'Total Projects', value: '0', icon: '📁', color: 'bg-blue-500', loading: true, key: 'project' },
    { name: 'Blog Posts', value: '0', icon: '📝', color: 'bg-green-500', loading: true, key: 'blog' },
    { name: 'Skills', value: '0', icon: '🛠️', color: 'bg-purple-500', loading: true, key: 'skill' },
    { name: 'Testimonials', value: '0', icon: '💬', color: 'bg-yellow-500', loading: true, key: 'testimonial' },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Helper function to update a specific stat
  const updateStat = useCallback((modelKey, count) => {
    setStats(prevStats => 
      prevStats.map(stat => 
        stat.key === modelKey 
          ? { ...stat, value: count.toString(), loading: false }
          : stat
      )
    );
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivities();
    
    // Update relative time every minute
    const timeInterval = setInterval(() => {
      // Force re-render to update relative times
      setActivities(prev => [...prev]);
    }, 60000); // Update every minute
    
    return () => clearInterval(timeInterval);
  }, []);

  // Listen to socket events for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleCountUpdate = (data) => {
      const { model, count } = data;
      // The backend already maps to the correct key (project, blog, skill, testimonial)
      if (model && typeof count === 'number') {
        updateStat(model, count);
      }
    };

    const handleNewActivity = (activity) => {
      // Add new activity to the beginning of the list
      setActivities(prev => {
        // Check if activity already exists (prevent duplicates)
        const exists = prev.some(a => a._id === activity._id);
        if (exists) return prev;
        
        // Add new activity and limit to 10 most recent
        return [activity, ...prev].slice(0, 10);
      });
    };

    socket.on("count-update", handleCountUpdate);
    socket.on("new-activity", handleNewActivity);

    return () => {
      socket.off("count-update", handleCountUpdate);
      socket.off("new-activity", handleNewActivity);
    };
  }, [socket, updateStat]);

  const fetchStats = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      }
      
      // Fetch all data in parallel
      const [projectsData, blogsData, skillsData, testimonialsData] = await Promise.all([
        projectService.getAll().catch(() => ({ items: [], total: 0 })),
        blogService.getAll().catch(() => ({ items: [], total: 0 })),
        skillService.getAll().catch(() => ({ items: [], total: 0 })),
        testimonialService.getAll().catch(() => ({ items: [], total: 0 })),
      ]);

      // Helper function to get count from response (handles both array and paginated responses)
      const getCount = (data) => {
        if (Array.isArray(data)) {
          return data.length;
        }
        if (data?.total !== undefined) {
          return data.total;
        }
        if (data?.items && Array.isArray(data.items)) {
          return data.items.length;
        }
        return 0;
      };

      // Update stats with real counts
      setStats([
        { name: 'Total Projects', value: getCount(projectsData).toString(), icon: '📁', color: 'bg-blue-500', loading: false },
        { name: 'Blog Posts', value: getCount(blogsData).toString(), icon: '📝', color: 'bg-green-500', loading: false },
        { name: 'Skills', value: getCount(skillsData).toString(), icon: '🛠️', color: 'bg-purple-500', loading: false },
        { name: 'Testimonials', value: getCount(testimonialsData).toString(), icon: '💬', color: 'bg-yellow-500', loading: false },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set all to 0 on error
      setStats([
        { name: 'Total Projects', value: '0', icon: '📁', color: 'bg-blue-500', loading: false },
        { name: 'Blog Posts', value: '0', icon: '📝', color: 'bg-green-500', loading: false },
        { name: 'Skills', value: '0', icon: '🛠️', color: 'bg-purple-500', loading: false },
        { name: 'Testimonials', value: '0', icon: '💬', color: 'bg-yellow-500', loading: false },
      ]);
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      }
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const data = await activityService.getRecent(10);
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Helper function to get activity type color
  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'create':
        return 'bg-green-500';
      case 'update':
        return 'bg-blue-500';
      case 'delete':
        return 'bg-red-500';
      case 'publish':
        return 'bg-purple-500';
      case 'unpublish':
        return 'bg-yellow-500';
      case 'upload':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-blue-100">
          Here's what's happening with your portfolio today.
        </p>
            {isConnected && (
              <p className="text-blue-200 text-sm mt-1 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Real-time updates active
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isConnected && (
              <span className="text-yellow-200 text-sm flex items-center mr-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Connecting...
              </span>
            )}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh stats"
            >
              <svg 
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>
                {stat.icon}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                {stat.loading ? (
                  <div className="flex items-center mt-1">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button
              onClick={fetchActivities}
              disabled={activitiesLoading}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
              title="Refresh activities"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No activities yet</p>
                <p className="text-xs mt-1">Activities will appear here as you make changes</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity._id || activity.id} className="flex items-center space-x-3 animate-fade-in">
                  <div className={`w-2 h-2 rounded-full ${getActivityTypeColor(activity.type)}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate("/dashboard/blog?action=create")}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all text-left group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
              <div className="text-sm font-medium text-gray-900">New Blog Post</div>
              <div className="text-xs text-gray-500 mt-1">Create a new blog post</div>
            </button>
            <button 
              onClick={() => navigate("/dashboard/projects?action=create")}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all text-left group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📁</div>
              <div className="text-sm font-medium text-gray-900">Add Project</div>
              <div className="text-xs text-gray-500 mt-1">Add a new project</div>
            </button>
            <button 
              onClick={() => navigate("/dashboard/skills")}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all text-left group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🛠️</div>
              <div className="text-sm font-medium text-gray-900">Update Skills</div>
              <div className="text-xs text-gray-500 mt-1">Manage your skills</div>
            </button>
            <button 
              onClick={() => navigate("/dashboard/media")}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all text-left group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🖼️</div>
              <div className="text-sm font-medium text-gray-900">Upload Media</div>
              <div className="text-xs text-gray-500 mt-1">Upload images and files</div>
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Portfolio Preview</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Live Site →
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </div>
          <p className="text-gray-600">Portfolio preview will appear here</p>
          <p className="text-sm text-gray-500 mt-1">Connect your portfolio to see live preview</p>
        </div>
      </div>
    </div>
  );
}