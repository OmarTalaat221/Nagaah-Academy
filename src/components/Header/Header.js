import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import CryptoJS from "crypto-js";
import axios from "axios";
import { base_url } from "../../constants";
import { toast } from "react-toastify";

import CourseIntroVideo from "../../pages/CourseDetails/CourseInfo/CourseIntroVideo/CourseIntroVideo";
import logo from "../../assets/logo/log.png";
import { MdPerson } from "react-icons/md";
import fcmService from "../../fcm-service";
import DiamondCounter from "./DiamondCounter";
import { FaSpinner, FaUser } from "react-icons/fa";
import help from "../../assets/help.png";
import signout from "../../assets/signout.png";
import user from "../../assets/user.png";

const Header = () => {
  const [showPerLinks, setShowPerLinks] = useState(false);
  const navigate = useNavigate();
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [logoutLoading, setLogOutLoading] = useState(false);
  const profileRef = useRef(null);

  // Check if diamond modals are showing
  const [areModalsOpen, setAreModalsOpen] = useState(false);

  useEffect(() => {
    // Listen for modal state changes
    const checkModals = () => {
      const diamondModal = document.querySelector(".simple-modal-overlay");
      setAreModalsOpen(!!diamondModal);
    };

    // Check initially
    checkModals();

    // Set up observer for modal changes
    const observer = new MutationObserver(checkModals);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showPerLinks && // only when open
        profileRef.current && // and ref exists
        !profileRef.current.contains(event.target) && // and click is outside
        !event.target.closest(".logo_links") // and not inside .logo_links
      ) {
        setShowPerLinks(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPerLinks]);

  const handleLogOut = async () => {
    setLogOutLoading(true);

    try {
      // Clean up FCM token first
      const fcmToken = localStorage.getItem("fcmToken");
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

      // Prepare logout data
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
        fcm_token: fcmToken || null, // Include FCM token in logout request
      };

      // Call logout API
      const res = await axios.post(
        base_url + "/user/auth/logout.php",
        JSON.stringify(data_send)
      );

      console.log(res.data);

      if (res.data.status === "success") {
        // Clear all local storage
        localStorage.removeItem("NagahUser");
        localStorage.removeItem("elmataryapp");
        localStorage.removeItem("fcmToken");

        // Optional: Clear any notification state if you have global state management
        // clearNotificationState(); // If using Redux/Context

        // Redirect to home
        window.location.href = "/";
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Even if logout API fails, still clear local data for security
      localStorage.removeItem("NagahUser");
      localStorage.removeItem("elmataryapp");
      localStorage.removeItem("fcmToken");

      toast.error("حدث خطأ أثناء تسجيل الخروج");

      // Still redirect to home for security
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } finally {
      setLogOutLoading(false);
    }
  };

  const AskedForAnOffer = JSON.parse(localStorage.getItem("NeedOffer"));

  // Get NagahUser data for diamond counter
  const nagahLocalData = localStorage.getItem("NagahUser");
  let nagahUserData = null;
  if (nagahLocalData) {
    try {
      nagahUserData = JSON.parse(nagahLocalData);
    } catch (error) {
      console.error("Error parsing NagahUser data:", error);
    }
  }

  const currentUser = userData || nagahUserData;

  return (
    <div className="header " style={{ zIndex: show ? 1000 : 1000 }}>
      <div className="container2">
        <div className="right">
          <div onClick={() => navigate("/")} className="logo">
            <img src={logo} alt="الشعار" />
          </div>
          <div className={show ? "links open" : "links"}>
            <span
              className="cart_logo"
              style={{ cursor: "pointer", color: "white", fontSize: "22px" }}
              onClick={() => setShow(false)}
            >
              &times;
            </span>
            <NavLink to={"/"}>الرئيسية</NavLink>
            {currentUser && Object.keys(currentUser).length > 0 ? (
              <>
                <NavLink to={"/mycourses"}>المناهج</NavLink>
                <NavLink to={"/MyReservedLessons"}>حصصي</NavLink>
                <NavLink to={"/freecourses"}>المناهج المجانية</NavLink>
                <NavLink to={"/About-us"}>عن نجاح</NavLink>
                <NavLink to={"/projects"}>المشاريع</NavLink>
                {AskedForAnOffer ? (
                  <NavLink to={"/offer-form/offers"}>طلب حصه</NavLink>
                ) : (
                  <NavLink to={"/offer-form"}>طلب حصه</NavLink>
                )}
                <NavLink to={"/myWallet"}>محفظتي</NavLink>
              </>
            ) : (
              <>
                <NavLink to={"/freecourses"}>المناهج المجانية</NavLink>
                <NavLink to={"/About-us"}>عن نجاح</NavLink>
                <NavLink to={"/courses"}>المناهج</NavLink>
                <NavLink to={"/offer-form"}>طلب حصه</NavLink>
                <NavLink to={"/login"}>تسجيل الدخول</NavLink>
              </>
            )}
          </div>
        </div>

        <div className="left">
          {/* Diamond Counter - Always show when user is logged in, but pass modal state */}
          {nagahUserData && Object.keys(nagahUserData).length > 0 && (
            <DiamondCounter areModalsOpen={areModalsOpen} />
          )}

          <div className="person_logo">
            <div
              className="cart_logo person_button "
              style={{ margin: "0px 10px" }}
            >
              <img
                onClick={() => {
                  setShow(!show);
                }}
                src={
                  "https://cdn.icon-icons.com/icons2/916/PNG/512/Menu_icon_icon-icons.com_71858.png"
                }
                alt="القائمة"
              />
            </div>
            <button
              className="person_button"
              ref={profileRef}
              onClick={() => {
                setShowPerLinks(!showPerLinks);
              }}
            >
              <FaUser />
            </button>

            {showPerLinks ? (
              <div className="logo_links">
                {currentUser && (
                  <div style={{ color: "black" }}>
                    <i className="fa-solid fs-4 m-2 fa-user"></i>
                    <div className="details">
                      <h5>{currentUser.student_name}</h5>
                      <p>{currentUser.student_email}</p>
                    </div>
                  </div>
                )}
                <div className="links" style={{ flexDirection: "column" }}>
                  {currentUser && Object.keys(currentUser).length > 0 ? (
                    <div
                      onClick={() => {
                        navigate("/profile");
                      }}
                    >
                      <img src={user} alt="" />
                      <span>حسابي</span>
                    </div>
                  ) : null}
                  <div
                    onClick={() => {
                      navigate("/techsup");
                    }}
                  >
                    <img src={help} alt="" />
                    <span>الدعم الفني</span>
                  </div>
                  {currentUser && Object.keys(currentUser).length > 0 ? (
                    <div
                      onClick={() => {
                        return logoutLoading ? null : handleLogOut();
                      }}
                    >
                      {logoutLoading ? (
                        <div className="flex items-center justify-center animate-spin">
                          <FaSpinner />
                        </div>
                      ) : (
                        <>
                          <img src={signout} alt="" />
                          <span>تسجيل الخروج</span>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
