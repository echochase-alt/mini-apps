import { useState } from "react";
import { loremIpsum } from "lorem-ipsum";
import { useNavigate } from "react-router-dom";
import { Bubbles } from "../components/Bubbles";
import "../styles/lorem-ipsum.css";
import "../styles/common.css";
import { TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const LoremIpsumGenerator = () => {
  const [numParagraphs, setNumParagraphs] = useState(3);
  const [generated, setGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleParagraphChange = (num) => {
    const parsedNum = parseInt(num, 10) || 0;
    if (parsedNum > 25) {
      setNumParagraphs(25);
    } else if (parsedNum < 1) {
      setNumParagraphs(1);
    } else {
      setNumParagraphs(parsedNum);
    }
  };
  
  const generateText = () => {
    setGenerated(true);
    const text = loremIpsum({ count: numParagraphs, units: "paragraphs" });
    setGeneratedText(text);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="center">
      <Bubbles colour="rgb(201, 231, 231)"></Bubbles>
      <div>
        <h1>Lorem Ipsum Generator</h1>
        <div className="center">
          <div className="horizontal-box">
            <p>Number of paragraphs to generate:</p>
            <TextField
              className="num-para"
              placeholder="--"
              type="number"
              value={numParagraphs}
              onChange={(e) => handleParagraphChange(Number(e.target.value))}
              variant="standard"
              sx={{
                margin: 1,
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "white",
                },
                "& .MuiInput-underline:after": { borderBottomColor: "white" },
                "& .MuiInputBase-input": {
                  color: "white",
                  textAlign: "center",
                  "&::placeholder": { color: "white", opacity: 0.5, textAlign: "center" },
                },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiInputLabel-root.Mui-focused": { color: "white" },
              }}
            />
          </div>
          <button onClick={generateText}>Generate</button>
        </div>
        <br />
        <div className="text-box">
          {generated && (
            <ContentCopyIcon onClick={copyToClipboard} className="copy-icon" />
          )}
          {generatedText || "Click generate to create placeholder text..."}
        </div>
      </div>
      {copied && <div className="toast">Copied!</div>}
      <br />
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
    </div>
  );
};
