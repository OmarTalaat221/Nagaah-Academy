import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message, Tooltip } from "antd";
import {
  Plus,
  Calendar,
  User,
  BookOpen,
  Star,
  ExternalLink,
  Info,
} from "lucide-react";
import axios from "axios";
import { base_url } from "../../constants";
import { FaInfoCircle } from "react-icons/fa";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({
    student_project_title: "",
    student_project_desc: "",
    teacher_id: "",
  });
  const [myCourses, setMyCourses] = useState([]);
  const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));

  const getMyCourses = async () => {
    try {
      const res = await axios.post(
        `${base_url}/user/courses/select_my_courses.php`,
        {
          student_id: NagahUser.student_id,
          token_value: NagahUser.token_value,
        }
      );

      if (res.data.status == "success") {
        setMyCourses(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${base_url}/user/student_projects/select_project.php`,
        { student_id: NagahUser.student_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        const transformedProjects = response.data.message.map((project) => ({
          ...project,
          status: project.student_project_url ? "مكتمل" : "معلق",
        }));
        setProjects(transformedProjects);
      } else {
        message.error("حدث خطأ في تحميل المشاريع");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response) {
        // Server responded with error status
        message.error(
          `حدث خطأ: ${error.response.status} - ${
            error.response.data?.message || "خطأ في الخادم"
          }`
        );
      } else if (error.request) {
        // Request was made but no response received
        message.error("لا يمكن الوصول إلى الخادم");
      } else {
        // Something else happened
        message.error("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!newProject.teacher_id) {
      message.error("يرجى إختيار المادة التابعة للمشروع");
      return;
    }
    if (!newProject.student_project_title.trim()) {
      message.error("يرجى إدخال عنوان المشروع");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${base_url}/user/student_projects/add_project.php`,
        {
          ...newProject,
          student_id: NagahUser.student_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Add the new project to the list with pending status
        const newProjectData = {
          student_project_title: newProject.student_project_title,
          student_project_desc: newProject.student_project_desc,
          student_id: NagahUser.student_id,
        };

        setNewProject({ student_project_title: "", student_project_desc: "" });
        setIsModalVisible(false);
        fetchProjects();
        message.success("تم إضافة المشروع بنجاح");

        // Optionally refresh the projects list to get the real ID
        // fetchProjects();
      } else {
        message.error(response.data?.message || "حدث خطأ في إضافة المشروع");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      if (error.response) {
        // Server responded with error status
        message.error(
          `حدث خطأ: ${error.response.status} - ${
            error.response.data?.message || "خطأ في إضافة المشروع"
          }`
        );
      } else if (error.request) {
        // Request was made but no response received
        message.error("لا يمكن الوصول إلى الخادم");
      } else {
        // Something else happened
        message.error("حدث خطأ غير متوقع");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewProject({ student_project_title: "", student_project_desc: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "مكتمل":
        return "text-green-800 bg-green-200";
      case "معلق":
        return "text-orange-800 bg-orange-200";
      default:
        return "text-gray-800 bg-gray-200";
    }
  };

  const handleViewProject = (project) => {
    if (project.student_project_url) {
      window.open(project.student_project_url, "_blank");
    } else {
      message.info("المشروع معلق، لا يوجد رابط متاح حالياً");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ direction: "rtl", backgroundColor: "#3b003b" }}
    >
      {/* Banner with 3 Small Floating Balls */}
      <div
        className="relative overflow-hidden border-b-2 border-yellow-400/30"
        style={{ backgroundColor: "#3b003b" }}
      >
        {/* 3 Small Animated Balls */}
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
                <BookOpen className="w-12 h-12" style={{ color: "#3b003b" }} />
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-6 tracking-wide">
              مشاريعي الأكاديمية
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              استعرض جميع مشاريعك الأكاديمية وأضف مشاريع جديدة لتطوير مهاراتك
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Enhanced Banner Button */}
              <button
                onClick={showModal}
                className="group relative inline-flex items-center p-3 text-lg font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: "#ffd700", color: "#3b003b" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="relative w-5 h-5 ml-3 transform group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative">إضافة مشروع جديد</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Projects Grid */}
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
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <div
                key={project.student_project_id}
                className="group relative rounded-3xl p-8 hover:scale-105 transform transition-all duration-500 cursor-pointer border-2 border-yellow-400/30 hover:border-yellow-400/60"
                style={{
                  backgroundColor: "rgba(255, 215, 0, 0.08)",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 215, 0, 0.2)",
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col gap-2 justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                          {project.student_project_title}
                        </h3>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-105 transition-all duration-300 ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      {project.student_project_url && (
                        <div
                          className="flex items-center gap-2 px-3 py-2 rounded-full border-2 backdrop-blur-sm transform group-hover:scale-105 transition-all duration-300"
                          style={{
                            backgroundColor: "rgba(255, 215, 0, 0.15)",
                            borderColor: "#ffd700",
                          }}
                        >
                          <ExternalLink
                            className="w-4 h-4"
                            style={{ color: "#ffd700" }}
                          />
                          <span
                            className="text-sm font-bold"
                            style={{ color: "#ffd700" }}
                          >
                            متاح
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-white/90 mb-4 leading-relaxed text-lg">
                      {project.student_project_desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/70">
                      <User className="w-4 h-4 ml-2 text-yellow-400" />
                      <span className="text-sm">المدرس:</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {project.teacher_name || "غير محدد"}
                    </span>
                  </div>

                  {/* <div className="space-y-4 mb-8">
                    <div className="flex items-center text-white/80">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center ml-4"
                        style={{ backgroundColor: "rgba(255, 215, 0, 0.2)" }}
                      >
                        <BookOpen
                          className="w-4 h-4"
                          style={{ color: "#ffd700" }}
                        />
                      </div>
                      <span className="font-medium text-base">
                        ID: {project.student_project_id}
                      </span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center ml-4"
                        style={{ backgroundColor: "rgba(255, 215, 0, 0.2)" }}
                      >
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: "#ffd700" }}
                        />
                      </div>
                      <span className="font-medium text-base">
                        {project.created_at}
                      </span>
                    </div>
                  </div> */}

                  <div className="pt-6 border-t border-yellow-400/30">
                    {/* Enhanced Card Button */}
                    <button
                      onClick={() => handleViewProject(project)}
                      disabled={!project.student_project_url}
                      className={`group relative w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-yellow-400/50 ${
                        !project.student_project_url
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      style={{
                        backgroundColor: "#ffd700",
                        color: "#3b003b",
                        // boxShadow: "0 8px 25px rgba(255, 215, 0, 0.3)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                        {project.student_project_url ? (
                          <>
                            <ExternalLink className="w-4 h-4 ml-2" />
                            عرض المشروع
                          </>
                        ) : (
                          "معلق - غير متاح"
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-yellow-400/30"
              style={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
            >
              <BookOpen className="w-16 h-16" style={{ color: "#ffd700" }} />
            </div>
            <h3 className="text-4xl font-bold mb-6 text-white">
              لا توجد مشاريع حالياً
            </h3>
            <p className="text-xl mb-8 text-white/70">
              ابدأ رحلتك الأكاديمية بإضافة مشروعك الأول
            </p>
            <button
              onClick={showModal}
              className="group relative inline-flex items-center p-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl overflow-hidden"
              style={{ backgroundColor: "#ffd700", color: "#3b003b" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="relative w-5 h-5 ml-3 transform group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative">إضافة مشروع جديد</span>
            </button>
          </div>
        )}
      </div>

      <Modal
        title="إضافة مشروع جديد"
        open={isModalVisible}
        centered
        onCancel={handleCancel}
        cancelText="إلغاء"
        width={650}
        className="custom-modal"
        footer={
          myCourses.length === 0 ? (
            <div className="flex justify-center w-full">
              <Button onClick={handleCancel} className="modal-submit-button">
                <span className="relative">حسناً</span>
              </Button>
            </div>
          ) : (
            <div className="flex justify-start gap-2 w-full">
              <Button onClick={handleCancel} className="modal-submit-button">
                <span className="relative">إلغاء</span>
              </Button>
              <Button onClick={handleOk} className="modal-submit-button">
                <span className="relative">إضافة المشروع</span>
              </Button>
            </div>
          )
        }
      >
        {myCourses.length === 0 ? (
          // Empty state design
          <div
            style={{ direction: "rtl" }}
            className="flex flex-col items-center justify-center py-8 px-4"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              {/* Main message */}
              <h3 className="text-lg font-semibold text-[#ffd700] mb-2">
                يجب أن تكون مشترك في مادة حتى تتيح لك هذه الميزة
              </h3>

              {/* Subtitle */}
              <p className="text-white text-sm leading-relaxed max-w-md">
                لإنشاء مشروع جديد، يجب عليك أولاً الاشتراك في إحدى المواد
                الدراسية المتاحة
              </p>
            </div>
          </div>
        ) : (
          // Original form content
          <div style={{ direction: "rtl" }} className="flex flex-col gap-2">
            <div className="form-group w-full">
              <label
                className="form-label mb-2 block text-sm font-bold transition-colors duration-300"
                htmlFor="teacher_id"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <span>المادة التابعة للمشروع</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <Tooltip
                    className="cursor-pointer"
                    title={
                      <div style={{ direction: "rtl" }}>
                        من فضلك اختر مادة المشروع، وسنرسلها فورًا إلى المعلّم
                        الذي تشترك معه.
                      </div>
                    }
                  >
                    <Info className="w-4 h-4 text-red-500" />
                  </Tooltip>
                </div>
              </label>
              <CustomDropdown
                value={newProject.teacher_id}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    teacher_id: e,
                  })
                }
                options={[
                  { label: "غير محدد", value: null },
                  ...myCourses.map((course) => ({
                    label: `${course.grade_name} - ${course.course_name}`,
                    value: course.admin_id,
                  })),
                ]}
                placeholder="أدخل المادة التابعة للمشروع"
                width="100%"
              />
            </div>

            <div className="form-group">
              <label
                className="form-label mb-2 block"
                htmlFor="student_project_title"
              >
                عنوان المشروع *
              </label>
              <Input
                value={newProject.student_project_title}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    student_project_title: e.target.value,
                  })
                }
                placeholder="أدخل عنوان المشروع"
                size="large"
                className="custom-input"
              />
            </div>

            <div className="form-group">
              <label
                className="form-label mb-2 block"
                htmlFor="student_project_desc"
              >
                وصف المشروع
              </label>
              <Input.TextArea
                value={newProject.student_project_desc}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    student_project_desc: e.target.value,
                  })
                }
                placeholder="اكتب وصفاً مختصراً عن المشروع"
                rows={4}
                className="custom-input"
              />
            </div>
          </div>
        )}
      </Modal>
      {/* Custom CSS for animations */}
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

export default Projects;
