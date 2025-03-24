'use client';

import { useEffect, useState, memo } from 'react';

interface TimerToastProps {
  timeLeft: number;
}

// Use memo to prevent unnecessary re-renders
const TimerToast = memo(function TimerToast({ timeLeft }: TimerToastProps) {
  const [visible, setVisible] = useState(true);
  const [isLowTime, setIsLowTime] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setVisible(false);
    }

    // Set urgent animation when time is running low
    setIsLowTime(timeLeft <= 10);
  }, [timeLeft]);

  if (!visible) return null;

  // Dynamic styles based on time left
  const getColorClass = () => {
    if (timeLeft <= 5) return 'bg-red-500';
    if (timeLeft <= 10) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <div
      className={`
        fixed top-5 right-5 
        ${getColorClass()} 
        text-white px-6 py-3 
        rounded-lg shadow-xl 
        text-lg font-semibold 
        transition-all duration-500
        ${isLowTime ? 'animate-bounce' : ''}
        ${isLowTime ? 'scale-110' : ''}
      `}
    >
      ⏳ Time Left: {timeLeft}s
    </div>
  );
});

export default TimerToast;
