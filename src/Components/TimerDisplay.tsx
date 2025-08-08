import { useEffect, useState } from 'react';

const TimerDisplay = ({ expiresAt }: { expiresAt: number }) => {
  const [timeLeft, setTimeLeft] = useState(expiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, expiresAt - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <p className="text-sm text-red-500">
      {hours}h {minutes}m {seconds}s
    </p>
  );
};

export default TimerDisplay;
