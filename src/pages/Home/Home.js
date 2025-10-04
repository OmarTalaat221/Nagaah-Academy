import React, { useEffect, useState } from "react";
import Banner from "./Banner/Banner";
import "./home.css";
import Feature from "./Features/Feature";
import Banner2 from "./Banner/Banner2";
import Courses from "./Courses/Courses";
import Footer from "../../components/Footer/Footer";
import About from "../About/About";
import Apply from "./Apply/Apply";
import ReportBanner from "./ReportBanner/ReportBanner";
import BeAteacher from "./BeAteacher";
import TeachersTeam from "./teacherTeam/TeachersTeam";
import NagaahLiveBanner from "./LiveVideoBanner";
import RequestLesson from "./RequestLesson";
import Loader from "../../components/Loader/Loader";
import EducationPackages from "./EducationPackages";

const Home = () => {
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBannerLoad = () => {
    setBannerLoaded(true);
  };

  const userData = JSON.parse(localStorage.getItem("NagahUser"));

  return (
    <div className="home">
      {/* Only render the rest of the content after banner is loaded */}
      <Banner2 onBannerLoad={handleBannerLoad} />
      {bannerLoaded && (
        <>
          <NagaahLiveBanner />
          <Courses />
          <RequestLesson />
          {!userData && <ReportBanner />}
          <About />
          <EducationPackages />
          <BeAteacher />
          <TeachersTeam />
          <Footer />
        </>
      )}

      {/* Optional: Add a loading spinner while banner is loading */}
      {!bannerLoaded && <Loader />}
    </div>
  );
};

export default Home;
