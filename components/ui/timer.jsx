"use client"; 

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"; 

export function Timer() {
  const [time, setTime] = useState(30 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); 

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
      setIsBlurred(false);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
      setIsBlurred(true);
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
    <div className="relative">
      {isBlurred && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
        <h1 className="text-bold text-center text-5xl text-white">Welcome to Interview Prep</h1>
    </div>
    )}

    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white p-4 rounded-md shadow-lg border border-gray-400">
      <h1 className="text-xl font-bold text-center">{formatTime(time)}</h1>
      <div className="mt-2 space-x-2">
        <Button variant="default" size="sm" onClick={startTimer}>
          Start
        </Button>
        <Button variant="secondary" size="sm" onClick={pauseTimer}>
          Pause
        </Button>
      </div>
    </div>
    </div>

  );
}
