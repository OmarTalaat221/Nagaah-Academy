import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Award,
  Target,
  TrendingUp,
  RotateCcw,
  Send,
  AlertTriangle,
  Timer,
  Shield,
  Eye,
  Maximize,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../constants";

export default function UnsolvedExamView({ data }) {
  const navigate = useNavigate();
  const UserData = JSON.parse(localStorage.getItem("NagahUser"));
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const timerRef = useRef(null);
  const warningShownRef = useRef(false);

  // Security states
  const [securityViolations, setSecurityViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [showFullscreenInstructions, setShowFullscreenInstructions] =
    useState(false);
  const maxViolations = 3;

  // Existing states
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(data.length).fill(null));
  const [submittedAnswers, setSubmittedAnswers] = useState(
    Array(data.length).fill(false)
  );
  const [correctAnsIndex, setCorrectAnsIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQuestion = data[questionIndex];

  // Security: Prevent browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
      handleSecurityViolation("محاولة استخدام زر العودة");
    };

    // Push initial state
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Security: Prevent browser exit
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!showResults && !isTimeUp) {
        event.preventDefault();
        event.returnValue =
          "هل أنت متأكد من الخروج من الامتحان؟ سيتم اعتبار الامتحان غير مكتمل.";
        return "هل أنت متأكد من الخروج من الامتحان؟ سيتم اعتبار الامتحان غير مكتمل.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [showResults, isTimeUp]);

  // Security: Detect tab switching and window focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !showResults && !isTimeUp) {
        handleSecurityViolation("تغيير النافذة أو التبديل بين التطبيقات");
      }
    };

    const handleBlur = () => {
      if (!showResults && !isTimeUp) {
        handleSecurityViolation("فقدان التركيز على نافذة الامتحان");
      }
    };

    const handleFocus = () => {
      // User came back to the exam
      if (!showResults && !isTimeUp) {
        toast.info("مرحباً بعودتك إلى الامتحان");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [showResults, isTimeUp]);

  // Security: Handle fullscreen mode - AUTOMATIC ON ENTRY
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        const elem = document.documentElement;

        // Try different fullscreen methods for cross-browser compatibility
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        }

        toast.success("تم تفعيل وضع الشاشة الكاملة للامتحان");
      } catch (error) {
        console.error("Fullscreen request failed:", error);
        toast.warning("لم يتم تفعيل الشاشة الكاملة. يرجى الضغط على F11 يدوياً");

        // Show instructions to user
        setShowFullscreenInstructions(true);
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      if (!isCurrentlyFullscreen && !showResults && !isTimeUp) {
        handleSecurityViolation("الخروج من وضع الشاشة الكاملة");

        // Try to request fullscreen again after a short delay
        setTimeout(() => {
          requestFullscreen();
        }, 1000);
      }
    };

    // Request fullscreen immediately when component mounts
    requestFullscreen();

    // Add event listeners for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      // Remove event listeners
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );

      // Exit fullscreen when component unmounts
      try {
        if (document.exitFullscreen) {
          document
            .exitFullscreen()
            .catch((err) => console.log("Exit fullscreen failed:", err));
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    };
  }, [showResults, isTimeUp]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      handleSecurityViolation("محاولة استخدام القائمة السياقية");
    };

    const handleKeyDown = (e) => {
      // Prevent common shortcuts
      if (
        e.key === "F12" || // Developer tools
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Developer tools
        (e.ctrlKey && e.shiftKey && e.key === "C") || // Developer tools
        (e.ctrlKey && e.shiftKey && e.key === "J") || // Console
        (e.ctrlKey && e.key === "u") || // View source
        (e.ctrlKey && e.key === "U") || // View source
        (e.ctrlKey && e.key === "s") || // Save page
        (e.ctrlKey && e.key === "S") || // Save page
        (e.ctrlKey && e.key === "p") || // Print
        (e.ctrlKey && e.key === "P") || // Print
        (e.ctrlKey && e.key === "r") || // Refresh
        (e.ctrlKey && e.key === "R") || // Refresh
        e.key === "F5" || // Refresh
        (e.altKey && e.key === "Tab") || // Alt+Tab
        (e.ctrlKey && e.key === "Tab") || // Ctrl+Tab
        (e.ctrlKey && e.shiftKey && e.key === "Tab") || // Ctrl+Shift+Tab
        (e.ctrlKey && e.key === "w") || // Close tab
        (e.ctrlKey && e.key === "W") || // Close tab
        (e.ctrlKey && e.key === "t") || // New tab
        (e.ctrlKey && e.key === "T") || // New tab
        (e.ctrlKey && e.key === "n") || // New window
        (e.ctrlKey && e.key === "N") || // New window
        (e.altKey && e.key === "F4") ||
        // Alt+F4
        e.key === "ESC" // Alt+F4
      ) {
        e.preventDefault();
        handleSecurityViolation(
          "محاولة استخدام اختصارات لوحة المفاتيح المحظورة"
        );
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Security violation handler
  const handleSecurityViolation = useCallback(
    (violationType) => {
      setSecurityViolations((prev) => {
        const newCount = prev + 1;

        if (newCount >= maxViolations) {
          toast.error(
            `تم تجاوز الحد المسموح من المخالفات (${maxViolations}). سيتم إنهاء الامتحان تلقائياً.`
          );
          // Auto-submit current question and finish exam
          if (selectedOption !== null && !submittedAnswers[questionIndex]) {
            handleSubmitAnswers(true);
          }
          setTimeout(() => {
            setShowResults(true);
          }, 2000);
        } else {
          setShowSecurityWarning(true);
          toast.error(
            `مخالفة أمنية: ${violationType}. المخالفة ${newCount} من ${maxViolations}`
          );
        }

        return newCount;
      });
    },
    [selectedOption, submittedAnswers, questionIndex, maxViolations]
  );

  // Initialize timer
  useEffect(() => {
    const examTime = searchParams.get("exam_time");
    if (examTime) {
      // Convert minutes to seconds
      const timeInSeconds = parseInt(examTime) * 60;
      setTimeRemaining(timeInSeconds);
    }
  }, [searchParams]);

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining <= 0 || showResults) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Show warning when 5 minutes left
        if (newTime <= 300 && !warningShownRef.current) {
          setShowTimeWarning(true);
          warningShownRef.current = true;
          toast.warning("تبقى 5 دقائق فقط!");
        }

        // Auto-submit when time is up
        if (newTime <= 0) {
          setIsTimeUp(true);
          handleTimeUp();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, showResults]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Auto-submit current question if selected but not submitted
    if (selectedOption !== null && !submittedAnswers[questionIndex]) {
      handleSubmitAnswers(true);
    }

    // Auto-finish exam
    setTimeout(() => {
      toast.error("انتهى الوقت المحدد للامتحان!");
      setShowResults(true);
    }, 1000);
  }, [selectedOption, submittedAnswers, questionIndex]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    const percentage =
      (timeRemaining / (parseInt(searchParams.get("exam_time")) * 60)) * 100;
    if (percentage <= 10) return "text-red-400 animate-pulse";
    if (percentage <= 25) return "text-orange-400";
    return "text-[#ffd700]";
  };

  // Get timer background color
  const getTimerBgColor = () => {
    const percentage =
      (timeRemaining / (parseInt(searchParams.get("exam_time")) * 60)) * 100;
    if (percentage <= 10)
      return "from-red-500/20 to-red-600/20 border-red-400/50";
    if (percentage <= 25)
      return "from-orange-500/20 to-orange-600/20 border-orange-400/50";
    return "from-[#ffd700]/20 to-[#ffed4e]/20 border-[#ffd700]/50";
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const questionVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const optionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1 },
    }),
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  function handleNextQuestion() {
    if (questionIndex < data.length - 1) {
      setQuestionIndex((prevState) => prevState + 1);
      setSelectedOption(null);
    }
  }

  function handlePrevQuestion() {
    if (questionIndex > 0) {
      setQuestionIndex((prevState) => prevState - 1);
      setSelectedOption(null);
    }
  }

  function handleChooseAnswer(index) {
    if (submittedAnswers[questionIndex] || isTimeUp) return;

    const newAnswers = [...answers];
    newAnswers[questionIndex] = index;
    setAnswers(newAnswers);
    setSelectedOption(index);
  }

  function handleSubmitAnswers(autoSubmit = false) {
    if (answers[questionIndex] !== null) {
      const selectedIndex = answers[questionIndex];
      const question = data[questionIndex];
      const selectedAnswer = question.real_answers[selectedIndex];

      const isCorrect = selectedAnswer.answer_check;

      if (isCorrect) {
        setCorrectAnsIndex((prev) => prev + 1);
      }

      const newSubmittedAnswers = [...submittedAnswers];
      newSubmittedAnswers[questionIndex] = true;
      setSubmittedAnswers(newSubmittedAnswers);

      setQuizAnswers((prev) => [
        ...prev,
        {
          question_id: question.question_id,
          student_id: UserData.student_id,
          chosen_answer: selectedAnswer.answer_text,
          exam_id: id,
          correct_or_not: isCorrect,
        },
      ]);

      if (autoSubmit) {
        toast.info("تم إرسال الإجابة تلقائياً");
      }
    }
  }

  function handleQuestionClick(index) {
    if (isTimeUp) return;
    setQuestionIndex(index);
    setSelectedOption(null);
  }

  function finishQuiz() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const dataSend = {
      ans_data: quizAnswers,
      security_violations: securityViolations,
    };

    axios
      .post(
        base_url + `/user/courses/insert_solving_uqs.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(res?.data?.message);
          navigate(`/exams/courses?course_id=${data[0]?.course_id}`);
        } else {
          toast.error("حدث خطأ ما");
        }
      });
  }

  const getQuestionStatus = (index) => {
    if (!submittedAnswers[index]) return "unanswered";
    if (
      answers[index] !== null &&
      data[index].real_answers[answers[index]].answer_check
    ) {
      return "correct";
    }
    return "incorrect";
  };

  const getProgressPercentage = () => {
    const submitted = submittedAnswers.filter(Boolean).length;
    return (submitted / data.length) * 100;
  };

  // Security Warning Modal
  const SecurityWarningModal = React.memo(() => (
    <>
      {showSecurityWarning && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
          style={{ direction: "rtl" }}
        >
          <div className="bg-gradient-to-br from-red-500/90 to-red-700/90 rounded-2xl p-8 max-w-md mx-4 text-center backdrop-blur-sm border border-red-400">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">تحذير أمني!</h3>
            <p className="text-white/90 mb-4">
              تم اكتشاف مخالفة أمنية. المخالفة {securityViolations} من{" "}
              {maxViolations}
            </p>
            <p className="text-white/80 text-sm mb-6">
              يرجى الالتزام بقوانين الامتحان وعدم محاولة الخروج من نافذة
              الامتحان أو استخدام اختصارات لوحة المفاتيح
            </p>
            <button
              onClick={() => setShowSecurityWarning(false)}
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              فهمت، لن أكرر ذلك
            </button>
          </div>
        </div>
      )}
    </>
  ));

  // Time Warning Modal
  const TimeWarningModal = React.memo(() => (
    <>
      {showTimeWarning && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          style={{ direction: "rtl" }}
        >
          <div className="bg-gradient-to-br from-orange-500/90 to-red-500/90 rounded-2xl p-8 max-w-md mx-4 text-center backdrop-blur-sm">
            <AlertTriangle className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">تحذير!</h3>
            <p className="text-white/90 mb-6">
              تبقى 5 دقائق فقط على انتهاء الامتحان
            </p>
            <button
              onClick={() => setShowTimeWarning(false)}
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold"
            >
              فهمت
            </button>
          </div>
        </div>
      )}
    </>
  ));

  // Fullscreen Instructions Modal
  const FullscreenInstructionsModal = React.memo(() => (
    <>
      {showFullscreenInstructions && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          style={{ direction: "rtl" }}
        >
          <div className="bg-gradient-to-br from-blue-500/90 to-blue-700/90 rounded-2xl p-8 max-w-md mx-4 text-center backdrop-blur-sm border border-blue-400">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Maximize className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              تفعيل الشاشة الكاملة
            </h3>
            <p className="text-white/90 mb-4">
              لم يتم تفعيل وضع الشاشة الكاملة تلقائياً
            </p>
            <p className="text-white/80 text-sm mb-6">
              يرجى الضغط على المفتاح F11 لتفعيل وضع الشاشة الكاملة أو النقر على
              الزر أدناه
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  try {
                    const elem = document.documentElement;
                    if (elem.requestFullscreen) {
                      await elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) {
                      await elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) {
                      await elem.msRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                      await elem.mozRequestFullScreen();
                    }
                    setShowFullscreenInstructions(false);
                  } catch (error) {
                    toast.error("يرجى الضغط على F11 يدوياً");
                  }
                }}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                تفعيل الشاشة الكاملة
              </button>
              {/* <button
                onClick={() => setShowFullscreenInstructions(false)}
                className="bg-white/20 text-white px-6 py-2 rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                المتابعة بدون شاشة كاملة (غير مستحسن)
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  ));

  // Results Modal
  const ResultsModal = React.memo(() => (
    <>
      {showResults && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          style={{ direction: "rtl" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#2d0a30] to-[#4a0e4e] border border-[#ffd700]/50 rounded-2xl p-8 max-w-3xl w-full mx-4 text-center backdrop-blur-sm"
          >
            <Award className="w-16 h-16 text-[#ffd700] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#ffd700] mb-4">
              انتهى الامتحان!
            </h3>

            <div className="space-y-4 mb-6">
              <div className="bg-[#3b003b]/50 rounded-xl p-4">
                <div className="text-[#ffd700] font-semibold">
                  النتيجة النهائية
                </div>
                <div className="text-2xl font-bold text-white">
                  {correctAnsIndex} من {data.length}
                </div>
                <div className="text-sm text-gray-300">
                  {Math.round((correctAnsIndex / data.length) * 100)}%
                </div>
              </div>

              {securityViolations > 0 && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                  <div className="text-red-400 font-semibold">
                    المخالفات الأمنية
                  </div>
                  <div className="text-lg font-bold text-red-300">
                    {securityViolations} مخالفة
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={finishQuiz}
                className="bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#3b003b] px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all"
              >
                حفظ النتائج والعودة
              </button>
              {/* <button
                onClick={() =>
                  navigate(`/exams/courses?course_id=${data[0]?.course_id}`)
                }
                className="bg-gray-600/50 text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-600/70 transition-colors"
              >
                العودة بدون حفظ
              </button> */}
            </div>
          </motion.div>
        </div>
      )}
    </>
  ));

  return (
    <>
      <SecurityWarningModal />
      <TimeWarningModal />
      <FullscreenInstructionsModal />
      <ResultsModal />

      <motion.div
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="min-h-screen bg-gradient-to-br from-[#3b003b] via-[#4a0e4e] to-[#3b003b] p-4 select-none"
        style={{ direction: "rtl" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header with Timer and Security Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#2d0a30] to-[#4a0e4e] border border-[#ffd700]/30 rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#3b003b] px-6 py-3 rounded-xl font-bold shadow-lg"
                >
                  السؤال {questionIndex + 1} من {data.length}
                </motion.div>

                {/* Security Status */}
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    securityViolations === 0
                      ? "bg-green-500/20 border border-green-500/50"
                      : securityViolations < maxViolations
                      ? "bg-yellow-500/20 border border-yellow-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  <Shield
                    className={`w-5 h-5 ${
                      securityViolations === 0
                        ? "text-green-400"
                        : securityViolations < maxViolations
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      securityViolations === 0
                        ? "text-green-400"
                        : securityViolations < maxViolations
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    مخالفات: {securityViolations}/{maxViolations}
                  </span>
                </div>

                {/* Fullscreen Status */}
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    isFullscreen
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  <Eye
                    className={`w-5 h-5 ${
                      isFullscreen ? "text-green-400" : "text-red-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isFullscreen ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isFullscreen ? "شاشة كاملة" : "ليس شاشة كاملة"}
                  </span>
                </div>
              </div>

              {/* Timer Display */}
              {timeRemaining > 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`bg-gradient-to-r ${getTimerBgColor()} border-2 rounded-2xl px-6 py-4 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className={`w-6 h-6 ${getTimerColor()}`} />
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getTimerColor()}`}>
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-xs text-gray-300">الوقت المتبقي</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Progress Section */}
              <div className="flex-1 max-w-md w-full">
                <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-[#ffd700] to-[#ffed4e] h-full shadow-lg"
                  />
                </div>
                <div className="text-sm text-[#ffd700] mt-2 text-center">
                  {submittedAnswers.filter(Boolean).length} من {data.length}{" "}
                  مكتمل
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={questionIndex}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={questionVariants}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-[#2d0a30] to-[#4a0e4e] border border-[#ffd700]/30 rounded-2xl shadow-xl p-8 mb-6 backdrop-blur-sm relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ffd700]/10 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    {/* Question */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl md:text-3xl font-bold text-[#ffd700] mb-8 leading-relaxed"
                    >
                      {currentQuestion?.question_text}
                    </motion.h2>

                    {/* Answer Options */}
                    <div className="space-y-4 mb-8">
                      {currentQuestion?.real_answers?.map((option, index) => {
                        const isSelected = index === selectedOption;
                        const isSubmitted = submittedAnswers[questionIndex];
                        const isCorrect = option.answer_check;
                        const isUserAnswer =
                          index === answers[questionIndex] && isSubmitted;

                        let optionClass =
                          "w-full p-6 rounded-xl border-2 text-right transition-all duration-300 cursor-pointer ";

                        if (isSubmitted) {
                          if (isCorrect) {
                            optionClass +=
                              "bg-green-500/20 border-green-400 text-green-100 shadow-green-500/20 shadow-lg";
                          } else if (isUserAnswer) {
                            optionClass +=
                              "bg-red-500/20 border-red-400 text-red-100 shadow-red-500/20 shadow-lg";
                          } else {
                            optionClass +=
                              "bg-gray-600/20 border-gray-500 text-gray-300";
                          }
                        } else {
                          if (isSelected) {
                            optionClass +=
                              "bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700] shadow-[#ffd700]/20 shadow-lg";
                          } else {
                            optionClass +=
                              "bg-[#3b003b]/50 border-[#ffd700]/30 text-[#ffd700]/80 hover:bg-[#ffd700]/10 hover:border-[#ffd700]/60";
                          }
                        }

                        return (
                          <motion.button
                            key={index}
                            custom={index}
                            initial="initial"
                            animate="animate"
                            variants={optionVariants}
                            whileHover={
                              !isSubmitted && !isTimeUp ? "hover" : undefined
                            }
                            whileTap={
                              !isSubmitted && !isTimeUp ? "tap" : undefined
                            }
                            disabled={isSubmitted || isTimeUp}
                            className={optionClass}
                            onClick={() => handleChooseAnswer(index)}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  isSubmitted && isCorrect
                                    ? "bg-green-500 border-green-500"
                                    : isSubmitted && isUserAnswer
                                    ? "bg-red-500 border-red-500"
                                    : isSelected
                                    ? "bg-[#ffd700] border-[#ffd700]"
                                    : "border-current"
                                }`}
                              >
                                {isSubmitted && isCorrect && (
                                  <CheckCircle className="w-5 h-5 text-white" />
                                )}
                                {isSubmitted && isUserAnswer && !isCorrect && (
                                  <XCircle className="w-5 h-5 text-white" />
                                )}
                                {isSelected && !isSubmitted && (
                                  <div className="w-4 h-4 bg-[#3b003b] rounded-full"></div>
                                )}
                              </div>
                              <span className="text-lg font-medium">
                                {option.answer_text}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevQuestion}
                        disabled={questionIndex === 0 || isTimeUp}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                          questionIndex === 0 || isTimeUp
                            ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg"
                        }`}
                      >
                        <ArrowRight className="w-5 h-5" />
                        <span>السابق</span>
                      </motion.button>

                      <div className="flex gap-4">
                        {!submittedAnswers[questionIndex] &&
                          selectedOption !== null &&
                          !isTimeUp && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSubmitAnswers()}
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-300"
                            >
                              تأكيد الإجابة
                            </motion.button>
                          )}

                        {submittedAnswers[questionIndex] &&
                          questionIndex < data.length - 1 &&
                          !isTimeUp && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleNextQuestion}
                              className="flex items-center gap-2 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#3b003b] px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300"
                            >
                              <span>التالي</span>
                              <ArrowLeft className="w-5 h-5" />
                            </motion.button>
                          )}

                        {(questionIndex === data.length - 1 &&
                          submittedAnswers[questionIndex]) ||
                        isTimeUp ? (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowResults(true)}
                            className="flex items-center gap-2 bg-[#ffd700] text-black px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-300"
                          >
                            <Flag className="w-5 h-5" />
                            إنهاء الإمتحان
                          </motion.button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-[#2d0a30] to-[#4a0e4e] border border-[#ffd700]/30 rounded-2xl shadow-xl p-6 backdrop-blur-sm sticky top-4"
              >
                <h3 className="text-lg font-bold text-[#ffd700] mb-6 text-center">
                  التنقل بين الأسئلة
                </h3>
                <div className="grid grid-cols-4 lg:grid-cols-3 gap-3">
                  {data.map((_, index) => {
                    const status = getQuestionStatus(index);
                    const isActive = index === questionIndex;

                    let buttonClass =
                      "w-12 h-12 rounded-xl font-bold transition-all duration-300 text-sm ";

                    if (isActive) {
                      buttonClass +=
                        "bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#3b003b] ring-4 ring-[#ffd700]/30 shadow-lg transform scale-110";
                    } else if (status === "correct") {
                      buttonClass +=
                        "bg-green-500 text-white hover:bg-green-600 shadow-lg";
                    } else if (status === "incorrect") {
                      buttonClass +=
                        "bg-red-500 text-white hover:bg-red-600 shadow-lg";
                    } else {
                      buttonClass +=
                        "bg-[#3b003b]/50 text-[#ffd700]/60 hover:bg-[#ffd700]/20 hover:text-[#ffd700] border border-[#ffd700]/20";
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuestionClick(index)}
                        disabled={isTimeUp}
                        className={buttonClass}
                        title={`السؤال ${index + 1} - ${
                          status === "correct"
                            ? "صحيح"
                            : status === "incorrect"
                            ? "خطأ"
                            : "لم يتم الإجابة"
                        }`}
                      >
                        {index + 1}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Progress Summary */}
                <div className="mt-6 p-4 bg-[#3b003b]/30 rounded-xl">
                  <div className="text-center text-sm">
                    <div className="text-[#ffd700] font-medium mb-2">
                      ملخص التقدم
                    </div>
                    <div className="text-green-400">
                      صحيح:{" "}
                      {
                        submittedAnswers.filter(
                          (_, i) => getQuestionStatus(i) === "correct"
                        ).length
                      }
                    </div>
                    <div className="text-red-400">
                      خطأ:{" "}
                      {
                        submittedAnswers.filter(
                          (_, i) => getQuestionStatus(i) === "incorrect"
                        ).length
                      }
                    </div>
                    <div className="text-gray-400">
                      متبقي:{" "}
                      {submittedAnswers.filter(Boolean).length === 0
                        ? data.length
                        : data.length - submittedAnswers.filter(Boolean).length}
                    </div>
                  </div>
                </div>

                {/* Security Status */}
                <div className="mt-4 p-4 bg-[#3b003b]/30 rounded-xl">
                  <div className="text-center text-sm">
                    <div className="text-[#ffd700] font-medium mb-2 flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      الحالة الأمنية
                    </div>
                    <div
                      className={`${
                        securityViolations === 0
                          ? "text-green-400"
                          : securityViolations < maxViolations
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {securityViolations === 0
                        ? "لا توجد مخالفات"
                        : `${securityViolations} مخالفة من ${maxViolations}`}
                    </div>
                  </div>
                </div>

                {/* Timer in sidebar for mobile */}
                {timeRemaining > 0 && (
                  <div className="mt-4 lg:hidden">
                    <div
                      className={`bg-gradient-to-r ${getTimerBgColor()} border-2 rounded-xl p-4 text-center`}
                    >
                      <Clock
                        className={`w-5 h-5 mx-auto mb-2 ${getTimerColor()}`}
                      />
                      <div className={`text-lg font-bold ${getTimerColor()}`}>
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-xs text-gray-300">الوقت المتبقي</div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
