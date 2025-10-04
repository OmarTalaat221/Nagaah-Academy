import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  Clock,
  User,
  Star,
  Search,
  Filter,
  BookOpen,
  Users,
  Calendar,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { base_url } from "../../constants";
import axios from "axios";
import CryptoJS from "crypto-js";

const CoursePdfs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pageLoading, setPageLoading] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  const [courses, setCourses] = useState([]);

  const categories = [
    "all",
    "البرمجة",
    "علوم البيانات",
    "تطوير الويب",
    "التسويق",
    "التصميم",
    "الأمن السيبراني",
  ];

  const { course_id, unit_id } = useParams();

  useEffect(() => {
    const getCourses = () => {
      const data_send = {
        // student_id: userData?.student_id,
        // token_value: userData?.token_value,
        unit_id: unit_id,
      };
      axios
        .post(
          base_url + "/user/courses/content/pdfs/select_user_pdfs.php",
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

  // const filteredCourses = courses.filter((course) => {
  //   const matchesSearch =
  //     course?.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     course?.description?.toLowerCase().includes(searchTerm?.toLowerCase());

  //   return matchesSearch;
  // });

  const filteredCourses = courses.filter((course) => {
    return course.book_title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDownload = (courseId, title) => {
    alert(`تحميل: ${title}`);
  };

  const handlePreview = (courseId, title) => {
    alert(`معاينة: ${title}`);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "مبتدئ":
        return "bg-green-100 text-green-700 border-green-200";
      case "متوسط":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "متقدم":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        direction: "rtl",
        background:
          "linear-gradient(135deg, #3b003b 0%, #3b003b 25%, #3b003b 50%, #3b003b 75%, #3b003b 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#ffd700] rounded-full blur-3xl animate-pulse" />
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
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-[#ffd700] to-yellow-600 mb-6">
            <BookOpen className="w-12 h-12 text-purple-900" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#ffd700] via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            مكتبة الكتب الإلكترونية
          </h1>

          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed">
              حمّل واستكشف مجموعة شاملة من الكتب التعليمية المتخصصة
            </p>
            <p className="text-lg text-white/70 leading-relaxed">
              كتب عالية الجودة مصممة لتلبية احتياجاتك التعليمية وتطوير مهاراتك
              المهنية
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-3 h-3 bg-[#ffd700] rounded-full animate-bounce" />
              <div
                className="w-3 h-3 bg-[#ffd700] rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-3 h-3 bg-[#ffd700] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 text-[#ffd700] w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن الكتب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-[1px] !border-[#ffd700] rounded-2xl focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700] text-white placeholder-white/60 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Course PDFs Grid */}
        <div className="max-w-7xl mx-auto">
          {pageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 animate-pulse"
                >
                  <div className="h-6 bg-white/20 rounded mb-4" />
                  <div className="h-32 bg-white/20 rounded mb-4" />
                  <div className="h-4 bg-white/20 rounded mb-2" />
                  <div className="h-4 bg-white/20 rounded" />
                </div>
              ))}
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="group cursor-pointer transform  transition-all duration-700 hover:scale-100"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    direction: "rtl",
                  }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br  from-[#3b003b] to-[#3b003b] backdrop-blur-sm border-[1px] !border-[#ffd700] hover:border-[#ffd700] transition-all duration-500 ">
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ffd700]/20 via-yellow-300/20 to-[#ffd700]/20 blur-xl animate-pulse" />
                    </div>

                    <div className="relative p-6 h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#ffd700] to-yellow-600 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-900" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-[#ffd700]">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">
                            {course.rating}
                          </span>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="">
                        <h3 className="text-xl font-bold text-[#ffd700] mb-2 leading-tight">
                          {course.book_title}
                        </h3>

                        <div className="inline-block px-3 py-1 bg-[#ffd700]/20 rounded-full text-[#ffd700] text-xs font-medium mb-4">
                          {course.book_description}
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <FileText className="w-4 h-4" />
                            <span>{course.page_count} صفحة</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3 rtl:space-x-reverse">
                        <button
                          onClick={() =>
                            navigate(`/pdfs/${course?.book_id}`, {
                              state: { course },
                            })
                          }
                          className="flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-all duration-300 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="mx-1">معاينة</span>
                        </button>
                      </div>

                      <div className="absolute top-16 left-8 w-2 h-2 bg-[#ffd700]/40 rounded-full animate-ping" />
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
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd700]/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <FileText className="w-16 h-16 text-[#ffd700]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                لا توجد كتب
              </h3>
              <p className="text-white/70">
                لم يتم العثور على أي كتب تطابق البحث
              </p>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        {filteredCourses.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <div className="flex justify-center gap-8">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-[#ffd700]">
                <div className="text-3xl font-bold text-[#ffd700] mb-2">
                  {courses.length}
                </div>
                <div className="text-white/70">إجمالي الكتب</div>
              </div>
              {/* <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-[#ffd700]/30">
                <div className="text-3xl font-bold text-[#ffd700] mb-2">
                  {courses
                    .reduce((sum, course) => sum + course.downloadCount, 0)
                    .toLocaleString()}
                </div>
                <div className="text-white/70">إجمالي التحميلات</div>
              </div> */}
              {/* <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-[#ffd700]/30">
                <div className="text-3xl font-bold text-[#ffd700] mb-2">
                  {categories.length - 1}
                </div>
                <div className="text-white/70">التخصصات</div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePdfs;
