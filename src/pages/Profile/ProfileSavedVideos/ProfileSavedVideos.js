import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdPlayLesson, MdDelete } from "react-icons/md";
import { BiSolidBookmark } from "react-icons/bi";
import axios from "axios";
import { base_url } from "../../../constants";
import { toast } from "react-toastify";

const ProfileSavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get user_id from your auth context, localStorage, or props
  const NagahUser = JSON.parse(localStorage.getItem("NagahUser"));

  useEffect(() => {
    loadSavedVideos();
  }, []);

  const loadSavedVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${base_url}/user/lessons/saved_video.php?user_id=${NagahUser?.student_id}`
      );

      if (response.data.status) {
        const videos = response.data.message || [];
        setSavedVideos(videos);
      } else {
        throw new Error(response.data.message || "Failed to load saved videos");
      }
    } catch (error) {
      console.error("Error loading saved videos:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ في تحميل الفيديوهات"
      );
      setSavedVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    const url = `/CourseContent?course_id=${video.course_id}&teacher_id=${video.teacher_id}&unit_id=${video.unit_id}&video_id=${video.video_id}`;
    navigate(url);
  };

  const handleRemoveVideo = async (video) => {
    try {
      const response = await axios.delete(
        `${base_url}/user/lessons/saved_video.php`,
        {
          data: {
            video_id: video.video_id,
            user_id: NagahUser.student_id,
          },
        }
      );

      if (response.data.status) {
        toast.success("تم حذف الفيديو بنجاح");
        loadSavedVideos();
      } else {
        throw new Error(response.data.message || "فشل في حذف الفيديو");
      }
    } catch (error) {
      console.error("Error removing video:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "حدث خطأ في حذف الفيديو"
      );
    } finally {
      loadSavedVideos();
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "غير محدد";
    }
  };

  const getVideoThumbnail = (videoUrl) => {
    // Extract Vimeo ID and generate thumbnail
    if (videoUrl && videoUrl.includes("vimeo.com")) {
      const vimeoId = videoUrl.split("/").pop();
      return `https://vumbnail.com/${vimeoId}.jpg`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600 mb-4"></div>
          <p className="text-gray-600">جاري تحميل الفيديوهات المحفوظة...</p>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="bg-gray-50 p-6">
  //       <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
  //         <h3 className="text-xl font-semibold text-gray-800 mb-2">
  //           حدث خطأ في تحميل الفيديوهات
  //         </h3>
  //         <p className="text-gray-600 mb-4">{error}</p>
  //         <button
  //           onClick={loadSavedVideos}
  //           className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
  //         >
  //           إعادة المحاولة
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BiSolidBookmark className="text-3xl text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-800">المحفوظات</h2>
          </div>
          <p className="text-gray-600">{savedVideos.length} فيديو محفوظ</p>
        </div>

        {/* Videos Grid */}
        {savedVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[150px] text-center">
            <BiSolidBookmark className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد فيديوهات محفوظة
            </h3>
            <p className="text-gray-500">
              احفظ الفيديوهات المفضلة لديك لتجدها هنا
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedVideos.map((video) => (
              <div
                onClick={() => handleVideoClick(video)}
                key={video.save_id}
                className="bg-white cursor-pointer rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-200 group">
                  {getVideoThumbnail(video.video_url) ? (
                    <img
                      src={getVideoThumbnail(video.video_url)}
                      alt={video.new_title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex gap-2 items-center justify-center opacity-0 group-hover:!opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoClick(video);
                      }}
                      className="p-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors mr-2"
                      title="مشاهدة الفيديو"
                    >
                      <MdPlayLesson className="text-xl" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveVideo(video);
                      }}
                      className={`p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors`}
                      title="إزالة من المحفوظات"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-3">
                  <h3
                    onClick={() => handleVideoClick(video)}
                    className="font-semibold text-gray-800 text-lg mb-3 cursor-pointer hover:text-yellow-600 transition-colors line-clamp-2"
                  >
                    {video.new_title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>الوحدة: {video.unit_name}</span>
                      <span>الدورة: {video.course_name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* <span className="text-xs">
                        فيديو رقم: {video.video_name}
                      </span> */}
                      {/* {video.join_day && (
                        <span className="text-xs">
                          انضم في: {formatDate(video.join_day)}
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSavedVideos;
