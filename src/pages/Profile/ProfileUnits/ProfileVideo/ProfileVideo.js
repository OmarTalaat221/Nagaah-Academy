import React, { useEffect, useState } from "react";
import "./profilevideo.css";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import CryptoJS from "crypto-js";
import { base_url } from "../../../../constants";
const ProfileVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [player, setPlayer] = useState(
    location?.state?.video?.youtube_id &&
      location?.state?.video?.youtube_id?.length
      ? 1
      : 2
  );
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const players = [
    location?.state?.video?.youtube_id &&
      location?.state?.video?.youtube_id?.length && {
        id: 1,
        label: "Player 1",
      },
    location?.state?.video?.loom_url &&
      location?.state?.video?.loom_url?.length && { id: 2, label: "Player 2" },
  ];
  useEffect(() => {
    let ele = document.getElementsByClassName("publitioPlaceHolder");
    // addEventListener('click');
  }, []);
  useEffect(() => {
    document.addEventListener(
      "click",
      (event) => {
        if (document.getElementsByClassName("profilevideo_page")) {
          event.preventDefault();
        }
      },
      []
    );
    const handleContextmenu = (e) => {
      if (document.getElementsByClassName("profilevideo_page")) {
        e.preventDefault();
      }
      // e.preventDefault()
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);
  const handleVideo = () => {
    const data_send = {
      student_id: userData.student_id,
      video_id: location?.state?.video?.video_id,
      course_id: location?.state?.item?.course_id,
    };
    axios
      .post(
        base_url + "/user/courses/insert_view.php",
        JSON.stringify(data_send)
      )
      .then((res) => {})
      .catch((e) => console.log(e));
  };
  const getYoutibeUrl = () => {
    if (
      location?.state?.video?.youtube_id &&
      location?.state?.video?.youtube_id?.length
    ) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = location?.state?.video?.youtube_id.match(regExp);
      if (match && match[2].length === 11) {
        setUrl(match[2]);
      }
    }
  };
  const getVideo = () => {
    axios
      .post(base_url + "", {
        video_id: location?.state?.video?.video_id,
      })
      .then((res) => {
        if (res?.data?.status == "success") {
          getYoutibeUrl();
        }
      });
  };
  useEffect(() => {
    getYoutibeUrl();
    handleVideo();
  }, []);
  if (!location.state) {
    navigate(-1);
  }
  return (
    <div className="profilevideo_page">
      <div
        className="players"
        style={{
          margin: "20px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {players?.map((item) => {
          return (
            <button
              className={player == item?.id ? "btn btn-success" : "btn"}
              onClick={() => setPlayer(item?.id)}
            >
              {item?.label}
            </button>
          );
        })}
      </div>
      <div
        onClick={() => {}}
        className="profilevideo_page"
        target="_blank"
        href="https://facebook.com"
      >
        {player == 1 ? (
          <iframe
            width="560"
            className="publitioPlaceHolder"
            height="315"
            src={`https://www.youtube.com/embed/${url}?autoplay=0&cc_lang_pref=en-GB&cc_load_policy=1&controls=2&rel=0&hl=en-GB&enablejsapi=1&origin=https%3A%2F%2Fsupport.google.com&widgetid=1&fs=1`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            onContextMenu={(e) => e.preventDefault()}
          ></iframe>
        ) : player == 2 ? (
          <iframe
            src={
              "https://www.loom.com/embed/" +
              location?.state?.video?.loom_url?.split("share/")[1]
            }
            width="560"
            height="315"
            frameborder="0"
            webkitallowfullscreen
            mozallowfullscreen
            allowfullscreen
          ></iframe>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileVideo;

// https://www.youtube.com/embed/K1yp7Q1hH1c?controls=0&fs=1
