import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Sign1, checkCode } from "./functions/Sign1";
import { FaSpinner } from "react-icons/fa";

const Registration = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [registData, setRegistData] = useState({ email: "" });
  const [changeShow, setChangeShow] = useState("email");
  const [signLoading, setSignLoading] = useState(false);

  const handleSign2 = () => {
    if (userCode === "") {
      toast.warn("الرجاء إدخال الكود");
      return;
    }
    if (code) {
      checkCode(registData?.email, userCode, navigate, registData);
    } else {
      toast.warn("تحقق من الكود المرسل");
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      {changeShow === "email" ? (
        <motion.form
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            Sign1(registData, setSignLoading, setChangeShow, setCode);
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">إنشاء حساب</h2>
          <div className="text-center text-gray-600 mb-4">
            <p>مرحبًا بك! 👋</p>
            <span>يرجى إنشاء حساب جديد أدناه</span>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              أدخل بريدك الإلكتروني
            </label>
            <input
              onChange={(e) =>
                setRegistData({ ...registData, email: e.target.value })
              }
              id="email"
              placeholder="البريد الإلكتروني"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="btn btn-primary w-100 my-3 p-3 text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: "rgb(59 0 59)",
                borderColor: "rgb(59 0 59)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "0.25rem",
              }}
            >
              {signLoading ? (
                <div className="flex items-center justify-center animate-spin">
                  <FaSpinner />
                </div>
              ) : (
                "تسجيل"
              )}
            </button>
          </div>
          <hr className="my-6" />
          <div className="text-center">
            <span>هل لديك حساب بالفعل؟ </span>
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              تسجيل الدخول
            </span>
          </div>
        </motion.form>
      ) : (
        <motion.form
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSign2();
          }}
        >
          <h4 className="text-xl font-bold text-center mb-4">
            تأكيد رمز التحقق
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            تم إرسال رمز مكون من 6 أرقام إلى بريدك الإلكتروني المسجل{" "}
            <span className="text-red-500">"{registData?.email}"</span>
          </p>
          <p className="text-xs text-gray-500 mb-4">
            إذا لم تجد الرمز في صندوق الوارد، يرجى التحقق من{" "}
            <span className="text-red-500">"البريد العشوائي (Spam)"</span>
          </p>
          <input
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-4 p-3"
            type="text"
            maxLength={6}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="أدخل الرمز المرسل إلى بريدك الإلكتروني"
          />
          <button
            type="submit"
            className="btn btn-primary w-100 my-3 p-3 text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "rgb(59 0 59)",
              borderColor: "rgb(59 0 59)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            تأكيد
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default Registration;
