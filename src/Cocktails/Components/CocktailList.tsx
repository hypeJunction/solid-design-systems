import React from "react";
import { Cocktail } from "../Controllers";
import { CocktailCard } from "./CocktailCard";

export function CocktailList({ items }: { items: Array<Cocktail> }) {
  return (
    <div>
      {items.map((item) => (
        <CocktailCard key={item.id} cocktail={item} />
      ))}
    </div>
  );
}
