import React from "react";
import { FormattedDateTime } from "./DateTime/Components";
import { ServiceProvider } from "./Container";
import { Services, services } from "./Services";
import { DateTimeFormat, useTimer } from "./DateTime/Services";
import "./App.css";

export const now = () => new Date();

export function App() {
  const { time } = useTimer();

  return (
    <div className="app">
      <ServiceProvider<Services> services={services}>
        <FormattedDateTime format={DateTimeFormat.TIME} date={time} />
      </ServiceProvider>
    </div>
  );
}
