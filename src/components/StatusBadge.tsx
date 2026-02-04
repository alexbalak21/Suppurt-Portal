import { colorClasses } from '../features/theme/badgeColors'
import type { BadgeColor } from '../features/theme/badgeColors'

interface BadgeProps {
  text?: string
  color?: BadgeColor
}

export default function StatusBadge({ text, color = "gray" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${colorClasses[color]}`}
    >
      {text}
    </span>
  )
}
