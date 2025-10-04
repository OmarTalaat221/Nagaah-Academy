import React from "react";
import { Tour } from "antd";

const TourGuide = ({ open, onClose, steps }) => {
  return (
    <>
      <button
        onClick={onClose}
        className="fixed bottom-4 left-4 z-50 bg-yellow-400 px-4 py-2 rounded text-black hover:bg-yellow-500"
      >
        ❓ ابدأ الدليل
      </button>

      <Tour 
        open={open} 
        onClose={onClose} 
        steps={steps} 
      />
    </>
  );
};

export default TourGuide;
