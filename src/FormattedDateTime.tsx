import {
  DateTimeFormat,
  DateTimeFormatterProps,
  DateTimeService,
} from "./DateTimeProvider";
import React from "react";
import { useServiceProvider } from "./ServiceProvider";

export function FormattedDateTime({ format, date }: DateTimeFormatterProps) {
  const { formatDateTime } = useServiceProvider<DateTimeService>();

  return (
    <time
      dateTime={formatDateTime({
        format: DateTimeFormat.ISO,
        date,
      })}
    >
      {formatDateTime({ format, date })}
    </time>
  );
}
