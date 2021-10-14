import useBreakpoint from "use-breakpoint";
import OrderBook from "../features/OrderBook";

const breakpoints = {
  VERTICAL: 0,
  HORIZONTAL: 1024,
};

export default function Responsive() {
  const { breakpoint } = useBreakpoint(breakpoints, "VERTICAL");

  return (
    <div className="h-screen">
      <OrderBook orientation={breakpoint} />
    </div>
  );
}
