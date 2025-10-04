import React, { useEffect, useState } from "react";
import { Slide } from "react-awesome-reveal";
import { featuresData } from "./data";
import "./feature.css";
const Feature = () => {
  const [features, setFeatures] = useState([]);
  const getFeatures = () => {
    setFeatures(featuresData);
  };
  useEffect(() => {
    getFeatures();
  }, []);
  return (
    <div className="features-big-container">
      <div className="features row justify-content-center w-75 ">
        {features.map((item) => (
          <>
            <div className="feature col-xl-6 col-md-6" key={item.title}>
              <img src={item.img} alt="featureImg" />
              <div className="featureText">
                <h6 style={{ fontSize: "22px" }}>{item.title}</h6>
                <p style={{ fontSize: "18px" }}>{item.des}</p>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Feature;
