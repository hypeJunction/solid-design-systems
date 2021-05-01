import React from "react";
import { Cocktail } from "../Controllers";

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  return (
    <div>
      <img src={cocktail.image} alt={cocktail.name} />
      <h3>{cocktail.name}</h3>
    </div>
  );
}
