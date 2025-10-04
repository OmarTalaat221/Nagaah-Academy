import React from "react";
import "./about.css";
import { useNavigate } from "react-router";
import AboutImg from "../../assets/AboutUS.png";

export default function About() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="relative border-b-[5px] border-[#ffd700]"
        style={{ width: "100%", padding: "80px 0" }}
      >
        <div className=" about_container">
          <div className="  about_container_row about-content-container">
            <div className=" d-flex justify-content-start  ">
              <img
                // style={{ width: "80%" }}
                src={
                  "https://res.cloudinary.com/dnt8gmwab/image/upload/v1747899746/Untitled_600_x_550_px_1_wzfntq.png"
                }
                // className="!w-[100px]"
                alt="عن ميديكوتون"
              />
            </div>
            <div className=" col-12 col-md-7 textContain text-end">
              <span
                className="main-text"
                style={{ fontSize: "18px", color: "white" }}
              >
                {" "}
              </span>
              <h1
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "4px 0px 0px black",
                }}
              >
                الطريق إلى النجاح يبدأ من هنا
              </h1>
              <p
                className="my-4"
                style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}
              >
                مرحبًا بكم في أكاديمية{" "}
                <strong style={{ color: "#ffd700" }}>نجاح</strong> التعليم حيث
                التميز في التعليم الدراسي دون الجامعى . نقدم لكم كورسات دراسية
                شاملة تُدرس على أيدي محترفين ذوي خبرة، لضمان حصولكم على معرفة
                عالية المستوى ومهارات عملية متميزة
              </p>
              {/* <button
                className="discover_subjects"
                onClick={() => navigate("/About-us")}
              >
                اعرف عنا
              </button> */}
            </div>
          </div>
        </div>
        {/* <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#5f2f6b] to-transparent"></div> */}
      </div>
    </>
  );
}
