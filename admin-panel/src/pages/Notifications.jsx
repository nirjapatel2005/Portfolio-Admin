import { useEffect, useState } from "react";
import { contactService } from "../services";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState("");

  const queryId = new URLSearchParams(window.location.search).get("id");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setItems(data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      setMarking(id);
      await contactService.markRead(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to mark as read");
    } finally {
      setMarking("");
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "Unknown time";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">View and manage contact messages.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-6">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-500">
          No notifications yet.
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
          <div className="space-y-4">
            {items.map((n) => {
              const isHighlighted = queryId && (n._id === queryId || n.id === queryId);
              return (
                <div
                  key={n._id}
                  className={`relative md:pl-14`}
                >
                  <div className="absolute left-4 top-5 hidden md:block">
                    <div
                      className={`w-3 h-3 rounded-full border-4 border-white shadow-sm ${
                        !n.isRead ? "bg-blue-600" : "bg-gray-300"
                      } ${isHighlighted ? "ring-2 ring-blue-500" : ""}`}
                    />
                  </div>

                  <div
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5 transition ${
                      !n.isRead ? "bg-blue-50" : "bg-white"
                    } ${isHighlighted ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <span className="text-blue-600">🔔</span>
                          <span>{n.subject || "New contact message"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-gray-500">👤</span>
                          <span className="font-medium">{n.name || "Unknown sender"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 break-all">
                          <span className="text-gray-500">📧</span>
                          <span>{n.email || "No email provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="text-gray-500">🗓️</span>
                          <span>{formatDate(n.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start">
                        {!n.isRead && (
                          <button
                            disabled={marking === n._id}
                            onClick={() => markRead(n._id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                          >
                            {marking === n._id ? "Marking..." : "Mark as read"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-gray-800 leading-relaxed text-sm whitespace-pre-wrap border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-gray-700 mb-2 text-sm">
                        <span className="text-gray-500">💬</span>
                        <span className="font-medium">Message</span>
                      </div>
                      <p>{n.message || "No message provided."}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

