import React, { useEffect, useState } from "react";
import "./profilecourses.css";
import { useNavigate, useLocation } from "react-router";
import { MdPlayLesson } from "react-icons/md";
const ProfileCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courses = location.state.courses;
  console.log(courses);
  if (courses.length === 0) {
    return (
      <div className="empty">
        <MdPlayLesson className="icon" />
        <h5>لا توجد دورات متاحه</h5>
      </div>
    );
  }
  return (
    <div className="profile_course_container">
      <h2 className="profile_course_title">دوراتي</h2>

      <div className="profile_courses_page">
        {courses.map((item, index) => {
          return (
            // <div
            //   onClick={() => {
            //     navigate("/units", { state: { course: item } });
            //   }}
            //   className="course"
            // >
            //   <div className="left">
            //     <img src={item.course_photo_url} alt="" />
            //   </div>
            //   <div className="right">
            //     {}
            //     <h2>{item.course_name}</h2>
            //     <h3>
            //       {}
            //       <span>{item.videos_count}lessons</span>
            //     </h3>
            //     <div className="compelete_ratio">
            //       <div>
            //         <h4
            //           style={{
            //             backgroundColor: '#ef466a',
            //             width: `${item.finished_rate}%`,
            //             height: '100%',
            //             borderRadius: '10px',
            //           }}
            //         ></h4>
            //       </div>
            //       <span>{item.finished_rate}%</span>
            //     </div>
            //   </div>
            // </div>

            <div
              key={item.course_id}
              className="course-card"
              onClick={() => {
                navigate("/units", { state: { course: item } });
              }}
            >
              <div className="main">
                <img
                  className="tokenImage"
                  src={item?.course_photo_url}
                  alt=""
                />
                <div className="course-title">
                  <h2>Surgery</h2>
                </div>

                <div className="course-content-body">
                  <h4>{item?.course_name}</h4>
                  <p class="description">
                    {item?.course_content?.length > 50
                      ? item?.course_content?.substring(0, 50) + "..."
                      : item?.course_content}
                  </p>
                </div>

                <div className="compelete_ratio">
                  <div>
                    <h4
                      style={{
                        backgroundColor: "#ef466a",
                        width: `${item.finished_rate}%`,
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    ></h4>
                  </div>
                  <span>{item.finished_rate}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileCourses;
