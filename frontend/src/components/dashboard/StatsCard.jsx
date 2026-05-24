import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from '../../utils/helpers'

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'purple', className = '' }) {
  const colors = {
    purple: 'from-brand-purple/20 to-transparent border-brand-purple/20 text-brand-purple',
    blue: 'from-brand-blue/20 to-transparent border-brand-blue/20 text-brand-blue',
    cyan: 'from-brand-cyan/20 to-transparent border-brand-cyan/20 text-brand-cyan',
    green: 'from-emerald-500/20 to-transparent border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-transparent border-amber-500/20 text-amber-400',
    red: 'from-red-500/20 to-transparent border-red-500/20 text-red-400',
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'

  return (
    <div className={clsx('stat-card bg-gradient-to-br', colors[color].split(' ').slice(0, 2).join(' '), 'border', colors[color].split(' ')[2], className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-dark-600/80 flex items-center justify-center ${colors[color].split(' ').pop()}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={12} />
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-slate-100 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-300">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  )
}
