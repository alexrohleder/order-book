import * as fc from "fast-check";
import { formatInt, formatFloat } from "./formatter";

describe("In the OrderBook formatters", () => {
  describe("The formatInt", () => {
    it("should not throw with NaN", () => {
      expect(formatInt(NaN)).toBe("NaN");
    });

    it("should be consistent with unknown argument types", () => {
      expect(formatInt("MyString" as any)).toBe("NaN");
      expect(formatInt(undefined as any)).toBe("NaN");
      expect(formatInt(null as any)).toBe("0");
      expect(formatInt(false as any)).toBe("0");
      expect(formatInt(true as any)).toBe("1");
    });

    it("should format integers", () => {
      expect(formatInt(-1000)).toBe("-1,000");
      expect(formatInt(-10)).toBe("-10");
      expect(formatInt(0)).toBe("0");
      expect(formatInt(10)).toBe("10");
      expect(formatInt(100)).toBe("100");
      expect(formatInt(1_000)).toBe("1,000");
      expect(formatInt(10_000)).toBe("10,000");
      expect(formatInt(100_000)).toBe("100,000");
      expect(formatInt(1_000_000)).toBe("1,000,000");
      expect(formatInt(1_000_000_000)).toBe("1,000,000,000");
    });

    it("should always contain the number if integer", () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          expect(formatInt(n).replace(/,/g, "")).toBe(n.toString());
        })
      );
    });
  });

  describe("The formatFloat", () => {
    it("should not throw with NaN", () => {
      expect(formatFloat(NaN)).toBe("NaN");
    });

    it("should be consistent with unknown argument types", () => {
      expect(formatFloat("MyString" as any)).toBe("NaN");
      expect(formatFloat(undefined as any)).toBe("NaN");
      expect(formatFloat(null as any)).toBe("0.00");
      expect(formatFloat(false as any)).toBe("0.00");
      expect(formatFloat(true as any)).toBe("1.00");
    });

    it("should format floats", () => {
      expect(formatFloat(1_000)).toBe("1,000.00");
      expect(formatFloat(1_000.5)).toBe("1,000.50");
    });

    it("should always have 2 decimals", () => {
      expect(formatFloat(1_000.12345)).toBe("1,000.12");
      expect(formatFloat(1_000.55)).toBe("1,000.55");
      expect(formatFloat(1_000.989)).toBe("1,000.99"); // notice rounding
    });

    it("should always contain the number if float", () => {
      fc.assert(
        fc.property(fc.float(), (n) => {
          expect(formatFloat(n).replace(/,/g, "")).toBe(
            n === 0 ? "0.00" : n.toFixed(2)
          );
        })
      );
    });
  });
});
