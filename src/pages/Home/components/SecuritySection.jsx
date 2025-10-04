import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const SecuritySection = ({
  formData,
  handleInputChange,
  errors,
  setErrors,
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
  const [showPassword, setShowPassword] = useState(false);
  const cursorPosition = useRef({});

  // Animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: hasAnimated.current ? 0 : 0.7,
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
          delay: hasAnimated.current ? 0 : 1.3,
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
  const requiredFields = useMemo(() => ["teacher_password"], []);

  // Helper function to safely set cursor position
  const setCursorPosition = useCallback((element, fieldName) => {
    if (element && element.value) {
      const position =
        cursorPosition.current[fieldName] || element.value.length;

      const supportedTypes = ["text", "search", "url", "tel", "password"];
      const inputType = element.type || "text";

      if (supportedTypes.includes(inputType) && element.setSelectionRange) {
        try {
          element.setSelectionRange(position, position);
        } catch (error) {
          console.warn("Could not set cursor position:", error);
        }
      }
    }
  }, []);

  // Store cursor position before any operations
  const storeCursorPosition = useCallback((element, fieldName) => {
    if (element && (element.type === "password" || element.type === "text")) {
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
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle initial error state
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

  // Restore focus after re-render
  useEffect(() => {
    if (
      shouldRestoreFocus &&
      focusedField.current &&
      errorFieldRefs.current[focusedField.current]
    ) {
      const element = errorFieldRefs.current[focusedField.current];
      if (element) {
        requestAnimationFrame(() => {
          element.focus();
          setCursorPosition(element, focusedField.current);
          setShouldRestoreFocus(false);
        });
      }
    }
  }, [shouldRestoreFocus, setCursorPosition, errors]);

  // Function to clear specific field error with focus preservation
  const clearFieldError = useCallback(
    (fieldName) => {
      if (errors[fieldName] && setErrors) {
        const element = errorFieldRefs.current[fieldName];
        if (element) {
          storeCursorPosition(element, fieldName);
        }

        isUserInteracting.current = true;
        focusedField.current = fieldName;
        setShouldRestoreFocus(true);

        const newErrors = { ...errors };
        delete newErrors[fieldName];
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && setHasError) {
          setHasError(false);
        }
      }
    },
    [errors, setErrors, setHasError, storeCursorPosition]
  );

  // Enhanced input change handler
  const handleEnhancedInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      storeCursorPosition(e.target, name);
      isUserInteracting.current = true;
      focusedField.current = name;

      handleInputChange(e);

      if (errors[name] && value.length > 0) {
        clearFieldError(name);
      }
    },
    [errors, clearFieldError, handleInputChange, storeCursorPosition]
  );

  // Handle focus events
  const handleFieldFocus = useCallback((fieldName) => {
    isUserInteracting.current = true;
    focusedField.current = fieldName;
    setShouldRestoreFocus(false);
  }, []);

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
      setTimeout(() => {
        const activeElement = document.activeElement;
        const isActiveElementInForm =
          activeElement &&
          activeElement.name &&
          requiredFields.includes(activeElement.name);

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

  // Field wrapper component
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
        <h2 className="text-2xl font-bold text-[#3b003b] mb-2">الأمان</h2>
        <div className="w-20 h-1 bg-[#ffd700] mx-auto rounded-full"></div>
      </div>

      {/* <ErrorGuide /> */}

      {/* Password */}
      <FieldWrapper fieldName="teacher_password" label="كلمة المرور">
        <div className="relative">
          <motion.input
            layout
            ref={(el) => (errorFieldRefs.current.teacher_password = el)}
            onChange={handleEnhancedInputChange}
            onFocus={() => handleFieldFocus("teacher_password")}
            onBlur={() => handleFieldBlur("teacher_password")}
            onKeyUp={(e) => handleKeyUp(e, "teacher_password")}
            onMouseUp={(e) => handleMouseUp(e, "teacher_password")}
            className={`w-full p-3 pl-[4rem] border-2 rounded-xl text-left transition-all duration-300 focus:scale-[1.02] shadow-sm focus-visible:!border-[#ffd700] focus-visible:outline-none ${
              errors.teacher_password
                ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            style={{
              borderColor: errors.teacher_password ? "#ef4444" : undefined,
            }}
            type={showPassword ? "text" : "password"}
            name="teacher_password"
            value={formData.teacher_password}
            id="teacher_password"
            placeholder="أدخل كلمة مرور قوية"
          />

          {/* Show/Hide Password Button */}
          <div className="absolute inset-y-0 left-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {formData.teacher_password && !errors.teacher_password && (
            <motion.div
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-green-500 text-sm">✓</span>
            </motion.div>
          )}
        </div>
      </FieldWrapper>
    </motion.div>
  );
};

export default SecuritySection;
