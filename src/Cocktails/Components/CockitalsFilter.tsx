import { Filters } from "../../Query";
import React from "react";

export function CocktailsFilter({
                                  filters,
                                  onChange
                                }: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const categories = ["Cocktail", "Ordinary Drink", "Shot"];

  return (
    <div className="tabs">
      <ul>
        {categories.map((c) => {
          return (
            <li className={filters.c === c ? "is-active" : ""} key={c}>
              <a
                onClick={() => onChange({ c })}
              >
                {c}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
