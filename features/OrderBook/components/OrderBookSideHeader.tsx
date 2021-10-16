import { ReactNode } from "react";
import { Dir } from "../types";
import { Row, Cell } from "./OrderBookTableRow";

type Props = {
  children: ReactNode;
  dir: Dir;
};

function OrderBookSideHeader(props: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-500">
        <Row dir={props.dir}>
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
