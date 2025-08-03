import { Bubbles } from "../components/Bubbles";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const Feedback = () => {
  const navigate = useNavigate();
  return (
    <div className="center" style={{ backgroundColor: "transparent" }}>
      <Navbar />
      <Bubbles colour="rgba(173, 216, 230, 0.6)" />
      <h1 className="feedback-title">Feedback for this website</h1>
      <h3>Feel free to suggest any features or upgrades regarding this website!</h3>
      <iframe className="feedback-frame" src="https://analytics-six-chi.vercel.app/review/" />
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636", marginTop: "10px" }}
      >
        Back to Mini Apps
      </button>
    </div>
  );
};
