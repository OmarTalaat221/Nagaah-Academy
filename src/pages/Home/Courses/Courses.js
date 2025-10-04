import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import "./courses.css";
import { coursesTypesData } from "./data";
import CryptoJS from "crypto-js";
import Skeleton from "react-loading-skeleton";
import { getCourses } from "../../AllCourses/functions/getAll";
import logo from "../../../assets/logo/medLearningHub.png";
import { MdPlayLesson } from "react-icons/md";
import Loader from "../../../components/Loader/Loader";

const Courses = ({ emptyText = false }) => {
  const paramtext = window.location.pathname;
  console.log(paramtext);

  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [originalCourses, setOriginalCourses] = useState([]);

  const getCoursesType = useCallback(() => {
    setSelectedType(coursesTypesData[0].id);
  }, []);

  const filterCourses = useCallback(() => {
    if (selectedType === 0) {
      setCoursesData(originalCourses);
    } else {
      setCoursesData(
        originalCourses.filter((item) => item.type_id === selectedType)
      );
    }
  }, [selectedType, originalCourses]);

  useEffect(() => {
    getCourses(
      userData,
      setPageLoading,
      setCoursesData,
      setOriginalCourses,
      null,
      "home"
    );
    getCoursesType();
  }, []);

  useEffect(() => {
    if (selectedType !== "") {
      filterCourses();
    }
  }, [selectedType, filterCourses]);

  const renderCourseCards = (courses) => {
    return courses.map((item, index) => (
      <div
        key={index}
        className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
        style={{
          margin: "10px",
          flex: "0 0 auto",
        }}
        onClick={() =>
          navigate(
            `/CourseContent?course_id=${item?.course_id}?teacher_id=${item?.teacher_id}`,
            {
              state: { course_details: item },
            }
          )
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
            maxWidth: "280px",
          }}
        >
          {/* باقي الكود كما هو */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            style={{
              background: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
              filter: "blur(8px)",
              transform: "scale(1.05)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />

          <div className="relative z-10 flex flex-col justify-center items-center p-8 h-full">
            <div
              className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: "#ffd700" }}
            />
            <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-300/60 rounded-full animate-ping" />
            <div className="absolute bottom-6 left-4 w-4 h-4 bg-yellow-500/30 rounded-full animate-bounce" />

            <div className="relative mb-6 group/image">
              <div className="relative w-40 h-40 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-110">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                  src={item?.course_photo_url}
                  alt={item?.course_name || "Course"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-purple-900 shadow-lg animate-bounce border-2 border-white"
                style={{ backgroundColor: "#ffd700" }}
              >
                ★
              </div>

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

            <div className="text-center space-y-4 w-full">
              <h4
                className="text-base font-bold max-w-[200px] transition-all duration-300 group-hover:scale-105 truncate"
                style={{ color: "#ffd700" }}
              >
                {" الصف " + item?.grade_name + " - " + item?.course_name}
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
              background: "linear-gradient(45deg, #ffd700 0%, transparent 70%)",
              clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
            }}
          />
        </div>
      </div>
    ));
  };

  const URLparam = new URLSearchParams(window.location.search);

  // إذا كان coursesData فارغ و emptyText = false، لا تعرض أي شيء
  if (!pageLoading && coursesData.length === 0 && !emptyText) {
    return null;
  }

  return (
    <div className="relative border-b-[5px] border-[#ffd700]">
      <div className="" style={{ marginBottom: "0px" }}>
        {pageLoading ? (
          <div
            className="flex justify-center items-center"
            style={{
              minHeight: "400px",
              width: "100%",
            }}
          >
            <Loader />
          </div>
        ) : coursesData.length > 0 ? (
          <>
            <div
              className="columnDiv"
              style={{
                marginBottom: "40px",
                color: "white",
                fontSize: "40px",
                textShadow: "4px 0px 0px black",
                fontWeight: "bold",
              }}
            >
              <h1>دروس مجانية</h1>
            </div>

            <div
              className="!mx-auto container !w-fit"
              style={{
                flexWrap: "wrap",
                width: "fit-content",
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "30px 20px",
                direction: "rtl",
                gap: "20px",
                maxWidth: "1200px",
              }}
            >
              {paramtext === "/freecourses"
                ? coursesData?.length > 0 && renderCourseCards(coursesData)
                : coursesData?.length > 0 &&
                  renderCourseCards(coursesData.slice(0, 3))}
            </div>

            {paramtext !== "/freecourses" && coursesData.length > 0 && (
              <button
                onClick={() => navigate("/freecourses")}
                className="btn-show-more min-w-fit md:!w-fit md:min-w-[400px] px-2 mx-auto flex items-center justify-center gap-2"
              >
                عرض جميع دوراتنا
              </button>
            )}

            <hr className="hr" />
          </>
        ) : (
          // Empty state - يظهر فقط إذا كان emptyText موجود
          emptyText && (
            <div
              className="flex justify-center items-center flex-col"
              style={{
                minHeight: "400px",
                width: "100%",
              }}
            >
              <div
                style={{
                  color: "#ffd700",
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "center",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                لا توجد دورات متاحة حالياً
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Courses;
