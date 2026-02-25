interface Bar {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  title: string;
  bars: Bar[];
}

export default function HorizontalBarChart({ title, bars }: Props) {
  const max = Math.max(...bars.map(b => b.value), 1);

  return (
      <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-lg shadow px-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {title}
      </h2>

        <div className="flex-1 flex flex-col space-y-5 justify-center">
          {bars.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{b.label}</span>
              <span>{b.value}</span>
            </div>
            
            <div className="w-full h-3 rounded bg-gray-200 dark:bg-gray-700">
              <div
                className="h-3 rounded"
                style={{
                  width: `${(b.value / max) * 100}%`,
                  backgroundColor: b.color || '#6366f1',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
