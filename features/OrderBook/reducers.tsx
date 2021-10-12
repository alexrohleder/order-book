import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Delta, State } from "./types";

export const initialState: State = {
  bids: {},
  asks: {},
  productId: "PI_XBTUSD",
};

const orderBook = createSlice({
  name: "OrderBook",
  initialState,
  reducers: {
    patchLevels(
      state,
      action: PayloadAction<{ asks: Delta[]; bids: Delta[] }>
    ) {
      function update(type: "bids" | "asks") {
        for (const [price, size] of action.payload[type]) {
          state[type][price] = size;

          if (size === 0) {
            delete state[type][price];
          }
        }
      }

      update("bids");
      update("asks");
    },

    switchProductId(state) {
      state.productId =
        state.productId === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";

      state.bids = {};
      state.asks = {};
    },
  },
});

export const { patchLevels, switchProductId } = orderBook.actions;

export default orderBook.reducer;
