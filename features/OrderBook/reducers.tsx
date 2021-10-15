import { original } from "immer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Delta, SocketMessage, State } from "./types";

export const initialState: State = {
  bids: [],
  asks: [],
  productId: "PI_XBTUSD",
  socketState: "DISCONNECTED",
};

const orderBook = createSlice({
  name: "OrderBook",
  initialState,
  reducers: {
    receivedDeltas(state, action: PayloadAction<SocketMessage>) {
      const originalState = original(state);

      function patch(type: "bids" | "asks") {
        const nextState = [...originalState![type]];

        for (const [newPrice, newSize] of action.payload[type]) {
          let lowestIndex = 0;
          let highestIndex = nextState.length;

          let replace = 0;
          let newElement: Delta = [newPrice, newSize];

          while (lowestIndex < highestIndex) {
            const midIndex = (lowestIndex + highestIndex) >>> 1;
            const currentPrice = nextState[midIndex][0];

            if (newPrice === currentPrice) {
              replace = 1;
              lowestIndex = midIndex;
              break;
            }

            if (currentPrice < newPrice) {
              lowestIndex = midIndex + 1;
            } else {
              highestIndex = midIndex;
            }
          }

          if (newSize > 0) {
            nextState.splice(lowestIndex, replace, newElement);
          } else {
            nextState.splice(lowestIndex, 1);
          }
        }

        return nextState;
      }

      return {
        bids: patch("bids"),
        asks: patch("asks"),
        productId: state.productId,
        socketState: state.socketState,
      };
    },

    switchedProducts(state) {
      state.productId =
        state.productId === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";
    },

    disconnectedSocket(state) {
      state.socketState = "DISCONNECTED";
    },

    connectingSocket(state) {
      state.socketState = "CONNECTING";
    },

    connectedSocket(state) {
      state.socketState = "CONNECTED";
    },

    resetDeltas(state) {
      state.bids = [];
      state.asks = [];
    },
  },
});

export const {
  receivedDeltas,
  switchedProducts,
  disconnectedSocket,
  connectingSocket,
  connectedSocket,
  resetDeltas,
} = orderBook.actions;

export default orderBook.reducer;
