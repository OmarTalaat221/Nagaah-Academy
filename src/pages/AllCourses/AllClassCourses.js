import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import Footer from "../../components/Footer/Footer";

import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../constants";

const AllClassCourses = () => {
  const { id, class_id } = useParams();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("NagahUser"));

  const checkPath = window.location.pathname === "/mycourses-pdfs";
  console.log(checkPath);

  const [subjects, setSubject] = useState([]);

  const getData = () => {
    const dataSend = {
      student_id: userData?.student_id,
      token_value: userData?.token_value,
    };
    axios
      .post(
        `${base_url}/user/courses/select_my_courses.php`,
        JSON.stringify(dataSend)
      )

      .then((res) => {
        if (res.data.status == "success") {
          setSubject(res?.data?.message);
          console.log(subjects);
        } else {
          toast.error("someThing went wrong");
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleVideoClick = (e, item) => {
    e.stopPropagation();
    if (checkPath) {
      navigate(`/pdfs-units/${item?.course_id}`);
    } else {
      navigate(
        `/CourseContent?course_id=${item?.course_id}?teacher_id=${item?.teacher_id}`,
        {
          state: { course_details: item },
        }
      );
    }
  };

  const handleAssignmentClick = (e, item) => {
    e.stopPropagation();
    navigate(`/assignments?course_id=${item?.course_id}`, {
      state: { course_details: item },
    });
  };

  return (
    <>
      <div className="allcourses grades">
        <div className="all_course-title">
          <h3
            style={{
              marginTop: "50px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "40px",
              fontWeight: "bold",
              color: "white",
              textShadow: "4px 0px 0px rgba(0, 0, 0, 0.534)",
            }}
          >
            اضغط على الماده أدناه لرؤية المناهج المتاحة لها
          </h3>
          <p
            style={{
              textAlign: "center",
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "30px",
              fontSize: "15px",
              color: "white",
              textShadow: "2px 0px 0px rgba(0, 0, 0, 0.534)",
            }}
          >
            لكل ماده مناهج مخصصة لطلابها، لذا نضمن لك مستوى عالٍ من التعليم
            والخبرة.
          </p>
        </div>

        <h2
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "30px",
            fontWeight: 900,
            textShadow: "2px 0px 0px rgba(0, 0, 0, 0.534)",
          }}
        >
          المواد المتاحه
        </h2>

        <div
          style={{
            width: "90%",
            margin: "auto",
            alignItems: "center",
            padding: "30px 0",
            direction: "rtl",
            position: "relative",
          }}
          className="grid grid-cols-1 justify-center items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {subjects.length > 0 ? (
            subjects.map((item, index) => {
              return (
                <>
                  <div key={index} style={{ position: "relative" }}>
                    <div className="group cursor-pointer transform transition-all duration-500 hover:scale-105">
                      <div
                        className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                        style={{
                          background:
                            "linear-gradient(#3b003b, #3b003b) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
                          border: "3px solid transparent",
                          minHeight: "270px",
                        }}
                      >
                        {/* Animated border glow effect */}
                        <div
                          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                          style={{
                            background:
                              "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
                            filter: "blur(8px)",
                            transform: "scale(1.05)",
                          }}
                        />

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />

                        {/* Content container */}
                        <div className="relative z-10 flex flex-col justify-center items-center p-8 h-full">
                          {/* Decorative elements */}
                          <div
                            className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
                            style={{ backgroundColor: "#ffd700" }}
                          />
                          <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-300/60 rounded-full animate-ping" />
                          <div className="absolute bottom-6 left-4 w-4 h-4 bg-yellow-500/30 rounded-full animate-bounce" />

                          {/* Profile Image Container */}
                          <div className="relative mb-6 group/image">
                            <div className="relative w-40 h-40 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-110">
                              <img
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                                src={item?.course_photo_url}
                                alt={item?.course_photo_url}
                              />

                              {/* Image overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Floating badge */}
                            <div
                              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-purple-900 shadow-lg animate-bounce border-2 border-white"
                              style={{ backgroundColor: "#ffd700" }}
                            >
                              ★
                            </div>

                            {/* Orbital rings */}
                            <div
                              className="absolute inset-0 rounded-full border border-yellow-400/30 animate-pulse"
                              style={{ transform: "scale(1.2)" }}
                            />
                            <div
                              className="absolute inset-0 rounded-full border border-yellow-400/20 animate-pulse"
                              style={{
                                transform: "scale(1.4)",
                                animationDelay: "0.5s",
                              }}
                            />
                          </div>

                          {/* Teacher Information */}
                          <div className="text-center space-y-4 w-full">
                            {/* Name */}
                            <h4
                              className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
                              style={{ color: "#ffd700" }}
                            >
                              {item?.course_name}
                            </h4>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6 w-full justify-center">
                            {/* Videos Button */}
                            <button
                              onClick={(e) => handleVideoClick(e, item)}
                              className="flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
                              style={{
                                background:
                                  "linear-gradient(45deg, #ffd700, #ffed4e)",
                                color: "#3b003b",
                                border: "2px solid #ffd700",
                                maxWidth: "120px",
                              }}
                            >
                              الفيديوهات
                            </button>

                            {/* Assignments Button */}
                            <button
                              onClick={(e) => handleAssignmentClick(e, item)}
                              className="flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95"
                              style={{
                                background: "transparent",
                                color: "#ffd700",
                                border: "2px solid #ffd700",
                                maxWidth: "120px",
                              }}
                            >
                              الواجبات
                            </button>
                          </div>

                          <div
                            className="absolute top-12 left-8 w-1 h-1 bg-yellow-400/40 rounded-full animate-ping"
                            style={{ animationDelay: "0.5s" }}
                          />
                          <div
                            className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-pulse"
                            style={{ animationDelay: "1s" }}
                          />
                          <div
                            className="absolute top-20 right-16 w-1 h-1 bg-yellow-500/30 rounded-full animate-bounce"
                            style={{ animationDelay: "1.5s" }}
                          />
                        </div>

                        {/* Corner decorations */}
                        <div
                          className="absolute top-0 right-0 w-16 h-16 opacity-20"
                          style={{
                            background:
                              "linear-gradient(225deg, #ffd700 0%, transparent 70%)",
                            clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
                          }}
                        />
                        <div
                          className="absolute bottom-0 left-0 w-12 h-12 opacity-15"
                          style={{
                            background:
                              "linear-gradient(45deg, #ffd700 0%, transparent 70%)",
                            clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <div
              className="col-span-4"
              style={{ width: "100%", textAlign: "center" }}
            >
              <p
                style={{
                  fontSize: "40px",
                  color: "#ffd700",
                  textAlign: "center",
                }}
              >
                لا يوجد مناهج متاحة
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllClassCourses;
