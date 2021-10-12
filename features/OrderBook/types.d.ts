export type ProductId = "PI_XBTUSD" | "PI_ETHUSD";

export type Delta = [number, number];

export type State = {
  bids: Record<number, number>;
  asks: Record<number, number>;
  productId: ProductId;
};
