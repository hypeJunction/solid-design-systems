import React, { createContext, ReactNode, useContext } from "react";
import { AsyncState } from "./HttpTransport";

const AsyncContext = createContext<AsyncState<any>>({
  loading: false,
  refreshing: false,
  result: null,
  error: null
});

export type ChildNode<S> = ReactNode | ((props: S) => ReactNode);

export interface AsyncProps<S> {
  state: S
  children: ChildNode<S>,
}

function renderChildren<S>(children: ChildNode<S>, state: S) {
  if (typeof children === "function") {
    return children(state);
  }

  return children;
}

export function Async<S extends AsyncState<any>, T extends Array<any>>({ state, children }: AsyncProps<S>) {
  return (
    <AsyncContext.Provider value={state}>
      {renderChildren(children, state)}
    </AsyncContext.Provider>
  );
}


export function AsyncLoading<S extends AsyncState<any>>({ children }: { children: ChildNode<S> }) {
  const state = useContext(AsyncContext);

  return state.loading && renderChildren(children, state);
}

export function AsyncRefreshing<S extends AsyncState<any>>({ children }: { children: ChildNode<S> }) {
  const state = useContext(AsyncContext);

  return state.refreshing && renderChildren(children, state);
}

export function AsyncError<S extends AsyncState<any>>({ children }: { children: ChildNode<S> }) {
  const state = useContext(AsyncContext);

  return state.error && renderChildren(children, state);
}

export function AsyncResult<S extends AsyncState<any>, T>({ children, select = (result: NonNullable<S["result"]>): S['result'] => result}: { children: ChildNode<S>, select?: (result: NonNullable<S['result']>) => S['result']|T}) {
  const state = useContext(AsyncContext);

  return state.result && renderChildren(children, {
    ...state,
    result: select(state.result)
  } as S);
}

