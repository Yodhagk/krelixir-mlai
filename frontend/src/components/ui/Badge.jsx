import { clsx } from '../../utils/helpers'

const variants = {
  green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  yellow: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  gray: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

const statusVariant = {
  active: 'green', healthy: 'green',
  inactive: 'red', critical: 'red',
  warning: 'yellow', pending: 'yellow',
  migrating: 'blue',
  migrated: 'purple',
  low: 'green', medium: 'yellow', high: 'red',
}

export function Badge({ children, variant = 'gray', status, className = '' }) {
  const resolvedVariant = status ? (statusVariant[status?.toLowerCase()] || 'gray') : variant
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[resolvedVariant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <Badge status={status}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </Badge>
  )
}

export default Badge
