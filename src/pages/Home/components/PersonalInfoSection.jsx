import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, AlertCircle } from "lucide-react";
import { Tooltip } from "antd";
import CustomDropdown from "./CustomDropdown";

const PersonalInfoSection = ({
  formData,
  handleInputChange,
  errors,
  setErrors,
  genderOptions,
  experienceOptions,
  hasError = false,
  setHasError,
}) => {
  const sectionRef = useRef(null);
  const errorFieldRefs = useRef({});
  const hasAnimated = useRef(false);
  const focusedField = useRef(null);
  const isUserInteracting = useRef(false);
  const [initialErrorHandled, setInitialErrorHandled] = useState(false);
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false);
  const cursorPosition = useRef({}); // Store cursor positions for each field

  // Animation variants defined outside render to prevent re-creation
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: hasAnimated.current ? 0 : 0.6,
          duration: 0.5,
        },
      },
    }),
    []
  );

  const fieldVariants = useMemo(
    () => ({
      hidden: { x: -50, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          delay: hasAnimated.current ? 0 : 0.7,
          duration: 0.4,
        },
      },
    }),
    []
  );

  const errorGuideVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.9, y: -10 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: -10 },
    }),
    []
  );

  const errorMessageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    }),
    []
  );

  // Required fields for validation
  const requiredFields = useMemo(
    () => [
      "teacher_name",
      "teacher_email",
      "teacher_phone",
      "teacher_summary",
      "teacher_role",
      "gender",
      "experience_id",
    ],
    []
  );

  // Helper function to safely set cursor position with better textarea support
  const setCursorPosition = useCallback((element, fieldName) => {
    if (element && element.value) {
      // Use stored cursor position if available, otherwise go to end
      const position =
        cursorPosition.current[fieldName] || element.value.length;

      // Check if the input type supports selection
      const supportedTypes = ["text", "search", "url", "tel", "password"];
      const inputType = element.type || "text";
      const isTextarea = element.tagName.toLowerCase() === "textarea";

      if (
        (supportedTypes.includes(inputType) || isTextarea) &&
        element.setSelectionRange
      ) {
        try {
          // For textarea and text inputs, set cursor to stored position
          element.setSelectionRange(position, position);
        } catch (error) {
          console.warn("Could not set cursor position:", error);
        }
      }
    }
  }, []);

  // Store cursor position before any operations
  const storeCursorPosition = useCallback((element, fieldName) => {
    if (
      element &&
      (element.type === "text" || element.tagName.toLowerCase() === "textarea")
    ) {
      try {
        cursorPosition.current[fieldName] =
          element.selectionStart || element.value.length;
      } catch (error) {
        cursorPosition.current[fieldName] = element.value.length;
      }
    }
  }, []);

  // Mark as animated after first render
  useEffect(() => {
    if (!hasAnimated.current) {
      const timer = setTimeout(() => {
        hasAnimated.current = true;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle initial error state (only when form is first submitted with errors)
  useEffect(() => {
    if (
      hasError &&
      !initialErrorHandled &&
      !isUserInteracting.current &&
      sectionRef.current
    ) {
      setInitialErrorHandled(true);

      const timer = setTimeout(() => {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Find FIRST ERROR FIELD (not just first field) and focus it
        const firstErrorField = requiredFields.find((field) => errors[field]);
        if (firstErrorField && errorFieldRefs.current[firstErrorField]) {
          setTimeout(() => {
            const element = errorFieldRefs.current[firstErrorField];
            element.focus();
            setCursorPosition(element, firstErrorField);
          }, 500);
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    // Reset initial error handling when hasError becomes false
    if (!hasError) {
      setInitialErrorHandled(false);
    }
  }, [
    hasError,
    initialErrorHandled,
    errors,
    requiredFields,
    setCursorPosition,
  ]);

  // Restore focus after re-render when shouldRestoreFocus is true
  useEffect(() => {
    if (
      shouldRestoreFocus &&
      focusedField.current &&
      errorFieldRefs.current[focusedField.current]
    ) {
      const element = errorFieldRefs.current[focusedField.current];
      if (element) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          element.focus();
          setCursorPosition(element, focusedField.current);
          setShouldRestoreFocus(false); // Reset the flag
        });
      }
    }
  }, [shouldRestoreFocus, setCursorPosition, errors]);

  // Function to clear specific field error with focus preservation
  const clearFieldError = useCallback(
    (fieldName) => {
      if (errors[fieldName] && setErrors) {
        // Store cursor position before clearing error
        const element = errorFieldRefs.current[fieldName];
        if (element) {
          storeCursorPosition(element, fieldName);
        }

        // Mark as user interaction and prepare for focus restoration
        isUserInteracting.current = true;
        focusedField.current = fieldName;
        setShouldRestoreFocus(true);

        const newErrors = { ...errors };
        delete newErrors[fieldName];
        setErrors(newErrors);

        // If no more errors, clear hasError state
        if (Object.keys(newErrors).length === 0 && setHasError) {
          setHasError(false);
        }
      }
    },
    [errors, setErrors, setHasError, storeCursorPosition]
  );

  // Enhanced input change handler that clears errors
  const handleEnhancedInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Store cursor position before any operations
      storeCursorPosition(e.target, name);

      // Mark as user interaction
      isUserInteracting.current = true;
      focusedField.current = name;

      // Call original handler first
      handleInputChange(e);

      // Clear error for this field when user starts typing
      if (errors[name] && value.length > 0) {
        clearFieldError(name);
      }
    },
    [errors, clearFieldError, handleInputChange, storeCursorPosition]
  );

  const handleDropdownChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Mark as user interaction
      isUserInteracting.current = true;
      focusedField.current = name;

      // Call original handler first
      handleInputChange(e);

      // Clear error for this field when user selects something
      if (errors[name] && value) {
        clearFieldError(name);
      }
    },
    [errors, clearFieldError, handleInputChange]
  );

  // Handle focus events
  const handleFieldFocus = useCallback((fieldName) => {
    isUserInteracting.current = true;
    focusedField.current = fieldName;
    setShouldRestoreFocus(false);
  }, []);

  // Handle cursor position changes during typing
  const handleKeyUp = useCallback(
    (e, fieldName) => {
      storeCursorPosition(e.target, fieldName);
    },
    [storeCursorPosition]
  );

  const handleMouseUp = useCallback(
    (e, fieldName) => {
      storeCursorPosition(e.target, fieldName);
    },
    [storeCursorPosition]
  );

  const handleFieldBlur = useCallback(
    (fieldName) => {
      // Only clear the focused field if the blur is to an element outside our form
      setTimeout(() => {
        const activeElement = document.activeElement;
        const isActiveElementInForm =
          activeElement &&
          ((activeElement.name &&
            requiredFields.includes(activeElement.name)) ||
            activeElement.closest("[data-dropdown]"));

        if (!isActiveElementInForm) {
          focusedField.current = null;
          isUserInteracting.current = false;
          setShouldRestoreFocus(false);
        }
      }, 50);
    },
    [requiredFields]
  );

  // Error guide component
  const ErrorGuide = useMemo(
    () => () =>
      (
        <AnimatePresence mode="wait">
          {hasError && Object.keys(errors).length > 0 && (
            <motion.div
              key="error-guide"
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
              variants={errorGuideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="text-red-500 text-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <AlertCircle className="w-6 h-6" />
                </motion.div>
                <div>
                  <p className="text-red-700 font-bold text-sm mb-1">
                    يرجى تصحيح الأخطاء التالية
                  </p>
                  <div className="mt-2 text-xs text-red-600">
                    الحقول التي بها أخطاء: {Object.keys(errors).length}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ),
    [hasError, errors, errorGuideVariants]
  );

  // Field wrapper component with error handling
  const FieldWrapper = useCallback(
    ({ children, fieldName, label, required = true, className = "" }) => {
      const hasFieldError = errors[fieldName];

      return (
        <motion.div
          layout
          variants={fieldVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate="visible"
          className={`relative group ${className} ${hasFieldError ? "" : ""}`}
        >
          <label
            className={`flex items-center gap-2 text-sm font-bold mb-2 transition-colors duration-300 ${
              hasFieldError ? "text-red-600" : "text-[#3b003b]"
            }`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
            {hasFieldError && (
              <motion.span
                className="inline-block"
                animate={{ x: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                ⚠️
              </motion.span>
            )}
          </label>
          {children}
          <AnimatePresence mode="wait">
            {hasFieldError && (
              <motion.div
                key={`error-${fieldName}`}
                variants={errorMessageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-2 p-2 bg-red-100 border border-red-300 rounded-lg"
                layout
              >
                <p className="text-red-600 text-sm flex items-center gap-2 mb-0">
                  <AlertCircle className="w-4 h-4" />
                  {hasFieldError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    },
    [errors, fieldVariants, errorMessageVariants]
  );

  return (
    <motion.div
      ref={sectionRef}
      variants={containerVariants}
      initial={hasAnimated.current ? false : "hidden"}
      animate="visible"
      className={`space-y-6 ${
        hasError ? "ring-2 ring-red-300 ring-opacity-30 rounded-xl p-4" : ""
      }`}
      layout
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#3b003b] mb-2">
          المعلومات الشخصية
        </h2>
        <div className="w-20 h-1 bg-[#ffd700] mx-auto rounded-full"></div>
      </div>

      {/* <ErrorGuide /> */}

      <div className="flex flex-col md:grid md:!grid-cols-2 gap-6">
        {/* Full Name */}
        <FieldWrapper fieldName="teacher_name" label="الاسم الكامل">
          <div className="relative">
            <motion.input
              layout
              ref={(el) => (errorFieldRefs.current.teacher_name = el)}
              onChange={handleEnhancedInputChange}
              onFocus={() => handleFieldFocus("teacher_name")}
              onBlur={() => handleFieldBlur("teacher_name")}
              onKeyUp={(e) => handleKeyUp(e, "teacher_name")}
              onMouseUp={(e) => handleMouseUp(e, "teacher_name")}
              className={`w-full pr-3 py-3 !pl-[2rem] focus-visible:!border-[#ffd700] focus-visible:outline-none border-2 rounded-xl text-right transition-all duration-300 focus:scale-[1.02] shadow-sm ${
                errors.teacher_name
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
              style={{
                borderColor: errors.teacher_name ? "#ef4444" : undefined,
              }}
              type="text"
              name="teacher_name"
              value={formData.teacher_name}
              id="teacher_name"
              placeholder="الاسم الكامل"
            />
            {formData.teacher_name && !errors.teacher_name && (
              <motion.div
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-green-500 text-sm">✓</span>
              </motion.div>
            )}
          </div>
        </FieldWrapper>

        {/* Gender */}
        <FieldWrapper fieldName="gender" label="النوع">
          <motion.div
            layout
            className={`relative ${
              errors.gender ? "ring-2 ring-red-300 rounded-xl" : ""
            }`}
            data-dropdown="true"
          >
            <CustomDropdown
              options={genderOptions}
              value={formData.gender}
              onChange={handleDropdownChange}
              placeholder="اختر النوع"
              error={errors.gender}
              name="gender"
              className={`hover:scale-100 ${
                errors.gender ? "border-red-500" : ""
              }`}
              onFocus={() => handleFieldFocus("gender")}
              onBlur={() => handleFieldBlur("gender")}
            />
            {formData.gender && !errors.gender && (
              <motion.div
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-green-500 text-sm">✓</span>
              </motion.div>
            )}
          </motion.div>
        </FieldWrapper>

        {/* Email */}
        <FieldWrapper fieldName="teacher_email" label="البريد الإلكتروني">
          <div className="relative">
            <motion.input
              layout
              ref={(el) => (errorFieldRefs.current.teacher_email = el)}
              onChange={handleEnhancedInputChange}
              onFocus={() => handleFieldFocus("teacher_email")}
              onBlur={() => handleFieldBlur("teacher_email")}
              className={`w-full p-3 pl-[4rem] focus-visible:!border-[#ffd700] focus-visible:outline-none border-2 rounded-xl text-right transition-all duration-300 focus:scale-[1.02] shadow-sm ${
                errors.teacher_email
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
              style={{
                borderColor: errors.teacher_email ? "#ef4444" : undefined,
              }}
              type="email"
              name="teacher_email"
              value={formData.teacher_email}
              id="teacher_email"
              placeholder="example@email.com"
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              {formData.teacher_email && !errors.teacher_email ? (
                <motion.span
                  className="text-green-500 text-sm"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  ✓
                </motion.span>
              ) : (
                <svg
                  className={`w-5 h-5 ${
                    errors.teacher_email ? "text-red-400" : "text-gray-400"
                  }`}
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
              )}
            </div>
          </div>
        </FieldWrapper>

        {/* Phone */}
        <FieldWrapper fieldName="teacher_phone" label="رقم الهاتف">
          <div className="relative">
            <motion.input
              layout
              ref={(el) => (errorFieldRefs.current.teacher_phone = el)}
              onChange={handleEnhancedInputChange}
              onFocus={() => handleFieldFocus("teacher_phone")}
              onBlur={() => handleFieldBlur("teacher_phone")}
              onKeyUp={(e) => handleKeyUp(e, "teacher_phone")}
              onMouseUp={(e) => handleMouseUp(e, "teacher_phone")}
              className={`w-full pr-3 py-3 pl-[3.5rem] focus-visible:!border-[#ffd700] focus-visible:outline-none border-2 rounded-xl text-right transition-all duration-300 focus:scale-[1.02] shadow-sm ${
                errors.teacher_phone
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
              style={{
                borderColor: errors.teacher_phone ? "#ef4444" : undefined,
              }}
              type="text"
              name="teacher_phone"
              value={formData.teacher_phone}
              id="teacher_phone"
              placeholder="01xxxxxxxxx"
            />
            {formData.teacher_phone && !errors.teacher_phone && (
              <motion.div
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-green-500 text-sm">✓</span>
              </motion.div>
            )}
          </div>
        </FieldWrapper>

        {/* Personal Summary */}
        <FieldWrapper
          fieldName="teacher_summary"
          label={
            <div className="flex items-center gap-2">
              <span>الملخص الشخصي</span>
              <Tooltip
                className="cursor-pointer"
                title={
                  <div style={{ direction: "rtl" }}>
                    لتسهيل التعرف عليك يرجى وضع الملخص الشخصي لك
                  </div>
                }
              >
                <Info className="w-4 h-4 text-blue-500" />
              </Tooltip>
            </div>
          }
        >
          <div className="relative">
            <motion.textarea
              layout
              ref={(el) => (errorFieldRefs.current.teacher_summary = el)}
              onChange={handleEnhancedInputChange}
              onFocus={() => handleFieldFocus("teacher_summary")}
              onBlur={() => handleFieldBlur("teacher_summary")}
              onKeyUp={(e) => handleKeyUp(e, "teacher_summary")}
              onMouseUp={(e) => handleMouseUp(e, "teacher_summary")}
              className={`w-full pr-3 py-3 pl-[3.5rem] border-2 rounded-xl focus-visible:!border-[#ffd700] focus-visible:outline-none text-right transition-all duration-300 focus:scale-[1.02] shadow-sm min-h-[100px] resize-none ${
                errors.teacher_summary
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
              style={{
                borderColor: errors.teacher_summary ? "#ef4444" : undefined,
              }}
              name="teacher_summary"
              value={formData.teacher_summary}
              id="teacher_summary"
              placeholder="اكتب ملخصاً شخصياً عنك وعن خبراتك التعليمية..."
            />
            {formData.teacher_summary && !errors.teacher_summary && (
              <motion.div
                className="absolute left-2 top-3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-green-500 text-sm">✓</span>
              </motion.div>
            )}
          </div>
        </FieldWrapper>

        {/* Specialization */}
        <FieldWrapper fieldName="teacher_role" label="اختصاصك الأساسي">
          <div className="relative">
            <motion.input
              layout
              ref={(el) => (errorFieldRefs.current.teacher_role = el)}
              onChange={handleEnhancedInputChange}
              onFocus={() => handleFieldFocus("teacher_role")}
              onBlur={() => handleFieldBlur("teacher_role")}
              onKeyUp={(e) => handleKeyUp(e, "teacher_role")}
              onMouseUp={(e) => handleMouseUp(e, "teacher_role")}
              className={`w-full pr-3 py-3 pl-[3.5rem] focus-visible:!border-[#ffd700] focus-visible:outline-none border-2 rounded-xl text-right transition-all duration-300 focus:scale-[1.02] shadow-sm ${
                errors.teacher_role
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
              style={{
                borderColor: errors.teacher_role ? "#ef4444" : undefined,
              }}
              type="text"
              name="teacher_role"
              value={formData.teacher_role}
              id="teacher_role"
              placeholder="مثال: مدرس رياضيات، مدرس فيزياء..."
            />
            {formData.teacher_role && !errors.teacher_role && (
              <motion.div
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-green-500 text-sm">✓</span>
              </motion.div>
            )}
          </div>
        </FieldWrapper>

        {/* Experience */}
        <FieldWrapper
          fieldName="experience_id"
          label={
            <div className="flex items-center gap-2">
              <span>الخبرة</span>
              <Tooltip
                className="cursor-pointer"
                title={
                  <div style={{ direction: "rtl" }}>
                    سيتم مراجعة الخبرة قبل الموافقة جيداً وعليها سيحدد سعر الحصة
                    ويعرض للطلاب
                  </div>
                }
              >
                <Info className="w-4 h-4 text-blue-500" />
              </Tooltip>
            </div>
          }
          className="col-span-2"
        >
          <motion.div
            layout
            className={`relative ${
              errors.experience_id ? "ring-2 ring-red-300 rounded-xl" : ""
            }`}
            data-dropdown="true"
          >
            <CustomDropdown
              options={experienceOptions}
              value={formData.experience_id}
              onChange={handleDropdownChange}
              placeholder="اختر مستوى الخبرة"
              error={errors.experience_id}
              name="experience_id"
              className={`hover:scale-100 ${
                errors.experience_id ? "border-red-500" : ""
              }`}
              onFocus={() => handleFieldFocus("experience_id")}
              onBlur={() => handleFieldBlur("experience_id")}
            />
            {formData.experience_id && !errors.experience_id && (
              <motion.div
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-green-500 text-sm">✓</span>
              </motion.div>
            )}
          </motion.div>
        </FieldWrapper>
      </div>
    </motion.div>
  );
};

export default PersonalInfoSection;
