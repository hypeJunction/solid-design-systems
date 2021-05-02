import { ServiceProvider } from "../Container";
import { Services, services } from "./Services";
import React from "react";
import { CocktailsByCategory } from "../Cocktails/Containers";
import "./App.css";

export function App() {
  return (
    <div className="section">
      <ServiceProvider<Services> services={services}>
        <CocktailsByCategory />
      </ServiceProvider>
    </div>
  );
}
