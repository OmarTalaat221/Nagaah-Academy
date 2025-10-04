import { useState } from "react";
import { motion } from "framer-motion";
import { Modal, Input } from "antd";
import { base_url } from "../../constants";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [resetLoading, setResetLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetData, setResetData] = useState({
    email: "",
  });

  // Generate random 4-digit code
  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSendCode = async () => {
    if (resetData.email === "") {
      toast.warn("أدخل البريد الإلكتروني");
      return;
    }

    setResetLoading(true);
    const code = generateCode();

    const dataSend = {
      email: resetData.email,
      code: code,
    };

    try {
      // First check if email is valid and send code
      const checkEmailResponse = await axios.post(
        base_url + "/user/auth/check_email_to_reset_pass.php",
        JSON.stringify(dataSend)
      );

      console.log("Email check response:", checkEmailResponse);

      if (checkEmailResponse.data.status === "success") {
        setGeneratedCode(code); // Store the generated code for frontend verification
        setIsModalVisible(true);
        toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      } else {
        toast.error(
          checkEmailResponse.data.message || "البريد الإلكتروني غير موجود"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء التحقق من البريد الإلكتروني");
    } finally {
      setResetLoading(false);
    }
  };

  // Verify code on frontend (not backend)
  const handleVerifyCode = () => {
    if (!otpCode || otpCode.length !== 4) {
      toast.warn("يرجى إدخال رمز التحقق المكون من 4 أرقام");
      return;
    }

    // Check if entered code matches the generated code
    if (otpCode !== generatedCode) {
      toast.error("رمز التحقق غير صحيح");
      return;
    }

    // Code is correct, show password fields
    setShowPasswordFields(true);
    toast.success("تم التحقق من الرمز بنجاح! الآن أدخل كلمة المرور الجديدة");
  };

  // Reset password after successful code verification
  const handleResetPassword = async () => {
    if (newPass !== confirmPass) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setVerifyLoading(true);

    try {
      const response = await axios.post(
        base_url + "/user/auth/reset_password.php",
        JSON.stringify({
          email: resetData.email,
          new_password: newPass,
        })
      );

      console.log("Password reset response:", response);

      if (response.data.status === "success") {
        toast.success("تم تغيير كلمة المرور بنجاح!");
        setIsModalVisible(false);

        // Reset all states
        setOtpCode("");
        setNewPass("");
        setConfirmPass("");
        setShowPasswordFields(false);
        setGeneratedCode("");
        setResetData({ email: "" });

        // Redirect to login after success message
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "حدث خطأ أثناء تغيير كلمة المرور");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const newCode = generateCode(); // Generate new code

      // Re-send the code by calling the same API again
      const checkEmailResponse = await axios.post(
        base_url + "/user/auth/check_email_to_reset_pass.php",
        JSON.stringify({
          email: resetData.email,
          code: newCode,
        })
      );

      if (checkEmailResponse.data.status === "success") {
        setGeneratedCode(newCode); // Update the stored code
        setOtpCode(""); // Clear current input
        setShowPasswordFields(false); // Hide password fields if shown
        toast.success("تم إرسال رمز جديد إلى بريدك الإلكتروني");
      } else {
        toast.error("فشل في إرسال رمز جديد");
      }
    } catch (error) {
      console.error("Error resending code:", error);
      toast.error("حدث خطأ أثناء إرسال رمز جديد");
    }
  };

  // Custom Spinner component
  const CustomSpinner = () => (
    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  );

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
        className="w-full max-w-md relative z-10"
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
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)`,
                }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: "#3b003b" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-3 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                استعادة كلمة المرور
              </motion.h1>
              <motion.p
                className="text-base opacity-90 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.9 }}
                transition={{ delay: 0.6 }}
              >
                سنساعدك على استعادة حسابك 🔐
              </motion.p>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-20"
              style={{ background: "#ffd700" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-8 h-8 rounded-full opacity-20"
              style={{ background: "#ffd700" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Form */}
          <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <div className="text-gray-600 text-sm">
                أدخل بريدك الإلكتروني لإرسال رمز التحقق
              </div>
            </motion.div>

            <div className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-bold mb-2 transition-colors duration-300"
                  style={{ color: "#3b003b" }}
                >
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setResetData({ ...resetData, email: e.target.value });
                    }}
                    value={resetData.email}
                    className="w-full p-3 border-2 rounded-xl text-right transition-all duration-300 focus:scale-[1.02] shadow-sm"
                    style={{
                      borderColor: "#e5e7eb",
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ffd700";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(255, 215, 0, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                    type="email"
                    id="email"
                    placeholder="example@email.com"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Send Code Button */}
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={handleSendCode}
                className="relative w-full py-3 px-4 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-2xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
                }}
                disabled={resetLoading}
                whileHover={{
                  scale: 1.02,
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
                  {resetLoading ? (
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <CustomSpinner />
                      <span className="mr-2">جاري إرسال الرمز...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      ارسل الرمز
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

            {/* Divider */}
            <motion.div
              className="relative my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-center">
                <span className="text-gray-600 text-sm">
                  تذكرت كلمة المرور؟{" "}
                </span>
                <motion.button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium transition-all duration-300 hover:underline"
                  style={{ color: "#3b003b" }}
                  whileHover={{
                    color: "#ffd700",
                    textShadow: "0 0 8px rgba(255, 215, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  تسجيل الدخول
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-60"
          style={{ background: "#ffd700" }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full opacity-60"
          style={{ background: "#3b003b" }}
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      {/* OTP Verification Modal */}
      <Modal
        title={
          <div className="text-center">
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
                  d={
                    showPasswordFields
                      ? "M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      : "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  }
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold" style={{ color: "#3b003b" }}>
              {showPasswordFields
                ? "تعيين كلمة مرور جديدة"
                : "تأكيد رمز التحقق"}
            </h3>
            <p className="text-gray-600 mt-2">
              {showPasswordFields
                ? "أدخل كلمة المرور الجديدة"
                : "أدخل الرمز المكون من 4 أرقام المرسل إليك"}
            </p>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setShowPasswordFields(false);
          setOtpCode("");
          setNewPass("");
          setConfirmPass("");
        }}
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
            {!showPasswordFields ? (
              // OTP Verification Section
              <>
                <div className="mb-6">
                  <Input
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 4) {
                        setOtpCode(value);
                      }
                    }}
                    placeholder="0000"
                    maxLength={4}
                    className="text-center text-2xl font-bold tracking-widest"
                    style={{
                      height: "60px",
                      fontSize: "24px",
                      letterSpacing: "8px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ffd700";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(255, 215, 0, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    أدخل الرمز المكون من 4 أرقام
                  </p>
                </div>

                <motion.button
                  onClick={handleVerifyCode}
                  disabled={otpCode.length !== 4}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white mb-4 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
                    opacity: otpCode.length !== 4 ? 0.6 : 1,
                  }}
                  whileHover={otpCode.length === 4 ? { scale: 1.02 } : {}}
                  whileTap={otpCode.length === 4 ? { scale: 0.98 } : {}}
                >
                  تحقق من الرمز
                </motion.button>

                <motion.button
                  onClick={handleResendCode}
                  className="text-sm font-medium transition-all duration-300 hover:underline"
                  style={{ color: "#3b003b" }}
                  whileHover={{ color: "#ffd700" }}
                  whileTap={{ scale: 0.95 }}
                >
                  إرسال رمز جديد
                </motion.button>
              </>
            ) : (
              // Password Reset Section
              <>
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Input
                      value={newPass}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="كلمة المرور الجديدة"
                      className="text-right"
                      style={{
                        height: "50px",
                        fontSize: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ffd700";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(255, 215, 0, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />

                    <div className="absolute text-[16px] top-[50%] translate-y-[-50%] left-[10px] !text-black">
                      {showPassword ? (
                        <EyeInvisibleOutlined
                          style={{ color: "#3b003b" }}
                          className="!text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeOutlined
                          style={{ color: "#3b003b" }}
                          className="!text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      value={confirmPass}
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="تأكيد كلمة المرور"
                      className="text-right"
                      style={{
                        height: "50px",
                        fontSize: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#ffd700";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(255, 215, 0, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />

                    <div className="absolute text-[16px] top-[50%] translate-y-[-50%] left-[10px] !text-black">
                      {showConfirmPassword ? (
                        <EyeInvisibleOutlined
                          className="!text-black"
                          style={{ color: "#3b003b" }}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        />
                      ) : (
                        <EyeOutlined
                          className="!text-black"
                          style={{ color: "#3b003b" }}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleResetPassword}
                  disabled={verifyLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white mb-4 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
                    opacity: verifyLoading ? 0.6 : 1,
                  }}
                  whileHover={
                    newPass &&
                    confirmPass &&
                    newPass === confirmPass &&
                    newPass.length >= 6
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    newPass &&
                    confirmPass &&
                    newPass === confirmPass &&
                    newPass.length >= 6
                      ? { scale: 0.98 }
                      : {}
                  }
                >
                  {verifyLoading ? (
                    <div className="flex items-center justify-center">
                      <CustomSpinner />
                      <span className="mr-2">جاري تغيير كلمة المرور...</span>
                    </div>
                  ) : (
                    "تغيير كلمة المرور"
                  )}
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </Modal>
    </div>
  );
};

export default ResetPassword;
