import { useSelector } from "../hooks/useStore";
import { formatFloat } from "../lib/formatter";
import { selectSpread, selectSpreadPercentage } from "../selectors";
import { Orientation } from "../types";

type Props = {
  orientation: Orientation;
};

function OrderBookSpread(props: Props) {
  const spread = useSelector((state) => selectSpread(state, props));
  const percent = useSelector((state) => selectSpreadPercentage(state, props));

  if (spread === null || percent === null) {
    return <div style={{ minHeight: 56 }} />;
  }

  return (
    <div
      style={{ minHeight: 56 }}
      className="text-gray-500 w-full flex items-center justify-center"
    >
      Spread {formatFloat(spread)} ({percent.toFixed(2)}%)
    </div>
  );
}

export default OrderBookSpread;
