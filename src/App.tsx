import React, { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);

  const timerRef = useRef<number | null>(null);
  const startStopButtonRef = useRef<HTMLButtonElement>(null);

  const totalTime = useMemo<number>(() => {
    return (
      history.reduce((acc, curr) => acc + curr, 0) + (isRunning ? time : 0)
    );
  }, [history, isRunning, time]);

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      timerRef.current = intervalId;
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setHistory((prevHistory) => [...prevHistory, time]);
    }
    if (startStopButtonRef.current) {
      startStopButtonRef.current.focus();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setHistory([]);
  };

  return (
    <div className="timer-container">
      <h1>Timer</h1>
      <div className="timer-display">{time} seconds</div>
      <div className="timer-buttons">
        <button ref={startStopButtonRef} onClick={handleStartStop}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <h2>History</h2>
      <ul className="history-list">
        {history.map((item, index) => (
          <li key={index}>
            Session {index + 1}: {item} seconds
          </li>
        ))}
      </ul>
      <h2>Total Time</h2>
      <div>{totalTime} seconds</div>
    </div>
  );
}

export default App;
