import React, { useState, useEffect } from "react";
import "./DiamondCounter.css";

const DiamondCounter = ({ areModalsOpen = false }) => {
  const [currentDiamonds, setCurrentDiamonds] = useState(0);
  const [previousDiamonds, setPreviousDiamonds] = useState(0);
  const [increaseAmount, setIncreaseAmount] = useState(0);
  const [decreaseAmount, setDecreaseAmount] = useState(0);
  const [showIncrease, setShowIncrease] = useState(false);
  const [showDecrease, setShowDecrease] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const getUserData = () => {
    const localData = localStorage.getItem("NagahUser");
    if (!localData) return null;

    try {
      return JSON.parse(localData);
    } catch (error) {
      console.error("Error parsing NagahUser data:", error);
      return null;
    }
  };

  useEffect(() => {
    const updateDiamondCount = () => {
      const userData = getUserData();
      if (userData && userData.diamond !== undefined) {
        const newCount = parseInt(userData.diamond) || 0;

        if (currentDiamonds !== newCount) {
          if (!areModalsOpen) {
            if (currentDiamonds > 0 && newCount > currentDiamonds) {
              const increase = newCount - currentDiamonds;
              setIncreaseAmount(increase);
              setShowIncrease(true);
              setIsUpdated(true);

              setTimeout(() => {
                setShowIncrease(false);
              }, 3000);

              setTimeout(() => {
                setIsUpdated(false);
              }, 600);
            }

            if (currentDiamonds > 0 && newCount < currentDiamonds) {
              const decrease = currentDiamonds - newCount;
              setDecreaseAmount(decrease);
              setShowDecrease(true);
              setIsUpdated(true);

              setTimeout(() => {
                setShowDecrease(false);
              }, 3000);

              setTimeout(() => {
                setIsUpdated(false);
              }, 600);
            }
          }

          setPreviousDiamonds(currentDiamonds);
          setCurrentDiamonds(newCount);
        }
      }
    };

    updateDiamondCount();

    const interval = setInterval(updateDiamondCount, 2000);

    return () => clearInterval(interval);
  }, [currentDiamonds, areModalsOpen]);

  useEffect(() => {
    if (areModalsOpen) {
      setShowIncrease(false);
      setShowDecrease(false);
      setIsUpdated(false);
    }
  }, [areModalsOpen]);

  if (!getUserData()) return null;

  return (
    <>
      <div className="ml-4 mr-2 flex items-center lg:ml-6 lg:mr-4">
        <div
          className={`
            diamond-display relative flex items-center justify-center gap-2 min-w-[80px] px-4 py-2 
            bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 
            border-2 border-yellow-400 rounded-full shadow-lg backdrop-blur-sm cursor-pointer
            transition-all duration-300 ease-in-out
            hover:-translate-y-0.5 hover:shadow-xl
            md:min-w-[70px] md:px-3 md:py-1.5
            sm:min-w-[60px] sm:px-2.5 sm:py-1 sm:gap-1.5
            ${isUpdated && !areModalsOpen ? "updated" : ""}
          `}
          style={{
            boxShadow:
              "0 4px 12px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Diamond Icon */}
          <div className="diamond-icon text-lg md:text-base sm:text-sm">💎</div>

          {/* Diamond Count */}
          <span className="text-base font-bold text-gray-800 min-w-[20px] text-center md:text-sm sm:text-xs">
            {currentDiamonds}
          </span>

          {/* Increase Animation - Only show when modals are closed */}
          {showIncrease && !areModalsOpen && (
            <div
              className={`
                diamond-increase absolute -top-4 -right-2 z-10
                px-2 py-1 bg-gradient-to-r from-green-400 to-green-500 
                text-white text-xs font-bold rounded-full shadow-lg border-2 border-white/40
                md:text-[11px] md:px-1.5 md:py-0.5
                sm:text-[10px] sm:px-1 sm:py-0.5
              `}
              style={{
                boxShadow:
                  "0 4px 8px rgba(0, 255, 136, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.4)",
              }}
            >
              +{increaseAmount}
            </div>
          )}

          {/* Decrease Animation - Only show when modals are closed */}
          {showDecrease && !areModalsOpen && (
            <div
              className={`
                diamond-decrease absolute -top-4 -right-2 z-10
                px-2 py-1 bg-gradient-to-r from-red-400 to-red-500 
                text-white text-xs font-bold rounded-full shadow-lg border-2 border-white/40
                md:text-[11px] md:px-1.5 md:py-0.5
                sm:text-[10px] sm:px-1 sm:py-0.5
              `}
              style={{
                boxShadow:
                  "0 4px 8px rgba(255, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.4)",
              }}
            >
              -{decreaseAmount}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{``}</style>
    </>
  );
};

export default DiamondCounter;
