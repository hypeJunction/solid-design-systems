import { CocktailDto, CocktailsService, fetchCocktails } from "../Services";
import { CollectionQuery, useQueryBuilder } from "../../Query";
import { useServiceProvider } from "../../Container";
import { Async, AsyncError, AsyncLoading, AsyncRefreshing, AsyncResult, transform, useSelector } from "../../Async";
import { CocktailList, CocktailsFilter } from "../Components";
import React from "react";

export interface Cocktail {
  name: string;
  image: string;
  id: string;
}

export function cocktailMapper(e: CocktailDto): Cocktail {
  return {
    id: e.idDrink,
    name: e.strDrink,
    image: e.strDrinkThumb
  };
}

export function useCocktails(query: CollectionQuery) {
  const { cocktailsDb } = useServiceProvider<CocktailsService>();

  return useSelector(
    () =>
      transform(fetchCocktails(cocktailsDb, query), (res) =>
        res.drinks.map(cocktailMapper)
      ),
    [query]
  );
}

export function CocktailsController() {
  const { query, setFilters } = useQueryBuilder({
    filters: {
      c: "Cocktail"
    }
  });

  const selector = useCocktails(query);

  return (
    <>
      <CocktailsFilter filters={query.filters} onChange={setFilters} />

      <Async selector={selector}>
        <AsyncLoading>
          <div className="progress">
            <span className="progress-bar" />
            <span className="is-hidden" aria-hidden="true">Loading...</span>
          </div>
        </AsyncLoading>
        <AsyncRefreshing>
          <div className="progress">
            <span className="progress-bar" />
          </div>
        </AsyncRefreshing>
        <AsyncError>{(state) => state.error.message}</AsyncError>
        <AsyncResult>
          {(state) => (
            <>
              <CocktailList items={state.result} />
            </>
          )}
        </AsyncResult>
      </Async>
    </>
  );
}
