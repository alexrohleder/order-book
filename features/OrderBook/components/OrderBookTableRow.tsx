import { useSelector } from "../hooks/useStore";
import {
  selectHighestTotal,
  selectPrice,
  selectSize,
  selectTotal,
} from "../selectors";

type Props = {
  index: number;
};

export const ROW_GREEN_BG = "bg-green-900";
export const ROW_RED_BG = "bg-red-900";

function OrderBookTableRow(props: Props) {
  const price = useSelector((s) => selectPrice(s, "bids", props.index));
  const size = useSelector((s) => selectSize(s, "bids", props.index));
  const total = useSelector((s) => selectTotal(s, "bids", props.index));
  const highestTotal = useSelector((s) => selectHighestTotal(s, "bids"));

  const barBgColor = "bg-green-900";
  const barPos = 100 - (total / highestTotal) * 100;

  return (
    <div role="row" className="grid grid-cols-3 relative">
      <div role="cell">{price}</div>
      <div role="cell">{size}</div>
      <div role="cell">{total}</div>
      <div
        className={`${barBgColor} bg-opacity-50 absolute h-full w-full`}
        style={{ transform: `translateX(${barPos}%)`, zIndex: -1 }}
        data-testid="OrderBookTableRowBg"
      />
    </div>
  );
}

export default OrderBookTableRow;
