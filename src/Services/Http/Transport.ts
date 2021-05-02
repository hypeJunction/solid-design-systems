import {
  Header,
  RequestOptions,
  TransportInterface,
} from "./TransportInterface";
import { BearerToken } from "./Identity";

export function createQueryRequest(
  method: "GET" | "HEAD" | "OPTIONS",
  url: URL,
  options: Partial<Pick<RequestOptions, "headers" | "bearerToken">> = {}
) {
  return new Request(url.toString(), {
    method,
    headers: buildHttpHeaders(options.bearerToken, options.headers || {}),
  });
}

export function createMutationRequest(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  url: URL,
  options: Partial<RequestOptions> = {}
) {
  return new Request(url.toString(), {
    method,
    cache: "no-cache",
    headers: buildHttpHeaders(options.bearerToken, options.headers || {}),
    body: options.body,
  });
}

export const send: TransportInterface = <T>(request: Request): Promise<T> => {
  return fetch(request).then((res) => parseFetchResponse<T>(res));
};

export const parseFetchResponse = async <T>(response: Response): Promise<T> => {
  const getData = async () => {
    try {
      return await response.json();
    } catch (err) {
      return {};
    }
  };

  const data = await getData();

  if (response.ok) {
    return Promise.resolve(data);
  }

  throw new HttpError(response.status || 500, data || {});
};

// Modified from https://stackoverflow.com/a/42604801
export function serializeUrlSearchParams(
  params: { [key: string]: any },
  prefix?: string
): string {
  const query = Object.keys(params).map((key) => {
    const value = params[key];

    if (params.constructor === Array) {
      key = `${prefix}[]`;
    } else if (params.constructor === Object) {
      key = prefix ? `${prefix}[${key}]` : key;
    }

    if (typeof value === "object") {
      return serializeUrlSearchParams(value, key);
    } else {
      return `${key}=${encodeURIComponent(value)}`;
    }
  });

  return query.join("&");
}

export function buildUrl(
  baseUrl: string,
  endpoint: string,
  query: object = {}
): URL {
  const queryString = serializeUrlSearchParams(query);

  const glue =
    endpoint.indexOf("?") === -1 && queryString.length > 0 ? "?" : "";

  return new URL(`${baseUrl}${endpoint}${glue}${queryString}`);
}

export const buildHttpHeaders = (
  bearerToken: BearerToken,
  ...parts: Array<Header>
): Headers => {
  return new Headers(
    Object.assign(
      {},
      bearerToken && {
        Authorization: `Bearer ${bearerToken}`,
      },
      ...parts
    )
  );
};

export function buildPostRequestOptions(
  format: "json" | "FormData",
  payload: object
): Pick<RequestOptions, "headers" | "body"> {
  switch (format) {
    case "json": {
      return {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: payload ? JSON.stringify(payload) : null,
      };
    }

    case "FormData": {
      const fd = new FormData();

      Object.entries(payload).forEach(([value, key]) => {
        fd.append(key, value);
      });

      return {
        headers: {},
        body: fd,
      };
    }
  }
}

export class HttpError implements Error {
  name: string;
  message: string;
  readonly code: string | number;
  readonly payload: object;

  constructor(code: string | number, payload: object) {
    this.code = code;
    this.payload = payload;
    this.name = "HttpError";
    this.message = `Error Response [${code}]: ${JSON.stringify(payload)}`;
  }
}
