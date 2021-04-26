import { ServiceFactoryFn, ServiceFactoryMap, ServiceProvider, useServiceProvider } from "./ServiceProvider";
import { ApiClient, Cocktail, CollectionQuery, fetchCocktails, useAsync, useQueryBuilder } from "./HttpTransport";
import { Services, services } from "./Services";
import React from "react";
import { Async, AsyncError, AsyncLoading, AsyncResult } from "./Async";
import {
  AspectRatio,
  Box,
  Center,
  chakra,
  ChakraProvider,
  Container,
  extendTheme,
  Image,
  SimpleGrid,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react";

export type CocktailsDb = ApiClient;

export interface CocktailsService extends ServiceFactoryMap {
  cocktailsDb: ServiceFactoryFn<CocktailsDb>
}

export function useCocktails(query: CollectionQuery) {
  const { cocktailsDb } = useServiceProvider<CocktailsService>();
  return useAsync(fetchCocktails, [cocktailsDb, query], { immediate: true });
}

export interface LocalCocktail {
  name: string,
  image: string,
  id: string,
}

export function cocktailMapper(e: Cocktail): LocalCocktail {
  return {
    name: e.strDrink,
    image: e.strDrinkThumb,
    id: e.idDrink
  };
}

export function CocktailsController() {
  const { query } = useQueryBuilder({
    filters: {
      c: "Cocktail"
    }
  });
  const state = useCocktails(query);

  return (
    <Async state={state}>
      <AsyncLoading><Center><Spinner /></Center></AsyncLoading>
      <AsyncError>{({ error }) => error?.message}</AsyncError>
      <AsyncResult select={(res) => res.drinks.map(cocktailMapper)}>
        {({ result }) => <CocktailList items={result} />}
      </AsyncResult>
    </Async>
  );
}

const Card = chakra(Box, {
  baseStyle: {
    boxShadow: "md",
    bg: "bg",
    color: "text",
    borderRadius: "md"
  }
});

const CardHeading = chakra(Text, {
  baseStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "lg"
  }
});

export function CocktailCard({ cocktail }: { cocktail: Pick<LocalCocktail, "image" | "name"> }) {
  return (
    <Card p={2}>
      <Stack gap="lg">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={cocktail.image}
            alt={cocktail.name}
            borderRadius={"md"}
          />
        </AspectRatio>

        <CardHeading>{cocktail.name}</CardHeading>
      </Stack>
    </Card>
  );
}

export function CocktailList({ items }: { items: Array<LocalCocktail> }) {
  return (
    <Container maxW={"container.xl"}>
      <SimpleGrid columns={4} gap={"1rem"}>
        {items.map((item) => <CocktailCard key={item.id} cocktail={item} />)}
      </SimpleGrid>
    </Container>
  );
}

const theme = extendTheme({
  colors: {
    border: "gray.200",
    primary: "teal.600",
    secondary: "green.600",
    text: "gray.800",
    bg: "white"
  }
});

export function CocktailApp() {
  return (
    <ServiceProvider<Services> services={services}>
      <ChakraProvider theme={theme}>
        <CocktailsController />
      </ChakraProvider>
    </ServiceProvider>
  );
}
