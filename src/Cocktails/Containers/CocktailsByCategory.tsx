import { useQueryBuilder } from "../../Container";
import { CocktailList, CocktailsFilter } from "../Components";
import React from "react";
import { Category, useCategoriesQuery } from "../Adapters/Categories";
import { Loader } from "../../App/Components/Loader";
import { useCocktailsQuery } from "../Adapters/Cocktails";

export function CocktailsByCategory() {
  const { loading, result, error } = useCategoriesQuery();

  return (
    <>
      {loading && <Loader />}
      {error && error.message}
      {result && <FilteredCocktails categories={result} />}
    </>
  );
}

export function FilteredCocktails({ categories }: { categories: Category[] }) {
  const { query, setFilters } = useQueryBuilder({
    filters: {
      c: categories[0].name,
    },
  });

  const { loading, result, error } = useCocktailsQuery(query);

  return (
    <div className="columns">
      <aside className="column is-3">
        <CocktailsFilter
          categories={categories}
          filters={query.filters}
          onChange={setFilters}
        />
      </aside>

      <div className="column">
        {loading && <Loader />}
        {error && error.message}
        {result && <CocktailList items={result} />}
      </div>
    </div>
  );
}
