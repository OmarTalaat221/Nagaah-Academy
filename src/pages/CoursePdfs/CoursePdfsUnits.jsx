import React, { useEffect, useState } from "react";
import { Play, ArrowRight, Book, Star, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { base_url } from "../../constants";
import CryptoJS from "crypto-js";
import { useSearchParams } from "react-router-dom";

const CoursePdfsUnits = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    // { unit_id: 1, unit_name: "الوحدة الأولى: أساسيات البرمجة" },
    // { unit_id: 2, unit_name: "الوحدة الثانية: هياكل البيانات" },
    // { unit_id: 3, unit_name: "الوحدة الثالثة: الخوارزميات" },
    // { unit_id: 4, unit_name: "الوحدة الرابعة: قواعد البيانات" },
    // { unit_id: 5, unit_name: "الوحدة الخامسة: تطوير الواجهات" },
    // { unit_id: 6, unit_name: "الوحدة السادسة: الأمان والحماية" },
  ]);
  const [pageLoading, setPageLoading] = useState(false);

  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const { course_id, unit_id } = useParams();
  const [searchParams] = useSearchParams();
  const nagahUser = JSON.parse(localStorage.getItem("NagahUser"));

  const teacher_id = searchParams.get("teacher_id");

  useEffect(() => {
    const getCourses = () => {
      const data_send = {
        student_id: nagahUser ? nagahUser?.student_id : null,
        token_value: userData?.token_value,
        course_id: course_id,
        admin_id: nagahUser ? teacher_id : null,
      };
      axios
        .post(
          base_url + "/user/courses/content/pdfs/select_pdfs_units.php",
          data_send
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
      <div
        className="allcourses min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #1a0d2e 0%, #16213e 25%, #0f3460 50%, #1a0d2e 75%, #3b003b 100%)",
          position: "relative",
          overflow: "hidden",
          direction: "rtl",
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="relative z-10 px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block p-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6">
              <Book className="text-4xl text-purple-900" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              الوحدات التعليمية
            </h1>

            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed">
                اضغط على الوحدة أدناه لرؤية الأسئلة المتاحة لها
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                كل مقرر يحتوي على وحدات خاصة مصممة لطلابها، لذا نضمن لك مستوى
                عاليًا من التعليم والخبرة.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
                <div
                  className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>

          {/* Units Grid */}
          <div className="max-w-7xl mx-auto">
            {pageLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-white/20 rounded mb-4" />
                    <div className="h-32 bg-white/20 rounded mb-4" />
                    <div className="h-4 bg-white/20 rounded" />
                  </div>
                ))}
              </div>
            ) : courses && courses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {courses.map((item, index) => (
                  <div
                    key={item?.unit_id}
                    className="group cursor-pointer transform transition-all duration-700 hover:scale-105"
                    onClick={() =>
                      navigate(
                        `/pdfs-units/${course_id}/unit/${item?.unit_id}/pdfs`
                      )
                    }
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/25">
                      {/* Animated border glow */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/20 via-yellow-300/20 to-yellow-400/20 blur-xl animate-pulse" />
                      </div>

                      {/* Top decoration */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

                      {/* Card content */}
                      <div className="relative p-8 h-full min-h-[280px] flex flex-col">
                        {/* Unit number badge */}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-purple-900 font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>

                        {/* Star decoration */}
                        <div className="absolute top-4 left-4 text-yellow-400 animate-pulse">
                          <Star className="text-xl w-5 h-5" />
                        </div>

                        {/* Unit name */}
                        <div className="flex-1 flex items-center justify-center text-center">
                          <h3 className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 leading-relaxed">
                            {item?.unit_name || "Unit Name"}
                          </h3>
                        </div>

                        {/* Bottom section */}
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse text-white/60">
                            <Play className="text-lg w-5 h-5" />
                            <span className="text-sm">ابدأ التعلم</span>
                          </div>

                          <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors duration-300">
                            <ArrowRight className="text-yellow-400 text-lg w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                        {/* Floating particles */}
                        <div className="absolute top-16 left-8 w-2 h-2 bg-yellow-400/40 rounded-full animate-ping" />
                        <div
                          className="absolute bottom-16 right-12 w-1 h-1 bg-yellow-300/50 rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        />
                        <div
                          className="absolute top-24 right-16 w-1.5 h-1.5 bg-yellow-500/30 rounded-full animate-bounce"
                          style={{ animationDelay: "2s" }}
                        />
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                  <Play className="text-6xl w-16 h-16 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  لا توجد وحدات
                </h3>
                <p className="text-white/70">
                  لم يتم العثور على أي وحدات تعليمية في هذا المقرر
                </p>
              </div>
            )}
          </div>

          {/* Bottom decoration */}
          {courses && courses?.length > 0 && (
            <div className="text-center mt-16">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm rounded-full border border-yellow-400/30">
                <span className="text-yellow-400 font-semibold">
                  إجمالي الوحدات: {courses.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursePdfsUnits;
