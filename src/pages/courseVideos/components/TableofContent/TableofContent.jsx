import {
  Bookmark,
  BookmarkPlus,
  Lock,
  LockKeyhole,
  Unlock,
} from "lucide-react";
import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
} from "react";
import "./TableofContent.module.css";
import axios from "axios";
import { base_url } from "../../../../constants";
import { toast } from "react-toastify";
import VimeoPlayer from "../VimeoPlayer/VimeoPlayer";

const AccordionCustomIcon = memo(
  ({ handleSelectVideo, Videos, selectedVideo }) => {
    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
      if (Videos.length > 0) {
        setOpenSections({ 0: true });
      }
    }, [Videos]);

    const toggleSection = (index) => {
      setOpenSections((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };

    return (
      <div className="space-y-2">
        {Videos.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="border border-[#ffd700] border-opacity-20 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full px-4 py-3 bg-[#3b003b] bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 flex items-center justify-between text-right"
            >
              <svg
                className={`w-5 h-5 text-[#ffd700] transition-transform duration-300 ${
                  openSections[sectionIndex] ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span className="text-[#ffd700] font-semibold">
                {section.title || `الوحدة ${sectionIndex + 1}`}
              </span>
            </button>

            {openSections[sectionIndex] && (
              <div className="bg-[#3b003b] bg-opacity-20">
                {section.videos &&
                  section.videos.map((lesson, lessonIndex) => (
                    <button
                      key={lessonIndex}
                      onClick={() => {
                        console.log("Video clicked:", {
                          sectionId: section.id,
                          videoId: lesson.id,
                          saved: lesson.saved,
                          sectionTitle: section.title,
                          videoName: lesson.name,
                          free: lesson.free,
                        });
                        handleSelectVideo(
                          section.id,
                          lesson.id,
                          lesson.saved,
                          section.title,
                          lesson.name,
                          lesson.teacher_name
                        );
                      }}
                      className={`w-full px-6 py-3 text-right hover:bg-[#ffd700] hover:bg-opacity-10 transition-all duration-200 border-r-4 group ${
                        selectedVideo?.videoId == lesson.id
                          ? "border-[#ffd700] bg-[#ffd700] bg-opacity-10 text-[#ffd700]"
                          : "border-transparent text-white text-opacity-80 hover:text-white hover:border-[#ffd700] hover:border-opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full transition-colors ${
                              selectedVideo?.videoId == lesson.id
                                ? "bg-[#ffd700]"
                                : "bg-white bg-opacity-30 group-hover:bg-[#ffd700]"
                            }`}
                          />
                          <div
                            style={{ direction: "rtl" }}
                            className="flex items-center gap-1"
                          >
                            {lesson.teacher_name && (
                              <span>{lesson.teacher_name}</span>
                            )}
                            {lesson.free == 1 ? (
                              <Unlock className="w-3 h-3 text-[#ffd700]" />
                            ) : (
                              <LockKeyhole className="w-3 h-3 text-[#ffd700]" />
                            )}
                          </div>
                        </div>
                        <span className="font-medium">{lesson.name}</span>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);

export default function TableofContent({
  handleSelectVideo,
  getUnitData,
  videoObj,
  handlePrevVideo,
  handleNextVideo,
  showContent = true,
  Videos = [],
  setVideos,
  selectedVideo,
}) {
  const [isRated, setIsRated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [rateSuccess, setRateSuccess] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showRatingPopup &&
        rateRef.current &&
        !rateRef.current.contains(event.target) &&
        !event.target.closest(".rate_links")
      ) {
        setShowRatingPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRatingPopup]);

  const rateRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("NagahUser"));

  const courseName = videoObj?.name || "دورة اللغة العربية المتقدمة";
  const videoTitle = videoObj?.name || "الوحدة الأولى";

  // Memoize the video ID to prevent unnecessary re-renders
  const videoId = useMemo(() => {
    return (
      videoObj?.youtube_id ||
      videoObj?.link_video?.split("vimeo.com/")[1] ||
      "76979871"
    );
  }, [videoObj?.youtube_id, videoObj?.link_video]);

  const handleSaveVideo = useCallback(
    async (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();

      if (!selectedVideo?.videoId || !user?.student_id) {
        toast.error("معلومات غير مكتملة");
        return;
      }

      if (isSaving) return;

      setIsSaving(true);

      try {
        const requestData = {
          video_id: selectedVideo.videoId,
          user_id: user.student_id,
        };

        const isCurrentlySaved = selectedVideo.saved;

        const res = await axios({
          method: isCurrentlySaved ? "DELETE" : "POST",
          url: `${base_url}/user/lessons/saved_video.php`,
          data: requestData,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res?.data?.status === true) {
          const newSavedStatus = !isCurrentlySaved;

          // Update Videos array locally without API call
          if (setVideos) {
            setVideos((prevVideos) =>
              prevVideos.map((section) => ({
                ...section,
                videos: section.videos.map((video) =>
                  video.id === selectedVideo.videoId
                    ? { ...video, saved: newSavedStatus }
                    : video
                ),
              }))
            );
          }

          toast.success(
            res.data.message ||
              (isCurrentlySaved
                ? "تم إلغاء الحفظ بنجاح"
                : "تم حفظ الفيديو بنجاح")
          );

          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        } else {
          toast.error(res?.data?.message || "حدث خطأ في العملية");
        }
      } catch (error) {
        console.error("Error saving/unsaving video:", error);

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message;

          if (status === 401) {
            toast.error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
          } else if (status === 403) {
            toast.error("ليس لديك صلاحية لحفظ هذا الفيديو");
          } else if (status === 404) {
            toast.error("الفيديو غير موجود");
          } else {
            toast.error(message || `خطأ من الخادم: ${status}`);
          }
        } else if (error.request) {
          toast.error("خطأ في الاتصال بالشبكة، تحقق من الاتصال");
        } else {
          toast.error("حدث خطأ غير متوقع");
        }
      } finally {
        setIsSaving(false);
      }
    },
    [selectedVideo, user, setVideos, isSaving]
  );

  const handleRateVideo = useCallback(() => {
    if (!selectedVideo?.videoId || !user?.student_id) {
      toast.error("معلومات غير مكتملة");
      return;
    }
    setShowRatingPopup(true);
  }, [selectedVideo, user]);

  const handleStarClick = useCallback(
    async (rating) => {
      if (isRating) return;

      setIsRating(true);
      setSelectedRating(rating);

      try {
        const requestData = {
          video_id: selectedVideo.videoId,
          user_id: user.student_id,
          rate: rating,
        };

        const res = await axios({
          method: "POST",
          url: `${base_url}/user/lessons/rate_video.php`,
          data: requestData,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res?.data?.status === true) {
          toast.success(res.data.message || "تم تقييم الفيديو بنجاح");
          setIsRated(true);
          setRateSuccess(true);
          setShowRatingPopup(false);
          setTimeout(() => setRateSuccess(false), 2000);
        } else {
          toast.error(res?.data?.message || "حدث خطأ في التقييم");
        }
      } catch (error) {
        console.error("Error rating video:", error);
        if (error.response) {
          toast.error(
            error.response.data?.message ||
              `خطأ من الخادم: ${error.response.status}`
          );
        } else if (error.request) {
          toast.error("خطأ في الاتصال بالشبكة");
        } else {
          toast.error("حدث خطأ غير متوقع");
        }
      } finally {
        setIsRating(false);
      }
    },
    [selectedVideo, user, isRating]
  );

  // Memoize the VimeoPlayer to prevent unnecessary re-renders
  const memoizedVimeoPlayer = useMemo(
    () => (
      <VimeoPlayer
        key={videoId} // Add key to force re-render when video changes
        videoId={videoId}
        startTime={0}
        onReady={(player) => console.log("Vimeo player ready", player)}
        onPlay={() => console.log("Video started playing")}
        onPause={() => console.log("Video paused")}
        onEnded={() => console.log("Video ended")}
      />
    ),
    [videoId]
  );

  // Memoize navigation buttons to prevent unnecessary re-renders
  const navigationControls = useMemo(
    () => (
      <div className="mt-6 p-4 bg-[#3b003b] sm:block hidden bg-opacity-30 rounded-xl border border-[#ffd700] border-opacity-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevVideo}
            className="p-2 rotate-180 rounded-full bg-[#ffd700] bg-opacity-20 text-[#ffd700] hover:bg-[#ffd700] hover:text-[#3b003b] transition-all duration-300 transform hover:scale-110"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="flex-1 mx-6">
            <div className="flex items-center justify-center mb-2">
              <h3 className="text-white font-semibold text-right">
                {courseName}
              </h3>
            </div>
          </div>

          <button
            onClick={handleNextVideo}
            className="p-2 rotate-180 rounded-full bg-[#ffd700] bg-opacity-20 text-[#ffd700] hover:bg-[#ffd700] hover:text-[#3b003b] transition-all duration-300 transform hover:scale-110"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    [handlePrevVideo, handleNextVideo, courseName]
  );

  return (
    <div className="min-h-screen w-full p-0 sm:p-6">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#3b003b] bg-opacity-80 backdrop-blur-sm rounded-2xl sm:p-6 sm:border-2 sm:border-[#ffd700] sm:border-opacity-30 shadow-md sm:shadow-2xl sm:hover:border-opacity-50 transition-all duration-500">
              <div className="relative w-full mb-6">{memoizedVimeoPlayer}</div>

              <div className="flex flex-col sm:flex-row items-center justify-start sm:justify-between gap-2 mt-6 py-4 bg-[#3b003b] bg-opacity-50 rounded-xl">
                {user && (
                  <div className="flex gap-3 sm:order-2 order-1 relative">
                    <button
                      onClick={handleSaveVideo}
                      disabled={isSaving}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedVideo?.saved
                          ? "bg-[#ffd700] text-[#3b003b] shadow-lg"
                          : "bg-[#3b003b] text-[#ffd700] border-2 border-[#ffd700] hover:bg-[#ffd700] hover:text-[#3b003b]"
                      } ${isSaving ? "opacity-70 cursor-not-allowed" : ""} ${
                        saveSuccess ? "animate-pulse" : ""
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>جاري العملية...</span>
                        </>
                      ) : (
                        <>
                          {selectedVideo?.saved ? (
                            <Bookmark className="w-4 h-4 group-hover:text-[#3b003b] text-[#3b003b]" />
                          ) : (
                            <BookmarkPlus className="w-4 h-4 group-hover:text-[#3b003b] text-[#ffd700]" />
                          )}
                          <span>
                            {selectedVideo?.saved ? "تم الحفظ" : "حفظ"}
                          </span>
                        </>
                      )}
                    </button>

                    <div className="relative">
                      <button
                        onClick={handleRateVideo}
                        disabled={isRating}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                          isRated
                            ? "bg-[#ffd700] text-[#3b003b] shadow-lg"
                            : "bg-[#3b003b] text-[#ffd700] border-2 border-[#ffd700] hover:bg-[#ffd700] hover:text-[#3b003b]"
                        } ${isRating ? "opacity-70 cursor-not-allowed" : ""} ${
                          rateSuccess ? "animate-pulse" : ""
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isRated ? "fill-current" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {isRating
                          ? "جاري التقييم..."
                          : isRated
                          ? "تم التقييم"
                          : "تقييم"}
                      </button>

                      {showRatingPopup && (
                        <div
                          ref={rateRef}
                          className="absolute bottom-12 left-0 bg-[#3b003b] border-2 border-[#ffd700] rounded-lg p-4 shadow-lg z-50"
                        >
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleStarClick(star)}
                                className={`text-2xl transition-colors rate_links ${
                                  star <= selectedRating
                                    ? "text-[#ffd700]"
                                    : "text-white text-opacity-50 hover:text-[#ffd700]"
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setShowRatingPopup(false)}
                            className="mt-2 text-[#ffd700] text-sm hover:text-opacity-80"
                          >
                            إغلاق
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <h2 className="text-xl font-bold text-[#ffd700] text-right sm:order-1 order-2 ">
                  {videoTitle}
                </h2>
              </div>

              {navigationControls}
            </div>
          </div>

          <div className="lg:col-span-1">
            {showContent && (
              <div className="bg-[#3b003b] bg-opacity-80 backdrop-blur-sm rounded-2xl border-2 border-[#ffd700] border-opacity-30 shadow-2xl overflow-hidden hover:border-opacity-50 transition-all duration-500">
                <div className="p-6 bg-gradient-to-r from-[#ffd700] to-yellow-300 text-[#3b003b]">
                  <h3 className="text-xl font-bold text-right">محتوى الدورة</h3>
                </div>

                <div className="p-4">
                  <AccordionCustomIcon
                    handleSelectVideo={handleSelectVideo}
                    Videos={Videos}
                    selectedVideo={selectedVideo}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
