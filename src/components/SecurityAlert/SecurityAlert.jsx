import React, { useEffect, useState } from "react";

const SecurityAlert = ({ show, visible, onTimeout, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds

  useEffect(() => {
    if (!show) {
      setTimeLeft(60); // Reset timer when show becomes false
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout(); // This will trigger security logout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, onTimeout]);

  const handleClose = () => {
    console.log(
      `Alert closed manually, ${timeLeft} seconds remaining until logout`
    );
    onClose(); // This only hides the visual alert
  };

  // Don't render if show is false OR if visible is false
  if (!show || !visible) return null;

  return (
    <div className="fixed top-5 right-5 z-[10001] animate-in slide-in-from-right-full duration-500">
      <div
        className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl shadow-2xl max-w-sm border border-red-400/20 backdrop-blur-sm cursor-pointer hover:shadow-red-500/30 transition-all duration-300 hover:scale-[1.02]"
        onClick={handleClose}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="text-2xl mb-2 text-center">⚠️</div>

        {/* Content */}
        <div className="text-center">
          <div className="font-bold text-base mb-2">تحذير أمني</div>
          <div className="text-sm leading-relaxed mb-3">
            تم تسجيل دخولك من جهاز أخر يرجي تسجيل الدخول مجددا
          </div>
          <div className="text-xs opacity-90 mb-3">
            سيتم إعادة التوجيه خلال {timeLeft} ثانية
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>

        {/* Click hint */}
        <div className="text-xs text-center mt-2 opacity-70">
          اضغط للإخفاء (سيستمر العد التنازلي)
        </div>
      </div>
    </div>
  );
};

export default SecurityAlert;
