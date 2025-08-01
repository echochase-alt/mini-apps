import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/date-calculator.css";
import { Bubbles } from "../components/Bubbles";

export const DateCalculator = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [generated, setGenerated] = useState(false);
  const [dateDifference, setDateDifference] = useState("");
  const [arithmetic, setArithmetic] = useState(false);
  const [days, setDays] = useState("");
  const [result, setResult] = useState("");
  const [direction, setDirection] = useState("after");
  const isMobile = useMediaQuery("(max-width:600px)");

  const navigate = useNavigate();

  const switchMode = (bool) => {
    setGenerated(false);
    setArithmetic(bool);
  };

  const calculateDate = () => {
    if (!arithmetic) {
      if (startDate === "" || endDate === "") return;
      setGenerated(true);
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      setDateDifference(
        Math.abs(Math.floor((ed - sd) / (1000 * 60 * 60 * 24)))
      );
      return;
    }
    if (selectedDate === "" || days === "") return;
    setGenerated(true);
    const sd = new Date(selectedDate);
    const addition = direction === "after" ? Number(days) : -Number(days);
    sd.setDate(sd.getDate() + addition);
    setResult(sd.toDateString());
  };

  return (
    <>
      <Bubbles colour="rgb(223, 155, 210)"></Bubbles>
      <h1 style={{ fontSize: isMobile ? "35px" : "3.2em" }}>Date Calculator</h1>
      <div className={isMobile ? "center" : "horizontal-box"}>
        <button
          onClick={() => switchMode(false)}
          className={arithmetic ? "grey" : "normal"}
        >
          Date Difference Calculator
        </button>
        <button
          onClick={() => switchMode(true)}
          className={!arithmetic ? "grey" : "normal"}
        >
          Date Arithmetic Calculator
        </button>
      </div>
      {arithmetic ? (
        <div key="arithmetic" className="horizontal-box">
          <h2>Calculate the date</h2>
          <TextField
            id="days-box"
            placeholder="--"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
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
                "&::placeholder": { color: "white", opacity: 0.5 },
              },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiInputLabel-root.Mui-focused": { color: "white" },
            }}
          />

          <h2>days</h2>
          <div className="horizontal-box">
            <FormControl className="custom-select" sx={{ margin: 1 }}>
              <InputLabel id="direction-label">{direction}</InputLabel>
              <Select
                labelId="direction-label"
                id="direction-select"
                value={direction}
                label="Direction"
                onChange={(e) => setDirection(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderColor: "white",
                  },
                }}
              >
                <MenuItem value="before">Before</MenuItem>
                <MenuItem value="after">After</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="date"
              value={selectedDate}
              label={isMobile && "date"}
              onChange={(e) => setSelectedDate(e.target.value)}
              variant="outlined"
              sx={{
                margin: 1,
                minWidth: isMobile ? "100px" : "150px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                  right: 0,
                  textAlign: "center"
                },
              }}
            />
          </div>
        </div>
      ) : (
        <div
          key="difference"
          className={isMobile ? "center" : "horizontal-box"}
        >
          <div style={{ margin: "10px 0" }}>
            Find the number of days between
          </div>
          <div className={isMobile ? "center" : "horizontal-box"}>
            <TextField
              type="date"
              value={startDate}
              label={isMobile && "start"}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              sx={{
                margin: 1,
                minWidth: isMobile ? "100px" : "150px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": {
                  color: "white",
                  right: 0,
                  textAlign: "center"
                },
              }}
            />
            <div>and</div>
            <TextField
              type="date"
              value={endDate}
              label={isMobile && "end"}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              sx={{
                margin: 1,
                minWidth: isMobile ? "100px" : "150px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": {
                  color: "white",
                  right: 0,
                  textAlign: "center"
                },
              }}
            />
          </div>
        </div>
      )}
      {generated &&
        (arithmetic ? (
          <h1>{result}</h1>
        ) : (
          <h1>
            {dateDifference} Day{dateDifference !== 1 && "s"}
          </h1>
        ))}
      <div>
        <button onClick={calculateDate}>Go!</button>
      </div>
      <button
        onClick={() => navigate("/")}
        style={{ backgroundColor: "#E32636" }}
      >
        Back to Mini Apps
      </button>
    </>
  );
};
