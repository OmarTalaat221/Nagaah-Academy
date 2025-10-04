import React, { useEffect, useState } from "react";
import "./allcourses.css";
import Footer from "../../components/Footer/Footer";
import CryptoJS from "crypto-js";
import { MdPlayLesson } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router";
import { base_url } from "../../constants";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

const Unitquestions = () => {
  // const { course_id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    // {
    //   id: 1,
    //   name: "الإملاء والخط",
    // },
    // {
    //   id: 2,
    //   name: "الحروف والكلمات",
    // },
    // {
    //   id: 3,
    //   name: "القواعد الأساسية",
    // },
    // {
    //   id: 4,
    //   name: "التعبير والإنشاء",
    // },
    // {
    //   id: 5,
    //   name: "القراءة والاستيعاب",
    // },
  ]);
  const [pageLoading, setPageLoading] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  const { id } = useParams();
  const { state } = useLocation();
  const admin_id = state?.admin_id;
  useEffect(() => {
    const getCourses = () => {
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
        course_id: id,
      };
      axios
        .post(
          base_url + "/user/courses/select_course_unit.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.data.status === "success") {
            setCourses(res.data.message);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setPageLoading(false);
        });
    };
    getCourses();
  }, []);

  return (
    <>
      <div className="allcourses">
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
              textShadow: "4px 0px 0px black",
            }}
          >
            اضغط على الوحدة أدناه لرؤية الأسئلة المتاحة لها
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
              textShadow: "2px 0px 0px black",
            }}
          >
            كل مقرر يحتوي على وحدات خاصة مصممة لطلابها، لذا نضمن لك مستوى عاليًا
            من التعليم والخبرة.
          </p>
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: 900,
            color: "white",
          }}
        >
          الوحدات
        </h2>

        <div className="courses_content py-2">
          {pageLoading ? (
            <div style={{ width: "100vw " }}>
              <Loader />
            </div>
          ) : courses && courses?.length > 0 ? (
            courses.map((item) => {
              return (
                <div
                  key={item?.unit_id}
                  className="group cursor-pointer transform transition-all duration-500"
                  style={{
                    margin: "10px",
                  }}
                  onClick={() => {
                    navigate(
                      "/questionBank/" +
                        item?.unit_id +
                        "?type=unit&course_id=" +
                        id
                    );
                  }}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(#3b003b, #3b003b) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
                      border: "3px solid transparent",
                      // minHeight: "300px",
                      minWidth: "250px",
                    }}
                  >
                    {/* Animated border glow effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                      style={{
                        background:
                          "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
                        filter: "blur(8px)",
                        // transform: "scale(1.05)",
                      }}
                    />

                    {/* Unit Name - Fixed positioning and styling */}
                    <div className="relative z-20 p-4">
                      <h4
                        className="text-xl font-bold transition-all duration-300 text-center"
                        style={{
                          color: "#ffd700",
                          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                          wordBreak: "break-word",
                          lineHeight: "1.4",
                        }}
                      >
                        {item?.unit_name || "Unit Name"}
                      </h4>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />

                    {/* Content container
                    <div className="relative z-10 flex flex-col justify-center items-center p-8 h-full">
                      {/* Decorative elements 
                      <div
                        className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: "#ffd700" }}
                      />
                      <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-300/60 rounded-full animate-ping" />
                      <div className="absolute bottom-6 left-4 w-4 h-4 bg-yellow-500/30 rounded-full animate-bounce" />

                      <div className="relative mb-6 group/image">
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
                    </div> */}

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
              <h5>لا توجد وحدات</h5>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Unitquestions;
