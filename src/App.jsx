import "./App.css";
import { Route, Routes, useLocation } from "react-router";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import CryptoJS from "crypto-js";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import Footer from "./components/Footer/Footer";

import Profile from "./pages/Profile/Profile";
import CourseContent from "./pages/courseVideos";
import ProfileUnits from "./pages/Profile/ProfileUnits/ProfileUnits";
import ProfileVideo from "./pages/Profile/ProfileUnits/ProfileVideo/ProfileVideo";
import AllCourses from "./pages/AllCourses/AllCourses";
import Contact from "./pages/Contact/Contact";
import TechSup from "./components/TechSup/TechSup";
import { useEffect, useState } from "react";
// import ExpandList from './components/ExpandList/ExpandList';
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { base_url } from "./constants";
import "./newStyle.css";
import CourseVideo from "./pages/Home/Courses/CourseVideo/CourseVideo";
import Exams from "./pages/Exams/Exams";
import ExamContent from "./pages/ExamContent/ExamContent";
import ExamQuestions from "./pages/ExamQuestions/ExamQuestions";
import QuestionBank from "./pages/QuestionBank/QuestionBank";
import AllUnivs from "./pages/AllCourses/AllUnivs";
import AllGrades from "./pages/AllCourses/Allgrades";
import CourseExams from "./pages/mycourses/CoursesExams";
import Unitquestions from "./pages/AllCourses/Unitquestions";
import Examslanding from "./pages/AllCourses/Examslanding";
// import CoursesquestionsLanding from "./pages/AllCourses/CoursesquestionsLanding";
import ResetPassword from "./pages/Login/ResetPasswordForm";
import ConfirmCode from "./pages/Login/ConfirmCodeForm";
import NewPassword from "./pages/Login/NewPasswordForm";
import FreeCourses from "./pages/Home/FreeCourses";
import AboutNagah from "./pages/AboutNagaah/AboutNagah";
import AllClassCourses from "./pages/AllCourses/AllClassCourses";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import MyReservedLessons from "./pages/MyReservedLessons/MyReservedLessons";
import MyOffers from "./pages/OfferALesson/MyOffers";
import OfferForm from "./pages/OfferALesson/OfferForm";
import Transactions from "./pages/Transactions/Transactions";
import BeAteacherForm from "./pages/Home/BeAteacherForm";
import Chat from "./pages/Teacher/Chat";
import AllSubjects from "./pages/AllCourses/AllSubjects";
import RequestsOffers from "./pages/OfferALesson/RequestsOffers";
import CoursePdfsUnits from "./pages/CoursePdfs/CoursePdfsUnits";
import CoursePdfs from "./pages/CoursePdfs/CoursePdfs";
import PdfViewer from "./pages/CoursePdfs/PdfViwer";
import CombinedRegistration from "./pages/Registration/CombinedRegistration";

import Projects from "./pages/Projects/Projects";
import Assignments from "./pages/Assignments/Assignments";

// FCM and Notification imports
import NotificationDisplay from "./components/NotificationDisplay/NotificationDisplay";
import NotificationPopup from "./components/NotificationPopup/NotificationPopup";
import fcmService from "./fcm-service";

// Diamond Reward System imports
import useDiamondReward from "./hooks/useDiamondReward";
import DiamondRewardModal from "./components/DiamondReward/DiamondRewardModal";
import TreasureRewardModal from "./components/DiamondReward/TreasureRewardModal";

// elmataryapp localStorage (encrypted)
const localData = localStorage.getItem("elmataryapp");
const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
const userData =
  decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

// NagahUser localStorage (plain JSON - no encryption)
const nagahLocalData = localStorage.getItem("NagahUser");
let nagahUserData = null;
if (nagahLocalData) {
  try {
    nagahUserData = JSON.parse(nagahLocalData);
  } catch (error) {
    console.error("Error parsing NagahUser data:", error);
    nagahUserData = null;
  }
}

export const handleLogOut = async () => {
  // Get FCM token for cleanup
  const fcmToken = localStorage.getItem("fcmToken");

  // Use userData for logout (keeping existing functionality)
  const data_send = {
    student_id: userData?.student_id,
    token_value: userData?.token_value,
    fcm_token: fcmToken || null, // Add FCM token
  };

  try {
    // Clean up FCM token first
    if (fcmToken) {
      try {
        console.log("Removing FCM token...");
        await fcmService.removeFCMTokenFromServer(fcmToken);
        console.log("FCM token removed successfully");
      } catch (fcmError) {
        console.error("FCM cleanup error:", fcmError);
        // Don't fail logout if FCM cleanup fails
      }
    }

    // Call logout API
    const res = await axios.post(
      base_url + "/user/auth/student_logout.php",
      JSON.stringify(data_send)
    );

    if (res.data.status == "success") {
      // Clear all local storage including FCM token
      localStorage.clear();
      toast.success("تم تسجيل الخروج بنجاح");
      window.location.reload();
    } else if (res.data.status == "error") {
      toast.error(res.data.message);
      // Still clear local storage for security
      localStorage.clear();
      window.location.reload();
    } else if (res.data.status == "out") {
      localStorage.clear();
      window.location.reload();
    }
  } catch (error) {
    console.error("Logout error:", error);

    // Even if logout fails, clear local data for security
    localStorage.clear();
    toast.error("حدث خطأ أثناء تسجيل الخروج");
    window.location.reload();
  }
};

function App() {
  const { pathname } = useLocation();

  // Diamond Reward System Hook (uses NagahUser with plain JSON)
  const {
    showDiamondModal,
    showTreasureModal,
    newDiamondsEarned,
    setShowDiamondModal,
    setShowTreasureModal,
    currentDiamonds,
  } = useDiamondReward();

  const [allLoading, setAllLoading] = useState(true);
  const [ShowMapFlotingMap, setShowMapFlotingMap] = useState(null);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Setup FCM if user is logged in (check both userData sources)
    if (
      (userData && Object.keys(userData).length > 0) ||
      (nagahUserData && Object.keys(nagahUserData).length > 0)
    ) {
      console.log("Setting up FCM for logged in user...");
      fcmService.setupForegroundMessageListener();
    }
  }, [pathname, userData, nagahUserData]);

  useEffect(() => {
    const getCourses = () => {
      // Use userData for existing functionality
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
      };
      axios
        .post(
          base_url + "/user/courses/select_course_unit.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.data.status === "success") {
            setShowMapFlotingMap(res.data.message);
          }
        })
        .catch((e) => console.log(e));
    };

    if (userData && Object.keys(userData).length > 0) {
      getCourses();
    }
  }, [userData]);

  useEffect(() => {
    const getImdiatLesson = () => {
      // Use userData for existing functionality
      const data_send = {
        student_id: userData?.student_id,
        token_value: userData?.token_value,
      };
      axios
        .post(
          base_url + "/user/uber_part/select_lesson_to_show_map.php",
          JSON.stringify(data_send)
        )
        .then((res) => {
          if (res.data.status === "success") {
            setShowMapFlotingMap(res.data.message);
          }
        })
        .catch((e) => console.log(e));
    };

    if (userData && Object.keys(userData).length > 0) {
      getImdiatLesson();
    }
  }, [userData]);

  // Determine which user data to use for authentication checks
  const currentUser = userData || nagahUserData;

  return (
    <div className="body">
      <>
        <>
          {location.pathname.includes("exam/take") ? <></> : <Header />}

          {currentUser && Object.keys(currentUser).length > 0 && (
            <>
              <NotificationDisplay />
              <NotificationPopup />

              {/* Diamond Reward System Modals - Only for NagahUser */}
              {nagahUserData && Object.keys(nagahUserData).length > 0 && (
                <>
                  <DiamondRewardModal
                    show={showDiamondModal}
                    onClose={() => setShowDiamondModal(false)}
                    diamondsEarned={newDiamondsEarned}
                  />

                  <TreasureRewardModal
                    show={showTreasureModal}
                    onClose={() => setShowTreasureModal(false)}
                  />
                </>
              )}
            </>
          )}

          {/* {ShowMapFlotingMap ? <FloatingActionButton /> : null} */}

          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* <Route path="/test" element={<Test />} /> */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/confirm-code/:email" element={<ConfirmCode />} />
            <Route path="/new-password/:email" element={<NewPassword />} />
            <Route path="/be-a-teacher" element={<BeAteacherForm />} />

            <Route
              path="/pdfs-units/:course_id"
              element={<CoursePdfsUnits />}
            />
            <Route
              path="/pdfs-units/:course_id/unit/:unit_id/pdfs"
              element={<CoursePdfs />}
            />

            <Route path="/pdfs/:book_id" element={<PdfViewer />} />

            <Route
              path="/offer-lesson/teacher/:teacher_id"
              element={<TeacherProfile />}
            />

            <Route path="/questionsunits/:id" element={<Unitquestions />} />
            <Route path="/questionBank/:id" element={<QuestionBank />} />

            <Route path="/offer-form" element={<OfferForm />} />

            {currentUser && Object.keys(currentUser).length > 0 ? (
              <>
                {/* <Route
                  path="/examQuestion/:id"
                  element={<ExamQuestions useeData={currentUser} />}
                /> */}

                <Route path="/profile" element={<Profile />} />
                {/* <Route path="/profileunits" element={<ProfileUnits />} /> */}
                <Route path="/lessonvideo" element={<ProfileVideo />} />
                <Route path="/allcourses" element={<AllCourses />} />
                <Route path="/assignments" element={<Assignments />} />

                <Route
                  path="allcourses/:id/allgrades"
                  element={<AllGrades />}
                />
                <Route path="/mycourses" element={<AllClassCourses />} />
                <Route path="/mycourses-pdfs" element={<AllClassCourses />} />
                <Route
                  path="allcourses/:id/allgrades/:class_id/courses/:course_id"
                  element={<CourseDetails />}
                />
                <Route
                  path="/book-lesson/teacher/:teacher_id"
                  element={<TeacherProfile />}
                />

                <Route
                  path="/offer-lesson/teacher/:teacher_id/chat"
                  element={<Chat />}
                />

                <Route
                  path="/MyReservedLessons"
                  element={<MyReservedLessons />}
                />
                <Route path="/offer-form/offers" element={<MyOffers />} />

                <Route path="/contact" element={<Contact />} />
                <Route path="/techsup" element={<TechSup />} />
                <Route path="/videos" element={<CourseVideo />} />
                <Route path="/CourseContent" element={<CourseContent />} />
                {/* <Route path="/exams" element={<Exams />} /> */}
                <Route path="/examContent/:examId" element={<ExamContent />} />
                {/* <Route path="/examQuestion/:id" element={<ExamQuestions />} /> */}
                <Route
                  path="/examQuestion/:id?status=solved"
                  element={<ExamQuestions />}
                />
                <Route path="/exams" element={<CourseExams />} />
                <Route path="/exams/courses" element={<Exams />} />
                <Route path="/exam/take/:id" element={<ExamQuestions />} />

                <Route path="/freecourses" element={<FreeCourses />} />
                <Route path="*" element={<Home />} />
                <Route path="/About-us" element={<AboutNagah />} />
                <Route path="/myWallet" element={<Transactions />} />
                <Route
                  path="/offer-form/offers/:request_id"
                  element={<RequestsOffers />}
                />
              </>
            ) : (
              <>
                <Route path="/About-us" element={<AboutNagah />} />
                <Route path="/coursedetails" element={<CourseDetails />} />
                <Route index path="/" element={<Home />} />
                <Route path="/freecourses" element={<FreeCourses />} />
                <Route path="/signup" element={<CombinedRegistration />} />

                <Route path="/login" element={<Login />} />
                <Route path="/CourseContent" element={<CourseContent />} />
                <Route path="/techsup" element={<TechSup />} />
                <Route path="/allcourses" element={<AllUnivs />} />
                <Route path="/allcourses/:id" element={<AllCourses />} />
                {/* <Route path="/allgrades/:id" element={<AllGrades />} /> */}
                <Route path="/exams" element={<Examslanding />} />
                <Route path="*" element={<Home />} />
                <Route path="/courses" element={<AllCourses />} />
                <Route path="/courses/:id/allgrades" element={<AllGrades />} />
                <Route
                  path="/courses/:id/allgrades/:grade_id/subjects"
                  element={<AllSubjects />}
                />

                {/* <Route
                  path="/questions"
                  element={<CoursesquestionsLanding />}
                /> */}
              </>
            )}
            {/* <Route path='/expand' element={<ExpandList/>}/> */}
          </Routes>
        </>
      </>
      {/* <ExternalRedirectGuard>

    </ExternalRedirectGuard> */}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 10000 }}
      />
      {/* <Footer/> */}
    </div>
  );
}

export default App;
