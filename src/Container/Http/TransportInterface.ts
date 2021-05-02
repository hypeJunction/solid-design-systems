import { BearerToken } from "./Identity";

export type TransportInterface = <T>(request: Request) => Promise<T>;

export type Header = Record<string, string>;

export interface RequestOptions {
  bearerToken: BearerToken;
  headers: Header;
  body: BodyInit | null | undefined;
}
