export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'gray'
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

const colorClasses = {
  primary: 'border-primary-500 border-t-transparent',
  gray: 'border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300',
}

export function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  )
}