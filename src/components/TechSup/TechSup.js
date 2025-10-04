import React, { useEffect, useState } from "react";
import "./techsup.css";
import {
  FaArrowRight,
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
// import { getSups } from '../../pages/Profile/HelpCenter/functions/getSup'
import Footer from "../../components/Footer/Footer";
import { getSupsData } from "./functions/getSupsData";
import axios from "axios";
import { base_url } from "../../constants";
import Loader from "../Loader/Loader";
const TechSup = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [sups, setSups] = useState(null);
  const getContacts = () => {
    axios.get(base_url + "/user/setting/select_call_center.php").then((res) => {
      setSups(res?.data?.message);
    });
  };
  useEffect(() => {
    getContacts();
  }, []);

  const contactOptions = [
    {
      icon: <FaInstagram />,
      title: "Instagram",
      url: sups && sups[2]?.value,
      iconBg: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
      hoverColor: "hover:text-pink-500",
      hoverShadow: "hover:shadow-pink-200",
      hoverBorder: "hover:border-pink-500",
    },

    {
      icon: <FaWhatsapp />,
      title: "WhatsApp",

      url: sups && sups[0]?.value,
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "hover:text-green-500",
      hoverShadow: "hover:shadow-green-200",
      hoverBorder: "hover:border-green-500",
    },

    {
      icon: <FaFacebook />,
      title: "Facebook",
      url: sups && sups[1]?.value,

      iconBg: "bg-gradient-to-br from-blue-600 to-blue-400",
      hoverColor: "hover:text-blue-600",
      hoverShadow: "hover:shadow-blue-200",
      hoverBorder: "hover:border-blue-600",
    },
  ];

  return (
    <>
      <div className="tech_sup_page">
        <div className="panner_continer">
          {/* <div className="panner_content">
            <h1>مركز المساعدة</h1>
            <p>نحن هنا لمساعدتك. اختر قناة الدعم أدناه للتواصل معنا.</p>
          </div> */}
        </div>
        {}
        <div className="tecs_sup_socials">
          {pageLoading ? (
            <Loader />
          ) : (
            <>
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className={`group bg-white rounded-3xl p-8 flex items-center justify-between cursor-pointer transition-all duration-300 ease-out flex-1 min-h-[120px] shadow-lg border-2 border-transparent hover:-translate-y-3 hover:shadow-2xl ${option.hoverShadow} ${option.hoverBorder} relative overflow-hidden transform hover:scale-102`}
                  onClick={() =>
                    option.url && window.open(option.url, "_blank")
                  }
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  <div className="flex flex-col items-center gap-4 flex-1 z-10">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 group-hover:scale-105 ${option.iconBg}`}
                    >
                      {option.icon}
                    </div>
                    <h4
                      className={`text-lg font-semibold text-gray-800 transition-colors duration-300 ${option.hoverColor}`}
                    >
                      {option.title}
                    </h4>
                  </div>

                  <div className="text-xl text-gray-400 transition-all duration-300 group-hover:text-gray-600 group-hover:translate-x-2 z-10">
                    <FaArrowRight />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TechSup;
