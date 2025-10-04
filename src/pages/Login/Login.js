import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base_url } from "../../constants";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import fcmService from "../../fcm-service";

const Login = () => {
  const navigate = useNavigate();
  const localNewOfferData = useMemo(() => {
    return JSON.parse(localStorage.getItem("newOfferData") || "null");
  }, []);

  const [loginLoading, setLoginLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isEdge, setIsEdge] = useState(false);
  const [showEdgeInstructions, setShowEdgeInstructions] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    pass: "",
  });

  useEffect(() => {
    // Detect if user is using Microsoft Edge
    const detectEdge = () => {
      const userAgent = navigator.userAgent;
      const isEdgeBrowser = /Edge|Edg/.test(userAgent);
      setIsEdge(isEdgeBrowser);
      console.log("Is Edge browser:", isEdgeBrowser);
    };

    detectEdge();
  }, []);

  const handleSub = async () => {
    if (loginData.email === "") {
      toast.warn("Enter Login Data");
      return;
    }
    if (loginData.pass === "") {
      toast.warn("Enter Password");
      return;
    }

    setLoginLoading(true);

    try {
      // STEP 1: First request notification permission - REQUIRED for login
      console.log("Requesting notification permission...");

      const hasPermission = await requestNotificationPermission();

      // if (!hasPermission) {
      //   // If permission denied, don't proceed with login
      //   if (isEdge) {
      //     setShowEdgeInstructions(true);
      //     toast.error("يجب تفعيل الإشعارات من إعدادات Edge لتسجيل الدخول");
      //   } else {
      //     toast.error("يجب السماح بالإشعارات لتسجيل الدخول");
      //   }
      //   setLoginLoading(false);
      //   return;
      // }

      const fcmToken = await fcmService.getFCMToken();

      if (!fcmToken) {
        toast.error("فشل في الحصول على رمز الإشعارات. يرجى المحاولة مرة أخرى");
        setLoginLoading(false);
        return;
      }

      // STEP 3: Proceed with login only if we have both permission and token
      const data_send = {
        ...loginData,
        fcm_token: fcmToken,
        device_type: "web",
        user_agent: navigator.userAgent,
      };

      console.log("Login data with FCM token:", data_send);

      // Login API call
      const res = await axios.post(
        base_url + "/user/auth/new_login.php",
        JSON.stringify(data_send)
      );

      console.log(res);

      if (res.data.status === "success") {
        // Store user data
        localStorage.setItem("NagahUser", JSON.stringify(res.data.message));

        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({
            ...res.data.message,
            password: loginData?.pass,
          }),
          "111"
        ).toString();
        localStorage.setItem("elmataryapp", encryptedData);

        // Store FCM token locally
        localStorage.setItem("fcmToken", fcmToken);

        // Setup message listener
        fcmService.setupForegroundMessageListener();

        // Show success message
        toast.success("تم تسجيل الدخول بنجاح");

        // Show welcome notification
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("مرحباً بك!", {
              body: "تم تسجيل الدخول بنجاح",
              icon: "/favicon.ico",
              tag: "login-success",
            });
          }
        }, 1000);

        // Navigate to appropriate page after a short delay
        setTimeout(() => {
          window.location.href = localNewOfferData ? "/offer-form" : "/";
        }, 1500);
      } else if (res.data.status === "error") {
        toast.error(res.data.message);
      } else {
        toast.error("Something Went Error");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoginLoading(false);
    }
  };

  // Function to request notification permission with Edge handling
  const requestNotificationPermission = async () => {
    try {
      // Check if browser supports notifications
      if (!("Notification" in window)) {
        toast.error("متصفحك لا يدعم الإشعارات");
        return false;
      }

      // Check if already granted
      if (Notification.permission === "granted") {
        console.log("Notification permission already granted");
        return true;
      }

      // If denied, show error
      if (Notification.permission === "denied") {
        toast.error("الإشعارات محظورة. يرجى تفعيلها من إعدادات المتصفح");

        return false;
      }

      // Request permission
      console.log("Requesting notification permission...");

      let permission;

      try {
        // Handle different browser implementations
        if (typeof Notification.requestPermission === "function") {
          if (Notification.requestPermission.length) {
            // Legacy callback-based (for Edge compatibility)
            permission = await new Promise((resolve) => {
              Notification.requestPermission(resolve);
            });
          } else {
            // Modern promise-based
            permission = await Notification.requestPermission();
          }
        } else {
          toast.error("متصفحك لا يدعم طلب إذن الإشعارات");
          return false;
        }
      } catch (requestError) {
        console.error("Permission request error:", requestError);

        // Edge might block the request, show instructions
        if (isEdge) {
          setShowEdgeInstructions(true);
          toast.error("Edge حظر طلب الإشعارات. اتبع التعليمات للتفعيل اليدوي");
        } else {
          toast.error("فشل في طلب إذن الإشعارات");
        }
        return false;
      }

      console.log("Permission result:", permission);

      if (permission === "granted") {
        console.log("Notification permission granted!");
        setShowEdgeInstructions(false);
        return true;
      } else if (permission === "denied") {
        if (isEdge) {
          setShowEdgeInstructions(true);
          toast.error("تم رفض إذن الإشعارات في Edge. اتبع التعليمات لتفعيلها");
        } else {
          toast.error(
            "تم رفض إذن الإشعارات. لا يمكن تسجيل الدخول بدون الإشعارات"
          );
        }
        return false;
      } else {
        toast.error("يجب الموافقة على الإشعارات لتسجيل الدخول");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      if (isEdge) {
        setShowEdgeInstructions(true);
        toast.error("فشل في طلب إذن الإشعارات في Edge");
      } else {
        toast.error("فشل في طلب إذن الإشعارات");
      }
      return false;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #3b003b 0%, #5a0a5a 50%, #3b003b 100%)`,
      }}
    >
      {/* Notification requirement notice - updated for Edge */}
      <motion.div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className={`${
            isEdge
              ? "bg-blue-100 border-blue-400 text-blue-800"
              : "bg-yellow-100 border-yellow-400 text-yellow-800"
          } px-4 py-2 rounded-lg text-sm text-center shadow-lg`}
        >
          <svg
            className="w-4 h-4 inline-block ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {"يجب السماح بالإشعارات لتسجيل الدخول"}
        </div>
      </motion.div>

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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-3 text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                تسجيل الدخول
              </motion.h1>
              <motion.p
                className="text-base opacity-90 text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.9 }}
                transition={{ delay: 0.6 }}
              >
                مرحباً بك مرة أخرى! 👋
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
                      setLoginData({ ...loginData, email: e.target.value });
                    }}
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
                    disabled={loginLoading}
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

              {/* Password Field */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-bold mb-2 transition-colors duration-300"
                  style={{ color: "#3b003b" }}
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => {
                      setLoginData({ ...loginData, pass: e.target.value });
                    }}
                    className="w-full p-3 border-2 rounded-xl transition-all duration-300 focus:scale-[1.02] shadow-sm"
                    style={{
                      borderColor: "#e5e7eb",
                      background: "rgba(255, 255, 255, 0.9)",
                      direction: "ltr",
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
                    type={showPass ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    disabled={loginLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loginLoading}
                  >
                    {showPass ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Login Button */}
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={handleSub}
                className="relative w-full py-3 px-4 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-2xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
                }}
                disabled={loginLoading}
                whileHover={
                  !loginLoading
                    ? {
                        scale: 1.02,
                        boxShadow: "0 20px 40px -10px rgba(59, 0, 59, 0.4)",
                      }
                    : {}
                }
                whileTap={!loginLoading ? { scale: 0.98 } : {}}
                onMouseEnter={(e) => {
                  if (!loginLoading) {
                    e.target.style.background = `linear-gradient(135deg, #4a0a4a 0%, #5a1a5a 100%)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loginLoading) {
                    e.target.style.background = `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`;
                  }
                }}
              >
                {/* Button Background Effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                  style={{ background: "#ffd700" }}
                />

                {/* Button Content */}
                <div className="relative z-10 flex items-center justify-center">
                  {loginLoading ? (
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                      <span>جاري التحقق من الإشعارات...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center"
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <span>تسجيل الدخول </span>
                    </motion.div>
                  )}
                </div>

                {/* Golden accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 rounded-full"
                  style={{ background: "#ffd700" }}
                  initial={{ width: 0 }}
                  whileHover={!loginLoading ? { width: "100%" } : {}}
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
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500">أو</span>
              </div>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-sm font-medium transition-all duration-300 hover:underline"
                style={{ color: "#3b003b" }}
                whileHover={{
                  color: "#ffd700",
                  textShadow: "0 0 8px rgba(255, 215, 0, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                disabled={loginLoading}
              >
                هل نسيت كلمة المرور؟
              </motion.button>

              <div className="text-center">
                <span className="text-gray-600 text-sm">ليس لديك حساب؟ </span>
                <motion.button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-sm font-medium transition-all duration-300 hover:underline"
                  style={{ color: "#3b003b" }}
                  whileHover={{
                    color: "#ffd700",
                    textShadow: "0 0 8px rgba(255, 215, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loginLoading}
                >
                  سجل الآن
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
    </div>
  );
};

export default Login;
