import { ServiceProvider } from "./Container";
import { Services, services } from "./Services";
import React from "react";
import { CocktailsController } from "./Cocktails/Controllers";

export function CocktailApp() {
  return (
    <ServiceProvider<Services> services={services}>
      <CocktailsController />
    </ServiceProvider>
  );
}
