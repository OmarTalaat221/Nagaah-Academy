import React from "react";
import { useNavigate } from "react-router";
import { coursesTypesData } from "../Home/Courses/data";
import "./maincourse.css";
const MainCourse = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(
          "/CourseContent?course_id=" +
            1 +
            "&course_name=" +
            course?.course_name +
            "&r=" +
            course?.finished_rate +
            "&p=" +
            course?.pdf_url,
          {
            state: { course: course },
          }
        );
      }}
      className="main_course"
    >
      <div className="image">
        <img src={course.course_photo_url} alt="" />
        <div className="price">
          <span>
            {coursesTypesData
              .filter((it) => it.id == course.type_id)
              .map((val) => val.name)}
          </span>
        </div>
      </div>
      <div className="description">
        <h4 className="courseName">{course.course_name}</h4>
        {}
        {/* <div>
          <div>
            <MdOutlinePlayLesson/>
            <p>{course.lecatures}</p>
          </div>
          <div>
            <FaClock/>
            <p>{course.duration}</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MainCourse;
