import { Middleware, StoreEnhancer } from "redux";
import createSagaMiddleware from "redux-saga";
import { useEffect, useMemo } from "react";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "../reducers";
import rootSaga from "../sagas";

// We use this as a hook so we can tear down the sagas when OrderBook is unmounted.
// Notice that the middleware is only created in the client, to avoid SSR socket messages.
function useStoreSaga() {
  const middleware = useMemo(
    () =>
      typeof window === "object"
        ? createSagaMiddleware({
            onError(error, errorInfo) {
              console.error(error, errorInfo);
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

    const store = configureStore({
      devTools: false,
      reducer,
      middleware,
      enhancers,
    });

    return store;
  }, [sagaMiddleware]);
}

export default useStore;
