import React from "react";
import { Cocktail } from "../Controllers";
import { CocktailCard } from "./CocktailCard";

export function CocktailList({ items }: { items: Array<Cocktail> }) {
  return (
    <div className="columns is-multiline">
      {items.map((item) => (
        <div key={item.id} className="column is-one-quarter is-flex is-flex-direction-column">
          <CocktailCard cocktail={item} />
        </div>
      ))}
    </div>
  );
}
