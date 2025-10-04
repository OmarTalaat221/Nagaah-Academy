import React from "react";
import { useNavigate } from "react-router";
import "./home.css";

const RequestLesson = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("NagahUser"));

  return (
    <div className="relative border-b-[5px] border-[#ffd700] py-[60px] px-0 bg-[#3b003b] overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#ffd700] opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#ffd700] opacity-10 rounded-full translate-x-20 translate-y-20"></div>

      <div className="w-[85%] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-shrink-0 md:!order-1 " style={{ order: "2" }}>
          <div className="join_us_div">
            <button onClick={() => navigate(`/offer-form`)}>
              ! اطلب حصتك الآن
            </button>
          </div>
        </div>
        <div
          className="flex flex-col gap-4 flex-1  md:!text-right"
          style={{ order: "1", textAlign: "center" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            اطلب حصتك الآن
          </h1>
          <p className="w-full text-xl text-gray-300 leading-relaxed">
            احصل على حصص مع أفضل المدرسين. نوفر لك تجربة تعليمية مميزة ومخصصة
            لاحتياجاتك الأكاديمية
          </p>
          <div className="flex flex-wrap sm:flex-row gap-4 text-[#ffd700] mt-4 justify-center md:justify-end w-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#ffd700] rounded-full"></div>
              <span className="text-sm font-medium">دروس مخصصة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#ffd700] rounded-full"></div>
              <span className="text-sm font-medium">مدرسين مؤهلين</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#ffd700] rounded-full"></div>
              <span className="text-sm font-medium">مرونة في المواعيد</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestLesson;
