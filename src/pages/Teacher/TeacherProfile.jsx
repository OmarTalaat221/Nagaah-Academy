import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { base_url } from "../../constants";
import { toast } from "react-toastify";
import { AiFillSchedule } from "react-icons/ai";
import TeacherTabel from "../../components/TeacherTabel/TeacherTabel";
import { UserData } from "../../components/axios";

const TeacherProfile = () => {
  const [TeacherData, setTeacherData] = useState([]);
  const [ReservationModal, setReservationModal] = useState(false);
  const [SelectedVid, setSelectedVid] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const { teacher_id } = useParams();
  const navigate = useNavigate();

  const lessonTimes = [
    { id: 1, label: "08:00 AM - 09:00 AM", value: "08:00-09:00" },
    { id: 2, label: "09:00 AM - 10:00 AM", value: "09:00-10:00" },
    { id: 3, label: "10:00 AM - 11:00 AM", value: "10:00-11:00" },
    { id: 4, label: "11:00 AM - 12:00 PM", value: "11:00-12:00" },
    { id: 5, label: "12:00 PM - 01:00 PM", value: "12:00-13:00" },
    { id: 6, label: "01:00 PM - 02:00 PM", value: "13:00-14:00" },
    { id: 7, label: "02:00 PM - 03:00 PM", value: "14:00-15:00" },
    { id: 8, label: "03:00 PM - 04:00 PM", value: "15:00-16:00" },
  ];

  const UserData = JSON.parse(localStorage.getItem("NagahUser"));

  const handelSelectTeacher = () => {
    const dataSend = {
      teacher_id: teacher_id,
    };
    axios
      .post(
        base_url + `/user/teachers/select_teacher.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          setTeacherData(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    handelSelectTeacher();
    setSelectedVid(TeacherData[0]?.free_videos[0]);
  }, []);

  const teacher = TeacherData[0];

  const [SelectedTap, setSelectedTap] = useState(1);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#3b003b] via-[#3b003b] to-[#3b003b]"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Teacher Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-yellow-400 shadow-2xl">
                  <img
                    src={teacher?.teacher_img}
                    alt={teacher?.teacher_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-3 shadow-lg">
                  <svg
                    className="w-6 h-6 text-yellow-800 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="lg:col-span-2 text-center lg:text-right">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  {teacher?.teacher_name}
                </h1>
                <p className="text-2xl text-yellow-400 font-semibold">
                  {teacher?.teacher_role}
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {teacher?.teacher_description}
                </p>

                {/* Rating */}
                {/* <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(teacher?.rate || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-400"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    {teacher?.rate || "0.0"} / 5
                  </span>
                </div> */}

                {/* Contact Button */}
                <button
                  onClick={() => {
                    if (UserData) {
                      navigate(`/offer-lesson/teacher/${teacher_id}/chat`, {
                        state: { TeacherData },
                      });
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  مراسلة المدرس
                </button>
                <button
                  onClick={() => setSelectedTap(!SelectedTap)}
                  className="inline-flex mx-2 items-center gap-3 bg-gradient-to-r from-[#3b003b] to-[#3b003b] hover:from-[#3b003b] hover:to-[#3b003b] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <AiFillSchedule />
                  {SelectedTap == 1 ? "   جدول المدرس" : "فيديو تعريفي"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Lesson Button */}
      {/* <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setReservationModal(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
          احجز حصة
        </button>
      </div> */}

      {/* Introduction Video Section */}

      {SelectedTap == 1 ? (
        <>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                فيديو تعريفي
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-yellow-400/30">
              <video
                src={teacher?.intro_vid_url}
                className="w-full h-[450px] object-cover "
                controls
                // poster={
                //   "https://res.cloudinary.com/dnt8gmwab/image/upload/v1749564299/_logo_NAGAAH_3_oxdsdd.png"
                // }
              />

              {/* <iframe
            className="w-full h-96 object-cover"
            src={teacher?.intro_vid_url}
            // title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe> */}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* <div className="w-[80%] min-h-[50vh] m-auto flex justify-center items-center "> */}
          <TeacherTabel />
          {/* </div> */}
        </>
      )}

      {/* Free Videos Section */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            فيديوهات مجانية
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">
                قائمة الفيديوهات
              </h3>
              <div className="space-y-3">
                {teacher?.free_videos?.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVid(video)}
                    className={`w-full text-right p-4 rounded-xl transition-all duration-300 ${
                      SelectedVid?.video_title === video?.video_title
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className="text-sm">{video?.duration}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{video?.video_title}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              {SelectedVid && (
                <>
                  <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
                    <video
                      src={SelectedVid?.youtube_id || SelectedVid?.loom_url}
                      controls
                      className="w-full h-80 object-cover"
                      poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {SelectedVid?.video_title}
                    </h3>
                    <p className="text-gray-300">
                      مدة الفيديو: {SelectedVid?.duration}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div> */}

      {/* Reservation Modal */}
      {ReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setReservationModal(false)}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-right mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                حجز حصة مع {teacher?.teacher_name}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كود الشراء
                </label>
                <input
                  type="number"
                  placeholder="ادخل كود الاشتراك"
                  className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  onWheel={(e) => e.target.blur()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر ميعاد الحصة
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">اختر المواعيد</option>
                  {lessonTimes.map((time) => (
                    <option key={time.id} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setReservationModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    alert("تم تأكيد الحجز بنجاح!");
                    setReservationModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  تأكيد الحجز
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
