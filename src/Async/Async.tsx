import React, { createContext, ReactNode, useContext } from "react";
import { AsyncSelector, AsyncState } from "./AsyncState";

const AsyncContext = createContext<Partial<AsyncSelector<any>>>({
  state: {
    loading: false,
    refreshing: false,
    result: null,
    error: null,
  },
});

export type ChildNode<S extends AsyncState<any>> =
  | ReactNode
  | ((props: S) => ReactNode);

export interface AsyncProps<S extends AsyncSelector<any>> {
  selector: S;
  children: ChildNode<S["state"]>;
}

export function renderChildren<S extends AsyncState<any>>(
  children: ChildNode<S>,
  state: S
) {
  if (typeof children === "function") {
    return children(state);
  }

  return children;
}

export function Async<S>({ selector, children }: AsyncProps<AsyncSelector<S>>) {
  return (
    <AsyncContext.Provider value={selector}>
      {renderChildren(children, selector.state)}
    </AsyncContext.Provider>
  );
}

export function AsyncLoading({ children }: { children: ChildNode<any> }) {
  const { state } = useContext(AsyncContext);

  return state?.loading && renderChildren(children, state);
}

export function AsyncRefreshing({ children }: { children: ChildNode<any> }) {
  const { state } = useContext(AsyncContext);

  return state?.refreshing && renderChildren(children, state);
}

export function AsyncError({ children }: { children: ChildNode<any> }) {
  const { state } = useContext(AsyncContext);

  return state?.error && renderChildren(children, state);
}

export function AsyncResult({ children }: { children: ChildNode<any> }) {
  const { state } = useContext(AsyncContext);

  return state?.result && renderChildren(children, state);
}
