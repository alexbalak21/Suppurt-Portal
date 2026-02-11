interface Slice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  slices: Slice[];
}

export default function DonutChart({ title, slices }: Props) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;

  let current = 0;
  const segments = slices.map(s => {
    const start = (current / total) * 360;
    const end = ((current + s.value) / total) * 360;
    current += s.value;
    return `${s.color} ${start}deg ${end}deg`;
  });

  const gradient = `conic-gradient(${segments.join(",")})`;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {title}
      </h2>

      <div className="relative w-40 h-40 mx-auto">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: gradient }}
        />
        <div
          className="absolute inset-0 m-auto rounded-full bg-white dark:bg-gray-900"
          style={{ width: "60%", height: "60%" }}
        />
      </div>

      {/* UPDATED LEGEND */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {slices.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {s.label} ({s.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
