import { RefObject, useLayoutEffect, useRef, useState } from 'react';

export const displayedLocationName = (location: string): string =>
  location.search('United States of America') !== -1
    ? location.replace('United States of America', 'United States')
    : location;

export const getMaxArtistsInWidth = (
  containerWidth: number,
  bigScreen: boolean,
) => Math.floor(containerWidth / (bigScreen ? 100 : 75));

export const useMeasure = (): [
  RefObject<HTMLDivElement | null>,
  { width: number; height: number },
] => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (element) {
      // Set initial dimensions
      setDimensions({
        width: element.clientWidth,
        height: element.clientHeight,
      });

      const resizeObserver = new ResizeObserver(() => {
        setDimensions({
          width: element.clientWidth,
          height: element.clientHeight,
        });
      });
      resizeObserver.observe(element);
      return () => resizeObserver.disconnect();
    }
  }, [ref]);

  return [ref, dimensions];
};
