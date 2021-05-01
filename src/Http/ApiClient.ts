import { RequestOptions, Transport } from "./HttpTransportProvider";
import {
  createMutationRequest,
  createQueryRequest,
} from "./HttpTransportService";

export class ApiClient {
  readonly baseUrl: string;
  readonly transport: Transport;

  constructor(baseUrl: string, transport: Transport) {
    this.baseUrl = baseUrl;
    this.transport = transport;
  }

  send<T>(request: Request): Promise<T> {
    return this.transport<T>(request);
  }

  get<T>(
    url: URL,
    options: Partial<Pick<RequestOptions, "headers" | "bearerToken">> = {},
    method: "GET" | "HEAD" | "OPTIONS" = "GET"
  ): Promise<T> {
    return this.send(createQueryRequest("GET", url, options));
  }

  post<T>(
    url: URL,
    options: Partial<RequestOptions> = {},
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
  ): Promise<T> {
    return this.send(createMutationRequest(method, url, options));
  }
}
