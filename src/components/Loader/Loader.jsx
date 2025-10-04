import "./style.css";
import React from "react";

export default function Loader() {
  const text = "Nagaah";
  return (
    <div className="text-center p-8 h-[60vh] flex flex-col items-center justify-center">
      <div
        className="relative inline-block mb-6"
        style={{
          width: "80px",
          height: "80px",
          border: "4px solid rgba(255, 215, 0, 0.1)",
          borderTop: "4px solid #ffd700",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))",
        }}
      >
        <div
          className="absolute"
          style={{
            content: '""',
            top: "-4px",
            left: "-4px",
            right: "-4px",
            bottom: "-4px",
            border: "2px solid transparent",
            borderTop: "2px solid #ffd700",
            borderRadius: "50%",
            animation: "spin 2s linear infinite reverse",
            opacity: 0.6,
          }}
        />
      </div>

      <div
        className="mb-2"
        style={{
          color: "#ffd700",
          fontSize: "1.2rem",
          fontWeight: 400,
          letterSpacing: "2px",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        {text
          ?.split("")

          ?.map((letter, index) => (
            <span
              dir="rtl"
              key={index}
              className="letter-animation"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {letter}
            </span>
          ))}
      </div>

      <div
        className="dots"
        style={{
          color: "#ffd700",
          fontSize: "1.5rem",
        }}
      >
        <span style={{ animation: "dots 1.5s steps(4) infinite" }}>...</span>
      </div>
    </div>
  );
}
