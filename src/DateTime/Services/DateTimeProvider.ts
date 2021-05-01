import { ServiceFactoryFn, ServiceFactoryMap } from "../../Container";

export enum DateTimeFormat {
  TIME,
  ISO,
  RELATIVE,
}

export interface DateTimeFormatterConfig {
  preferredTimeFormat: string;
}

export interface DateTimeFormatterProps {
  format: DateTimeFormat;
  date: Date;
}

export interface DateTimeService extends ServiceFactoryMap {
  formatDateTime: ServiceFactoryFn<DateTimeFormatter>;
}

export type DateTimeFormatterFactory = (
  config: DateTimeFormatterConfig
) => DateTimeFormatter;

export type DateTimeFormatter = (props: DateTimeFormatterProps) => string;
