import { Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const SignInModal = ({ openSignInModal, setOpenSignInModal, newOfferData }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    setOpenSignInModal(false);
    navigate("/login");
    localStorage.setItem(
      "newOfferData",
      JSON.stringify({
        ...newOfferData,
        scheduled_date: null,
        scheduled_time: null,
        end_time: null,
      })
    );
  };

  return (
    <Modal
      open={openSignInModal}
      onCancel={() => setOpenSignInModal(false)}
      footer={null}
      centered
      width={450}
      styles={{
        content: {
          borderRadius: "24px",
          overflow: "hidden",
        },
        header: {
          borderBottom: "none",
          paddingBottom: 0,
        },
      }}
    >
      <div className="text-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Icon Section */}
          <div className="text-center mb-4">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)`,
              }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: "#3b003b" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2" style={{ color: "#3b003b" }}>
              تسجيل الدخول مطلوب
            </h3>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              يجب عليك تسجيل الدخول للوصول إلى هذه الميزة
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Login Button */}
            <motion.button
              onClick={handleLoginRedirect}
              className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              تسجيل الدخول
            </motion.button>

            {/* Cancel Button */}
            <motion.button
              onClick={() => setOpenSignInModal(false)}
              className="w-full py-3 px-4 rounded-xl font-bold border-2 transition-all duration-300"
              style={{
                color: "#3b003b",
                borderColor: "#e5e7eb",
                background: "transparent",
              }}
              whileHover={{
                borderColor: "#3b003b",
                backgroundColor: "rgba(59, 0, 59, 0.05)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              إلغاء
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Modal>
  );
};

export default SignInModal;
