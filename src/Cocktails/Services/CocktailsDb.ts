import { ApiClient, buildUrl, Identity } from "../../Http";
import { CollectionQuery } from "../../Query";
import { ServiceFactoryFn, ServiceFactoryMap } from "../../Container";

export type CocktailsDb = ApiClient;

export interface CocktailsService extends ServiceFactoryMap {
  cocktailsDb: ServiceFactoryFn<CocktailsDb>;
}

export interface CocktailDto {
  strDrink: string;
  strDrinkThumb: string;
  idDrink: string;
}

export const fetchCocktails = (
  client: ApiClient,
  query: CollectionQuery,
  identity?: Identity
): Promise<{ drinks: Array<CocktailDto> }> => {
  return client.get(
    buildUrl(client.baseUrl, "/v1/1/filter.php", { ...query.filters }),
    {
      bearerToken: identity?.bearerToken,
    }
  );
};
