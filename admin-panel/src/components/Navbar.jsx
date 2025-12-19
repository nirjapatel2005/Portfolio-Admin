import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { contactService } from "../services";
import ConfirmDialog from "./ConfirmDialog";

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await contactService.getAll();
      const list = data || [];
      const unread = list.filter((n) => !n.isRead);
      // Store unread (limit 5 in dropdown)
      setNotifications(unread.slice(0, 5));
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleCountUpdate = (data) => {
      if (data.model === "contact") {
        fetchNotifications();
      }
    };
    socket.on("count-update", handleCountUpdate);
    return () => socket.off("count-update", handleCountUpdate);
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      await contactService.markRead(id);
      fetchNotifications();
      navigate(`/dashboard/notifications?id=${id}`);
      setShowNotifications(false);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className={`fixed top-0 ${sidebarOpen ? 'left-64' : 'left-16'} right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-40 transition-all duration-300`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((s) => !s)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            title="Notifications"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Notifications</span>
                <span className="text-xs text-gray-500">{unreadCount} unread</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">No unread notifications</div>
                )}
                {notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors bg-blue-50"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">{n.subject || 'New contact message'}</p>
                    <p className="text-xs text-gray-600 truncate">From: {n.name} ({n.email})</p>
                    <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100">
                <button
                  onClick={() => { setShowNotifications(false); navigate("/dashboard/notifications"); }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 font-medium"
                >
                  View notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.name || "Admin User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">{user?.name || "Admin User"}</p>
                <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
              </div>
              <button 
                onClick={() => {
                  navigate("/dashboard/account-settings");
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Account Settings
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Logout from admin?"
        description="You will need to sign in again to access the dashboard."
        confirmLabel="Logout"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </header>
  );
}
