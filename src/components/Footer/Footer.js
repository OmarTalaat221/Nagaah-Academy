import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
} from "react-icons/fa";
import logo from "../../assets/logo/log.png";
import { FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  const userData = JSON.parse(localStorage.getItem("NagahUser"));
  const socialLinks = [
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/profile.php?id=61555961158291",
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/manastngaah/",
      label: "Instagram",
    },
    {
      icon: FaWhatsapp,
      url: "https://www.instagram.com/manastngaah/", // You might want to update this to actual TikTok URL
      label: "Whatsapp",
    },
    {
      icon: FaSnapchatGhost,
      url: "https://www.instagram.com/medicotoon?igsh=dnR3OGgwemFhZHp4",
      label: "Snapchat",
    },
  ];
  return (
    <footer className="footer-section ">
      <div className="container mx-auto px-4">
        <div className="footer-content py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {/* Logo and Social Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
              <div className="footer-widget">
                <div className="footer-text">
                  <img
                    className="footerImage"
                    width={150}
                    src={logo}
                    alt="logo"
                  />
                  <p className="mt-4 ">
                    ابقَ على اتصال معنا واستمتع بعروض حصرية مستمرة مصممة خصيصًا
                    لمتابعينا.
                  </p>
                  <span className="font-semibold mt-2 block">
                    تابعنا على وسائل التواصل الاجتماعي:
                  </span>
                  <div className="mb-3 mt-2 flex gap-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => window.open(social.url, "_blank")}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 hover:scale-110"
                          aria-label={social.label}
                        >
                          <Icon className="text-lg" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Explore Links */}
            <div className="footer-widget mt-4 lg:mt-0">
              <div className="footer-widget-heading">
                <h3 className="text-lg font-bold mb-4">استكشف</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link to={"/"} className=" transition-colors">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link
                    to={userData ? "/mycourses" : "/courses"}
                    className=" transition-colors"
                  >
                    المناهج
                  </Link>
                </li>
              </ul>
            </div>

            {/* Other Links */}
            <div className="footer-widget mt-4 lg:mt-0">
              <div className="footer-widget-heading">
                <h3 className="text-lg font-bold mb-4">روابط</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link to="/exams" className=" transition-colors">
                    الاختبارات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subscribe Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 mt-4 lg:mt-0">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3 className="text-lg font-bold mb-4">اشترك الآن</h3>
                </div>
                <div className="footer-text">
                  <p className="mb-4 ">
                    لا تفوت فرصة الاشتراك في أحدث التحديثات والعروض، قم بملء
                    النموذج أدناه.
                  </p>
                </div>
                <div className="subscribe-form">
                  <form action="#" className="flex flex-col sm:flex-row gap-2">
                    <input
                      className="flex-1 px-4 py-2 border-2 border-[#ffd700] rounded focus:outline-none focus:border-[#fb9700] text-[#3b003b]"
                      placeholder="البريد الإلكتروني"
                    />
                    <button
                      className="px-6 py-1 font-bold text-[18px] subscribe_btn text-[#3b003b] rounded"
                      type="submit"
                    >
                      اشتراك
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="copyright-area text-white bg-[#3b003b] py-4">
        <div className="container mx-auto px-4">
          <div className="text-center lg:text-left">
            <div className="copyright-text">
              <p>
                جميع الحقوق محفوظة &copy; 2025{" "}
                <div className="text-[#ffd700] hover:text-[#fb9700] transition-colors">
                  Nagaah
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
