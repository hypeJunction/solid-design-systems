import { CocktailDto } from "../Services";

export type Ingredient = {
  id: string;
  name: string;
  measure: string;
};

export const mapIngredients = (e: CocktailDto): Ingredient[] => {
  const ingredients = [];

  for (let i = 1; i <= 15; i++) {
    const indexedName = `strIngredient${i}`;
    const indexedMeasure = `strMeasure${i}`;

    if (e?.[indexedName]) {
      ingredients.push({
        id: Math.random().toString(36).substr(2, 9),
        name: e?.[indexedName],
        measure: e?.[indexedMeasure],
      });
    }
  }

  return ingredients;
};
