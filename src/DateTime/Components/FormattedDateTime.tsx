import { DateTimeFormatterProps, DateTimeService } from "../Services";
import React from "react";
import { useServiceProvider } from "../../Container";

export function FormattedDateTime({ format, date }: DateTimeFormatterProps) {
  const { formatDateTime } = useServiceProvider<DateTimeService>();

  return <time>{formatDateTime({ format, date })}</time>;
}
