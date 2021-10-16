const FormatInt = new Intl.NumberFormat("en");

export function formatInt(value: number) {
  try {
    return FormatInt.format(value);
  } catch {
    return String(value);
  }
}

const FormatFloat = new Intl.NumberFormat("en", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatFloat(value: number) {
  try {
    return FormatFloat.format(value);
  } catch {
    return String(value);
  }
}
