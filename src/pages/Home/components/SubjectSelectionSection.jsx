import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import CustomDropdown from "./CustomDropdown";

const SubjectSelectionSection = ({
  universities,
  grades,
  subjects,
  selectedSubjects,
  setSelectedSubjects,
  currentUniversity,
  setCurrentUniversity,
  currentGrade,
  setCurrentGrade,
  currentSubject,
  setCurrentSubject,
  showSubjectSelect,
  setShowSubjectSelect,
  hasError = false,
  setHasError,
}) => {
  const sectionRef = useRef(null);

  // Subject selection handlers
  const handleUniversitySelect = (universityId) => {
    setCurrentUniversity(universityId);
    setShowSubjectSelect("grade");
    if (setHasError) setHasError(false);
  };

  const handleGradeSelect = (gradeId) => {
    setCurrentGrade(gradeId);
    setCurrentSubject(null);
    setShowSubjectSelect("subject");
    if (setHasError) setHasError(false);
  };

  const handleSubjectSelect = (subjectId) => {
    const selectedUniversity = universities.find(
      (u) => u.university_id === currentUniversity
    );
    const selectedGrade = grades.find((g) => g.grade_id === currentGrade);
    const selectedSubject = subjects.find((s) => s.course_id === subjectId);

    // Check if this combination already exists
    const exists = selectedSubjects.some(
      (item) => item.gradeId === currentGrade && item.subjectId === subjectId
    );

    if (exists) {
      toast.error("تم اختيار هذه المادة والصف مسبقاً");
      return;
    }

    const newSelection = {
      universityId: currentUniversity,
      universityName: selectedUniversity?.university_name || currentUniversity,
      gradeId: currentGrade,
      subjectId: subjectId,
      gradeName: selectedGrade?.grade_name || currentGrade,
      subjectName: selectedSubject?.course_name || currentSubject,
    };

    setSelectedSubjects([...selectedSubjects, newSelection]);

    // Reset to grade selection for next item
    setCurrentUniversity(0);
    setCurrentGrade(0);
    setCurrentSubject(0);
    setShowSubjectSelect("university");
    if (setHasError) setHasError(false);
  };

  const handleRemoveSubject = (index) => {
    const newSelections = [...selectedSubjects];
    newSelections.splice(index, 1);
    setSelectedSubjects(newSelections);
  };

  const handleBackToStep = (step) => {
    if (step === "university") {
      setCurrentUniversity(null);
      setShowSubjectSelect("university");
    }

    if (step === "grade") {
      setCurrentGrade(null);
      setCurrentSubject(null);
      setShowSubjectSelect("grade");
    }
  };

  // Scroll to section when there's an error
  useEffect(() => {
    if (hasError && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [hasError]);

  // Get available options
  const availableGradeOptions = grades.map((grade) => ({
    label: grade.grade_name,
    value: grade.grade_id,
  }));

  const availableSubjectOptions = subjects
    .filter(
      (subject) =>
        !selectedSubjects.some(
          (item) =>
            item.gradeId === currentGrade &&
            item.subjectId === subject.course_id
        )
    )
    .map((subject) => ({
      label: subject.course_name,
      value: subject.course_id,
    }));

  // Get current step info for the guide
  const getCurrentStepInfo = () => {
    switch (showSubjectSelect) {
      case "university":
        return {
          step: 1,
          total: 3,
          message: "اختر المرحلة التعليمية",
          isCompleted: currentUniversity !== null && currentUniversity !== 0,
        };
      case "grade":
        return {
          step: 2,
          total: 3,
          message: "اختر الصف الدراسي",
          isCompleted: currentGrade !== null && currentGrade !== 0,
        };
      case "subject":
        return {
          step: 3,
          total: 3,
          message: "اختر المادة الدراسية",
          isCompleted: selectedSubjects.length > 0,
        };
      default:
        return {
          step: 1,
          total: 3,
          message: "ابدأ بالخطوة الأولى",
          isCompleted: false,
        };
    }
  };

  const stepInfo = getCurrentStepInfo();

  // Bouncing pointer component
  const BouncingPointer = () => (
    <motion.div
      className="flex items-center gap-2 mb-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-2xl"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        👈
      </motion.div>
      <span className="text-[#3b003b] font-semibold text-sm">
        {stepInfo.message}
      </span>
    </motion.div>
  );

  // Error message component
  const ErrorGuide = () => (
    <AnimatePresence>
      {hasError && (
        <motion.div
          className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3 }}
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
              ⚠️
            </motion.div>
            <div>
              <p className="text-red-700 font-bold text-sm mb-1">
                يجب اختيار الخطوات كاملة
              </p>
              <p className="text-red-600 text-xs">
                المرحلة - الصف - مادة واحدة على الأقل
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Step progress indicator
  const StepProgress = () => (
    <div className="mb-6">
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                step <= stepInfo.step
                  ? "bg-[#3b003b] text-white border-[#3b003b]"
                  : "bg-gray-200 text-gray-500 border-gray-300"
              }`}
              animate={
                step === stepInfo.step && hasError
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(239, 68, 68, 0.7)",
                        "0 0 0 10px rgba(239, 68, 68, 0)",
                        "0 0 0 0 rgba(239, 68, 68, 0)",
                      ],
                    }
                  : step === stepInfo.step
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(59, 0, 59, 0.4)",
                        "0 0 0 8px rgba(59, 0, 59, 0)",
                        "0 0 0 0 rgba(59, 0, 59, 0)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: step === stepInfo.step ? Infinity : 0,
              }}
            >
              {step}
            </motion.div>
            {step < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  step < stepInfo.step ? "bg-[#3b003b]" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-gray-600">
          الخطوة {stepInfo.step} من {stepInfo.total}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`space-y-6 ${
        hasError
          ? "ring-2 ring-red-300 ring-opacity-50 rounded-xl p-4 bg-red-50"
          : ""
      }`}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#3b003b] mb-2">
          اختيار المواد التي تدرسها
        </h2>
        <div className="w-20 h-1 bg-[#ffd700] mx-auto rounded-full"></div>
      </div>

      <StepProgress />
      <ErrorGuide />

      {showSubjectSelect === "university" ? (
        <div className="mb-4">
          {hasError && <BouncingPointer />}
          <label
            className={`block mb-2 font-semibold ${
              hasError ? "text-red-600" : "text-[#3b003b]"
            }`}
          >
            اختر المرحلة:
            <span className="text-red-500">*</span>
          </label>
          <div className={hasError ? "ring-2 ring-red-300 rounded-xl" : ""}>
            <CustomDropdown
              options={universities.map((university) => ({
                label: university.university_name,
                value: university.university_id,
              }))}
              value={currentUniversity}
              onChange={({ target }) => handleUniversitySelect(target.value)}
              placeholder="اختر المرحلة"
              name="university"
              className={`hover:!scale-100 ${
                hasError ? "border-red-300 focus:border-red-500" : ""
              }`}
            />
          </div>
        </div>
      ) : showSubjectSelect === "grade" ? (
        <div className="mb-4">
          {hasError && <BouncingPointer />}
          <label
            className={`block mb-2 font-semibold ${
              hasError ? "text-red-600" : "text-[#3b003b]"
            }`}
          >
            {(() => {
              const university = universities.find(
                (u) => u.university_id === currentUniversity
              );
              return `اختر الصف ${
                university?.university_name || currentUniversity
              }:`;
            })()}
            <span className="text-red-500">*</span>
          </label>
          <div className={hasError ? "ring-2 ring-red-300 rounded-xl" : ""}>
            <CustomDropdown
              options={availableGradeOptions}
              value={currentGrade}
              onChange={({ target }) => handleGradeSelect(target.value)}
              placeholder="اختر الصف"
              name="grade"
              className={`hover:!scale-100 ${
                hasError ? "border-red-300 focus:border-red-500" : ""
              }`}
            />
          </div>

          <div className="mt-2">
            <button
              type="button"
              className="text-sm cursor-pointer hover:underline text-[#3b003b] font-medium"
              onClick={() => handleBackToStep("university")}
            >
              العودة لاختيار مرحلة أخرى
            </button>
          </div>
        </div>
      ) : showSubjectSelect === "subject" ? (
        <div className="mb-4">
          {hasError && <BouncingPointer />}
          <label
            className={`block mb-2 font-semibold ${
              hasError ? "text-red-600" : "text-[#3b003b]"
            }`}
          >
            {(() => {
              const grade = grades.find((g) => g.grade_id === currentGrade);
              return `اختر المادة للصف ${grade?.grade_name || currentGrade}:`;
            })()}
            <span className="text-red-500">*</span>
          </label>
          <div className={hasError ? "ring-2 ring-red-300 rounded-xl" : ""}>
            <CustomDropdown
              options={availableSubjectOptions}
              value={currentSubject}
              onChange={({ target }) => handleSubjectSelect(target.value)}
              placeholder="اختر المادة"
              name="subject"
              className={`hover:!scale-100 ${
                hasError ? "border-red-300 focus:border-red-500" : ""
              }`}
            />
          </div>
          <div className="mt-2 flex justify-between">
            <button
              type="button"
              className="text-sm cursor-pointer hover:underline text-[#3b003b] font-medium"
              onClick={() => handleBackToStep("university")}
            >
              العودة لاختيار مرحلة أخرى
            </button>
            <button
              type="button"
              className="text-sm cursor-pointer hover:underline text-[#3b003b] font-medium"
              onClick={() => handleBackToStep("grade")}
            >
              العودة لاختيار صف آخر
            </button>
          </div>
        </div>
      ) : null}

      {selectedSubjects.length > 0 && (
        <motion.div
          className="mb-4 p-4 rounded-xl"
          style={{
            border: "2px solid rgba(59, 0, 59, 0.2)",
            background: "rgba(59, 0, 59, 0.05)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block mb-3 font-semibold text-[#3b003b]">
            المواد المحددة:
          </label>
          <div className="space-y-2">
            {selectedSubjects.map((item, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-[#3b003b] font-medium">
                  {item.universityName} - {item.gradeName} - {item.subjectName}
                </span>
                <motion.button
                  type="button"
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleRemoveSubject(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  حذف
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completion status */}
      <AnimatePresence>
        {selectedSubjects.length > 0 && !hasError && (
          <motion.div
            className="p-3 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-green-700 font-medium text-sm">
                تم اختيار {selectedSubjects.length} مادة بنجاح
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubjectSelectionSection;
