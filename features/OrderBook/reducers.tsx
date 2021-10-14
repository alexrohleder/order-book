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
      function patch(type: "bids" | "asks") {
        const nextState = [...state[type]];

        for (const [price, size] of action.payload[type]) {
          let lowestIndex = 0;
          let highestIndex = nextState.length;

          let deleteCount = 0;
          let newElement: Delta = [price, size];

          while (lowestIndex < highestIndex) {
            const midIndex = (lowestIndex + highestIndex) >>> 1;
            const currentPrice = nextState[midIndex][0];

            if (price === currentPrice) {
              deleteCount = 1;
            }

            if (currentPrice < price) {
              lowestIndex = midIndex + 1;
            } else {
              highestIndex = midIndex;
            }
          }

          if (size > 0) {
            nextState.splice(lowestIndex, deleteCount, newElement);
          } else {
            nextState.splice(lowestIndex, 1);
          }
        }

        return nextState;
      }

      return {
        ...state,
        bids: patch("bids"),
        asks: patch("asks"),
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
