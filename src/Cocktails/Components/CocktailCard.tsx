import React from "react";
import { Cocktail } from "../Adapters/Cocktails";
import "./CocktailCard.css";

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  return (
    <div className="card is-flex-grow-1">
      <div className="card-image">
        <figure className="image is-3by4">
          <img src={cocktail.image} alt={cocktail.name} />
        </figure>
      </div>
      <div className="card-content">
        <div className="content columns is-multiline">
          <div className="column is-full">
            <h3>{cocktail.name}</h3>
          </div>

          <div className="column is-full">
            {cocktail.ingredients.map((e) => (
              <div
                key={e.id}
                className="is-flex is-justify-content-space-between"
              >
                <div>{e.name}</div>
                <div>{e.measure}</div>
              </div>
            ))}
          </div>

          <div className="column is-full">
            <div className="text is-italic">{cocktail?.instructions}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
