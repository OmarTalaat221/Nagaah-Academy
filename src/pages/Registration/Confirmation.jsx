import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import CryptoJS from "crypto-js";
import { base_url } from "../../constants";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import { Input } from "antd";
import "./registration.css";
import { FaSpinner } from "react-icons/fa";

const Confirmation = () => {
  const navigate = useNavigate();

  // Form data
  const [universities, setUniversities] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const { registrationData, code, selectedGrade } = useLocation().state;

  // Handle registration submit
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    if (!registrationData.email) {
      toast.warn("يرجى إدخال البريد الإلكتروني");
      return;
    }

    if (!code) {
      toast.warn("يرجى إدخال الكود المرسل");
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...registrationData,
        grade_id: selectedGrade,
      };

      const response = await axios.post(
        base_url + "/user/auth/signup_2.php",
        dataToSend
      );
      if (response.data.status === "success") {
        localStorage.setItem(
          "NagahUser",
          JSON.stringify(response.data.message)
        );

        toast.success("تم إنشاء الحساب بنجاح");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(response.data.message || "حدث خطأ في إنشاء الحساب");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #3b003b 0%, #5a0a5a 50%, #3b003b 100%)`,
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{ background: "#ffd700" }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{ background: "#ffd700" }}
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full opacity-20"
          style={{ background: "#ffd700" }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Card */}
        <div
          className="backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-opacity-20"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderColor: "#ffd700",
            boxShadow: `0 25px 50px -12px rgba(59, 0, 59, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.2)`,
          }}
        >
          {/* Header */}
          <motion.div
            className="relative p-8 text-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 20% 50%, #ffd700 0%, transparent 50%), 
                           radial-gradient(circle at 80% 50%, #ffd700 0%, transparent 50%)`,
                }}
              />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative z-10"
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-3 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                مرحباً بك في <span style={{ color: "#ffd700" }}>نجاح</span>
              </motion.h1>
              <motion.p
                className="text-lg opacity-90 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.9 }}
                transition={{ delay: 0.6 }}
              >
                سجل حسابك الجديد واستمتع بالتعلم
              </motion.p>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-20"
              style={{ background: "#ffd700" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-12 h-12 rounded-full opacity-20"
              style={{ background: "#ffd700" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleRegistrationSubmit}
            className="p-8 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-1 justify-center items-center gap-8">
              <motion.div
                className="space-y-6 flex justify-center items-center otp-container"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Input.OTP length={4} />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              className="mt-10 flex justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                type="submit"
                className="relative w-full max-w-sm py-3 px-4 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-2xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
                }}
                disabled={loading}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px -10px rgba(59, 0, 59, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={(e) => {
                  e.target.style.background = `linear-gradient(135deg, #4a0a4a 0%, #5a1a5a 100%)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`;
                }}
              >
                {/* Button Background Effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                  style={{ background: "#ffd700" }}
                />

                {/* Button Content */}
                <div className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center justify-center animate-spin">
                        <FaSpinner />
                      </div>{" "}
                      <span>جاري تأكيدالحساب...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      تأكيد الحساب
                    </motion.span>
                  )}
                </div>

                {/* Golden accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 rounded-full"
                  style={{ background: "#ffd700" }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="mt-8 pt-6 text-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              <motion.p
                className="text-gray-600 text-base"
                whileHover={{ scale: 1.02 }}
              >
                هل لديك حساب بالفعل؟{" "}
                <motion.span
                  onClick={() => navigate("/login")}
                  className="font-bold cursor-pointer transition-all duration-300 hover:underline"
                  style={{ color: "#3b003b" }}
                  whileHover={{
                    color: "#ffd700",
                    textShadow: "0 0 8px rgba(255, 215, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  تسجيل الدخول
                </motion.span>
              </motion.p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>

      {/* Custom Styles for Phone Input */}
      <style jsx>{`
        .phone-input-wrapper .react-tel-input .form-control:focus {
          border-color: #ffd700 !important;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1) !important;
        }

        .phone-input-wrapper .react-tel-input .flag-dropdown:hover {
          background-color: rgba(255, 215, 0, 0.1) !important;
        }

        .phone-input-wrapper .react-tel-input .selected-flag:hover {
          background-color: rgba(255, 215, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Confirmation;
