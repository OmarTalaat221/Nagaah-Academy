import React from "react";
import "./style.css";
import qrNote from "../../../assets/qr.gif";
import { useNavigate } from "react-router";

const ReportBanner = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("NagahUser"));

  return (
    <>
      <div className="report-banner-container relative border-b-[5px] border-[#ffd700]">
        <div className="report-banner">
          <img
            src={
              "https://res.cloudinary.com/dnt8gmwab/image/upload/v1746105514/Untitled_600_x_550_px_1_-_Copy_krldv8.gif"
            }
            alt=""
          />
          <span>
            <h1>مذكرات نجاح الشاملة</h1>
            <p>
              أقوى مذكرات بالكويت تغطي منهجك بالكامل وتغنيك عن كل المصادر الأخرى
            </p>
            <p>ارفع درجاتك مع مذكرات نجاح الشاملة</p>

            <div className="flex md:justify-start justify-center">
              <button
                className="try-again-btn md:w-fit"
                onClick={() => {
                  if (userData) {
                    navigate(`/mycourses-pdfs`);
                  } else {
                    navigate(`/login`);
                  }
                }}
              >
                استكشف المواد
              </button>
            </div>
          </span>
        </div>
        {/* <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#5f2f6b] to-transparent"></div> */}
      </div>
    </>
  );
};

export default ReportBanner;
