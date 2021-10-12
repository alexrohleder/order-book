export type ProductId = "PI_XBTUSD" | "PI_ETHUSD";

export type Delta = [number, number];

export type SocketMessage = {
  bids: Delta[];
  asks: Delta[];
};

export type State = {
  bids: Delta[];
  asks: Delta[];
  productId: ProductId;
};
