import React from "react";
import { CocktailCard } from "./CocktailCard";
import { Cocktail } from "../Adapters/Cocktails";

export function CocktailList({ items }: { items: Array<Cocktail> }) {
  return (
    <div className="columns is-multiline">
      {items.map((item) => (
        <div
          key={item.id}
          className="column is-full-mobile is-half-tablet is-one-quarter-fullhd is-flex is-flex-direction-column"
        >
          <CocktailCard cocktail={item} />
        </div>
      ))}
    </div>
  );
}
