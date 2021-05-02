import { CategoryDto, CocktailsService, fetchCategories } from "../Services";
import { useAsync, useServiceProvider } from "../../Container";

export interface Category {
  id: string;
  name: string;
}

export function categoryMapper(e: CategoryDto): Category {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: e.strCategory,
  };
}

export function useCategoriesQuery() {
  const { cocktailsDb } = useServiceProvider<CocktailsService>();

  return useAsync(() =>
    fetchCategories(cocktailsDb).then((res) => res.drinks.map(categoryMapper))
  );
}
