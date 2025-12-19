import React from "react";

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  tone = "danger", // danger | info
}) {
  if (!isOpen) return null;

  const tones = {
    danger: {
      iconColor: "text-red-600",
      badgeBg: "bg-red-100",
      badgeText: "text-red-800",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    info: {
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  };

  const palette = tones[tone] || tones.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md transform transition-all duration-200 scale-100 animate-[fadeIn_120ms_ease-out]">
        <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center space-x-3 px-5 py-4 border-b border-gray-100">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${palette.badgeBg}`}>
              {tone === "danger" ? (
                <svg className={`w-6 h-6 ${palette.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856C18.403 19 19 18.403 19 17.694V6.306C19 5.597 18.403 5 17.694 5H6.306C5.597 5 5 5.597 5 6.306v11.388C5 18.403 5.597 19 6.306 19z" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${palette.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
            </div>
          </div>

          <div className="px-5 py-4 flex justify-end space-x-3 bg-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${palette.button}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

