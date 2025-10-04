import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import "./profile.css";
import Modal from "../../components/modal/index";
import ProfileCourses from "./ProfileCourses/ProfileCourses";
import { useNavigate } from "react-router";
import Footer from "../../components/Footer/Footer";
import { Axios } from "../../components/axios";
import { toast } from "react-toastify";
import { getStdCourses } from "./functions/getStudentCourses";
import axios from "axios";
import { base_url } from "../../constants";
import { MdPlayLesson } from "react-icons/md";
import { Link } from "react-router-dom";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import { getCourses } from "../AllCourses/functions/getAll";
import ProfileSidebar from "./ProfileSidebar/ProfileSidebar";
import ProfileSavedVideos from "./ProfileSavedVideos/ProfileSavedVideos";
import fcmService from "../../fcm-service"; // Make sure to import your FCM service
import { FaSpinner } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [courses, setCourses] = useState([]);
  const [logoutLoading, setLogOutLoading] = useState(false);
  const [compCourses, setCmpCourses] = useState([]);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData = JSON.parse(localStorage.getItem("NagahUser"));
  function getCourses() {
    navigate("/studentCourses", {
      state: {
        courses,
      },
    });
  }

  const handleLogOut = async () => {
    setLogOutLoading(true);

    try {
      // Get FCM token before clearing localStorage
      const fcmToken = localStorage.getItem("fcmToken");

      // Clean up FCM token first
      if (fcmToken) {
        try {
          console.log("Removing FCM token...");
          await fcmService.removeFCMTokenFromServer(fcmToken);
          console.log("FCM token removed successfully");
        } catch (fcmError) {
          console.error("Error removing FCM token:", fcmError);
          // Don't fail logout if FCM cleanup fails
        }
      }

      // Prepare logout data (include FCM token for backend cleanup)
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
        fcm_token: fcmToken || null, // Add FCM token to logout data
      };

      // Call logout API
      const res = await axios.post(
        base_url + "/user/auth/logout.php",
        JSON.stringify(data_send)
      );

      if (res.data.status == "success") {
        // Clear all local storage including FCM token
        localStorage.removeItem("elmataryapp");
        localStorage.removeItem("NagahUser");
        localStorage.removeItem("fcmToken");

        toast.success(res.data.message);
        window.location.href = "/";
      } else if (res.data.status == "error") {
        toast.error(res.data.message);
      } else if (res.data.status == "out") {
        // Clear everything including FCM token
        localStorage.clear();
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Even if logout fails, clear local data for security
      localStorage.removeItem("elmataryapp");
      localStorage.removeItem("NagahUser");
      localStorage.removeItem("fcmToken");

      toast.error("حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setLogOutLoading(false);
    }
  };

  useEffect(() => {
    getStdCourses(
      userData,
      setPageLoading,
      setCourses,
      setOriginalCourses,
      setCmpCourses
    );
  }, []);
  console.log(courses, originalCourses, compCourses);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo userData={userData} />;
      case "saved":
        return <ProfileSavedVideos />;
      default:
        return <ProfileInfo userData={userData} />;
    }
  };

  return logoutLoading ? (
    <div
      className="flex justify-center items-center"
      style={{ height: "100vh" }}
    >
      <div className="flex items-center justify-center animate-spin">
        <FaSpinner />
      </div>
    </div>
  ) : (
    <>
      <div className="profile_page">
        <div
          className="profile-welcome"
          style={{
            background: "#3b003b",
            border: "2px solid #fb9700",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "white" }}>اهلا بعودتك</h3>
        </div>

        <div className="profile-content">
          <ProfileSidebar
            handleLogOut={handleLogOut}
            setActiveTab={setActiveTab}
          />
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
