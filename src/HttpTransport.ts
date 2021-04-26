import { ServiceFactoryFn, ServiceFactoryMap, useServiceProvider } from "./ServiceProvider";
import { Reducer, useCallback, useEffect, useReducer, useRef } from "react";

export type HttpTransport = <T>(request: Request) => Promise<T>;

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

export const parseFetchResponse = async <T>(response: Response): Promise<T> => {
  const getData = async () => {
    try {
      return await response.json();
    } catch (err) {
      return {};
    }
  };

  const data = await getData();

  if (response.ok && !data?.errors) {
    return Promise.resolve(data);
  }

  throw new HttpError(response.status || 500, data || {});
};

export const sendHttpRequest: HttpTransport = <T>(request: Request): Promise<T> => {
  return fetch(request).then((res) => parseFetchResponse<T>(res));
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

export class ApiClient {
  readonly baseUrl: string;
  readonly transport: HttpTransport;

  constructor(baseUrl: string, transport: HttpTransport) {
    this.baseUrl = baseUrl;
    this.transport = transport;
  }

  send<T>(request: Request): Promise<T> {
    return this.transport<T>(request);
  }
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

export type BearerToken = string | undefined;
export type Header = Record<string, string>;

export interface RequestOptions {
  bearerToken: BearerToken;
  headers: Header;
  payload: {
    [key: string]: any;
  };
}

export const buildHttpHeaders = (
  bearerToken: BearerToken,
  ...parts: Array<Header>
): Headers => {
  return new Headers(
    Object.assign(
      {},
      bearerToken && {
        Authorization: `Bearer ${bearerToken}`
      },
      ...parts
    )
  );
};

export function buildGetRequest(
  method: "GET" | "HEAD" | "OPTIONS",
  url: URL,
  options: Partial<Pick<RequestOptions, "headers" | "bearerToken">> = {}
) {
  return new Request(url.toString(), {
    method,
    headers: buildHttpHeaders(options.bearerToken, options.headers || {})
  });
}

export function buildPostRequest(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  url: URL,
  options: Partial<RequestOptions> = {}
) {
  return new Request(url.toString(), {
    method,
    cache: "no-cache",
    headers: buildHttpHeaders(
      options.bearerToken,
      {
        "Content-Type": "application/json; charset=utf-8"
      },
      options.headers || {}
    ),
    body: options.payload ? JSON.stringify(options.payload) : null
  });
}

export function buildFormDataRequest(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  url: URL,
  options: Partial<RequestOptions> = {}
) {
  const fd = new FormData();

  Object.keys(options.payload || {}).forEach((e) => {
    fd.append(e, options.payload?.[e]);
  });

  return new Request(url.toString(), {
    method,
    headers: buildHttpHeaders(options.bearerToken, options.headers || {}),
    cache: "no-cache",
    body: fd
  });
}

export const fetchCocktails = (
  client: ApiClient,
  query: CollectionQuery,
  identity?: Identity
): Promise<{ drinks: Array<Cocktail>}> => {
  return client.send(
    buildGetRequest(
      "GET",
      buildUrl(client.baseUrl, "/v1/1/filter.php", { ...query.filters }),
      {
        ...identity
      }
    )
  );
};

export const readCocktailById = (
  client: ApiClient,
  query: EntityQuery,
  identity?: Identity
): Promise<Cocktail> => {
  return client.send(
    buildGetRequest(
      "GET",
      buildUrl(client.baseUrl, `/v1/cocktails/${query.id}`, query),
      {
        ...identity
      }
    )
  );
};

export const createCocktail = (
  client: ApiClient,
  payload: Cocktail,
  identity: Identity
): Promise<Cocktail> => {
  return client.send(
    buildPostRequest("POST", buildUrl(client.baseUrl, "/v1/cocktails"), {
      ...identity,
      payload
    })
  );
};

export type Filters = Record<string, any>;
export type Sorts = Record<string, "asc" | "desc">;

export interface CollectionQuery {
  filters: Filters | null;
  sorts: Sorts | null;
  page: number | null;
  perPage: number | null;
}

export interface EntityQuery {
  id: string;
}

export interface Identity {
  bearerToken: BearerToken;
}

export interface Cocktail {
  strDrink: string,
  strDrinkThumb: string,
  idDrink: string,
}

export interface IdentityService extends ServiceFactoryMap {
  identity: ServiceFactoryFn<Identity>;
}

export function useIdentity(): Identity {
  const { identity } = useServiceProvider<IdentityService>();

  return identity;
}

export interface UseQueryOptions<S> {
  immediate: boolean,
  onDone: (result: S) => void,
  onError: (error: Error) => void,
}

export interface AsyncState<S> {
  result: S | null;
  error: Error | null;
  loading: boolean;
  refreshing: boolean;
}

type AsyncStateAction<S> =
  | {
  type: "SET_LOADING";
  payload: boolean;
}
  | {
  type: "SET_RESULT";
  payload: S | null;
}
  | {
  type: "SET_ERROR";
  payload: Error | null;
};

function asyncStateReducer<S>(
  state: AsyncState<S>,
  action: AsyncStateAction<S>
): AsyncState<S> {
  switch (action.type) {
    case "SET_LOADING": {
      return {
        ...state,
        loading: state.result ? false : action.payload,
        refreshing: state.result ? action.payload : false
      };
    }

    case "SET_RESULT": {
      return {
        ...state,
        result: action.payload,
        loading: false,
        refreshing: false
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
        loading: false,
        refreshing: false
      };
    }
  }
}

export type UseQueryState<S> = AsyncState<S> & { execute: () => void };

const noop = () => {
};

export function useAsync<S, T extends Array<any>>(
  fn: (...deps: T) => Promise<S>,
  deps: T,
  {
    immediate = false,
    onDone = noop,
    onError = noop
  }: Partial<UseQueryOptions<S>>
): UseQueryState<S> {
  const [state, dispatch] = useReducer(asyncStateReducer, {
    loading: immediate,
    refreshing: false,
    result: null,
    error: null
  });

  const execute = useCallback(() => {
    dispatch({
      type: "SET_LOADING",
      payload: true
    });

    Promise.resolve(fn(...deps)).then((result) => {
      dispatch({
        type: "SET_RESULT",
        payload: result
      });

      onDone(result);
    }).catch((err) => {
      dispatch({
        type: "SET_ERROR",
        payload: err
      });
      onError(err);
    });
  }, []);

  useEffect(() => {
    immediate && execute();
  }, []);

  useEffect(() => {
    execute();
  }, deps);

  return {
    ...state,
    execute
  } as UseQueryState<S>;
}

type QueryBuilderAction =
  | {
  type: "SET_FILTERS";
  payload: Filters;
}
  | {
  type: "SET_SORTS";
  payload: Sorts;
}
  | {
  type: "SET_PAGE";
  payload: number;
}
  | {
  type: "SET_PER_PAGE";
  payload: number;
};

function queryBuilderActionReducer(query: CollectionQuery, action: QueryBuilderAction): CollectionQuery {
  switch (action.type) {
    case "SET_FILTERS": {
      return {
        ...query,
        filters: action.payload
      };
    }

    case "SET_SORTS": {
      return {
        ...query,
        sorts: action.payload
      };
    }

    case "SET_PAGE": {
      return {
        ...query,
        page: action.payload
      };
    }

    case "SET_PER_PAGE": {
      return {
        ...query,
        perPage: action.payload
      };
    }
  }
}

export function useResettableReducer(reducer: Reducer<any, any>, initialState: any) {
  const { current: initial } = useRef(initialState);
  const resettableReducer = useCallback((state, action) => {
    if (action.type === "RESET") {
      return initial;
    }

    return reducer(state, action);
  }, [reducer, initial]);

  return useReducer(resettableReducer, initialState);
}

export function useQueryBuilder(initialState: Partial<CollectionQuery>) {
  const [query, dispatch] = useResettableReducer(queryBuilderActionReducer, {
    perPage: null,
    page: null,
    sorts: null,
    filters: null,
    ...initialState
  } as CollectionQuery);

  return {
    query,
    setFilters: (payload: Filters) =>
      dispatch({
        type: "SET_FILTERS",
        payload
      }),
    setSorts: (payload: Sorts) =>
      dispatch({
        type: "SET_SORTS",
        payload
      }),
    setPage: (payload: number) =>
      dispatch({
        type: "SET_PAGE",
        payload
      }),
    setPerPage: (payload: number) =>
      dispatch({
        type: "SET_PER_PAGE",
        payload
      }),
    reset: () => {
      dispatch({
        type: "RESET",
        payload: null
      });
    }
  };
}
