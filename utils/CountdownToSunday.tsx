import React, { useEffect, useState } from "react";

const CountdownToSunday = () => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00:00");

  const getNextSundayMidnightGMT8 = () => {
    const now = new Date();
    const currentDay = now.getUTCDay(); // Sunday is 0
    const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;

    const nextSundayGMT8 = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + daysUntilSunday
      )
    );
    nextSundayGMT8.setUTCHours(16, 0, 0, 0); // 16:00 UTC is 12:00 AM GMT+8

    if (nextSundayGMT8 <= now) {
      // If we've already passed this week's Sunday midnight, move to the next week
      nextSundayGMT8.setDate(nextSundayGMT8.getDate() + 7);
    }

    return nextSundayGMT8;
  };

  const calculateTimeDifference = (targetTime: Date) => {
    const now = new Date();
    const difference = targetTime.getTime() - now.getTime();

    if (difference <= 0) {
      return "00:00:00:00";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // Format as DD:HH:MM:SS
    const formattedTime = [
      String(days).padStart(2, "0"),
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");

    return formattedTime;
  };

  useEffect(() => {
    const targetTime = getNextSundayMidnightGMT8();

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeDifference(targetTime);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === "00:00:00:00") {
        // Reset to next Sunday when time is up
        clearInterval(timer);
        setTimeLeft(calculateTimeDifference(getNextSundayMidnightGMT8()));
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div style={{
      color: "var(--text-dim)",
    }}>{timeLeft}</div>
  );
};

export default CountdownToSunday;
