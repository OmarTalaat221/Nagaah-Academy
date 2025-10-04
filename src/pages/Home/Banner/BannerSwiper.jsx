import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./banner2.css";
import ScrollReveal from "scrollreveal";
import logo from "../../../assets/logo/log.png";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router";

export default function BannerSwiper({ onBannerLoad }) {
  const userData = JSON.parse(localStorage.getItem("NagahUser"));
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    ScrollReveal().reveal(".banner_text", {
      delay: 500,
      distance: "20px",
      origin: "top",
      duration: 500,
      easing: "ease-in-out",
      reset: true,
    });
  }, []);

  const getBannerSrc = () => {
    switch (userData?.university_id) {
      case "1":
        return "/primary.gif";
      case "2":
        return "/preparatory.gif";
      case "3":
        return "/secondary.gif";
      default:
        return "/all.gif";
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Notify parent component that banner is loaded
    if (onBannerLoad) {
      onBannerLoad();
    }
  };

  const handleImageError = () => {
    // Even if image fails to load, we should still show the rest of the content
    setImageLoaded(true);
    if (onBannerLoad) {
      onBannerLoad();
    }
  };

  return (
    <div className="banner_container">
      <img
        src={getBannerSrc()}
        alt="University Banner"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
}
