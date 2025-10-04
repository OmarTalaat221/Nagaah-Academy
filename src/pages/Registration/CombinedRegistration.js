import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import CryptoJS from "crypto-js";
import { base_url } from "../../constants";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import { Input, Modal } from "antd";
import { FaSpinner } from "react-icons/fa";

const CombinedRegistration = () => {
  const navigate = useNavigate();

  // Form data
  const [universities, setUniversities] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [confPass, setConfPass] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    email: "",
    student_name: "",
    pass: "",
    university_id: "",
    grade_id: "",
    phone: "",
    parent_phone: "",
  });

  const localNewOfferData = useMemo(() => {
    return JSON.parse(localStorage.getItem("newOfferData") || "null");
  }, []);

  // Get universities and grades
  const getUniversities = () => {
    axios
      .get(base_url + "/user/auth/select_universities_grade.php")
      .then((res) => {
        if (res.data.status == "success") {
          setUniversities(res.data.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getUniversities();
  }, []);

  // Handle send OTP code
  const handleSendCode = async (e) => {
    e.preventDefault();

    // Validation
    if (!registrationData.email) {
      toast.warn("يرجى إدخال البريد الإلكتروني");
      return;
    }
    if (!registrationData.student_name) {
      toast.warn("يرجى إدخال اسمك");
      return;
    }
    if (!registrationData.pass) {
      toast.warn("يرجى إدخال كلمة المرور");
      return;
    }
    if (confPass !== registrationData.pass) {
      toast.warn("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }
    if (!registrationData.university_id) {
      toast.warn("يرجى اختيار المرحلة");
      return;
    }
    if (!selectedGrade) {
      toast.warn("يرجى اختيار الصف الدراسي");
      return;
    }
    if (!registrationData.phone) {
      toast.warn("يرجى إدخال رقم الهاتف");
      return;
    }
    if (!registrationData.parent_phone) {
      toast.warn("يرجى إدخال رقم هاتف ولي الأمر");
      return;
    }

    setLoading(true);
    try {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      const dataToSend = {
        email: registrationData.email,
        code: code,
      };

      const response = await axios.post(
        base_url + "/user/auth/check_valid_email.php",
        dataToSend
      );

      console.log(response.data);
      if (response.data.status === "success") {
        setGeneratedCode(code);
        setIsModalVisible(true);
        toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      } else {
        toast.error(response.data.message || "حدث خطأ في إرسال الرمز");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في إرسال الرمز");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification and registration
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      toast.warn("يرجى إدخال رمز التحقق المكون من 4 أرقام");
      return;
    }

    if (otp !== generatedCode) {
      toast.error("رمز التحقق غير صحيح");
      return;
    }

    // If OTP is correct, proceed with registration
    setOtpLoading(true);
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
        // Encrypt and store user data

        localStorage.setItem(
          "NagahUser",
          JSON.stringify(response.data.message)
        );

        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({
            ...response.data.message,
            password: registrationData?.pass,
          }),
          "111"
        ).toString();
        localStorage.setItem("elmataryapp", encryptedData);
        toast.success("تم إنشاء الحساب بنجاح");
        setIsModalVisible(false);
        setTimeout(() => {
          window.location.href = localNewOfferData ? "/offer-form" : "/";
        }, 1500);
      } else {
        toast.error(response.data.message || "حدث خطأ في إنشاء الحساب");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في إنشاء الحساب");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setOtpLoading(true);
    try {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      const dataToSend = {
        email: registrationData.email,
        code: code,
      };

      const response = await axios.post(
        base_url + "/user/auth/check_valid_email.php",
        dataToSend
      );

      if (response.data.status === "success") {
        setGeneratedCode(code);
        setOtp("");
        toast.success("تم إرسال رمز جديد إلى بريدك الإلكتروني");
      } else {
        toast.error(response.data.message || "حدث خطأ في إرسال الرمز");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في إرسال الرمز");
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    if (!universities?.length) return;

    const desiredId =
      registrationData?.university_id ?? universities[0].university_id;
    const selectedUni =
      universities.find((u) => u.university_id === desiredId) ??
      universities[0];

    // functional update avoids stale closures
    setRegistrationData((prev) => ({
      ...prev,
      university_id: selectedUni.university_id,
    }));

    setGrades(selectedUni.grades ?? []);
    setSelectedGrade(selectedUni.grades?.[0]?.grade_id ?? "");
  }, [universities, registrationData?.university_id]);

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
                أنشئ حسابك الجديد واستمتع بالتعلم
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
            onSubmit={handleSendCode}
            className="p-8 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <motion.div
                className="space-y-6 lg:order-2 order-1"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Email Input */}
                <div className="relative group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Input
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          email: e.target.value,
                        })
                      }
                      id="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      type="email"
                      className="w-full p-[10px_16px] border-2 rounded-xl text-right text-base transition-all duration-300 focus:scale-[1.02] shadow-sm"
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
                    />
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(to right, transparent, #ffd700, transparent)`,
                      }}
                    />
                  </div>
                </div>

                {/* Student Name Input */}
                <div className="relative group">
                  <label
                    htmlFor="student_name"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <Input
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          student_name: e.target.value,
                        })
                      }
                      placeholder="أدخل اسمك الكامل"
                      type="text"
                      id="student_name"
                      className="w-full p-[10px_16px] border-2 rounded-xl text-right text-base transition-all duration-300 focus:scale-[1.02] shadow-sm"
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
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <label
                    htmlFor="pass"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Input
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          pass: e.target.value,
                        })
                      }
                      id="pass"
                      placeholder="أدخل كلمة المرور"
                      type="password"
                      className="w-full p-[10px_16px] border-2 rounded-xl text-right text-base transition-all duration-300 focus:scale-[1.02] shadow-sm"
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
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="relative group">
                  <label
                    htmlFor="confPass"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Input
                      onChange={(e) => setConfPass(e.target.value)}
                      id="confPass"
                      placeholder="أعد إدخال كلمة المرور"
                      type="password"
                      className="w-full p-[10px_16px] border-2 rounded-xl text-right text-base transition-all duration-300 focus:scale-[1.02] shadow-sm"
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
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                className="space-y-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Phone Input */}
                <div className="relative group">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    رقم الهاتف
                  </label>
                  <div className="relative phone-input-wrapper">
                    <PhoneInput
                      searchPlaceholder="ابحث عن دولة"
                      showSearch={true}
                      country={"kw"}
                      value={registrationData.phone}
                      onChange={(phone) =>
                        setRegistrationData({ ...registrationData, phone })
                      }
                      containerClass="w-full"
                      inputClass="phone-input-custom"
                      buttonClass="phone-button-custom"
                      dropdownClass="text-right"
                      enableSearch={true}
                      preferredCountries={["kw"]}
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        fontSize: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        paddingLeft: "60px",
                        paddingRight: "16px",
                        background: "rgba(255, 255, 255, 0.9)",
                        transition: "all 0.3s ease",
                      }}
                      buttonStyle={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px 0 0 12px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        width: "60px",
                        height: "48px",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Parent Phone Input */}
                <div className="relative group">
                  <label
                    htmlFor="parent_phone"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    رقم هاتف ولي الأمر
                  </label>
                  <div className="relative phone-input-wrapper">
                    <PhoneInput
                      searchPlaceholder="ابحث عن دولة"
                      country={"kw"}
                      value={registrationData.parent_phone}
                      onChange={(phone) =>
                        setRegistrationData({
                          ...registrationData,
                          parent_phone: phone,
                        })
                      }
                      containerClass="w-full"
                      inputClass="phone-input-custom"
                      buttonClass="phone-button-custom"
                      dropdownClass="text-right"
                      enableSearch={true}
                      preferredCountries={["kw"]}
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        fontSize: "16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        paddingLeft: "60px",
                        paddingRight: "16px",
                        background: "rgba(255, 255, 255, 0.9)",
                        transition: "all 0.3s ease",
                      }}
                      buttonStyle={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px 0 0 12px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        width: "60px",
                        height: "48px",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* University Dropdown */}
                <div className="relative group">
                  <label
                    htmlFor="university_id"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    المرحلة الدراسية
                  </label>
                  <div className="relative">
                    <CustomDropdown
                      width="100%"
                      options={universities?.map((uni) => ({
                        label: uni.university_name,
                        value: uni.university_id,
                      }))}
                      value={registrationData.university_id}
                      onChange={(e) => {
                        setRegistrationData({
                          ...registrationData,
                          university_id: e,
                        });

                        const selectedUni = universities.find(
                          (uni) => uni.university_id == e
                        );
                        if (selectedUni) {
                          setGrades(selectedUni.grades);
                          setSelectedGrade(
                            selectedUni.grades[0]?.grade_id || ""
                          );
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Grade Dropdown */}
                <div className="relative group">
                  <label
                    htmlFor="grade_id"
                    className="block text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: "#3b003b" }}
                  >
                    الصف الدراسي
                  </label>
                  <div className="relative">
                    <CustomDropdown
                      width="100%"
                      options={grades?.map((grade) => ({
                        label: grade.grade_name,
                        value: grade.grade_id,
                      }))}
                      disabled={!registrationData.university_id}
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e)}
                    />
                  </div>
                </div>
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
                className="relative w-full max-w-md py-3 px-4 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-2xl transition-all duration-300"
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
                      <span>جاري إرسال الرمز...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                      // transition={{ type: "spring", stiffness: 400 }}
                      className="!bg-transparent"
                      style={{
                        background: "transparent",
                      }}
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

      {/* OTP Verification Modal */}
      <Modal
        title={
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold" style={{ color: "#ffd700" }}>
              تحقق من بريدك الإلكتروني
            </h3>
            <p className=" mt-2">
              أدخل الرمز المرسل إلى {registrationData.email}
            </p>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        closeIcon={false}
        width={400}
        className="otp-modal"
      >
        <div className="text-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* OTP Input */}
            <div className="mb-6">
              <Input
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 4) {
                    setOtp(value);
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
                  e.target.style.boxShadow = "0 0 0 3px rgba(255, 215, 0, 0.1)";
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

            {/* Verify Button */}
            <motion.button
              onClick={handleVerifyOTP}
              disabled={otpLoading || otp.length !== 4}
              className="w-full py-3 px-4 rounded-xl font-bold text-white mb-4 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
                opacity: otp.length !== 4 ? 0.6 : 1,
              }}
              whileHover={otp.length === 4 ? { scale: 1.02 } : {}}
              whileTap={otp.length === 4 ? { scale: 0.98 } : {}}
            >
              {otpLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner animation="border" size="sm" className="ml-2" />
                  <span>جاري التحقق...</span>
                </div>
              ) : (
                "تحقق من الرمز"
              )}
            </motion.button>

            {/* Resend Code */}
            <motion.button
              onClick={handleResendCode}
              disabled={otpLoading}
              className="text-sm font-medium transition-all duration-300 hover:underline"
              style={{ color: "#3b003b" }}
              whileHover={{ color: "#ffd700" }}
              whileTap={{ scale: 0.95 }}
            >
              {otpLoading ? "جاري الإرسال..." : "إرسال رمز جديد"}
            </motion.button>
          </motion.div>
        </div>
      </Modal>

      {/* Custom Styles for Phone Input and Modal */}
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

        .otp-modal .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden;
        }

        .otp-modal .ant-modal-header {
          background: linear-gradient(
            135deg,
            #3b003b 0%,
            #4a0a4a 100%
          ) !important;
          border-bottom: none !important;
          padding: 24px !important;
          margin-top: 20px;
        }

        .otp-modal .ant-modal-title {
          color: white !important;
        }

        .otp-modal .ant-modal-close {
          color: white !important;
        }

        .otp-modal .ant-modal-close:hover {
          color: #ffd700 !important;
        }
      `}</style>
    </div>
  );
};

export default CombinedRegistration;
