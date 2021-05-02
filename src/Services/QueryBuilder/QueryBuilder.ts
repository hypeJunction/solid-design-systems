import { Reducer, useCallback, useReducer, useRef } from "react";

export type Filters = Record<string, any>;
export type Sorts = Record<string, "asc" | "desc">;

export interface CollectionQuery {
  filters: Filters | null;
  sorts: Sorts | null;
  page: number | null;
  perPage: number | null;
}

export type QueryBuilderAction =
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

export function queryBuilderActionReducer(
  query: CollectionQuery,
  action: QueryBuilderAction
): CollectionQuery {
  switch (action.type) {
    case "SET_FILTERS": {
      return {
        ...query,
        filters: action.payload,
      };
    }

    case "SET_SORTS": {
      return {
        ...query,
        sorts: action.payload,
      };
    }

    case "SET_PAGE": {
      return {
        ...query,
        page: action.payload,
      };
    }

    case "SET_PER_PAGE": {
      return {
        ...query,
        perPage: action.payload,
      };
    }
  }
}

export function useResettableReducer(
  reducer: Reducer<any, any>,
  initialState: any
) {
  const { current: initial } = useRef(initialState);
  const resettableReducer = useCallback(
    (state, action) => {
      if (action.type === "RESET") {
        return initial;
      }

      return reducer(state, action);
    },
    [reducer, initial]
  );

  return useReducer(resettableReducer, initialState);
}

export function useQueryBuilder(initialState: Partial<CollectionQuery>) {
  const [query, dispatch] = useResettableReducer(queryBuilderActionReducer, {
    perPage: null,
    page: null,
    sorts: null,
    filters: null,
    ...initialState,
  } as CollectionQuery);

  return {
    query,
    setFilters: (payload: Filters) =>
      dispatch({
        type: "SET_FILTERS",
        payload,
      }),
    setSorts: (payload: Sorts) =>
      dispatch({
        type: "SET_SORTS",
        payload,
      }),
    setPage: (payload: number) =>
      dispatch({
        type: "SET_PAGE",
        payload,
      }),
    setPerPage: (payload: number) =>
      dispatch({
        type: "SET_PER_PAGE",
        payload,
      }),
    reset: () => {
      dispatch({
        type: "RESET",
        payload: null,
      });
    },
  };
}
