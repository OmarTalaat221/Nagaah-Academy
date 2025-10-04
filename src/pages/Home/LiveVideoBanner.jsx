import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { BASE_URL } from "../../components/axios/BASE_URL";
import axios from "axios";
import { toast } from "react-toastify";

const NagaahLiveBanner = () => {
  const [viewerCount, setViewerCount] = useState(1247);
  const [Lives, setLives] = useState([]);
  const [floatingElements, setFloatingElements] = useState([]);
  const [particles, setParticles] = useState([]);

  // Initialize floating elements
  useEffect(() => {
    const elements = ["⭐", "📚", "🎓", "✨", "📖", "🏆", "💡"];
    const newElements = [];

    for (let i = 0; i < 12; i++) {
      newElements.push({
        id: i,
        symbol: elements[Math.floor(Math.random() * elements.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
      });
    }
    setFloatingElements(newElements);
  }, []);

  // Create particles continuously
  useEffect(() => {
    const createParticle = () => {
      const newParticle = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        delay: 0,
        duration: 8 + Math.random() * 4,
      };

      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    };

    const interval = setInterval(createParticle, 800);
    return () => clearInterval(interval);
  }, []);

  // Simulate live viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      const baseCount = 1200;
      const variation = Math.floor(Math.random() * 100);
      setViewerCount(baseCount + variation);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const joinLive = (link) => {
    window.open(link, "_blank");
  };

  // const scheduleReminder = () => {
  //   alert("🔔 تم تفعيل التذكير! سنرسل لك إشعاراً قبل بدء الدروس القادمة.");
  // };

  const UserData = JSON.parse(localStorage.getItem("NagahUser"));

  const handelgetLives = () => {
    const dataSend = UserData
      ? {
          student_id:
            JSON.parse(localStorage.getItem("NagahUser")).student_id || "",
        }
      : null;

    console.log(dataSend);

    axios
      .post(
        BASE_URL + `/user/lives/select_live_vid.php`,
        JSON.stringify(dataSend)
      )
      .then((res) => {
        if (res.data.status == "success") {
          setLives(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    handelgetLives();
  }, []);

  return Lives.length > 0 ? (
    <Swiper
      modules={[Autoplay, Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 5000 }}
      navigation={true}
      className="border-b-[5px] border-[#ffd700] w-full"
    >
      {Lives?.length > 0 &&
        Lives?.map((live) => {
          return (
            <>
              <SwiperSlide>
                {/* Your full current content goes here */}
                <div className="relative w-[90%] m-auto  bg-gradient-to-br from-[#3b003b] via-[#3b003b] to-[#3b003b] overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    {/* {floatingElements.map((element) => (
                      <div
                        key={element.id}
                        className={`absolute text-yellow-400 ${
                          element.symbol === "⭐" || element.symbol === "✨"
                            ? "text-xl animate-pulse"
                            : element.symbol === "📚" || element.symbol === "📖"
                            ? "text-2xl animate-bounce"
                            : "text-xl animate-spin"
                        }`}
                        style={{
                          left: `${element.left}%`,
                          top: `${element.top}%`,
                          animationDelay: `${element.delay}s`,
                          animationDuration: `${element.duration}s`,
                        }}
                      >
                        {element.symbol}
                      </div>
                    ))} */}

                    {particles.map((particle) => (
                      <div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          left: `${particle.left}%`,
                          top: "100%",
                          animationDuration: `${particle.duration}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* <div className="absolute top-5 left-5 bg-black bg-opacity-70 p-4 rounded-lg  text-white text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400">👥</span>
              <span className="font-bold">{viewerCount.toLocaleString()}</span>
              <span>مشاهد</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>مباشر منذ {liveTime} دقيقة</span>
            </div>
          </div> */}

                  <div className="flex flex-col md:flex-row items-center justify-between h-full p-6 md:p-12 relative z-10">
                    <div className="flex-1 text-white text-center md:text-right mb-8 md:mb-0">
                      <div className="inline-flex items-center bg-black text-white px-4 py-2 rounded-full font-bold mb-6 animate-pulse">
                        <span className="mr-2">🔴 مباشر الآن</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>

                      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent animate-pulse">
                        NAGAAH
                      </h1>

                      <h2 className="text-xl md:text-2xl mb-6 text-gray-200">
                        درس مباشر - {live?.live_title || "عنوان الدرس"}
                      </h2>

                      <h2 className="text-4xl text-[#ffd700]  font-bold mb-6 ">
                        أ/ {live?.teacher_name || "اسم المعلم"}
                      </h2>

                      <p className="text-base md:text-lg leading-relaxed mb-8 text-gray-300">
                        انضم إلينا الآن في درس تفاعلي مباشر مع أفضل المعلمين.
                        تعلم، شارك، واكتشف طريقك إلى النجاح مع نجاح!
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-center">
                        <button
                          onClick={() => joinLive(live?.live_url)}
                          className="bg-gradient-to-r  from-yellow-400 to-yellow-300 text-purple-900 px-16 py-6 rounded-full font-bold text-xl hover:from-yellow-300 hover:to-yellow-200 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                        >
                          🎥 انضم للبث المباشر
                        </button>
                      </div>
                    </div>

                    <div className="flex-none">
                      <div className="relative">
                        <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br mt-[50px] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                          <div className="text-6xl md:text-8xl animate-pulse">
                            <img
                              src="https://res.cloudinary.com/dhgp9dzdt/image/upload/v1750324637/ICON_NAGHAA_hchu35.png"
                              alt=""
                            />
                          </div>
                        </div>

                        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-4xl text-yellow-400 animate-ping">
                          🪶
                        </div>
                        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-4xl text-yellow-400 animate-ping">
                          🪶
                        </div>

                        <div className="absolute -top-4 -right-4 text-2xl animate-spin">
                          ⭐
                        </div>
                        <div className="absolute -bottom-4 -left-4 text-2xl animate-bounce">
                          📚
                        </div>
                        <div className="absolute top-1/4 -left-6 text-xl animate-pulse">
                          ✨
                        </div>
                        <div className="absolute top-3/4 -right-6 text-xl animate-ping">
                          🏆
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </>
          );
        })}
    </Swiper>
  ) : null;
};

export default NagaahLiveBanner;
