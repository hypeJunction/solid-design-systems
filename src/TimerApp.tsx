import React, { useEffect, useState } from "react";
import { DateTimeFormat } from "./DateTimeProvider";
import { FormattedDateTime } from "./FormattedDateTime";
import { ServiceProvider } from "./ServiceProvider";
import { Services, services } from "./Services";

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

export function TimerApp() {
  const { time } = useTimer();

  return (
    <ServiceProvider<Services> services={services}>
      <FormattedDateTime format={DateTimeFormat.TIME} date={time} />
    </ServiceProvider>
  );
}
