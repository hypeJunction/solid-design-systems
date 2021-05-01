import { Filters } from "../../Query";
import React from "react";

export function CocktailsFilter({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const categories = ["Cocktail", "Ordinary Drink", "Shot"];

  return (
    <div>
      {categories.map((c) => {
        return (
          <button
            key={c}
            onClick={() => onChange({ c })}
            disabled={filters.c === c}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
