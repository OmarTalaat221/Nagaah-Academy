import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fcmService from "../../fcm-service";

const NotificationPopup = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [autoCloseTime, setAutoCloseTime] = useState(5000); // 5 seconds default
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    console.log("NotificationPopup mounted");

    const handleNewNotification = (notificationData) => {
      console.log("New notification received in Popup:", notificationData);

      // Show popup for specified time
      setCurrentNotification(notificationData);
      setTimeLeft(autoCloseTime);

      const timer = setTimeout(() => {
        setCurrentNotification(null);
      }, autoCloseTime);

      // Update time left every 100ms for smooth progress
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 100) {
            clearInterval(interval);
            return 0;
          }
          return prev - 100;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
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
  }, [autoCloseTime]);

  const handleActionClick = () => {
    console.log("Notification action clicked");
    setCurrentNotification(null);
  };

  const extendTime = () => {
    setTimeLeft(autoCloseTime);
    setCurrentNotification({
      ...currentNotification,
      timestamp: new Date(),
    });
  };

  return (
    <>
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -100, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.4,
            }}
            className="notification-popup-top-left"
            style={{
              position: "fixed",
              top: "20px",
              left: "20px",
              zIndex: 9999,
              width: "calc(100vw - 40px)",
              maxWidth: "320px",
              minWidth: "280px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(59, 0, 59, 0.3)",
                border: "2px solid #ffd700",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "14px",
                    margin: 0,
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  إشعار جديد
                </h3>
                <button
                  onClick={() => setCurrentNotification(null)}
                  style={{
                    color: "#ffd700",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    borderRadius: "4px",
                    transition: "color 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#ffd700";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
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

              {/* Content */}
              <div
                style={{
                  padding: "16px",
                  paddingBottom: "12px",
                }}
              >
                <h4
                  style={{
                    color: "#3b003b",
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "8px",
                    textAlign: "right",
                    wordWrap: "break-word",
                    lineHeight: "1.3",
                  }}
                >
                  {currentNotification.title}
                </h4>

                <p
                  style={{
                    color: "#666",
                    fontSize: "13px",
                    textAlign: "right",
                    marginBottom: "12px",
                    wordWrap: "break-word",
                    lineHeight: "1.4",
                  }}
                >
                  {currentNotification.body}
                </p>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => setCurrentNotification(null)}
                    style={{
                      color: "#666",
                      backgroundColor: "transparent",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b003b";
                      e.target.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#666";
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    إغلاق
                  </button>

                  <button
                    onClick={handleActionClick}
                    style={{
                      backgroundColor: "#3b003b",
                      color: "#ffffff",
                      border: "1px solid #3b003b",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#ffd700";
                      e.target.style.color = "#3b003b";
                      e.target.style.borderColor = "#ffd700";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#3b003b";
                      e.target.style.color = "#ffffff";
                      e.target.style.borderColor = "#3b003b";
                    }}
                  >
                    عرض
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: "3px",
                  backgroundColor: "rgba(59, 0, 59, 0.1)",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  position: "relative",
                }}
              >
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: autoCloseTime / 1000,
                    ease: "linear",
                  }}
                  style={{
                    height: "100%",
                    backgroundColor: "#ffd700",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              </div>

              {/* Small extend time button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 1.5 }}
                onClick={extendTime}
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  right: "-8px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#ffd700",
                  color: "#3b003b",
                  border: "2px solid #ffffff",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  fontSize: "10px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#3b003b";
                  e.target.style.color = "#ffd700";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffd700";
                  e.target.style.color = "#3b003b";
                  e.target.style.transform = "scale(1)";
                }}
                title="تمديد"
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles to ensure it never exits viewport */}
      <style jsx global>{`
        /* Base styles ensure no viewport overflow */
        @media (max-width: 380px) {
          .notification-popup-top-left {
            left: 10px !important;
            top: 15px !important;
            width: calc(100vw - 20px) !important;
            max-width: calc(100vw - 20px) !important;
            min-width: 250px !important;
          }
        }

        @media (max-width: 320px) {
          .notification-popup-top-left {
            left: 8px !important;
            top: 12px !important;
            width: calc(100vw - 16px) !important;
            max-width: calc(100vw - 16px) !important;
            min-width: 240px !important;
          }
        }

        /* Very small height screens */
        @media (max-height: 500px) {
          .notification-popup-top-left {
            top: 10px !important;
          }
        }

        @media (max-height: 400px) {
          .notification-popup-top-left {
            top: 5px !important;
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (max-width: 900px) {
          .notification-popup-top-left {
            top: 8px !important;
            left: 15px !important;
          }
        }

        /* Prevent any horizontal overflow */
        html,
        body {
          overflow-x: hidden;
        }
      `}</style>
    </>
  );
};

export default NotificationPopup;
