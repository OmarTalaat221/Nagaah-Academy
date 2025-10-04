import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { handleLogOut } from "../../App";
import { base_url } from "../../constants";
import TableofContent from "./components/TableofContent/TableofContent";
import ContentLoader from "react-content-loader";
import { useDispatch } from "react-redux";
import { showToogleTooltib } from "../../store/reducers/tooltibReducer";
import "./style.css";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";

const CourseContent = () => {
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  const [Videos, setVideos] = useState([]);
  const [params] = useSearchParams();
  const location = useLocation();
  const state = location?.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extract clean parameter values
  const getCleanCourseId = useCallback(() => {
    const rawCourseId = params.get("course_id");
    if (!rawCourseId) return null;

    const cleanId = rawCourseId.split("?")[0].split("&")[0];
    console.log("Raw course_id:", rawCourseId, "Clean course_id:", cleanId);
    return cleanId;
  }, [params]);

  const getCleanTeacherId = useCallback(() => {
    let teacherId = params.get("teacher_id");

    if (!teacherId) {
      const rawCourseId = params.get("course_id");
      if (rawCourseId && rawCourseId.includes("teacher_id=")) {
        const match = rawCourseId.match(/teacher_id=(\d+)/);
        teacherId = match ? match[1] : null;
      }
    }

    if (!teacherId) {
      teacherId = state?.course_details?.teacher_id;
    }

    console.log("Teacher ID:", teacherId);
    return teacherId;
  }, [params, state]);

  // Get selected video ID from URL or state
  const getSelectedVideoId = useCallback(() => {
    // Check URL params first
    const videoIdFromParams =
      params.get("video_id") || params.get("selected_video_id");

    // Check state (from navigation)
    const videoIdFromState = state?.selectedVideoId || state?.video_id;

    const selectedVideoId = videoIdFromParams || videoIdFromState;
    console.log("Selected Video ID:", selectedVideoId);
    return selectedVideoId;
  }, [params, state]);

  // State management
  const [tab, setTab] = useState(0);
  const [index, setIndex] = useState(0);
  const [checkOwn, setCheckOwn] = useState("");
  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [videoFound, setVideoFound] = useState(false);

  // Derived state - calculate currentVideo and selectedVideo properly
  const currentVideo = Videos[tab]?.videos?.[index];

  const selectedVideo = currentVideo
    ? {
        objId: Videos[tab]?.id,
        videoId: currentVideo.id,
        saved: currentVideo.saved,
        title: Videos[tab]?.title,
        name: currentVideo.name,
        free: currentVideo.free,
        teacher_name: currentVideo.teacher_name,
      }
    : null;

  // Function to find video by ID in the Videos array
  const findVideoById = useCallback((videoId, videosArray) => {
    if (!videoId || !videosArray?.length) return null;

    for (let unitIndex = 0; unitIndex < videosArray.length; unitIndex++) {
      const unit = videosArray[unitIndex];
      if (unit.videos) {
        for (
          let videoIndex = 0;
          videoIndex < unit.videos.length;
          videoIndex++
        ) {
          const video = unit.videos[videoIndex];
          if (video.id == videoId) {
            console.log("Found video:", { unitIndex, videoIndex, video });
            return { unitIndex, videoIndex, video, unit };
          }
        }
      }
    }

    console.log("Video not found:", videoId);
    return null;
  }, []);

  useEffect(() => {
    if (currentVideo && selectedVideo) {
      console.log("Current Video:", currentVideo);
      console.log("Selected Video:", selectedVideo);
      console.log("Current Tab:", tab, "Current Index:", index);
    }
  }, [currentVideo, selectedVideo, tab, index]);

  // Centralized navigation function with clean URL building
  const updateNavigation = useCallback(
    (newTab, newIndex, replace = true, preserveVideoId = false) => {
      console.log("Updating navigation:", {
        newTab,
        newIndex,
        currentVideosLength: Videos.length,
      });

      // Validate inputs
      const validTab = Math.max(0, Math.min(newTab, Videos.length - 1));
      const validIndex = Math.max(
        0,
        Math.min(newIndex, (Videos[validTab]?.videos?.length || 1) - 1)
      );

      console.log("Valid navigation:", { validTab, validIndex });

      // Update state immediately
      setTab(validTab);
      setIndex(validIndex);

      // Build clean URL parameters
      const newParams = new URLSearchParams();
      const cleanCourseId = getCleanCourseId();
      const teacherId = getCleanTeacherId();

      // Set clean parameters
      if (cleanCourseId) {
        newParams.set("course_id", cleanCourseId);
      }
      if (teacherId) {
        newParams.set("teacher_id", teacherId);
      }
      newParams.set("tab", validTab.toString());
      newParams.set("index", validIndex.toString());

      // Preserve video_id if requested (useful for initial navigation)
      if (preserveVideoId) {
        const selectedVideoId = getSelectedVideoId();
        if (selectedVideoId) {
          newParams.set("video_id", selectedVideoId);
        }
      }

      console.log("New URL params:", newParams.toString());
      navigate(`?${newParams.toString()}`, { replace });
    },
    [Videos, getCleanCourseId, getCleanTeacherId, navigate, getSelectedVideoId]
  );

  // Initialize from URL parameters or find specific video
  useEffect(() => {
    if (Videos.length > 0 && !isInitialized) {
      const selectedVideoId = getSelectedVideoId();

      if (selectedVideoId) {
        // Try to find the specific video
        const foundVideo = findVideoById(selectedVideoId, Videos);

        if (foundVideo) {
          console.log("Initializing with found video:", foundVideo);
          updateNavigation(
            foundVideo.unitIndex,
            foundVideo.videoIndex,
            true,
            true
          );
          setVideoFound(true);
        } else {
          console.log("Video not found, using URL params or defaults");
          const urlTab = parseInt(params.get("tab")) || 0;
          const urlIndex = parseInt(params.get("index")) || 0;
          updateNavigation(urlTab, urlIndex, true);
        }
      } else {
        // No specific video requested, use URL params or defaults
        const urlTab = parseInt(params.get("tab")) || 0;
        const urlIndex = parseInt(params.get("index")) || 0;
        console.log("Initializing from URL:", { urlTab, urlIndex });
        updateNavigation(urlTab, urlIndex, true);
      }

      setIsInitialized(true);
    }
  }, [
    Videos,
    params,
    updateNavigation,
    isInitialized,
    getSelectedVideoId,
    findVideoById,
  ]);

  // Handle URL parameter changes (only if no specific video was found initially)
  useEffect(() => {
    if (isInitialized && Videos.length > 0 && !videoFound) {
      const urlTab = parseInt(params.get("tab")) || 0;
      const urlIndex = parseInt(params.get("index")) || 0;

      if (urlTab !== tab || urlIndex !== index) {
        console.log("URL changed, updating state:", {
          urlTab,
          urlIndex,
          currentTab: tab,
          currentIndex: index,
        });
        setTab(urlTab);
        setIndex(urlIndex);
      }
    }
  }, [params, tab, index, isInitialized, Videos.length, videoFound]);

  const getUnitData = (load = true) => {
    if (load) {
      setLoading(true);
    }

    const cleanCourseId = getCleanCourseId();
    const teacherId = getCleanTeacherId();

    const data_send = {
      student_id: userData?.student_id,
      token_value: userData?.token_value,
      course_id: cleanCourseId,
      admin_id: teacherId,
    };

    console.log("API request data:", data_send);

    axios
      .post(base_url + "/user/courses/select_course_lesson.php", data_send)
      .then(async (res) => {
        if (res.data.status == "success") {
          const videosData = res.data.message.map((unit) => ({
            id: unit.unit_id,
            title: unit.unit_name,
            videos: unit.videos.map((video) => ({
              teacher_name: video.teacher_name,
              id: video.source_video_id,
              name: video.video_title,
              link_video: video.youtube_id,
              loom_url: video?.loom_url,
              saved: video?.saved || false,
              free: video?.free || "0", // Add this line to include the free property
            })),
          }));

          console.log("Videos data loaded:", videosData);
          setCheckOwn(
            res?.data?.message[0]?.videos[0]?.own ||
              res?.data?.message[0]?.free == "1"
          );
          setVideos(videosData);

          let allcourses = [...res.data.message];
          let pushedData = allcourses.map((course) => ({
            ...course,
            show: false,
          }));
          setCourseDetails(pushedData);
        } else if (res.data.status === "out") {
          localStorage.clear();
          window.location.reload();
        } else {
          dispatch(showToogleTooltib());
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getUnitData();
  }, []);

  // Video selection handler - improved with better logging
  const handleSelectVideo = useCallback(
    (objId, videoId, saved, title, LessonName, teacher_name) => {
      console.log("Selecting video:", {
        objId,
        videoId,
        saved,
        title,
        LessonName,
        teacher_name,
      });
      console.log("Current Videos state:", Videos);

      const unitIndex = Videos.findIndex((unit) => unit.id == objId);
      console.log("Found unit index:", unitIndex, "for objId:", objId);

      if (unitIndex !== -1) {
        const videoIndex = Videos[unitIndex]?.videos.findIndex(
          (video) => video.id == videoId
        );
        console.log("Found video index:", videoIndex, "for videoId:", videoId);

        if (videoIndex !== -1) {
          console.log("Navigating to:", { unitIndex, videoIndex });
          updateNavigation(unitIndex, videoIndex, false);
        } else {
          console.error("Video not found in unit:", videoId);
        }
      } else {
        console.error("Unit not found:", objId);
      }
    },
    [Videos, updateNavigation]
  );

  // Navigation handlers
  const handleNextVideo = useCallback(() => {
    console.log("Next video clicked, current:", { tab, index });
    if (index < Videos[tab]?.videos?.length - 1) {
      updateNavigation(tab, index + 1, false);
    } else if (tab < Videos.length - 1) {
      updateNavigation(tab + 1, 0, false);
    }
  }, [tab, index, Videos, updateNavigation]);

  const handlePrevVideo = useCallback(() => {
    console.log("Previous video clicked, current:", { tab, index });
    if (index > 0) {
      updateNavigation(tab, index - 1, false);
    } else if (tab > 0) {
      const prevTabLastIndex = Videos[tab - 1]?.videos?.length - 1 || 0;
      updateNavigation(tab - 1, prevTabLastIndex, false);
    }
  }, [tab, index, Videos, updateNavigation]);

  // Updated Videos handler to maintain current selection
  const handleSetVideos = useCallback(
    (newVideos) => {
      console.log("Updating videos, maintaining current selection:", {
        tab,
        index,
      });

      if (typeof newVideos === "function") {
        setVideos((prevVideos) => {
          const updatedVideos = newVideos(prevVideos);
          console.log("Videos updated via function:", updatedVideos);
          return updatedVideos;
        });
      } else {
        setVideos(newVideos);
        console.log("Videos updated directly:", newVideos);
      }
    },
    [tab, index]
  );

  return (
    <>
      <div className="courseContent" style={{ marginBottom: "30px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        ) : (
          <main>
            <div className="flexRow my-4 sm:px-6 !justify-between">
              <span style={{ display: "flex", gap: "15px" }}>
                <button
                  style={{ color: "black" }}
                  className="btn questnBank_btn flex items-center justify-center "
                  onClick={() =>
                    navigate(
                      `/pdfs-units/${getCleanCourseId()}?teacher_id=${getCleanTeacherId()}`
                    )
                  }
                >
                  مذكرة الماده
                </button>

                {/* <button
                  className="btn questnBank_btn flex items-center justify-center "
                  onClick={() =>
                    navigate(
                      `/questionsunits/${getCleanCourseId()}?teacher_id=${getCleanTeacherId()}`
                    )
                  }
                >
                  بنك الاسئلة
                </button> */}
              </span>

              <div className="home-text-box" style={{ direction: "rtl" }}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowTable(!showTable)}
                  className="questnBank_btn flex items-center justify-center "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </div>
                <p>{currentVideo?.name}</p>
              </div>
            </div>

            <div className="videos">
              <TableofContent
                getUnitData={getUnitData}
                handlePrevVideo={handlePrevVideo}
                handleNextVideo={handleNextVideo}
                setTab={setTab}
                tab={tab}
                showContent={showTable}
                setShowTable={setShowTable}
                videoObj={currentVideo}
                Videos={Videos}
                index={index}
                setIndex={setIndex}
                setVideos={handleSetVideos}
                selectedVideo={selectedVideo}
                handleSelectVideo={handleSelectVideo}
              />
            </div>
          </main>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CourseContent;
