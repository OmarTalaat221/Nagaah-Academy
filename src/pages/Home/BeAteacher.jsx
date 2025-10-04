import React from "react";
import "./home.css";
import { useNavigate } from "react-router";

const BeAteacher = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="Be-Ateacher-container relative border-b-[5px] border-[#ffd700] p-[60px_0]">
        <div className=" teacher-content-container" style={{ display: "flex" }}>
          <div className="teacher-text flex flex-col gap-4">
            <h1>كن مدرس مع نجاح</h1>
            <p>
              انضم الان الى فريق عمل نجاح لنوصلك بالاف الطلاب المهتمين بخدماتك
              في الكويت
            </p>
          </div>
          <div className="join_us_div !text-black">
            <button onClick={() => navigate(`/be-a-teacher`)}>
              انضم الينا الان !
            </button>
          </div>
        </div>
        {/* <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#5f2f6b] to-transparent"></div> */}
      </div>
    </>
  );
};

export default BeAteacher;
