// components/SolvedQuizView.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Target,
  XCircle,
  Award,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { base_url } from "../../constants";
import axios from "axios";

export default function SolvedQuizView() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { id } = useParams();

  const userData = JSON.parse(localStorage.getItem("NagahUser"));

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
  };

  useEffect(() => {
    const dataSend = {
      exam_id: id,
      student_id: userData?.student_id || 301,
    };

    axios
      .post(
        base_url + `/user/courses/select_solved_exam_questions.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status === "success") {
          setQuestions(res?.data?.message);
        } else {
          toast.error("حدث خطأ ما");
        }
      })
      .catch((error) => {
        toast.error("حدث خطأ في الاتصال");
        console.error(error);
      });
  }, [id, userData?.student_id]);

  const currentQuestion = questions[currentQuestionIndex];

  const getStats = () => {
    const correct = questions.filter((q) => q.is_correct == 1).length;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  const stats = getStats();

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getQuestionStatus = (index) => {
    return questions[index]?.is_correct == 1 ? "correct" : "incorrect";
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3b003b] via-[#4a0e4e] to-[#3b003b] flex items-center justify-center">
        <div className="text-[#ffd700] text-xl">جاري تحميل الأسئلة...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-[#3b003b] via-[#4a0e4e] to-[#3b003b] p-4"
      style={{ direction: "rtl" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#2d0a30] to-[#4a0e4e] border border-[#ffd700]/30 rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-[#ffd700]" />
              <h1 className="text-2xl font-bold text-[#ffd700]">
                نتائج الامتحان
              </h1>
            </div>

            {/* Stats Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-400">
                  {stats.correct}
                </div>
                <div className="text-sm text-green-300">إجابات صحيحة</div>
              </div>
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-red-400">
                  {stats.total - stats.correct}
                </div>
                <div className="text-sm text-red-300">إجابات خاطئة</div>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-400">
                  {stats.total}
                </div>
                <div className="text-sm text-blue-300">إجمالي الأسئلة</div>
              </div>
              <div className="bg-[#ffd700]/20 border border-[#ffd700]/50 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-[#ffd700]">
                  {stats.percentage}%
                </div>
                <div className="text-sm text-yellow-300">النسبة المئوية</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#3b003b] px-6 py-3 rounded-xl font-bold shadow-lg"
              >
                السؤال {currentQuestionIndex + 1} من {questions.length}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
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
                  {/* Question Header with Result */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl md:text-3xl font-bold text-[#ffd700] leading-relaxed flex-1"
                    >
                      {currentQuestion?.question_text}
                    </motion.h2>

                    <div
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl ${
                        currentQuestion?.is_correct == 1
                          ? "bg-green-500/20 border border-green-500/50"
                          : "bg-red-500/20 border border-red-500/50"
                      }`}
                    >
                      {currentQuestion?.is_correct == 1 ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <span className="text-green-400 font-bold">
                            إجابة صحيحة
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-400" />
                          <span className="text-red-400 font-bold">
                            إجابة خاطئة
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-4 mb-8">
                    {currentQuestion?.real_answers?.map((option, index) => {
                      const isCorrect = option.answer_check;
                      const isUserAnswer =
                        option.answer_text === currentQuestion.user_answer;

                      let optionClass =
                        "w-full p-6 rounded-xl border-2 text-right transition-all duration-300 ";

                      if (isCorrect) {
                        optionClass +=
                          "bg-green-500/20 border-green-400 text-green-100 shadow-green-500/20 shadow-lg";
                      } else if (isUserAnswer && !isCorrect) {
                        optionClass +=
                          "bg-red-500/20 border-red-400 text-red-100 shadow-red-500/20 shadow-lg";
                      } else {
                        optionClass +=
                          "bg-gray-600/20 border-gray-500/50 text-gray-300";
                      }

                      return (
                        <motion.div
                          key={index}
                          custom={index}
                          initial="initial"
                          animate="animate"
                          variants={optionVariants}
                          className={optionClass}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isCorrect
                                  ? "bg-green-500 border-green-500"
                                  : isUserAnswer
                                  ? "bg-red-500 border-red-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {isCorrect && (
                                <CheckCircle className="w-5 h-5 text-white" />
                              )}
                              {isUserAnswer && !isCorrect && (
                                <XCircle className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 items-center gap-2">
                              <span className="text-lg font-medium block">
                                {option.answer_text}
                              </span>
                              {isUserAnswer && (
                                <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full mt-2 inline-block">
                                  إجابتك
                                </span>
                              )}
                              {isCorrect && (
                                <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full mt-2 inline-block">
                                  الإجابة الصحيحة
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                        currentQuestionIndex === 0
                          ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg"
                      }`}
                    >
                      <ArrowRight className="w-5 h-5" />
                      <span>السابق</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                        currentQuestionIndex === questions.length - 1
                          ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#3b003b] hover:from-yellow-400 hover:to-yellow-500 shadow-lg"
                      }`}
                    >
                      <span>التالي</span>
                      <ArrowLeft className="w-5 h-5" />
                    </motion.button>
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

              <div className="grid grid-cols-4 lg:grid-cols-3 gap-3 mb-6">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  const isActive = index === currentQuestionIndex;

                  let buttonClass =
                    "w-12 h-12 rounded-xl font-bold transition-all duration-300 text-sm ";

                  if (isActive) {
                    buttonClass +=
                      "bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#3b003b] ring-4 ring-[#ffd700]/30 shadow-lg transform scale-110";
                  } else if (status === "correct") {
                    buttonClass +=
                      "bg-green-500 text-white hover:bg-green-600 shadow-lg cursor-pointer";
                  } else {
                    buttonClass +=
                      "bg-red-500 text-white hover:bg-red-600 shadow-lg cursor-pointer";
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuestionClick(index)}
                      className={buttonClass}
                      title={`السؤال ${index + 1} - ${
                        status === "correct" ? "صحيح" : "خطأ"
                      }`}
                    >
                      {index + 1}
                    </motion.button>
                  );
                })}
              </div>

              {/* Results Summary */}
              <div className="bg-[#3b003b]/30 rounded-xl p-4">
                <div className="text-center text-sm">
                  <div className="text-[#ffd700] font-medium mb-3 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    ملخص النتائج
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">الإجابات الصحيحة:</span>
                      <span className="text-green-400 font-bold">
                        {stats.correct}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-400">الإجابات الخاطئة:</span>
                      <span className="text-red-400 font-bold">
                        {stats.total - stats.correct}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-600/50 pt-2">
                      <span className="text-[#ffd700]">النتيجة النهائية:</span>
                      <span className="text-[#ffd700] font-bold">
                        {stats.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Badge */}
              <div className="mt-4">
                <div
                  className={`text-center p-4 rounded-xl ${
                    stats.percentage >= 80
                      ? "bg-green-500/20 border border-green-500/50"
                      : stats.percentage >= 60
                      ? "bg-yellow-500/20 border border-yellow-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  <div
                    className={`text-lg font-bold ${
                      stats.percentage >= 80
                        ? "text-green-400"
                        : stats.percentage >= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {stats.percentage >= 80
                      ? "ممتاز"
                      : stats.percentage >= 60
                      ? "جيد"
                      : "يحتاج تحسين"}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">تقييم الأداء</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
