import { Container, ServiceFactoryFn, ServiceFactoryMap } from "./ServiceProvider";
import { DateTimeFormatterConfig, DateTimeService } from "./DateTimeProvider";
import { dateTimeService } from "./DateTimeService";
import { ApiClient, sendHttpRequest } from "./HttpTransport";
import { CocktailsService } from "./CocktailsApp";

const config = {
  dateTimeFormatter: {
    preferredTimeFormat: "HH:mm:ss"
  } as DateTimeFormatterConfig,
  cocktailsDbBaseUrl: process.env.COCKTAILS_DB_BASE_URL || "https://www.thecocktaildb.com/api/json"
};

export interface ConfigService extends ServiceFactoryMap {
  config: ServiceFactoryFn<typeof config>;
}

export type Services = ConfigService & DateTimeService & CocktailsService;

export const services: Services = {
  config: () => config,
  formatDateTime: (c: Container<Services>) => dateTimeService(c.config.dateTimeFormatter),
  cocktailsDb: (c: Container<Services>) => new ApiClient(
    c.config.cocktailsDbBaseUrl,
    sendHttpRequest
  )
};
