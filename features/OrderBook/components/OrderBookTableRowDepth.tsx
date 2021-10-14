import { useSelector } from "../hooks/useStore";
import { selectHighestTotal } from "../selectors";
import { DeltaType } from "../types";

export const ROW_GREEN_BG = "bg-green-900";
export const ROW_RED_BG = "bg-red-900";

type Props = {
  type: DeltaType;
  total: number | undefined;
  rtl?: boolean;
};

function OrderBookTableRowBackground(props: Props) {
  const highestTotal = useSelector((s) => selectHighestTotal(s, props.type));

  if (!props.total || !highestTotal) {
    return null;
  }

  const barBgColor = props.type === "bids" ? ROW_GREEN_BG : ROW_RED_BG;
  const barPos =
    (100 - (props.total / highestTotal) * 100) * (props.rtl ? -1 : 1);

  return (
    <div
      className={`${barBgColor} bg-opacity-50 absolute h-full w-full`}
      style={{ transform: `translateX(${barPos}%)`, zIndex: -1 }}
      data-testid="OrderBookTableRowBackground"
    />
  );
}

export default OrderBookTableRowBackground;
