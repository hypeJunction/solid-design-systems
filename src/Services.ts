import { Container, ServiceFactoryFn, ServiceFactoryMap } from "./Container";
import {
  DateTimeFormatterConfig,
  DateTimeService,
  dateTimeService,
} from "./DateTime/Services";

const config = {
  dateTimeFormatter: {
    preferredTimeFormat: "HH:mm:ss",
  } as DateTimeFormatterConfig,
};

export interface ConfigService extends ServiceFactoryMap {
  config: ServiceFactoryFn<typeof config>;
}

export type Services = ConfigService & DateTimeService;

export const services: Services = {
  config: () => config,
  formatDateTime: (c: Container<Services>) =>
    dateTimeService(c.config.dateTimeFormatter),
};
