import { RefObject, useEffect, useLayoutEffect, useState } from "react";

type Size = {
  width: number;
  height: number;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function useElementSize<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>
): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useIsomorphicLayoutEffect(() => {
    const computeSize = () => {
      requestAnimationFrame(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();

          setSize({
            width: rect.width,
            height: rect.height,
          });
        }
      });
    };

    computeSize();

    if ("addEventListener" in window) {
      window.addEventListener("resize", computeSize);

      return () => window.removeEventListener("resize", computeSize);
    }
  }, [setSize, ref]);

  return size;
}

export default useElementSize;
