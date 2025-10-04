import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { MdPlayLesson } from "react-icons/md";
import { useNavigate } from "react-router";
import AllCoursesBanner from "./AllCoursesBanner/AllCoursesBanner";
import "./allcourses.css";
import "./maincourse.css";
import { getCourses } from "./functions/getAll";
import { useDispatch } from "react-redux";
import ContentLoader from "react-content-loader";
const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(false);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  console.log(userData);
  const [selectedTopic, setSelectedTopic] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    getCourses(
      userData,
      setPageLoading,
      setCourses,
      setOriginalCourses,
      dispatch
    );
  }, []);
  return (
    <div style={{ padding: "40px" }}>
      <div className="allcourses">
        <AllCoursesBanner
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />

        <div className="courses_content py-3">
          {!courses ? (
            <div style={{ width: "100vw " }}>
              <ContentLoader
                viewBox="0 0 980 320"
                speed={1}
                // backgroundColor={'green'}
              >
                {}
                <rect x="10" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="350" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="690" y="10" rx="20" ry="20" width="260" height="300" />
                <rect x="690" y="10" rx="20" ry="20" width="260" height="300" />
              </ContentLoader>
            </div>
          ) : courses && courses?.length > 0 ? (
            courses.map((item, index) => {
              return (
                // <div
                //   class="card"
                // onClick={() => {
                //   return item?.units[0]?.videos[0]?.own || item?.own
                //     ? navigate(
                //         "/CourseContent?course_id=" +
                //           item?.course_id +
                //           "&course_name=" +
                //           item?.course_name +
                //           "&r=" +
                //           item?.finished_rate,
                //         {
                //           state: { course: item },
                //         }
                //       )
                //     : navigate("/Subscribe");
                // }}
                // >
                //   <div className="main">
                //     <div className="imageCourse">
                //       <img
                //         className="tokenImage"
                //         src={item?.course_photo_url}
                //         alt=""
                //       />
                //       <h4 className="category">{item?.category_label}</h4>
                //     </div>
                //     <div className="courseDetails">
                //       <span className="iconWithText">
                //         <svg
                //           xmlns="http://www.w3.org/2000/svg"
                //           width="1em"
                //           height="1em"
                //           viewBox="0 0 256 256"
                //         >
                //           <g fill="currentColor">
                //             <path
                //               d="M226.59 71.53a16 16 0 0 0-9.63-11C183.48 47.65 128 48 128 48s-55.48-.35-89 12.58a16 16 0 0 0-9.63 11C27.07 80.54 24 98.09 24 128s3.07 47.46 5.41 56.47A16 16 0 0 0 39 195.42C72.52 208.35 128 208 128 208s55.48.35 89-12.58a16 16 0 0 0 9.63-10.95c2.34-9 5.41-26.56 5.41-56.47s-3.11-47.46-5.45-56.47M112 160V96l48 32Z"
                //               opacity="0.2"
                //             />
                //             <path d="m164.44 121.34l-48-32A8 8 0 0 0 104 96v64a8 8 0 0 0 12.44 6.66l48-32a8 8 0 0 0 0-13.32M120 145.05V111l25.58 17Zm114.33-75.53a24 24 0 0 0-14.49-16.4C185.56 39.88 131 40 128 40s-57.56-.12-91.84 13.12a24 24 0 0 0-14.49 16.4C19.08 79.5 16 97.74 16 128s3.08 48.5 5.67 58.48a24 24 0 0 0 14.49 16.41C69 215.56 120.4 216 127.34 216h1.32c6.94 0 58.37-.44 91.18-13.11a24 24 0 0 0 14.49-16.41c2.59-10 5.67-28.22 5.67-58.48s-3.08-48.5-5.67-58.48m-15.49 113a8 8 0 0 1-4.77 5.49c-31.65 12.22-85.48 12-86.12 12s-54.37.18-86-12a8 8 0 0 1-4.77-5.49C34.8 173.39 32 156.57 32 128s2.8-45.39 5.16-54.47A8 8 0 0 1 41.93 68c31.65-12.18 85.47-12 86.12-12s54.37-.18 86 12a8 8 0 0 1 4.77 5.49C221.2 82.61 224 99.43 224 128s-2.8 45.39-5.16 54.47Z" />
                //           </g>
                //         </svg>
                //         <span>{item?.units?.length} Lessons</span>
                //       </span>
                //       <h2 className="courseName">{item?.course_name}</h2>
                //       {/* <p className="description">
                //         {item?.course_content?.length > 50
                //           ? `${item?.course_content?.substring(0, 50)}...`
                //           : item?.course_content}
                //       </p> */}
                //       <span>Dr.Mohammed Elmatary</span>
                //       <div className="spacebetween flex justify-space-between">
                //         <div class="ratings">
                //           {Array(item?.rate ? parseInt(item?.rate) : 0)
                //             .fill(0)
                //             .map((item) => {
                //               return (
                //                 <img
                //                   src="https://raw.githubusercontent.com/mustafadalga/ratings-card/461b28d30e6d5b4475e0f78d2f65700674808565/assets/img/star2.svg"
                //                   alt=""
                //                 />
                //               );
                //             })}
                //           {Array(5 - (item?.rate ? parseInt(item?.rate) : 0))
                //             .fill(0)
                //             .map((item) => {
                //               return (
                //                 <img
                //                   src="https://res.cloudinary.com/duovxefh6/image/upload/v1710597956/purepng.com-grey-starstargeometricallydecagonconcavestardomclipartblackgrey-1421526502793oblca_ca8lyn.png"
                //                   alt=""
                //                 />
                //               );
                //             })}
                //           {}
                //         </div>
                //         <div className="price">${item?.course_price}</div>
                //       </div>
                //     </div>
                //   </div>
                // </div>

                <div
                  key={item.course_id}
                  className="my-course-card"
                  style={{ color: "white" }}
                  onClick={() => {
                    return item?.own
                      ? navigate(
                          "/CourseContent?course_id=" +
                            1 +
                            "&course_name=" +
                            item?.course_name +
                            "&r=" +
                            item?.finished_rate +
                            "&p=" +
                            item?.pdf_url,
                          {
                            state: { course: item },
                          }
                        )
                      : navigate("/Subscribe");
                  }}
                >
                  {/* <div className="course-price">
                    {item?.course_price == 0 ? "Free" : item?.course_price}
                  </div> */}
                  <div class="main">
                    <img
                      class="mytokenImage"
                      src={item?.course_photo_url}
                      alt=""
                    />
                    {/* <div className="course-title">
                      <h2>Surgery</h2>
                    </div> */}

                    <div className="course-content-body">
                      {/* <h4 style={{ color: "white", fontSize: "30px" }}>
                        {item?.course_name}
                      </h4> */}
                      {/* <p style={{ color: "white" }} class="description">
                        {item?.course_content?.length > 50
                          ? item?.course_content?.substring(0, 50) + "..."
                          : item?.course_content}
                      </p> */}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty">
              <MdPlayLesson className="icon" />
              <h5>لا توجد دورات متاحه</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
