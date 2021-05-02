import {
  CocktailDto,
  CocktailsService,
  CocktailSummaryDto,
  fetchCocktail,
  fetchCocktails,
} from "../Services";
import { CollectionQuery, useAsync, useServiceProvider } from "../../Services";
import { Ingredient, mapIngredients } from "./Ingredients";

export interface Cocktail {
  name?: string;
  image?: string;
  id?: string;
  ingredients: Ingredient[];
  tags: string[];
  instructions?: string;
}

export function cocktailMapper(e: CocktailDto): Cocktail {
  return {
    id: e.idDrink,
    name: e.strDrink,
    image: e.strDrinkThumb,
    ingredients: mapIngredients(e),
    tags: (e.strTags || "").split(","),
    instructions: e.strInstructions,
  };
}

export function useCocktailsQuery(query: CollectionQuery) {
  const { cocktailsDb } = useServiceProvider<CocktailsService>();

  return useAsync(
    () =>
      fetchCocktails(cocktailsDb, query)
        .then((res) =>
          res.drinks.map((c: CocktailSummaryDto) =>
            fetchCocktail(cocktailsDb, c.idDrink).then(
              (drink) => drink.drinks[0]
            )
          )
        )
        .then((res) => Promise.all(res))
        .then((res) => res.map(cocktailMapper)),
    [query]
  );
}
