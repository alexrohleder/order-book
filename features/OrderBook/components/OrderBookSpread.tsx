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
    return null;
  }

  return (
    <div className="text-gray-500 text-center w-full">
      Spread {formatFloat(spread)} ({percent.toFixed(2)}%)
    </div>
  );
}

export default OrderBookSpread;
