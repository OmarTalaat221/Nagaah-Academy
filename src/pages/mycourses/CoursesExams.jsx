import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate } from "react-router";
import AllCoursesBanner from "./AllCoursesBanner/AllCoursesBanner";
import "./allcourses.css";
import "./maincourse.css";
import { getCourses } from "./functions/getAll";
import { useDispatch } from "react-redux";
import ContentLoader from "react-content-loader";
import GradeImage from "../../assets/logo/log.png";
const CourseExams = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  console.log(userData);
  const [selectedTopic, setSelectedTopic] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    getCourses(
      userData,
      setPageLoading,
      setCourses,
      setOriginalCourses,
      dispatch
    );
  }, []);
  return (
    <div style={{ padding: "40px" }}>
      <div className="allcourses">
        <AllCoursesBanner
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />

        <div className="courses_content py-3">
          {!courses ? (
            <div style={{ width: "100vw " }}>
              <ContentLoader
                viewBox="0 0 980 320"
                speed={1}
                // backgroundColor={'green'}
              >
                {}
                <rect x="10" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="350" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="690" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="690" y="10" rx="20" ry="20" width="260" height="300" />
              </ContentLoader>
            </div>
          ) : courses && courses?.length > 0 ? (
            courses.map((item, index) => {
              return (
                <div
                  key={index} // Add key prop
                  className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                  style={{
                    margin: "10px",
                    flex: "0 0 auto",
                  }}
                  onClick={() =>
                    navigate("/exams/courses?course_id=" + item?.course_id, {})
                  }
                >
                  <div
                    className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(#3b003b, #3b003b) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
                      border: "3px solid transparent",
                      minHeight: "300px",
                      minWidth: "250px",
                      maxWidth: "280px", // Limit card width
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
                            alt={item?.course_name || "Course"}
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

                      {/* Course Information */}
                      <div className="text-center space-y-4 w-full">
                        {/* Name */}
                        <h4
                          className="text-xl font-bold max-w-[200px] transition-all duration-300 group-hover:scale-105 truncate"
                          style={{ color: "#ffd700" }}
                        >
                          {item?.course_name}
                        </h4>
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
              );
            })
          ) : (
            <div className="empty">
              <MdPlayLesson className="icon" />
              <h5>لا توجد دورات متاحه</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseExams;
