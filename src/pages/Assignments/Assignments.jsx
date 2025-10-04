import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message, Upload as AntUpload } from "antd";
import {
  Plus,
  Calendar,
  User,
  BookOpen,
  Star,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  UploadCloud,
  File,
  Delete,
} from "lucide-react";
import axios from "axios";
import { base_url } from "../../constants";
import dayjs from "dayjs";
import { useLocation, useSearchParams } from "react-router-dom";

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));
  const [searchParams] = useSearchParams();
  const subject_id = searchParams.get("course_id");

  const { state } = useLocation();
  const course = state?.course_details;

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${base_url}/user/student_projects/select_task.php`,
        { student_id: NagahUser.student_id, subject_id: subject_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        // Transform assignments to include proper status
        const transformedAssignments = response.data.message.map(
          (assignment) => ({
            ...assignment,
          })
        );
        setAssignments(transformedAssignments);
      } else {
        message.error("حدث خطأ في تحميل الواجبات");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      if (error.response) {
        message.error(
          `حدث خطأ: ${error.response.status} - ${
            error.response.data?.message || "خطأ في الخادم"
          }`
        );
      } else if (error.request) {
        message.error("لا يمكن الوصول إلى الخادم");
      } else {
        message.error("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const showUploadModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsUploadModalVisible(true);
    setFileList([]);
    setUploadedFile(null);
  };

  const handleUploadCancel = () => {
    setIsUploadModalVisible(false);
    setSelectedAssignment(null);
    setFileList([]);
    setUploadedFile(null);
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("pdf_file", file);

      const uploadResponse = await axios.post(
        `${base_url}/admin/pdf_uploader.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data) {
        const uploadedFileUrl = uploadResponse.data?.pdf_url;
        setUploadedFile(uploadedFileUrl);
        return uploadedFileUrl;
      } else {
        throw new Error("فشل في رفع الملف");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("حدث خطأ في رفع الملف");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Submit assignment
  const handleSubmitAssignment = async () => {
    if (!uploadedFile) {
      message.error("يرجى رفع ملف أولاً");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        `${base_url}/user/student_projects/upload_student_task.php`,
        {
          student_id: NagahUser.student_id,
          task_link: selectedAssignment.task_link,
          solved_task_link: uploadedFile,
          teacher_id: selectedAssignment.teacher_id, // Use from assignment data or fallback
          subject_id: subject_id,
          task_id: selectedAssignment.task_id,
          uploded: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        message.success(response.data.message);
        setIsUploadModalVisible(false);
        setSelectedAssignment(null);
        setFileList([]);
        setUploadedFile(null);
        fetchAssignments(); // Refresh assignments list
      } else {
        message.error("حدث خطأ في تسليم الواجب");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      message.error("حدث خطأ في تسليم الواجب");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case true:
        return {
          color: "text-green-800 bg-green-200",
          icon: CheckCircle,
          bgColor: "rgba(34, 197, 94, 0.1)",
          borderColor: "rgba(34, 197, 94, 0.3)",
        };
      case false:
        return {
          color: "text-orange-800 bg-orange-200",
          icon: Clock,
          bgColor: "rgba(249, 115, 22, 0.1)",
          borderColor: "rgba(249, 115, 22, 0.3)",
        };
      default:
        return {
          color: "text-gray-800 bg-gray-200",
          icon: AlertCircle,
          bgColor: "rgba(107, 114, 128, 0.1)",
          borderColor: "rgba(107, 114, 128, 0.3)",
        };
    }
  };

  const handleViewAssignment = (assignment) => {
    if (assignment.solved) {
      window.open(assignment.solved_task_link, "_blank");
    } else {
      window.open(assignment.task_link, "_blank");
    }
  };

  const isOverdue = (dueDate) => {
    return dayjs(dueDate).isBefore(dayjs());
  };

  // Sort assignments: pending first, then submitted
  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.solved === false && b.solved === true) return -1;
    if (a.solved === true && b.solved === false) return 1;
    return 0;
  });

  // Custom upload props
  const uploadProps = {
    accept: ".pdf",
    beforeUpload: async (file) => {
      try {
        await handleFileUpload(file);
        setFileList([file]);
        return false; // Prevent default upload
      } catch (error) {
        return false;
      }
    },
    fileList,
    onRemove: () => {
      setFileList([]);
      setUploadedFile(null);
    },
  };

  return (
    <div
      className="min-h-screen"
      style={{ direction: "rtl", backgroundColor: "#3b003b" }}
    >
      {/* Header Banner */}
      <div
        className="relative overflow-hidden border-b-2 border-yellow-400/30"
        style={{ backgroundColor: "#3b003b" }}
      >
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute rounded-full opacity-30"
            style={{
              backgroundColor: "#ffd700",
              width: "40px",
              height: "40px",
              left: "15%",
              top: "20%",
              animation: "float 4s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full opacity-25"
            style={{
              backgroundColor: "#ffd700",
              width: "35px",
              height: "35px",
              right: "20%",
              top: "30%",
              animation: "float 5s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute rounded-full opacity-20"
            style={{
              backgroundColor: "#ffd700",
              width: "45px",
              height: "45px",
              left: "70%",
              bottom: "25%",
              animation: "float 6s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
        </div>

        <div className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 border-4 border-yellow-400/30"
                style={{ backgroundColor: "#ffd700" }}
              >
                <FileText className="w-12 h-12" style={{ color: "#3b003b" }} />
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-6 tracking-wide">
              واجباتي الدراسية
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              تابع جميع واجباتك الدراسية، سلم أعمالك في الوقت المحدد وحقق التميز
              الأكاديمي
            </p>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl p-8 animate-pulse border-2 border-yellow-400/20"
                style={{
                  backgroundColor: "rgba(255, 215, 0, 0.05)",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 215, 0, 0.2)",
                }}
              >
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-4"></div>
                <div className="h-8 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAssignments.map((assignment) => {
              const statusInfo = getStatusInfo(assignment.solved);
              const StatusIcon = statusInfo.icon;
              const overdue = isOverdue(assignment.dueDate);

              return (
                <div
                  key={assignment.task_id || assignment.id}
                  className="group relative rounded-3xl p-6 hover:scale-105 transform transition-all duration-500 cursor-pointer border-2 border-yellow-400/30 hover:border-yellow-400/60"
                  style={{
                    backgroundColor: "rgba(255, 215, 0, 0.08)",
                    boxShadow:
                      "0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 215, 0, 0.2)",
                  }}
                >
                  {/* Status Badge */}
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {assignment.solved ? "مُسلم" : "معلق"}
                        </span>
                      </div>
                      {overdue && assignment.solved === false && (
                        <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
                          <AlertCircle className="w-3 h-3" />
                          متأخر
                        </div>
                      )}
                    </div>

                    {/* Assignment Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                        {assignment.task_name}
                      </h3>
                    </div>

                    {/* Assignment Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-white/70">
                          <BookOpen className="w-4 h-4 ml-2 text-yellow-400" />
                          <span className="text-sm">المادة:</span>
                        </div>
                        <span className="text-white text-sm font-medium">
                          {assignment?.course_name || "غير محدد"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-white/70">
                          <Calendar className="w-4 h-4 ml-2 text-yellow-400" />
                          <span className="text-sm">تاريخ التسليم:</span>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            overdue && assignment.solved === false
                              ? "text-red-400"
                              : "text-white"
                          }`}
                        >
                          {dayjs(assignment.deadline).format("DD/MM/YYYY")}
                        </span>
                      </div>

                      {assignment.solved && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white/70">
                            <ExternalLink className="w-4 h-4 ml-2 text-yellow-400" />
                            <span className="text-sm">تم التسليم:</span>
                          </div>
                          <span className="text-green-400 text-sm font-medium">
                            نعم
                          </span>
                        </div>
                      )}
                      {assignment.score != 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white/70">
                            <ExternalLink className="w-4 h-4 ml-2 text-yellow-400" />
                            <span className="text-sm">الدرجة:</span>
                          </div>
                          <span className="text-green-400 text-sm font-medium">
                            {assignment.score}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {!assignment.solved && (
                        <button
                          onClick={() => handleViewAssignment(assignment)}
                          className="flex-1 py-2 px-4 rounded-xl font-bold transition-all duration-300 border-2 border-transparent hover:border-yellow-400/50 hover:scale-105"
                          style={{
                            backgroundColor: "#ffd700",
                            color: "#3b003b",
                          }}
                        >
                          <span className="flex items-center justify-center text-sm">
                            <ExternalLink className="w-4 h-4 ml-1" />
                            عرض الواجب
                          </span>
                        </button>
                      )}

                      <div
                        className={`flex gap-3 w-full ${
                          assignment.solved ? "md:col-span-2" : ""
                        }`}
                      >
                        {assignment.solved ? (
                          <button
                            onClick={() => handleViewAssignment(assignment)}
                            className="flex-1 py-2 px-4 rounded-xl font-bold transition-all duration-300 border-2 border-transparent hover:border-yellow-400/50 hover:scale-105"
                            style={{
                              backgroundColor: "#ffd700",
                              color: "#3b003b",
                            }}
                          >
                            <span className="flex items-center justify-center text-sm">
                              <ExternalLink className="w-4 h-4 ml-1" />
                              عرض الواجب المُسلم
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => showUploadModal(assignment)}
                            className="flex-1 py-2 px-4 rounded-xl font-bold transition-all duration-300 border-2 border-transparent hover:border-yellow-400/50 hover:scale-105"
                            style={{
                              backgroundColor: "#ffd700",
                              color: "#3b003b",
                            }}
                          >
                            <span className="flex items-center justify-center text-sm">
                              <Upload className="w-4 h-4 ml-1" />
                              رفع الملف
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-yellow-400/30"
              style={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
            >
              <FileText className="w-16 h-16" style={{ color: "#ffd700" }} />
            </div>
            <h3 className="text-4xl font-bold mb-6 text-white">
              لا توجد واجبات حالياً
            </h3>
            <p className="text-xl mb-8 text-white/70">
              لم يقم المعلم بإضافة واجباتك الدراسية بعد
            </p>
          </div>
        )}
      </div>

      {/* Add Assignment Modal */}
      {/* <Modal
        title="إضافة واجب جديد"
        open={isModalVisible}
        centered
        onOk={handleOk}
        onCancel={handleCancel}
        okText="إضافة الواجب"
        cancelText="إلغاء"
        confirmLoading={submitting}
        width={650}
        className="custom-modal"
      >
        <div style={{ direction: "rtl" }} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label mb-2 block text-gray-700 font-bold">
              عنوان الواجب *
            </label>
            <Input
              value={newAssignment.task_title}
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
                  student_project_title: e.target.value,
                })
              }
              placeholder="أدخل عنوان الواجب"
              size="large"
              className="custom-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label mb-2 block text-gray-700 font-bold">
              وصف الواجب
            </label>
            <Input.TextArea
              value={newAssignment.student_project_desc}
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
                  student_project_desc: e.target.value,
                })
              }
              placeholder="اكتب وصفاً مختصراً عن الواجب"
              rows={4}
              className="custom-input"
            />
          </div>
        </div>
      </Modal> */}

      {/* Upload Assignment Modal */}
      <Modal
        title={`تسليم الواجب: ${"واجب دراسي"}`}
        open={isUploadModalVisible}
        centered
        onCancel={handleUploadCancel}
        width={650}
        className="custom-modal"
        footer={
          <div className="flex justify-start gap-2 w-full">
            <Button onClick={handleUploadCancel}>إلغاء</Button>
            <Button
              type="primary"
              onClick={handleSubmitAssignment}
              disabled={!uploadedFile}
              loading={submitting}
              style={{
                backgroundColor: uploadedFile ? "#ffd700" : "#6b7280",
                borderColor: uploadedFile ? "#ffd700" : "#6b7280",
                color: "#3b003b",
              }}
            >
              تسليم الواجب
            </Button>
          </div>
        }
      >
        <div style={{ direction: "rtl" }} className="flex flex-col gap-6">
          <div className="form-group">
            <label className="form-label mb-3 block text-gray-700 font-bold">
              اختر ملف الواجب *
            </label>

            <AntUpload.Dragger
              {...uploadProps}
              style={{
                backgroundColor: "#f8f9fa",
                border: "2px dashed #dee2e6",
              }}
              deleteIcon={<Delete className="w-4 h-4 text-red-500" />}
            >
              <div className="flex flex-col items-center justify-center py-8">
                {uploading ? (
                  <>
                    <UploadCloud className="w-12 h-12 text-blue-500 mb-4 animate-bounce" />
                    <p className="text-blue-600 font-medium">
                      جاري رفع الملف...
                    </p>
                  </>
                ) : uploadedFile ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                    <p className="text-green-600 font-medium">
                      تم رفع الملف بنجاح!
                    </p>
                  </>
                ) : (
                  <>
                    <File className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-2">
                      اضغط أو اسحب الملف هنا للرفع
                    </p>
                    <p className="text-gray-400 text-sm">
                      PDF, DOC, DOCX, TXT (حتى 10MB)
                    </p>
                  </>
                )}
              </div>
            </AntUpload.Dragger>
          </div>

          {uploadedFile && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">
                    الملف جاهز للتسليم
                  </p>
                  <p className="text-green-600 text-sm">
                    يمكنك الآن الضغط على "تسليم الواجب"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-15px) translateX(8px);
          }
          50% {
            transform: translateY(-8px) translateX(-8px);
          }
          75% {
            transform: translateY(-20px) translateX(4px);
          }
        }
      `}</style>
    </div>
  );
};

export default Assignment;
