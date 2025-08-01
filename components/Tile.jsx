import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

export const Tile = ({ title, link, description, logo }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleGlobalTouch = () => setHover(false);

    if (hover) {
      document.addEventListener("touchstart", handleGlobalTouch);
    }

    return () => {
      document.removeEventListener("touchstart", handleGlobalTouch);
    };
  }, [hover]);

  return (
    <div
      className="tile"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onTouchMove={() => setHover(false)}
      onClick={() => navigate(link)}
    >
      {hover ? (
        <>
          <b className="tile-title">{title}</b>
          <div>{description}</div>
        </>
      ) : (
        <div className={logo}></div>
      )}
    </div>
  );
};
