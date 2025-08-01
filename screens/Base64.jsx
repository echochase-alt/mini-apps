import { useState } from "react";
import { InputText } from "../components/InputText";
import "../styles/base64.css";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "@mui/material";
import SouthIcon from "@mui/icons-material/South";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Bubbles } from "../components/Bubbles";

export const Base64 = () => {
  const [text, setText] = useState("");
  const [decoding, setDecoding] = useState(true);
  const [decodedText, setDecodedText] = useState("");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const processInput = () => {
    if (decoding) {
      try {
        const decoded = atob(text);
        setDecodedText(decoded);
      } catch (err) {
        setError(true);
      }
    } else {
      setDecodedText(btoa(text));
    }
  };

  const switchMode = (bool) => {
    setDecodedText("");
    setDecoding(bool);
  };

  const clearInput = () => {
    setText("");
    setDecodedText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodedText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <>
      <Bubbles colour="rgba(214, 140, 153, 0.6)"></Bubbles>
      <h1 style={{ fontSize: isMobile ? "25px" : "3.2em" }}>Base64 Encoder and Decoder</h1>
      <button
        onClick={() => switchMode(true)}
        className={!decoding ? "grey" : "normal"}
      >
        Base64 Decode
      </button>
      <button
        onClick={() => switchMode(false)}
        className={decoding ? "grey" : "normal"}
      >
        Base64 Encode
      </button>
      {
        !isMobile &&
        <div className="center">
          <br />
        </div>
      }
      <br />
      <div className={isMobile ? "center" : "horizontal-box"}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <InputText
            text="Your input here..."
            field={text}
            setField={(e) => setText(e.target.value)}
          />
          {text && (
            <CancelIcon
              onClick={clearInput}
              style={{
                position: "absolute",
                right: "5px",
                top: "45%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "gray",
              }}
            />
          )}
        </div>
        <br />
        {isMobile ? (
          <SouthIcon fontSize="large" />
        ) : (
          <TrendingFlatIcon fontSize="large" />
        )}
        <br />
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            disabled
            className="result"
            placeholder="Result will go here..."
            value={decodedText}
          />
          {decodedText && (
            <ContentCopyIcon onClick={copyToClipboard} className="copy-icon" />
          )}
          {copied && <div className="toast">Copied!</div>}
        </div>
      </div>
      <br />
      <div className="center">
        <button onClick={processInput}>
          {decoding ? "Decode!" : "Encode!"}
        </button>
        <button
          onClick={() => navigate("/")}
          style={{ backgroundColor: "#E32636" }}
        >
          Back to Mini Apps
        </button>
      </div>
      <Modal open={error} onClose={() => setError(false)}>
        <div className="modal">
          <div className="center">
            <h2>Invalid string!</h2>
            <p>String to be decoded was not correctly encoded!</p>
            <div className="horizontal-box">
              <button onClick={() => setError(false)}>Done</button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
