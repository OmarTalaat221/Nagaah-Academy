import React from "react";
import { motion } from "framer-motion";

const FileUploadsSection = ({
  formData,
  handleInputChange,
  errors,
  previewImg,
  previewVideo,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#3b003b] mb-2">
          الملفات المطلوبة
        </h2>
        <div className="w-20 h-1 bg-[#ffd700] mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="space-y-2"
        >
          <label
            className="block text-sm font-bold mb-2"
            style={{ color: "#3b003b" }}
          >
            الصورة الشخصية
          </label>
          <motion.div
            className="flex items-center justify-center w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-[#ffd700]">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">اضغط لرفع الصورة</span>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG أو JPEG</p>
              </div>
              <input
                type="file"
                name="teacher_img"
                onChange={handleInputChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </motion.div>
          {previewImg && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-[#3b003b] mb-2">معاينة الصورة:</p>
              <img
                src={previewImg}
                alt="معاينة الصورة"
                className="w-24 h-24 mx-auto rounded-full shadow-md object-cover border-2 border-[#ffd700]"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Introduction Video */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="space-y-2"
        >
          <label
            className="block text-sm font-bold mb-2"
            style={{ color: "#3b003b" }}
          >
            فيديو التعريف
          </label>
          <motion.div
            className="flex items-center justify-center w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-[#ffd700]">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">اضغط لرفع الفيديو</span>
                </p>
                <p className="text-xs text-gray-500">MP4, AVI أو MOV</p>
              </div>
              <input
                type="file"
                name="intro_vid_url"
                onChange={handleInputChange}
                accept="video/*"
                className="hidden"
              />
            </label>
          </motion.div>
          {previewVideo && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-[#3b003b] mb-2">معاينة الفيديو:</p>
              <video
                controls
                src={previewVideo}
                className="w-full max-w-xs mx-auto rounded-lg shadow-md"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* CV Upload */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="space-y-2"
      >
        <label
          className="block text-sm font-bold mb-2"
          style={{ color: "#3b003b" }}
        >
          السيرة الذاتية (PDF)
        </label>
        <motion.div
          className="flex items-center justify-center w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-[#ffd700]">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">اضغط لرفع السيرة الذاتية</span>
              </p>
              <p className="text-xs text-gray-500">PDF فقط</p>
            </div>
            <input
              type="file"
              name="teacher_cv"
              onChange={handleInputChange}
              accept=".pdf"
              className="hidden"
            />
          </label>
        </motion.div>
        {formData.teacher_cv && (
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-green-600">
              ✓ تم رفع الملف: {formData.teacher_cv.name}
            </p>
          </motion.div>
        )}
        {errors.teacher_cv && (
          <p className="text-red-500 text-sm mt-1">{errors.teacher_cv}</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FileUploadsSection;
