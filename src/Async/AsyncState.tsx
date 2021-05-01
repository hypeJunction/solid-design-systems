import { useCallback, useEffect, useReducer } from "react";

export type Selector<S> = (...args: Array<any>) => Promise<S>;

export interface AsyncState<S> {
  result: S | null;
  error: Error | null;
  loading: boolean;
  refreshing: boolean;
}

export interface AsyncSelector<S> {
  state: AsyncState<S>;
  execute: () => Promise<S | void>;
}

export function transform<T, O>(
  res: Promise<T>,
  transformer: (res: T) => O
): Promise<O> {
  return res.then(transformer);
}

export function useAsyncCallback<S>(
  fn: Selector<S>,
  deps: Array<any> = []
): AsyncSelector<S> {
  const [state, dispatch] = useReducer(asyncStateReducer, {
    loading: false,
    refreshing: false,
    result: null,
    error: null,
  });

  const execute = useCallback(() => {
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });

    Promise.resolve(fn(...deps))
      .then((result) => {
        dispatch({
          type: "SET_RESULT",
          payload: result,
        });
      })
      .catch((err) => {
        dispatch({
          type: "SET_ERROR",
          payload: err,
        });
      });
  }, [fn, deps]);

  return {
    state,
    execute,
  } as AsyncSelector<S>;
}

export function useSelector<S>(
  fn: Selector<S>,
  deps: Array<any> = []
): AsyncSelector<S> {
  const selector = useAsyncCallback(fn, deps);

  useEffect(() => {
    selector.execute();
  }, deps);

  return selector;
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
        refreshing: state.result ? action.payload : false,
      };
    }

    case "SET_RESULT": {
      return {
        ...state,
        result: action.payload,
        loading: false,
        refreshing: false,
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
        loading: false,
        refreshing: false,
      };
    }
  }
}
