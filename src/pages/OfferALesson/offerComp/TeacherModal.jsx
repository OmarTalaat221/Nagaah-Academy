import React from "react";
import { Modal } from "antd";

const TeacherModal = ({ isOpen, onClose, teacher, subjects }) => {
  if (!teacher) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      title={teacher?.teacher_name}
      centered
      className="!z-[29920099] custom-modal"
      width={700}
    >
      <div className="p-4" dir="rtl">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={teacher.teacher_img}
            alt={teacher.teacher_name}
            className="w-16 h-16 rounded-full object-cover border-2 shadow-md"
            style={{ borderColor: "#ffd700" }}
          />
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1" style={{ color: "#ffd700" }}>
              {teacher.teacher_name}
            </h2>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "#ffd700",
                  color: "#3b003b",
                }}
              >
                ⭐ {teacher.rate}
              </span>
              {(teacher.teacher_phone || teacher.phone) && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-[#3b003b]"
                  style={{ backgroundColor: "#ffd700" }}
                >
                  📞 {teacher.teacher_phone || teacher.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className="p-3 rounded-lg border"
            style={{
              background: "linear-gradient(to bottom right, #f8f4ff, #f0e6ff)",
              borderColor: "#ffd700",
            }}
          >
            <h3
              className="text-sm font-bold mb-2 text-right"
              style={{ color: "#3b003b" }}
            >
              الوصف
            </h3>
            <p className="text-gray-700 text-right leading-relaxed text-xs">
              {teacher.teacher_description}
            </p>
          </div>

          <div
            className="p-3 rounded-lg border"
            style={{
              background: "linear-gradient(to bottom right, #fffdf0, #fffacd)",
              borderColor: "#ffd700",
            }}
          >
            <h3
              className="text-sm font-bold mb-2 text-right"
              style={{ color: "#3b003b" }}
            >
              المواد الدراسية
            </h3>
            <div className="flex flex-wrap gap-1 justify-start">
              {teacher?.subjects &&
                teacher?.subjects?.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: "#ffd700",
                      color: "#3b003b",
                      borderColor: "#ffd700",
                    }}
                  >
                    {subject.grade_name} - {subject.subject_name}
                  </span>
                ))}

              {subjects &&
                subjects?.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: "#ffd700",
                      color: "#3b003b",
                      borderColor: "#ffd700",
                    }}
                  >
                    {subject.grade_name} - {subject.course_name}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {teacher?.intro_vid_url && (
          <div className="mt-4">
            <h3
              className="text-sm font-bold mb-2 text-right"
              style={{ color: "#ffd700" }}
            >
              فيديو تعريفي
            </h3>
            <div
              className=" rounded-lg "
              style={{
                backgroundColor: "#f8f4ff",
                borderColor: "#ffd700",
              }}
            >
              <video
                src={teacher.intro_vid_url}
                controls
                className="w-full rounded-md shadow-sm"
                style={{ maxHeight: "200px" }}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TeacherModal;
