export function formatInt(value: number) {
  try {
    return value.toLocaleString("en-US");
  } catch {
    return value.toString();
  }
}

export function formatFloat(value: number | undefined) {
  if (Number.isNaN(value) || typeof value !== "number") {
    return "NaN";
  }

  const withPrecision =
    typeof value.toFixed === "function" ? value.toFixed(2) : value + ".00"; // integer

  const [int, decimals] = withPrecision.split(".");
  return formatInt(Number(int)) + "." + decimals;
}
