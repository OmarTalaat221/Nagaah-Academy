import React, { useEffect, useState } from "react";
import "./profileunits.css";
import Banner from "../../Unit/Banner/Banner";
import Lessons from "../../Unit/Lessons/Lessons";
import Books from "../../Books/Books";
import CryptoJS from "crypto-js";
import { useLocation, useNavigate } from "react-router";
import ProfileLessons from "./ProfileLessons/ProfileLessons";
import axios from "axios";
import { base_url } from "../../../constants";
import { handleLogOut } from "../../../App";
const ProfileUnits = () => {
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const [currentPage, setCurrentPage] = useState("lessons");
  const [currentVideo, setCurrentVideo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [courseDetails, setCourseDetails] = useState([]);
  const getUnits = async () => {
    const data_send = {
      student_id: userData?.student_id,
      course_id: location?.state?.course?.course_id,
      token_value: userData?.token_value,
    };
    await axios
      .post(base_url + "/user/courses/select_course_lesson.php", data_send)
      .then(async (res) => {
        const regExp =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = res.data.message[0].videos[0].youtube_id.match(regExp);
        // console.log(res.data.message[0],'this is zero')
        setCurrentVideo(match[2]);
        if (match && match[2].length === 11) {
          setCurrentVideo(match[2]);
        }
        if (res.data.status == "success") {
          setCourseDetails(res.data.message);
        } else if (res.data.status == "out") {
          localStorage.clear();

          // window.location.reload();
        }
      })
      .catch((e) => console.log(e));
  };
  const handleChangeShow = (item) => {
    let pushedData = [];
    for (let i = 0; i < courseDetails.length; i++) {
      if (item.unit_id == courseDetails[i].unit_id) {
        let obj = {
          ...courseDetails[i],
          show: !courseDetails[i]["show"],
        };
        pushedData.push(obj);
      } else {
        let obj = {
          ...courseDetails[i],
          show: false,
        };
        pushedData.push(obj);
      }
    }
    setCourseDetails(pushedData);
  };

  useEffect(() => {}, [currentPage]);
  useEffect(() => {
    getUnits();
  }, []);
  return (
    <div className="profileunits_page">
      <Banner
        description={location?.state?.course?.course_content}
        title={location?.state?.course?.course_name}
      />
      <div className="player_content">
        <ProfileLessons
          course_data={location?.state?.course}
          setCurrentVideo={setCurrentVideo}
          handleChangeShow={handleChangeShow}
          course={courseDetails}
        />
        <div
          onClick={() => {}}
          className="profilevideo_page"
          target="_blank"
          href="https://facebook.com"
        >
          {currentVideo ? (
            <>
              <iframe
                width="560"
                className="publitioPlaceHolder"
                height="315"
                src={`https://www.youtube.com/embed/${currentVideo}?controls=1&fs=1`}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                onContextMenu={(e) => e.preventDefault()}
              ></iframe>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileUnits;
