import { ReactNode } from "react";
import { Row, Cell } from "./OrderBookSideLevelBase";

type Props = {
  children: ReactNode;
  rtl?: boolean;
};

function OrderBookSideHeader(props: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-500">
        <Row rtl={props.rtl}>
          <Cell color="text-gray-500">TOTAL</Cell>
          <Cell color="text-gray-500">SIZE</Cell>
          <Cell color="text-gray-500">PRICE</Cell>
        </Row>
      </div>
      {props.children}
    </div>
  );
}

export default OrderBookSideHeader;
