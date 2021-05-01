import { ServiceFactoryFn, ServiceFactoryMap } from "../Container";

export type Transport = <T>(request: Request) => Promise<T>;

export type BearerToken = string | undefined;

export type Header = Record<string, string>;

export interface RequestOptions {
  bearerToken: BearerToken;
  headers: Header;
  body: BodyInit | null | undefined;
}

export interface Identity {
  bearerToken: BearerToken;
}

export interface IdentityService extends ServiceFactoryMap {
  identity: ServiceFactoryFn<Identity>;
}
