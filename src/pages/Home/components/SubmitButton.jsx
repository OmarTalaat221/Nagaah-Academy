import React from "react";
import { motion } from "framer-motion";

const SubmitButton = ({ loading }) => {
  return (
    <motion.div
      className="mt-8 flex justify-center"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.7 }}
    >
      <motion.button
        type="submit"
        className="relative w-full py-3 px-4 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-2xl transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, #3b003b 0%, #4a0a4a 100%)`,
        }}
        disabled={loading}
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
          {loading ? (
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
              <span>جاري التسجيل...</span>
            </motion.div>
          ) : (
            <motion.span
              initial={{ y: 0 }}
              style={{ background: "transparent" }}
              className="!bg-transparent w-full"
            >
              تسجيل معلم جديد
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
  );
};

export default SubmitButton;
