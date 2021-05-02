import { useCallback, useEffect, useReducer } from "react";

export type AsyncFn<S> = (...args: any) => Promise<S>;
export type InvokeAsyncFn = (soft?: boolean) => void;

export interface AsyncState<S> {
  result: S | null;
  error: Error | null;
  loading: boolean;
  refreshing: boolean;
  execute: InvokeAsyncFn;
}

export function useAsync<S>(fn: AsyncFn<S>, deps?: any[]): AsyncState<S> {
  const selector = useAsyncCallback(fn);
  const { execute } = selector;

  useEffect(() => {
    execute();
  }, deps || []);

  return selector;
}

export function useAsyncCallback<S>(fn: AsyncFn<S>): AsyncState<S> {
  const execute = useCallback(
    (soft = false) => {
      dispatch({
        type: "START",
        payload: {
          soft,
        },
      });

      Promise.resolve(fn())
        .then((result) => {
          dispatch({
            type: "FINISH",
            payload: result,
          });
        })
        .catch((err) => {
          dispatch({
            type: "FAIL",
            payload: err,
          });
        });
    },
    [fn]
  );

  const [state, dispatch] = useReducer(asyncStateReducer, {
    loading: false,
    refreshing: false,
    result: null,
    error: null,
  });

  return { ...state, execute } as AsyncState<S>;
}

export type AsyncStateAction<S> =
  | {
      type: "START";
      payload: {
        soft: boolean;
      };
    }
  | {
      type: "FINISH";
      payload: S | null;
    }
  | {
      type: "FAIL";
      payload: Error | null;
    };

export function asyncStateReducer<S>(
  state: Omit<AsyncState<S>, "execute">,
  action: AsyncStateAction<S>
): Omit<AsyncState<S>, "execute"> {
  switch (action.type) {
    case "START": {
      return {
        ...state,
        result: action.payload.soft ? state.result : null,
        loading: !action.payload.soft,
        refreshing: action.payload.soft,
      };
    }

    case "FINISH": {
      return {
        ...state,
        result: action.payload,
        loading: false,
        refreshing: false,
      };
    }

    case "FAIL": {
      return {
        ...state,
        error: action.payload,
        loading: false,
        refreshing: false,
      };
    }
  }
}
