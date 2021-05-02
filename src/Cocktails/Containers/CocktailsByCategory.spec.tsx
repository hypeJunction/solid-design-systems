import { act, render } from "@testing-library/react";
import {
  ApiClient,
  ServiceProvider,
  TransportInterface,
} from "../../Services";
import { Services, services as defaultServices } from "../../App/Services";
import { SinonSpy, stub } from "sinon";
import { CocktailsByCategory } from "./CocktailsByCategory";
import { expect } from "chai";
import { CocktailSummaryDto } from "../Services";

describe("CocktailsController", () => {
  describe("given a pending request", () => {
    it("should display a loading state", () => {
      const promise = new Promise(() => {});
      const fetcher: TransportInterface & SinonSpy = stub().returns(promise);
      const apiClient = new ApiClient("http://example.com", fetcher);

      const services = {
        ...defaultServices,
        cocktailsDb: () => apiClient,
      };

      const { getByText } = render(
        <ServiceProvider<Services> services={services}>
          <CocktailsByCategory />
        </ServiceProvider>
      );

      expect(getByText("Loading...")).to.be.visible;
    });
  });

  describe("given a failed request", () => {
    it("should display an error state", async () => {
      const error = new Error("Failed request");
      const fetcher: TransportInterface & SinonSpy = stub().returns(
        Promise.reject(error)
      );
      const apiClient = new ApiClient("http://example.com", fetcher);

      const services = {
        ...defaultServices,
        cocktailsDb: () => apiClient,
      };

      const { getByText } = render(
        <ServiceProvider<Services> services={services}>
          <CocktailsByCategory />
        </ServiceProvider>
      );

      try {
        await act(async () => await fetcher());
      } catch (err) {
        expect(err).to.equal(error);
      }

      expect(getByText(error.message)).to.be.visible;
    });
  });

  describe("given a successful request", () => {
    it("should display a list", async () => {
      const fetcher: TransportInterface & SinonSpy = stub().returns(
        Promise.resolve({
          drinks: [
            {
              strDrink: "Test Cocktail",
              strDrinkThumb: "image.jpg",
              idDrink: "test-cocktail",
            },
          ],
        } as { drinks: Array<CocktailSummaryDto> })
      );
      const apiClient = new ApiClient("http://example.com", fetcher);

      const services = {
        ...defaultServices,
        cocktailsDb: () => apiClient,
      };

      const { getByText } = render(
        <ServiceProvider<Services> services={services}>
          <CocktailsByCategory />
        </ServiceProvider>
      );

      await act(async () => await fetcher());
      expect(getByText("Test Cocktail")).to.be.visible;
    });
  });
});
