import { createContext, ReactNode, useContext, useRef } from "react";

export type Container<S extends ServiceFactoryMap> = {
  [P in keyof S]: ReturnType<S[P]>;
};

export type ServiceFactoryFn<S> = (container: Container<any>) => S;

export type ServiceFactoryMap = Record<string | symbol, ServiceFactoryFn<any>>;

const ContainerContext = createContext<
  Partial<{ services: Container<ServiceFactoryMap> }>
>({});

interface ServiceProviderProps<S extends ServiceFactoryMap> {
  services: S;
  children: ReactNode;
}

export function ServiceProvider<S extends ServiceFactoryMap>({
  services,
  children,
}: ServiceProviderProps<S>) {
  const setup = (): Container<S> => {
    const singletons: Partial<Container<S>> = {};

    return new Proxy(services, {
      get(instance: S, property: keyof S, receiver: any) {
        if (!singletons?.[property]) {
          singletons[property] = instance[property](receiver);
        }

        return singletons[property];
      },
    }) as Container<S>;
  };

  const { current } = useRef(setup());

  return (
    <ContainerContext.Provider value={{ services: current }}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useServiceProvider<
  S extends ServiceFactoryMap
>(): Container<S> {
  return useContext(ContainerContext).services as Container<S>;
}
