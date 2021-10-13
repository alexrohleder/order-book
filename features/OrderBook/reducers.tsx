import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Delta, SocketState, State } from "./types";

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
    patchLevels(
      state,
      action: PayloadAction<{ asks: Delta[]; bids: Delta[] }>
    ) {
      function patch(type: "bids" | "asks") {
        for (const [price, size] of action.payload[type]) {
          let lowestIndex = 0;
          let highestIndex = state[type].length;

          let deleteCount = 0;
          let newElement: Delta = [price, size];

          while (lowestIndex < highestIndex) {
            const midIndex = (lowestIndex + highestIndex) >>> 1;
            const currentPrice = state[type][midIndex][0];

            if (price === currentPrice) {
              deleteCount = 1;
              break;
            }

            if (currentPrice < price) {
              lowestIndex = midIndex + 1;
            } else {
              highestIndex = midIndex;
            }
          }

          if (size > 0) {
            state[type].splice(lowestIndex, deleteCount, newElement);
          } else {
            state[type].splice(lowestIndex, 1);
          }
        }
      }

      patch("bids");
      patch("asks");
    },

    switchProductId(state) {
      state.productId =
        state.productId === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";

      state.bids = [];
      state.asks = [];
    },

    setSocketState(state, action: PayloadAction<SocketState>) {
      state.socketState = action.payload;
    },
  },
});

export const { patchLevels, switchProductId, setSocketState } =
  orderBook.actions;

export default orderBook.reducer;
