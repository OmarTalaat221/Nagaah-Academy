import React, { useState, useEffect } from "react";
import "./DiamondRewardModal.css";

const DiamondRewardModal = ({ show, onClose, diamondsEarned }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl =
    "https://camp-coding.online/Teacher_App_2025/Nagah_kw/admin/images/411312354_1758972608item_img.jpeg";

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    img.src = imageUrl;
  }, []);

  if (!show) return null;

  return (
    <div className="simple-modal-overlay" onClick={onClose}>
      <div
        className="simple-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="simple-loading">
            <div className="simple-spinner"></div>
          </div>
        )}

        {/* Error State */}
        {imageError && (
          <div className="simple-error">
            <div className="simple-diamond-icon">💎</div>
          </div>
        )}

        {/* Main Content */}
        {imageLoaded && (
          <>
            <div className="simple-image-container">
              <img
                src={imageUrl}
                alt="Diamond Reward"
                className="simple-reward-image"
              />
              <div className="simple-count-badge">+{diamondsEarned}</div>
            </div>

            <div className="simple-text-container">
              <h2 className="simple-congratulations">مبروك!</h2>
              <p className="simple-message">
                لقد حصلت على {diamondsEarned} ماسة جديدة
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiamondRewardModal;
