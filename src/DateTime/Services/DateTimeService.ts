import moment from "moment";
import {
  DateTimeFormat,
  DateTimeFormatter,
  DateTimeFormatterConfig,
  DateTimeFormatterFactory,
  DateTimeFormatterProps,
} from "./DateTimeProvider";

const momentFormats = {
  [DateTimeFormat.TIME]: (
    date: Date,
    config: DateTimeFormatterConfig
  ): string => {
    return moment(date).format(config.preferredTimeFormat);
  },
  [DateTimeFormat.ISO]: (date: Date): string => {
    return date.toISOString();
  },
  [DateTimeFormat.RELATIVE]: (date: Date): string => {
    return moment(date).fromNow();
  },
};

const momentFormatter: DateTimeFormatterFactory = (
  config: DateTimeFormatterConfig
): DateTimeFormatter => (props: DateTimeFormatterProps): string => {
  const { format, date } = props;

  return momentFormats[format](date, config);
};

export { momentFormatter as dateTimeService };
