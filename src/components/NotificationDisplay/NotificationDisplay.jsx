import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fcmService from "../../fcm-service";

const NotificationDisplay = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  useEffect(() => {
    console.log("NotificationDisplay mounted");

    const handleNewNotification = (notificationData) => {
      console.log("New notification received in Display:", notificationData);
      setNotifications((prev) => [notificationData, ...prev.slice(0, 9)]);
    };

    if (fcmService.addNotificationCallback) {
      fcmService.addNotificationCallback(handleNewNotification);
    } else {
      console.error("FCM service doesn't have addNotificationCallback method");
    }

    return () => {
      if (fcmService.removeNotificationCallback) {
        fcmService.removeNotificationCallback(handleNewNotification);
      }
    };
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Notification Bell Icon */}
      {unreadCount != 0 && (
        <div
          className="fixed top-20 right-4 z-[9999]"
          style={{
            position: "fixed",
            top: "80px",
            right: "16px",
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <motion.button
            onClick={() => {
              console.log("Notification bell clicked");
              setShowNotificationCenter(!showNotificationCenter);
            }}
            className="relative p-3 bg-white rounded-full shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: "2px solid #ddd6fe",
            }}
          >
            <svg
              className="w-6 h-6 text-[#3b003b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                style={{
                  backgroundColor: "#ef4444",
                  minWidth: "20px",
                  height: "20px",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.div>
            )}
          </motion.button>
        </div>
      )}

      {/* Backdrop */}
      <AnimatePresence>
        {showNotificationCenter && (
          <div
            className="fixed inset-0 z-[9998]"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
            onClick={() => setShowNotificationCenter(false)}
          />
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <AnimatePresence>
        {showNotificationCenter && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-32 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] max-h-96 overflow-hidden"
            style={{
              position: "fixed",
              top: "128px",
              right: "16px",
              width: "320px",
              maxWidth: "90vw",
              zIndex: 9999,
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b border-gray-200"
              style={{
                background: "#3b003b",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold text-lg mb-0">الإشعارات</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-white/80 hover:text-white text-sm"
                  >
                    مسح الكل
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p>لا توجد إشعارات</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1 text-right">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-sm text-right mb-2">
                            {notification.body}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.timestamp).toLocaleString(
                              "en-US"
                            )}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationDisplay;
