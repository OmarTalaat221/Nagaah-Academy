import React, { useState } from "react";

export const TeacherCard = ({ item, navigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer transform transition-all duration-500 hover:scale-100 "
      onClick={() => navigate(`/offer-lesson/teacher/${item?.teacher_id}`)}
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
        style={{
          background:
            "linear-gradient(#3b003b, #3b003b) padding-box, linear-gradient(45deg, #ffd700, #ffed4e, #ffd700) border-box",
          border: "3px solid transparent",
          minHeight: "270px",
        }}
      >
        {/* Animated border glow effect */}
        <div
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
          style={{
            background: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
            filter: "blur(8px)",
            transform: "scale(1.05)",
          }}
        />

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />

        {/* Content container */}
        <div className="relative z-10 flex flex-col justify-center items-center p-8 h-full">
          {/* Decorative elements */}
          <div
            className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: "#ffd700" }}
          />
          <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-300/60 rounded-full animate-ping" />
          <div className="absolute bottom-6 left-4 w-4 h-4 bg-yellow-500/30 rounded-full animate-bounce" />

          {/* Profile Image Container */}
          <div className="relative mb-6 group/image">
            <div
              className="relative w-40 h-40 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-110"
              style={{
                border: "4px solid #ffd700",
                boxShadow: isHovered
                  ? "0 0 30px rgba(255, 215, 0, 0.5)"
                  : "0 0 15px rgba(255, 215, 0, 0.2)",
              }}
            >
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                src={
                  item?.teacher_img ||
                  "https://res.cloudinary.com/dnt8gmwab/image/upload/v1747899746/Untitled_600_x_550_px_1_wzfntq.png"
                }
                alt={item?.teacher_name}
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Floating badge */}
            <div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-purple-900 shadow-lg animate-bounce border-2 border-white"
              style={{ backgroundColor: "#ffd700" }}
            >
              ★
            </div>

            {/* Orbital rings */}
            <div
              className="absolute inset-0 rounded-full border border-yellow-400/30 animate-pulse"
              style={{ transform: "scale(1.2)" }}
            />
            <div
              className="absolute inset-0 rounded-full border border-yellow-400/20 animate-pulse"
              style={{ transform: "scale(1.4)", animationDelay: "0.5s" }}
            />
          </div>

          {/* Teacher Information */}
          <div className="text-center space-y-4 w-full">
            {/* Name */}
            <h4
              className="text-xl font-bold transition-all duration-300 group-hover:scale-105"
              style={{ color: "#ffd700" }}
            >
              {item?.teacher_name}
            </h4>

            {/* Experience Badge */}
            <div
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105 border"
              style={{
                backgroundColor: "rgba(255, 215, 0, 0.1)",
                color: "#ffd700",
                borderColor: "#ffd700",
              }}
            >
              <span className="ml-2 lg:text-base text-sm animate-bounce">
                📚
              </span>
              {item.experience}
            </div>

            {/* Rating Stars */}
            {/* <div className="flex justify-center items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <span
                    key={index}
                    className="text-lg transition-all duration-300 hover:scale-125 cursor-pointer animate-pulse"
                    style={{
                      color: "#ffd700",
                      animationDelay: `${index * 0.1}s`,
                      filter: "drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))",
                    }}
                  >
                    ⭐
                  </span>
                ))}
            </div> */}
          </div>

          <div
            className="absolute top-12 left-8 w-1 h-1 bg-yellow-400/40 rounded-full animate-ping"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-20 right-16 w-1 h-1 bg-yellow-500/30 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        {/* Corner decorations */}
        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-20"
          style={{
            background: "linear-gradient(225deg, #ffd700 0%, transparent 70%)",
            clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-12 h-12 opacity-15"
          style={{
            background: "linear-gradient(45deg, #ffd700 0%, transparent 70%)",
            clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
          }}
        />
      </div>
    </div>
  );
};
