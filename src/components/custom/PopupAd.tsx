import React, { useState, useEffect } from "react";
import pr1 from "../../assets/pr2.png";
import pr2 from "../../assets/qr1.png";
import "../../style/popupAd.scss";

const PopupAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("popupAdSeen");
    if (!hasSeenPopup) {
      const images = [pr1, pr2];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setSelectedImage(randomImage);
      setIsVisible(true);
      sessionStorage.setItem("popupAdSeen", "true");
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="popup-ad-overlay" onClick={handleClose}>
      <div className="popup-ad" onClick={(e) => e.stopPropagation()}>
        <button className="popup-ad__close" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <img src={selectedImage} alt="Quảng cáo" className="popup-ad__image" />
      </div>
    </div>
  );
};

export default PopupAd;
