import { ServiceProvider } from "./Container";
import { Services, services } from "./Services";
import React from "react";
import { CocktailsController } from "./Cocktails/Controllers";
import "./App.css";

export function App() {
  return (
    <div className="container">
      <div className="section">
        <ServiceProvider<Services> services={services}>
          <CocktailsController />
        </ServiceProvider>
      </div>
    </div>
  );
}
