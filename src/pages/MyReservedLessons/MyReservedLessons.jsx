import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Select,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./style.css";
import moment from "moment";

import { FaSpinner } from "react-icons/fa";
import { Loader } from "rsuite";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { BASE_URL } from "../../components/axios/BASE_URL";
import { Video } from "lucide-react";

moment.locale("en");

const MyReservedLessons = () => {
  const AdminData = JSON.parse(localStorage.getItem("NagahTeacherData"));
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [courses, setCourses] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [weekRange, setWeekRange] = useState({
    start: "",
    end: "",
  });
  const [rowData, setRowData] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);

  useEffect(() => {
    console.log(rowData);
  }, [rowData]);

  const daysOfWeek = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);

  const fetchCourses = () => {
    const dataSend = {
      admin_id: AdminData?.teacher_id,
    };

    axios
      .post(
        BASE_URL + "/admin/courses/select_courses.php",
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status === "success") {
          setCourses(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    console.log(timeSlots);
  }, [timeSlots]);

  const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));

  const fetchLessons = () => {
    setLoading(true);
    const dataSend = {
      student_id: NagahUser?.student_id,
    };

    axios
      .post(
        BASE_URL + "/user/lessons/get_my_lessons.php",
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status === "success") {
          const formattedLessons = res.data.lessons.map((lesson) => {
            const startTime = moment(lesson.scheduled_time, "HH:mm:ss");
            const endTime = lesson.end_time
              ? moment(lesson.end_time, "HH:mm:ss")
              : moment(lesson.scheduled_time, "HH:mm:ss").add(
                  parseInt(lesson.duration) || 60, // default 60 minutes if no duration
                  "minutes"
                );

            // Calculate duration: use duration if > 0, otherwise calculate from times
            let calculatedDuration;
            if (parseInt(lesson.duration) > 0) {
              calculatedDuration = parseInt(lesson.duration);
            } else {
              // Use end_time - start_time
              const endTimeForCalc = lesson.end_time
                ? moment(lesson.end_time, "HH:mm:ss")
                : endTime;
              calculatedDuration = endTimeForCalc.diff(startTime, "minutes");
            }

            return {
              lesson_id: lesson.request_id,
              lesson_title: `حصة ${lesson.subject_id}`,
              course_id: lesson.subject_id,
              course_name: lesson.course_name || `مادة ${lesson.subject_id}`,
              lesson_date: lesson.scheduled_date,
              start_time: lesson.scheduled_time,
              end_time: endTime.format("HH:mm:ss"),
              duration: calculatedDuration,
              description: `نوع المجموعة: ${
                lesson.group_type === "small_group"
                  ? "مجموعة صغيرة"
                  : lesson.group_type === "individual"
                  ? "حصة فردية"
                  : "مجموعة كبيرة"
              }`,
              group_type: lesson.group_type,
              request_type: lesson.request_type,
              student_id: lesson.student_id,
              is_group: false,
              status: lesson.status,
              zoom_meeting_link: lesson.zoom_meeting_link,
            };
          });

          const formattedGroupLessons =
            res.data.group_lessons?.map((group) => {
              const startTime = moment(group.start_time, "HH:mm:ss");
              const endTime = moment(group.end_time, "HH:mm:ss");
              const duration = endTime.diff(startTime, "minutes");

              return {
                lesson_id: group.group_classes_id,
                lesson_title: group.group_name,
                course_id: "group_" + group.group_id,
                course_name: group.group_name + " - " + group.course_name,
                lesson_date: group.lesson_date,
                start_time: group.start_time,
                end_time: group.end_time,
                duration: duration,
                description: group.group_desc,
                group_type: "group",
                request_type: "scheduled",
                is_group: true,
                group_id: group.group_id,
                status: group.status,
                zoom_meeting_link: group.zoom_meeting_link,
              };
            }) || [];

          const allLessons = [...formattedLessons, ...formattedGroupLessons];

          // Extract unique time slots from all lessons
          const timeSlotSet = new Set();
          allLessons.forEach((lesson) => {
            const start = moment(lesson.start_time, "HH:mm:ss");
            const end = moment(lesson.end_time, "HH:mm:ss");
            const timeSlot = `${start.format("H:mm")} - ${end.format("H:mm")}`;
            timeSlotSet.add(timeSlot);
          });

          // Sort time slots by start time
          const extractedTimeSlots = Array.from(timeSlotSet).sort((a, b) => {
            const startTimeA = moment(a.split(" - ")[0], "H:mm");
            const startTimeB = moment(b.split(" - ")[0], "H:mm");
            return startTimeA.diff(startTimeB);
          });

          setTimeSlots(extractedTimeSlots);
          setLessons(allLessons);
          setWeekRange({
            start: res.data.start_of_week,
            end: res.data.end_of_week,
          });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("حدث خطأ في جلب البيانات");
      })
      .finally(() => setLoading(false));
  };

  const setLinktoLesson = async () => {
    try {
      setSubmitting(true);
      const dataSend = {
        group_classes_id: rowData.lesson_id,
        zoom_meeting_link: rowData.zoom_meeting_link,
      };

      const response = await axios.post(
        BASE_URL + "/admin/teacher/set_zoom_link.php",
        JSON.stringify(dataSend)
      );
      if (response.data.status === "success") {
        toast.success("تم تحديث رابط بنجاح");
        fetchLessons();
        setShowZoomModal(false);
      } else {
        toast.error(response.data.message || "حدث خطأ في تحديث رابط ");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في تحديث رابط ");
    } finally {
      setSubmitting(false);
    }
  };

  const setLessonStatus = async (status) => {
    try {
      setSubmitting(true);
      const dataSend = {
        group_classes_id: rowData.lesson_id,
        status: status ? "Active" : "dnActive",
      };

      const response = await axios.post(
        BASE_URL + "/admin/teacher/activate_lesson.php",
        JSON.stringify(dataSend)
      );
      if (response.data.status === "success") {
        toast.success(`تم ${status ? "تفعيل" : "إلغاء تفعيل"} الحصة بنجاح`);
        fetchLessons();
        setShowZoomModal(false);
      } else {
        toast.error(response.data.message || "حدث خطأ في تحديث حالة الحصة");
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في تحديث حالة الحصة");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveZoomSettings = async () => {
    try {
      setSubmitting(true);

      if (rowData.zoom_meeting_link !== rowData.original_zoom_meeting_link) {
        await setLinktoLesson();
      }

      if (rowData.original_active !== rowData.is_active) {
        await setLessonStatus(rowData.is_active);
      }

      setShowZoomModal(false);
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في حفظ الإعدادات");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenZoomModal = (lesson) => {
    if (lesson.status == "Active") {
      window.open(
        lesson.zoom_meeting_link.match(/^https?:\/\//)
          ? lesson.zoom_meeting_link
          : "https://" + lesson.zoom_meeting_link,
        "_blank"
      );
    } else {
      toast.error("لا يمكن الدخول إلى الحصة قبل تفعيلها");
    }
  };

  const getLessonsForSlot = (day, timeSlot) => {
    const dayIndex = daysOfWeek.indexOf(day);
    if (dayIndex === -1) return [];

    const startOfWeek = moment(
      weekRange.start || moment().format("YYYY-MM-DD")
    );
    const dayDate = startOfWeek
      .clone()
      .add(dayIndex, "days")
      .format("YYYY-MM-DD");

    const [slotStartTime, slotEndTime] = timeSlot.split(" - ");
    const slotStart = moment(slotStartTime, "H:mm");
    const slotEnd = moment(slotEndTime, "H:mm");

    return lessons.filter((lesson) => {
      // Check if lesson is on the correct day
      if (lesson.lesson_date !== dayDate) return false;

      const lessonStart = moment(lesson.start_time, "HH:mm:ss");
      const lessonEnd = moment(lesson.end_time, "HH:mm:ss");

      // Check if lesson's time matches the time slot exactly
      return (
        lessonStart.format("H:mm") === slotStart.format("H:mm") &&
        lessonEnd.format("H:mm") === slotEnd.format("H:mm")
      );
    });
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.course_name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesSearch;
  });

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours} ساعة` : ""} ${
      mins > 0 ? `${mins} دقيقة` : ""
    }`;
  };

  const courseOptions = [
    {
      value: "all",
      label: "الكل",
    },
    ...(courses?.map((course) => ({
      value: course.course_id,
      label:
        course.university_name +
        " - " +
        course.grade_name +
        " - " +
        course.course_name,
    })) || []),
  ];

  return (
    <div className="w-[100%] h-[100%] px-[20px]">
      <div className="w-[100%]">
        <div className="flex flex-wrap gap-[15px] items-center mb-4">
          {/* <Input
            placeholder="بحث عن حصة..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            className="search-input"
          /> */}
          {/* <CustomDropdown
            placeholder="تصفية حسب المادة"
            width="400px"
            onChange={(value) => setSelectedCourse(value)}
            defaultValue={selectedCourse}
            options={courseOptions}
          /> */}
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="schedule-container">
            <div className="week-info">
              <h3 className="text-lg font-bold mb-2 text-[#ffd700]">
                جدول الأسبوع: {moment(weekRange.start).format("YYYY/MM/DD")} -{" "}
                {moment(weekRange.end).format("YYYY/MM/DD")}
              </h3>
            </div>
            <div className="schedule-grid">
              <div className="schedule-header">
                <div className="schedule-cell day-header">اليوم / الوقت</div>
                {timeSlots.map((slot, index) => (
                  <div key={index} className="schedule-cell time-header">
                    {slot}
                  </div>
                ))}
              </div>

              {daysOfWeek.map((day, dayIndex) => (
                <div key={dayIndex} className="schedule-row">
                  <div className="schedule-cell day-cell">{day}</div>
                  {timeSlots.map((slot, slotIndex) => {
                    const slotLessons = getLessonsForSlot(day, slot);
                    return (
                      <div key={slotIndex} className="schedule-cell time-cell">
                        {slotLessons.map((lesson, lessonIndex) => (
                          <div
                            key={`${lesson.lesson_id}-${lesson.is_group}`}
                            onClick={() => handleOpenZoomModal(lesson)}
                            className={`lesson-card flex items-center justify-between w-full${
                              lesson.is_group ? "group-lesson" : ""
                            }`}
                          >
                            <div>
                              <div className="lesson-title">
                                {lesson.course_name}
                              </div>
                              <div className="lesson-time">
                                {moment(lesson.start_time, "HH:mm:ss").format(
                                  "hh:mm A"
                                )}
                                <span className="lesson-duration">
                                  ({formatDuration(lesson.duration)})
                                </span>
                              </div>
                              <div className="lesson-group-type">
                                {lesson.is_group
                                  ? "مجموعة"
                                  : lesson.group_type === "small_group"
                                  ? "مجموعة صغيرة"
                                  : lesson.group_type === "individual"
                                  ? "حصة فردية"
                                  : "مجموعة كبيرة"}
                              </div>
                            </div>

                            <div className="badge !text-[#fff] p-2 text-[12px] font-semibold rounded-full">
                              {lesson.status == "Active" ? (
                                <div className="animate-pulse ">
                                  <Video />
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="lessons-list mt-8">
          <h2 className="text-xl font-bold mb-4 !text-[#ffd700]">
            قائمة الحصص
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons?.map((lesson) => (
              <div
                key={`${lesson.lesson_id}-${lesson.is_group}`}
                className={`lesson-list-card ${
                  lesson.is_group ? "group-lesson-card" : ""
                }`}
                onClick={() => handleOpenZoomModal(lesson)}
              >
                <h3 className="lesson-list-title">{lesson.course_name}</h3>
                <p className="lesson-list-date">
                  {moment(lesson.lesson_date).format("dddd, YYYY/MM/DD")}
                </p>
                <p className="lesson-list-time">
                  {moment(lesson.start_time, "HH:mm:ss").format("hh:mm A")} -
                  {lesson.is_group
                    ? moment(lesson.end_time, "HH:mm:ss").format(" hh:mm A")
                    : ` المدة: ${formatDuration(lesson.duration)}`}
                </p>
                <div className="lesson-list-details">
                  {lesson.is_group ? (
                    <span className="group-type group">مجموعة</span>
                  ) : (
                    <span
                      className={`group-type ${
                        lesson.group_type === "small_group" ? "small" : "large"
                      }`}
                    >
                      {lesson.group_type === "small_group"
                        ? "مجموعة صغيرة"
                        : "مجموعة كبيرة"}
                    </span>
                  )}
                  <span className="request-type">
                    {lesson.request_type === "scheduled" ? "مجدولة" : "طلب"}
                  </span>
                </div>
                {lesson.description && (
                  <p className="lesson-list-desc">{lesson.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <Modal
        title={`إعدادات الحصة: ${rowData?.course_name || ""}`}
        open={showZoomModal}
        onCancel={() => setShowZoomModal(false)}
        className="custom-modal"
        centered
        footer={
          <>
            <button
              onClick={handleSaveZoomSettings}
              className="modal-submit-button"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                </div>
              ) : (
                "حفظ الإعدادات"
              )}
            </button>
          </>
        }
      >
        <div className="custom-form">
          <div className="form-group">
            <label className="form-label" htmlFor="zoom_link">
              رابط الإجتماع
            </label>
            <Input
              id="zoom_link"
              className="custom-input"
              placeholder="أدخل رابط للحصة"
              value={rowData?.zoom_meeting_link}
              onChange={(e) => {
                setRowData({
                  ...rowData,
                  zoom_meeting_link: e.target.value,
                });
              }}
            />
          </div>
          <div className="form-group mt-4">
            <label className="form-label mb-2 block" htmlFor="lesson_status">
              حالة الحصة
            </label>
            <div className="flex items-center">
              <Switch
                id="lesson_status"
                checked={rowData?.is_active}
                onChange={(checked) => {
                  setRowData({
                    ...rowData,
                    is_active: checked,
                  });
                }}
              />
              <span className="mr-2">
                {rowData?.is_active ? "مفعلة" : "غير مفعلة"}
              </span>
            </div>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default MyReservedLessons;
