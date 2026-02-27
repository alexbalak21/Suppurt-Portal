interface ServerStatusChipProps {
  online: boolean | null;
  starting: boolean;
}

export default function ServerStatusChip({ online, starting }: ServerStatusChipProps) {
  if (online === null && !starting) return null;

  const config =
    online === true
      ? {
          dotClass: "bg-green-500",
          textClass: "text-green-700 dark:text-green-300",
          bgClass: "bg-green-100 dark:bg-green-900/30",
          label: "Server online",
        }
      : online === false
        ? {
            dotClass: "bg-red-500",
            textClass: "text-red-700 dark:text-red-300",
            bgClass: "bg-red-100 dark:bg-red-900/30",
            label: "Server unreachable",
          }
        : {
            dotClass: "bg-yellow-500 animate-pulse",
            textClass: "text-yellow-700 dark:text-yellow-300",
            bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
            label: "Server starting…",
          };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgClass} ${config.textClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
