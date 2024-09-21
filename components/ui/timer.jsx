"use client"; 

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"; 

export function Timer() {
  const [time, setTime] = useState(30 * 60);
  const [isActive, setIsActive] = useState(false);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  return (
    <div>
      <h1>{formatTime(time)}</h1>
      <Button variant="default" size="sm" onClick={startTimer}>
        Start
      </Button>
      <Button variant="secondary" size="sm" onClick={pauseTimer}>
        Pause
        </Button>
    </div>
  );
}
