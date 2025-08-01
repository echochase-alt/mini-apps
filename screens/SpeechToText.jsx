import React from "react";
import MicrophoneButton from "../components/MicrophoneButton";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "../styles/microphone-button.css";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";

export const SpeechToText = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();
  const navigate = useNavigate();
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const onClearTranscript = () => {
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser doesn't support speech recognition.</p>;
  }

  return (
    <div className="center">
      <Bubbles colour={listening ? "#cc8c81" : "#6b89cf"}></Bubbles>
      <h1>Speech to Text</h1>
      <h3>Click the microphone to record. Click again to stop.</h3>
      <p>
        Talk clearly into the mic! You can copy and paste your speech when it's
        generated.
      </p>
      <p>
        Note this app doesn't work on iOS/Safari.
      </p>
      <MicrophoneButton onClick={toggleListening} listening={listening} />
      <button
        className="clear-transcript-button"
        onClick={onClearTranscript}
        aria-label="Clear transcript"
      >
        Clear
      </button>
      {transcript && (
        <>
          <p className="transcript">{transcript}
            
          <ContentCopyIcon onClick={copyToClipboard} className="copy-speech" />
          </p>
        </>
      )}
      <h3>
        Powered by{" "}
        <a href="https://www.npmjs.com/package/react-speech-recognition">
          React Speech Recognition
        </a>{" "}
        (Check them out on{" "}
        <a href="https://github.com/JamesBrill/react-speech-recognition">
          GitHub
        </a>
        )
      </h3>
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
        className="menu-button"
      >
        Back to Mini Apps
      </button>
    </div>
  );
};
