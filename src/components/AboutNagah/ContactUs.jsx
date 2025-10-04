import React from "react";
import "./style.css";

import { useState } from "react";
import { Phone, Mail, MessageCircle, Star } from "lucide-react";

const ContactUs = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/96566654045", "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:nagaahkw@gmail.com";
  };
  return (
    <>
      <div
        className=" w-[95%] mx-auto !my-[20px] h-96 perspective-1000"
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`
          relative w-full h-full transition-all duration-700 transform-style-preserve-3d
         
        `}
        >
          {/* Card Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3b003b] via-[#3b003b] to-[#3b003b] rounded-3xl border-4 border-[#ffd700] shadow-2xl overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating Dots */}
              <div className="absolute top-8 right-8 w-4 h-4 bg-[#ffd700] rounded-full opacity-80"></div>
              <div className="absolute top-16 right-16 w-2 h-2 bg-[#ffd700]/60 rounded-full"></div>
              <div className="absolute bottom-12 left-8 w-3 h-3 bg-[#ffd700]/40 rounded-full"></div>
              <div className="absolute bottom-20 left-16 w-1.5 h-1.5 bg-[#ffd700]/60 rounded-full"></div>

              {/* Star Icon */}
              <div className="absolute top-6 left-6">
                <div
                  className={`
                  p-2 rounded-full bg-[#ffd700] transition-all duration-500
                  ${isHovered ? "scale-110 rotate-45" : ""}
                `}
                >
                  <Star className="w-4 h-4 text-[#3b003b] fill-current" />
                </div>
              </div>

              {/* Subtle Gradient Overlays */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#ffd700]/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
              {/* Contact Icons Container */}
              <div className="relative mb-6">
                {/* Outer Circle */}
                <div
                  className={`
                  w-32 h-32 rounded-full border-4 border-[#ffd700] 
                  flex items-center justify-center relative transition-all duration-500
                  ${isHovered ? "scale-110 rotate-12" : ""}
                `}
                >
                  {/* Inner Circle */}
                  <div className="w-24 h-24 rounded-full border-2 border-[#ffd700]/60 flex items-center justify-center">
                    {/* Contact Icons */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`
                        absolute -left-4 -top-2 p-2 rounded-full bg-green-500 
                        transition-all duration-500 cursor-pointer hover:scale-110
                        ${isHovered ? "scale-105 -rotate-12" : ""}
                      `}
                        onClick={handleWhatsAppClick}
                      >
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>

                      <div
                        className={`
                        absolute -right-4 -top-2 p-2 rounded-full bg-[#ffd700] 
                        transition-all duration-500 cursor-pointer hover:scale-110
                        ${isHovered ? "scale-105 rotate-12" : ""}
                      `}
                        onClick={handleEmailClick}
                      >
                        <Mail className="w-4 h-4 text-[#3b003b]" />
                      </div>

                      <div
                        className={`
                        p-3 rounded-full bg-gradient-to-br from-white/90 to-white/60 
                        border-2 border-[#ffd700] backdrop-blur-sm shadow-lg
                        transition-all duration-500
                        ${isHovered ? "scale-110 rotate-6" : ""}
                      `}
                      >
                        <Phone className="w-6 h-6 text-[#3b003b]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-[#ffd700]/20 blur-xl -z-10 animate-pulse"></div>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl font-bold text-[#ffd700] mb-6 tracking-wide">
                تواصل معنا
              </h1>

              {/* Contact Information */}
              <div className="sm:w-[50%] w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-[#ffd700]/30 space-y-3">
                {/* WhatsApp */}
                <div
                  className="flex items-center gap-2 justify-center space-x-3 space-x-reverse cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/90 text-sm font-medium">
                    +965 666 54045
                  </span>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#ffd700]/30"></div>

                {/* Email */}
                <div
                  className="flex items-center gap-2 justify-center space-x-3 space-x-reverse cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={handleEmailClick}
                >
                  <Mail className="w-5 h-5 text-[#ffd700]" />
                  <span className="text-white/90 text-sm font-medium">
                    nagaahkw@gmail.com
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-2 h-2 bg-[#ffd700] rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-[#ffd700]/60 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#ffd700]/40 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
          </div>

          {/* 3D Shadow */}
          <div className="absolute inset-0 bg-black/20 rounded-3xl transform translate-x-3 translate-y-3 -z-10 blur-sm"></div>
        </div>

        {/* Additional Floating Elements */}
        {/* <div
          className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#ffd700] to-yellow-500 
          rounded-full transition-all duration-700`}
        ></div>
        <div
          className={`absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 
          rounded-full transition-all duration-700`}
        ></div> */}
      </div>
    </>
  );
};

export default ContactUs;
