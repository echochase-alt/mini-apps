import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/timer.css";
import { Bubbles } from "../components/Bubbles";

export const Timer = () => {
  const [initialTime, setInitialTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [edit, setEdit] = useState(false);
  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const [millisecs, setMillisecs] = useState(0);
  const [zeroError, setZeroError] = useState(false);

  const navigate = useNavigate();
  
  const startTimeRef = useRef(null);
  const remainingTimeRef = useRef(timeLeft);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - (initialTime - remainingTimeRef.current) * 1000;
      timerRef.current = requestAnimationFrame(updateTimer);
    } else {
      cancelAnimationFrame(timerRef.current);
    }
    return () => cancelAnimationFrame(timerRef.current);
  }, [isRunning]);

  const updateTimer = () => {
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    const newTimeLeft = Math.max(initialTime - elapsedTime, 0);
    setTimeLeft(newTimeLeft);
    remainingTimeRef.current = newTimeLeft;

    if (newTimeLeft > 0) {
      timerRef.current = requestAnimationFrame(updateTimer);
    } else {
      setIsRunning(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 100);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    remainingTimeRef.current = initialTime;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const totalSeconds = Number(hrs) * 3600 + Number(mins) * 60 + Number(secs) + Number(millisecs) / 1000;
    if (totalSeconds === 0) {
      setZeroError(true);
      setTimeout(() => setZeroError(false), 2000);
      return;
    }
    setInitialTime(totalSeconds);
    setTimeLeft(totalSeconds);
    remainingTimeRef.current = totalSeconds;
    setEdit(false);
  };

  return (
    <>
      <Bubbles colour="rgba(117, 211, 156, 0.6)"></Bubbles>
      <div>
        <h1>Timer</h1>
        {edit ? (
          <form onSubmit={handleEditSubmit}>
            <div className="timer-container">
              <div className="time-units">
                <div className="time-unit">
                  <input type="number" value={hrs}
                  className="time-input" onChange={(e) => setHrs(e.target.value)} />
                  <div>Hours</div>
                </div>
                <div className="time-unit">
                  <input type="number" value={mins}
                  className="time-input" onChange={(e) => setMins(e.target.value)} />
                  <div>Minutes</div>
                </div>
                <div className="time-unit">
                  <input type="number" value={secs}
                  className="time-input" onChange={(e) => setSecs(e.target.value)} />
                  <div>Seconds</div>
                </div>
                <div className="time-unit">
                  <input type="number" value={millisecs}
                  className="time-input" onChange={(e) => setMillisecs(e.target.value)} />
                  <div>Milliseconds</div>
                </div>
              </div>
            </div>
            <br />
            <button type="submit">Done</button>
            {zeroError && <div style={{ color: "#E32636" }}>Initial time cannot be set to zero!</div>}
          </form>
        ) : (
          <div className="timer-container">
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div className="timer-buttons">
              {isRunning ? <button onClick={pauseTimer}>Pause</button> : <button onClick={startTimer}>Start</button>}
              <button onClick={resetTimer}>Reset</button>
              {!isRunning && !edit && <button onClick={() => setEdit(true)}>Edit</button>}
            </div>
          </div>
        )}
      </div>
      <br />
      <button onClick={() => navigate("/")} style={{ backgroundColor: "#E32636" }}>Back to Mini Apps</button>
    </>
  );
};
