import "./style.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../../constants";
import { TeacherCard } from "./TeacherCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TeachersTeam = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handelGetTeachers = () => {
    axios
      .get(base_url + `/user/teachers/select_all_teachers.php`)
      .then((res) => {
        if (res.data.status == "success") {
          setTeachers(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    handelGetTeachers();
  }, []);

  const handlePrev = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
    <div className="TeachersTeam-container relative">
      <div
        style={{
          direction: "rtl",
        }}
        className="flex px-5  items-center justify-between mb-8"
      >
        <h1 className="text-center mb-6 !text-[25px] sm:!text-[30px] md:!text-[40px]">
          فريق نجاح
        </h1>

        {/* Navigation Buttons Above Swiper */}
        <div className=" flex items-center gap-4 mb-6">
          {/* Center indicator/title */}

          <button
            onClick={handlePrev}
            disabled={isBeginning}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
              bg-gradient-to-br from-yellow-400 to-yellow-500 
              border-2 border-yellow-400 rounded-full 
              flex items-center justify-center 
              text-purple-900 text-sm sm:text-base md:text-lg lg:text-xl font-bold 
              transition-all duration-300 ease-in-out 
              shadow-lg hover:shadow-xl hover:shadow-yellow-400/50 
              hover:scale-110 active:scale-95
              ${
                isBeginning
                  ? "opacity-50 cursor-not-allowed bg-gradient-to-br from-gray-300 to-gray-400 border-gray-300 text-gray-600"
                  : "cursor-pointer hover:from-yellow-300 hover:to-yellow-400 hover:border-yellow-300"
              }
            `}
          >
            <FaChevronRight />
          </button>

          <button
            onClick={handleNext}
            disabled={isEnd}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
              bg-gradient-to-br from-yellow-400 to-yellow-500 
              border-2 border-yellow-400 rounded-full 
              flex items-center justify-center 
              text-purple-900 text-sm sm:text-base md:text-lg lg:text-xl font-bold 
              transition-all duration-300 ease-in-out 
              shadow-lg hover:shadow-xl hover:shadow-yellow-400/50 
              hover:scale-110 active:scale-95
              ${
                isEnd
                  ? "opacity-50 cursor-not-allowed bg-gradient-to-br from-gray-300 to-gray-400 border-gray-300 text-gray-600"
                  : "cursor-pointer hover:from-yellow-300 hover:to-yellow-400 hover:border-yellow-300"
              }
            `}
          >
            <FaChevronLeft />
          </button>
        </div>
      </div>

      <div className="relative w-full mx-auto px-5">
        <Swiper
          onSwiper={setSwiper}
          className="categories_swipper"
          spaceBetween={50}
          slidesPerView={3}
          style={{ direction: "rtl" }}
          autoplay={{
            delay: 5000,
            stopOnLastSlide: false,
          }}
          onSlideChange={(swiperInstance) => {
            setIsBeginning(swiperInstance.isBeginning);
            setIsEnd(swiperInstance.isEnd);
          }}
          modules={[Autoplay]}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            550: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {teachers?.map((item) => (
            <SwiperSlide
              key={item?.teacher_id}
              onClick={() =>
                navigate(`/offer-lesson/teacher/${item?.teacher_id}`)
              }
            >
              <TeacherCard
                key={item.teacher_id}
                item={item}
                navigate={navigate}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TeachersTeam;
