import { useEffect, useState } from "react";

export const now = () => new Date();

export const useTimer = (): { time: Date } => {
  const [time, setTime] = useState(now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(now());
    }, 1000);

    return () => clearInterval(interval);
  });

  return { time };
};
