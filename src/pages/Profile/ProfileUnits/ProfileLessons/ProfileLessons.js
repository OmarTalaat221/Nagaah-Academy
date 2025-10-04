import React from "react";
import "./profilelessons.css";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useNavigate } from "react-router";
const ProfileLessons = ({
  course_data,
  course,
  handleChangeShow,
  setCurrentVideo,
}) => {
  const navigate = useNavigate();
  return (
    <div className="profile_lessons_com">
      <div className="course_features">
        <h4
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "20px",
            justifyContent: "space-between",
          }}
        >
          <span>{course_data?.course_name}</span>
          {/* {course[0]?.videos[0]?.own ? (
            <button
              onClick={() => {
                navigate("/coursequestions", {
                  state: { course: course_data },
                });
              }}
              className="btn btn-warning text-light"
            >
              Course Questions
            </button>
          ) : null} */}
        </h4>
        {course?.map((item, index) => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleChangeShow(item);
              }}
              key={index}
              className="content_div"
            >
              <h4>
                <span>{item.unit_name}</span>
                <span>{item.show ? <IoChevronDown /> : <IoChevronUp />}</span>
              </h4>
              <div className={item.show ? "videos show" : "videos hide"}>
                {item?.videos?.map((video, ind) => {
                  return (
                    <div key={index} className="video">
                      <div
                        onClick={() => {
                          const regExp =
                            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                          const match = video.youtube_id.match(regExp);
                          setCurrentVideo(match[2]);
                          // navigate("/lessonvideo",{state:{video,item}})
                        }}
                        className="left"
                        style={{ flex: "1" }}
                      >
                        <h5>{video.video_title}</h5>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {video.own ? (
                          <button
                            onClick={() => {
                              navigate("/videoquestions", {
                                state: { video: video },
                              });
                            }}
                            style={{ marginRight: "4px", color: "white" }}
                            className="btn btn-warning"
                          >
                            questions
                          </button>
                        ) : null}
                        <p className="right">
                          <img
                            src={require("../../../../assets/vid.png")}
                            alt=""
                          />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileLessons;
