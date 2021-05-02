import {
  ApiClient,
  buildUrl,
  CollectionQuery,
  Identity,
  ServiceFactoryFn,
  ServiceFactoryMap,
} from "../../Services";

export type CocktailsDb = ApiClient;

export interface CocktailsService extends ServiceFactoryMap {
  cocktailsDb: ServiceFactoryFn<CocktailsDb>;
}

export interface CocktailSummaryDto {
  strDrink: string;
  strDrinkThumb: string;
  idDrink: string;
}

export interface CocktailDto {
  idDrink?: string;
  strDrink?: string;
  strDrinkAlternate?: string;
  strTags?: string;
  strVideo?: string;
  strCategory?: string;
  strIBA?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  strInstructionsES?: string;
  strInstructionsDE?: string;
  strInstructionsFR?: string;
  strInstructionsIT?: string;
  "strInstructionsZH-HANS"?: string;
  "strInstructionsZH-HANT"?: string;
  strDrinkThumb?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strImageSource?: string;
  strImageAttribution?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;

  [key: string]: any;
}

export interface CategoryDto {
  strCategory: string;
}

export const fetchCocktails = (
  client: ApiClient,
  query: CollectionQuery,
  identity?: Identity
): Promise<{ drinks: Array<CocktailSummaryDto> }> => {
  return client.get(
    buildUrl(client.baseUrl, "/v1/1/filter.php", { ...query.filters }),
    {
      bearerToken: identity?.bearerToken,
    }
  );
};

export const fetchCategories = (
  client: ApiClient,
  identity?: Identity
): Promise<{ drinks: Array<CategoryDto> }> => {
  return client.get(buildUrl(client.baseUrl, "/v1/1/list.php", { c: "list" }), {
    bearerToken: identity?.bearerToken,
  });
};

export const fetchCocktail = (
  client: ApiClient,
  id: string,
  identity?: Identity
): Promise<{ drinks: Array<CocktailSummaryDto> }> => {
  return client.get(buildUrl(client.baseUrl, "/v1/1/lookup.php", { i: id }), {
    bearerToken: identity?.bearerToken,
  });
};
