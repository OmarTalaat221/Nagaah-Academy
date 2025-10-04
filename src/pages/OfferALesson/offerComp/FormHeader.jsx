import React from "react";

const FormHeader = ({ title }) => {
  return (
    <h1
      className="inline-flex items-center px-4 py-2 rounded-full text-[40px] font-medium border"
      style={{
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        color: "#ffd700",
        borderColor: "#ffd700",
      }}
    >
      {title || "طلب حصه"}
    </h1>
  );
};

export default FormHeader;
