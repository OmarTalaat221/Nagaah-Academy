import React, { useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import "./banner2.css";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router";
import BannerSwiper from "./BannerSwiper";
import Feature from "../Features/Feature";

const salt = bcrypt.genSaltSync(10);

const Banner2 = ({ onBannerLoad }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // secureLocalStorage.setItem("object", {
    //     message:  "This is testing of local storage",
    // });
    // secureLocalStorage.setItem("number", 12);
    // secureLocalStorage.setItem("string", "12");
    // secureLocalStorage.setItem("boolean", true);
    // let value = secureLocalStorage.getItem("boolean");
  }, []);

  const handleOpenCrypt = () => {
    const encryptedData = localStorage.getItem("elmataryapp");
    if (encryptedData) {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, "111");
      const decryptedData = JSON.parse(
        decryptedBytes.toString(CryptoJS.enc.Utf8)
      );
    }
  };

  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  return (
    <>
      <section className="index-banner">
        <div className="banner2">
          <div className="swiperPos">
            <BannerSwiper onBannerLoad={onBannerLoad} />
          </div>
          <Slide className="left" direction="left">
            {/* <div>
            <h4>Embark on a Journey of Medical Excellence</h4>
            <p>
              Explore our comprehensive range of medical courses designed to
              empower and inspire. From foundational knowledge to advanced
              practices, our curated curriculum ensures a transformative
              learning experience.
            </p>
            <div className="actions">
              {userData && Object.keys(userData).length > 0 ? (
                <button onClick={() => navigate("/allcourses")}>Get Started</button>
              ) : null}
            </div>
          </div> */}
          </Slide>
          <Slide className="right" direction="right">
            <div>{}</div>
          </Slide>
        </div>
      </section>
      {/* <div className="featureContain mt-5">
      <Feature />
    </div> */}
    </>
  );
};

export default Banner2;
