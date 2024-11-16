import React, { useEffect, useState } from "react";

const CountdownToEndOfDay = () => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  const getEndOfDayGMT8 = () => {
    const now = new Date();
    const endOfDayGMT8 = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    endOfDayGMT8.setUTCHours(16 + 24, 0, 0, 0); // 16:00 UTC is 12:00 AM GMT+8 the next day
    return endOfDayGMT8;
  };

  const calculateTimeDifference = (targetTime: Date) => {
    const now = new Date();
    const difference = targetTime.getTime() - now.getTime();

    if (difference <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // Format as HH:MM:SS
    const formattedTime = [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");

    return formattedTime;
  };

  useEffect(() => {
    const targetTime = getEndOfDayGMT8();

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeDifference(targetTime);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === "00:00:00") {
        // Reset to the next day when time is up
        clearInterval(timer);
        setTimeLeft(calculateTimeDifference(getEndOfDayGMT8()));
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <>
      {timeLeft}
    </>
  );
};

export default CountdownToEndOfDay;
