import React, { useState, useEffect } from "react";
import "./DiamondRewardModal.css";

const TreasureRewardModal = ({ show, onClose }) => {
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

  const handleWhatsAppContact = () => {
    const phoneNumber = "96566654045";

    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    window.open(whatsappUrl, "_blank");
  };

  if (!show) return null;

  return (
    <div className="simple-modal-overlay" onClick={onClose}>
      <div
        className="simple-modal-content treasure-content"
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
            <div className="simple-treasure-icon">🏆</div>
          </div>
        )}

        {/* Main Content */}
        {imageLoaded && (
          <>
            <div className="simple-image-container">
              <img
                src={imageUrl}
                alt="Treasure Reward"
                className="simple-reward-image treasure-image"
              />
              <div className="simple-treasure-badge">كنز!</div>
            </div>

            <div className="simple-text-container">
              <h2 className="simple-congratulations treasure-title">
                إنجاز رائع!
              </h2>
              <p className="simple-message">
                لقد حصلت على 10 ماسات وفزت بكنز ثمين!
              </p>
              <p className="simple-bonus-text">
                🎁 اشتراك مجاني لمدة شهر في أي مادة 🎁
              </p>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="treasure-contact-section">
              <button
                className="whatsapp-contact-btn"
                onClick={handleWhatsAppContact}
              >
                {/* <span className="whatsapp-icon">📱</span> */}
                تواصل معنا
                {/* <span className="phone-number">+965 6665 4045</span> */}
              </button>

              <button className="simple-close-btn" onClick={onClose}>
                إغلاق
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TreasureRewardModal;
