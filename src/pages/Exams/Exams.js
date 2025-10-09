import { useNavigate, useSearchParams } from "react-router-dom";
import "./Exams.css";
import { useEffect, useState } from "react";
import { base_url } from "../../constants";
import CryptoJS from "crypto-js";
import axios from "axios";
import { MdQuiz, MdTimer, MdCalendarToday, MdPlayArrow } from "react-icons/md";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaExternalLinkAlt,
  FaLink,
} from "react-icons/fa";
import ContentLoader from "react-content-loader";

export default function Exams() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const course_id = searchParams.get("course_id");

  const [exams, setExams] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  const getExams = async () => {
    if (!course_id) return;

    setPageLoading(true);
    try {
      const response = await axios.post(
        `${base_url}/user/courses/select_exam.php`,
        {
          course_id: course_id,
          student_id: userData?.student_id,
          token_value: userData?.token_value,
        }
      );

      if (response.data?.status === "success") {
        setExams(response.data.message || []);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getExams();
  }, [course_id]);

  const getExamStatus = (exam) => {
    const now = new Date();
    const startDate = new Date(exam.start_date);
    const endDate = new Date(exam.end_date);

    // Check if exam was already solved
    if (exam.solved === "yes" || exam.solved === 1 || exam.solved === true) {
      return {
        status: "solved",
        color: "#2ed573",
        text: "مكتمل",
        icon: FaCheckCircle,
        clickable: true,
      };
    }

    if (now < startDate) {
      return {
        status: "upcoming",
        color: "#ffd700",
        text: "قادم",
        icon: FaClock,
        clickable: false,
      };
    }

    if (now > endDate) {
      return {
        status: "expired",
        color: "#ff4757",
        text: "منتهي",
        icon: FaTimesCircle,
        clickable: false,
      };
    }

    return {
      status: "active",
      color: "#5352ed",
      text: "متاح",
      icon: MdPlayArrow,
      clickable: true,
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleExamClick = (exam) => {
    const examStatus = getExamStatus(exam);

    if (!examStatus.clickable) return;

    // Handle link type exams
    if (exam.type === "link" || exam.type === "external") {
      if (exam.exam_link) {
        // Open external link in new tab
        window.open(exam.exam_link, "_blank", "noopener,noreferrer");
      } else {
        console.error("No exam link provided for link type exam");
      }
      return;
    }

    // Handle normal type exams
    if (examStatus.status === "active") {
      const examParams = new URLSearchParams({
        exam_time: exam.exam_time || exam.timer,
      });

      navigate(`/exam/take/${exam.exam_id}?${examParams.toString()}`);
    } else if (examStatus.status === "solved") {
      const solvedParams = new URLSearchParams({
        status: "solved",
        exam_name: exam.exam_name,
        course_id: course_id,
        show_exam_id: exam.show_exam_id,
      });

      navigate(`/exam/take/${exam.exam_id}?${solvedParams.toString()}`);
    }
  };

  const getExamTypeInfo = (exam) => {
    const isLinkType = exam.type === "link" || exam.type === "external";

    return {
      isLink: isLinkType,
      icon: isLinkType ? FaLink : MdQuiz,
      bgColor: isLinkType ? "rgba(255, 152, 0, 0.2)" : "rgba(255, 215, 0, 0.2)",
      iconColor: isLinkType ? "#ff9800" : "#ffd700",
      borderColor: isLinkType ? "#ff9800" : "#ffd700",
    };
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#3b003b",
        minHeight: "100vh",
      }}
    >
      <div
        className="exams-container"
        style={{
          direction: "rtl",
        }}
      >
        {/* Header */}
        <div
          className="exams-header"
          style={{ marginBottom: "40px", textAlign: "center" }}
        >
          <h1
            style={{
              color: "#ffd700",
              fontSize: "2.5rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              marginBottom: "10px",
            }}
          >
            الإمتحانات
          </h1>
          <p style={{ color: "rgba(255, 215, 0, 0.8)", fontSize: "1.1rem" }}>
            اختر الإمتحان الذي تريد البدء به
          </p>
        </div>

        {/* Exams Grid */}
        <div className="exams_content">
          {pageLoading ? (
            <div style={{ width: "100%" }}>
              <ContentLoader
                viewBox="0 0 1200 400"
                speed={1}
                backgroundColor={"rgba(255, 215, 0, 0.1)"}
                foregroundColor={"rgba(255, 215, 0, 0.2)"}
              >
                <rect x="20" y="20" rx="20" ry="20" width="350" height="350" />
                <rect x="400" y="20" rx="20" ry="20" width="350" height="350" />
                <rect x="780" y="20" rx="20" ry="20" width="350" height="350" />
              </ContentLoader>
            </div>
          ) : exams && exams?.length > 0 ? (
            <div
              className="exams-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "30px",
                padding: "20px",
              }}
            >
              {exams.map((exam, index) => {
                const examStatus = getExamStatus(exam);
                const typeInfo = getExamTypeInfo(exam);
                const IconComponent = examStatus.icon;
                const ExamTypeIcon = typeInfo.icon;

                return (
                  <div
                    key={exam.exam_id}
                    className={`exam-card group ${
                      examStatus.clickable
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } transform transition-all duration-500 hover:scale-105`}
                    style={{
                      margin: "10px",
                      opacity: !examStatus.clickable ? 0.7 : 1,
                    }}
                    onClick={() =>
                      examStatus.clickable && handleExamClick(exam)
                    }
                  >
                    <div
                      className="relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl"
                      style={{
                        background:
                          "linear-gradient(145deg, #4a0e4e, #2d0a30) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
                        border: "3px solid transparent",
                        minHeight: "400px",
                        position: "relative",
                      }}
                    >
                      {/* Animated border glow effect */}
                      <div
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                        style={{
                          background:
                            "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
                          filter: "blur(12px)",
                          transform: "scale(1.05)",
                        }}
                      />

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />

                      {/* Status Badge */}
                      <div
                        className="absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg z-20 flex items-center gap-2"
                        style={{ backgroundColor: examStatus.color }}
                      >
                        <IconComponent size={16} />
                        {examStatus.text}
                      </div>

                      {/* Exam Type Badge */}
                      <div
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-white font-bold text-xs shadow-lg z-20 flex items-center gap-1"
                        style={{
                          backgroundColor: typeInfo.isLink
                            ? "#ff9800"
                            : "#5352ed",
                          opacity: 0.9,
                        }}
                      >
                        {typeInfo.isLink ? (
                          <FaExternalLinkAlt size={12} />
                        ) : (
                          <MdQuiz size={12} />
                        )}
                        {typeInfo.isLink ? "رابط خارجي" : "إمتحان تفاعلي"}
                      </div>

                      {/* Content container */}
                      <div className="relative z-10 flex flex-col p-8 h-full">
                        {/* Exam Icon */}
                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <div
                              className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                              style={{
                                backgroundColor: typeInfo.bgColor,
                                border: `3px solid ${typeInfo.borderColor}`,
                              }}
                            >
                              <ExamTypeIcon
                                size={40}
                                style={{
                                  color: typeInfo.iconColor,
                                }}
                              />
                            </div>

                            {/* Status indicator */}
                            <div
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: examStatus.color }}
                            >
                              <IconComponent size={12} color="white" />
                            </div>
                          </div>
                        </div>

                        {/* Exam Information */}
                        <div className="flex-1 space-y-4">
                          {/* Exam Name */}
                          <h3
                            className="text-2xl font-bold text-center transition-all duration-300 group-hover:scale-105"
                            style={{ color: "#ffd700" }}
                          >
                            {exam.exam_name}
                          </h3>

                          {/* Exam Description */}
                          {exam.exam_description && (
                            <p
                              className="text-center text-sm leading-relaxed"
                              style={{ color: "rgba(255, 215, 0, 0.8)" }}
                            >
                              {exam.exam_description}
                            </p>
                          )}

                          {/* Exam Details */}
                          <div className="space-y-3 mt-6">
                            {/* Duration - Only show for normal exams */}
                            {!typeInfo.isLink && (
                              <div className="flex items-center justify-center gap-3">
                                <MdTimer
                                  style={{ color: "#ffd700" }}
                                  size={20}
                                />
                                <span
                                  style={{ color: "#fff" }}
                                  className="font-medium"
                                >
                                  {exam.exam_time || exam.timer} دقيقة
                                </span>
                              </div>
                            )}

                            {/* External Link indicator for link exams */}
                            {typeInfo.isLink && (
                              <div className="flex items-center justify-center gap-3">
                                <FaExternalLinkAlt
                                  style={{ color: "#ff9800" }}
                                  size={18}
                                />
                                <span
                                  style={{ color: "#fff" }}
                                  className="font-medium text-sm"
                                >
                                  سيتم فتح الإمتحان في نافذة جديدة
                                </span>
                              </div>
                            )}

                            {/* Start Date */}
                            <div className="flex items-center justify-center gap-3">
                              <MdCalendarToday
                                style={{ color: "#ffd700" }}
                                size={18}
                              />
                              <span
                                style={{ color: "#fff" }}
                                className="text-sm"
                              >
                                يبدأ: {formatDate(exam.start_date)}
                              </span>
                            </div>

                            {/* End Date */}
                            <div className="flex items-center justify-center gap-3">
                              <FaClock style={{ color: "#ffd700" }} size={16} />
                              <span
                                style={{ color: "#fff" }}
                                className="text-sm"
                              >
                                ينتهي: {formatDate(exam.end_date)}
                              </span>
                            </div>

                            {/* Questions Count - Only for normal exams */}
                            {!typeInfo.isLink && exam.questions_count && (
                              <div className="flex items-center justify-center gap-3">
                                <MdQuiz
                                  style={{ color: "#ffd700" }}
                                  size={18}
                                />
                                <span
                                  style={{ color: "#fff" }}
                                  className="text-sm"
                                >
                                  {exam.questions_count} سؤال
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-6">
                          {examStatus.status === "active" && (
                            <button
                              className="w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: typeInfo.isLink
                                  ? "#ff9800"
                                  : "#ffd700",
                                color: "#3b003b",
                                boxShadow: `0 4px 15px ${
                                  typeInfo.isLink
                                    ? "rgba(255, 152, 0, 0.3)"
                                    : "rgba(255, 215, 0, 0.3)"
                                }`,
                              }}
                            >
                              {typeInfo.isLink ? (
                                <>
                                  <FaExternalLinkAlt size={18} />
                                  فتح الرابط
                                </>
                              ) : (
                                <>
                                  <MdPlayArrow size={20} />
                                  ابدأ الإمتحان
                                </>
                              )}
                            </button>
                          )}

                          {examStatus.status === "solved" && (
                            <button
                              className="w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: "#ffd700",
                                color: "#3b003b",
                                boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                              }}
                            >
                              <FaEye size={18} />
                              {typeInfo.isLink
                                ? "فتح الرابط مرة أخرى"
                                : "عرض الإمتحان"}
                            </button>
                          )}

                          {examStatus.status === "upcoming" && (
                            <div
                              className="w-full py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: "rgba(255, 215, 0, 0.2)",
                                color: "#ffd700",
                                border: "2px solid rgba(255, 215, 0, 0.5)",
                              }}
                            >
                              <FaClock size={16} />
                              سيبدأ قريباً
                            </div>
                          )}

                          {examStatus.status === "expired" && (
                            <div
                              className="w-full py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: "rgba(255, 71, 87, 0.2)",
                                color: "#ff4757",
                                border: "2px solid rgba(255, 71, 87, 0.5)",
                              }}
                            >
                              <FaTimesCircle size={18} />
                              انتهت صلاحيته
                            </div>
                          )}

                          {examStatus.status === "unavailable" && (
                            <div
                              className="w-full py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: "rgba(108, 117, 125, 0.2)",
                                color: "#6c757d",
                                border: "2px solid rgba(108, 117, 125, 0.5)",
                              }}
                            >
                              <FaTimesCircle size={18} />
                              غير متاح
                            </div>
                          )}
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-20 left-4 w-2 h-2 bg-yellow-400/40 rounded-full animate-ping" />
                        <div className="absolute bottom-20 right-6 w-3 h-3 bg-yellow-300/30 rounded-full animate-bounce" />
                        <div className="absolute top-32 right-8 w-1 h-1 bg-yellow-500/50 rounded-full animate-pulse" />
                      </div>

                      {/* Corner decorations */}
                      <div
                        className="absolute top-0 right-0 w-20 h-20 opacity-10"
                        style={{
                          background:
                            "linear-gradient(225deg, #ffd700 0%, transparent 70%)",
                          clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
                        }}
                      />
                      <div
                        className="absolute bottom-0 left-0 w-16 h-16 opacity-10"
                        style={{
                          background:
                            "linear-gradient(45deg, #ffd700 0%, transparent 70%)",
                          clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="empty"
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#ffd700",
              }}
            >
              <MdQuiz
                size={80}
                style={{ opacity: 0.5, marginBottom: "20px" }}
              />
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                لا توجد إمتحانات متاحة
              </h3>
              <p style={{ opacity: 0.7 }}>سيتم إضافة إمتحانات جديدة قريباً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
