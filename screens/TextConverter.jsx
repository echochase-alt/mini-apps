import { useState } from "react";
import { InputText } from "../components/InputText";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const TextConverter = () => {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [mode, setMode] = useState("");
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();

  const changeMode = (mode) => {
    setMode(mode);
    if (mode === "upper") {
      setProcessedText(text.toUpperCase());
    }
    if (mode === "lower") {
      setProcessedText(text.toLowerCase());
    }
    if (mode === "alt") {
      setProcessedText(text
        .split("")
        .map((char, i) => (i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
        .join(""));
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(processedText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <>
      <Bubbles colour="rgba(209, 214, 140, 0.6)"></Bubbles>
      <h1>Text Converter</h1>
      <p>Enter any passage of text and convert it to upper case, lower case or alternating casing.</p>
      <InputText text="Enter text here..." field={text} setField={(e) => setText(e.target.value)} />
      <br /><br />
      <div className="horizontal-box">
        <button onClick={() => changeMode("upper")} style={{ color: mode === "upper" ? "white" : "grey", margin: "1px" }}>
          Capitalise
        </button>
        <button onClick={() => changeMode("lower")} style={{ color: mode === "lower" ? "white" : "grey", margin: "1px" }}>
          Lowercase
        </button>
        <button onClick={() => changeMode("alt")} style={{ color: mode === "alt" ? "white" : "grey", margin: "1px" }}>
          Alternate
        </button>
      </div>
      <br />
      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          disabled
          className="result"
          placeholder="Result will go here..."
          value={processedText}
        />
        <ContentCopyIcon onClick={copyToClipboard} className="copy-icon" />
        {copied && <div className="toast">Copied!</div>}
      </div>
      <br/>
      <br/>
      <div>
        <button onClick={() => navigate("/")} style={{ backgroundColor: "#E32636" }}>Back to Mini Apps</button>
      </div>
    </>
  )
}