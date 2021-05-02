import { Container, ServiceFactoryFn, ServiceFactoryMap } from "../Services";
import { ApiClient, send } from "../Services/Http";
import { CocktailsDb, CocktailsService } from "../Cocktails/Services";

const config = {
  cocktailsDbBaseUrl:
    process.env.COCKTAILS_DB_BASE_URL ||
    "https://www.thecocktaildb.com/api/json",
};

export interface ConfigService extends ServiceFactoryMap {
  config: ServiceFactoryFn<typeof config>;
}

export type Services = ConfigService & CocktailsService;

export const services: Services = {
  config: () => config,
  cocktailsDb: (c: Container<Services>) =>
    new ApiClient(c.config.cocktailsDbBaseUrl, send) as CocktailsDb,
};
