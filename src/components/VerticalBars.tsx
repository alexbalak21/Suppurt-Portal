export interface BarSlice {
  label: string;
  value: number;
  color: string;
}

interface VerticalBarsProps {
  data: BarSlice[];
  maxY?: number;
  barWidth?: number;
  minHeight?: number;
}

const BAR_WIDTH = 48; // px

export function VerticalBars({
  data,
  maxY,
  minHeight = 8,
}: VerticalBarsProps) {
  const max = maxY || Math.max(...data.map(d => d.value), 1);

  const LABEL_HEIGHT = 40;

  return (
    <div className="flex items-end gap-6 h-full w-full">
      {data.map(slice => {
        if (slice.value === 0) return null;

        const heightPercent = (slice.value / max) * 100;

        return (
          <div
            key={slice.label}
            className="flex flex-col items-center flex-1 min-w-0"
            style={{ height: "100%" }}
          >
            {/* BAR AREA */}
            <div
              className="relative w-full flex items-end"
              style={{ height: `calc(100% - ${LABEL_HEIGHT}px)` }}
            >
              <div
                className={`w-full rounded-t ${slice.color}`}
                style={{
                  height: `${heightPercent}%`,
                  minHeight,
                  transition: "height 0.3s",
                }}
              />
            </div>

            {/* LABEL AREA */}
            <div
              className="flex flex-col items-center justify-center mt-1 mb-1 text-center w-full"
              style={{ height: LABEL_HEIGHT }}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight w-full text-center">
                {slice.label}
              </span>

              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-full text-center">
                {slice.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
