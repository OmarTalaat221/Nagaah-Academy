import React from "react";
import { motion } from "framer-motion";

const FormHeader = () => {
  return (
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-3 text-white"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          كن معلمًا معنا
        </motion.h1>
        <motion.p
          className="text-base opacity-90 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.9 }}
          transition={{ delay: 0.6 }}
        >
          انضم إلى فريقنا المتميز من المعلمين المحترفين 🎓
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
  );
};

export default FormHeader;
