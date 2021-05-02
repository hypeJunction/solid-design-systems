import { ServiceFactoryFn, ServiceFactoryMap } from "../ServiceProvider";

export type BearerToken = string | undefined;

export interface Identity {
  bearerToken: BearerToken;
}

export interface IdentityService extends ServiceFactoryMap {
  identity: ServiceFactoryFn<Identity>;
}
