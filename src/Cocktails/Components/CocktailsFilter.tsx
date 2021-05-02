import { Filters } from "../../Services";
import React from "react";
import { Category } from "../Adapters/Categories";

export function CocktailsFilter({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  return (
    <div className="menu">
      <ul className="menu-list">
        {categories.map((c) => {
          return (
            <li key={c.id}>
              <a
                className={filters.c === c.name ? "is-active" : ""}
                onClick={() => onChange({ c: c.name })}
              >
                {c.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
