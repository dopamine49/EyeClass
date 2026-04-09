import React, { useEffect, useMemo, useState } from 'react';

function toTimeParts(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function FlashSaleTimer({ targetDate }) {
  const deadline = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [secondsLeft, setSecondsLeft] = useState(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));

  useEffect(() => {
    const timer = setInterval(() => {
      const next = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setSecondsLeft(next);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const { days, hours, minutes, seconds } = toTimeParts(secondsLeft);

  return (
    <div className="flash-timer" role="status" aria-live="polite">
      <span>Flash sale kết thúc sau</span>
      <div className="timer-grid">
        <strong>{String(days).padStart(2, '0')}d</strong>
        <strong>{String(hours).padStart(2, '0')}h</strong>
        <strong>{String(minutes).padStart(2, '0')}m</strong>
        <strong>{String(seconds).padStart(2, '0')}s</strong>
      </div>
    </div>
  );
}

export default FlashSaleTimer;
