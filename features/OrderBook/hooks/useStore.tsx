import { Middleware, StoreEnhancer } from "redux";
import createSagaMiddleware from "redux-saga";
import { useEffect, useMemo, useState } from "react";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "../reducers";
import rootSaga from "../sagas";
import { TypedUseSelectorHook, useSelector as selectorHook } from "react-redux";
import { State } from "../types";

// We use this as a hook so we can tear down the sagas when OrderBook is unmounted.
// Notice that the middleware is only created in the client, to avoid SSR socket messages.
function useStoreSaga() {
  const [error, setError] = useState<any>(null);

  const middleware = useMemo(
    () =>
      typeof window === "object"
        ? createSagaMiddleware({
            onError(err, errorInfo) {
              setError({ error: err, errorInfo });
            },
          })
        : null,
    []
  );

  useEffect(() => {
    if (middleware) {
      const task = middleware.run(rootSaga);

      return () => task.cancel();
    }
  }, [middleware]);

  if (error) {
    // This converts the saga middleware uncaught errors into a component error.
    // We do so to have the error boundary triggered.
    throw error;
  }

  return middleware;
}

function useStore() {
  const sagaMiddleware = useStoreSaga();

  return useMemo(() => {
    const middleware: Middleware[] = [];
    const enhancers: StoreEnhancer[] = [];

    if (sagaMiddleware) {
      middleware.push(sagaMiddleware);
    }

    // We deliberately create the devtools enhancer instead of using the toolkit.
    // This is so we can fix instance id and avoid multiple instances with HMR.
    if (typeof window === "object" && process.env.NODE_ENV === "development") {
      // @ts-ignore
      const devTools = window.__REDUX_DEVTOOLS_EXTENSION__;

      if (devTools) {
        enhancers.push(
          devTools({
            name: "OrderBook",
            instanceId: 1, // this is the important bit :)
          })
        );
      }
    }

    return configureStore({
      devTools: false,
      reducer,
      middleware,
      enhancers,
    });
  }, [sagaMiddleware]);
}

export const useSelector: TypedUseSelectorHook<State> = selectorHook;

export default useStore;
