import React from "react";
import { Cocktail } from "../Controllers";

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  return (
    <div className="card is-flex-grow-1">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={cocktail.image} alt={cocktail.name} />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <h3>{cocktail.name}</h3>
        </div>
      </div>
    </div>
  );
}
