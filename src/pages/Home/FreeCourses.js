import React, { useEffect } from "react";
import Banner from "./Banner/Banner";
import "./home.css";
import Feature from "./Features/Feature";
import Banner2 from "./Banner/Banner2";
import Courses from "./Courses/Courses";
import Footer from "../../components/Footer/Footer";
import About from "../About/About";
import Apply from "./Apply/Apply";
const FreeCourses = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="home">
        <Courses emptyText={true} />
      </div>
      <Footer />
    </>
  );
};

export default FreeCourses;
