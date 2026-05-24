import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { costComparisonData } from '../../utils/sampleData'
import { formatCurrency } from '../../utils/helpers'
import { TrendingDown } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const savings = payload[0]?.value - payload[1]?.value
    return (
      <div className="glass-card px-4 py-3 text-xs space-y-1.5">
        <p className="font-semibold text-slate-200 mb-2">{label}</p>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">Current</span>
          <span className="text-amber-400 font-medium">{formatCurrency(payload[0]?.value)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-400">Projected</span>
          <span className="text-emerald-400 font-medium">{formatCurrency(payload[1]?.value)}</span>
        </div>
        <div className="flex items-center justify-between gap-6 border-t border-dark-600 pt-1.5">
          <span className="text-slate-400">Savings</span>
          <span className="text-brand-purple font-bold">{formatCurrency(savings)}</span>
        </div>
      </div>
    )
  }
  return null
}

export default function CostComparisonChart() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="section-header">Cost Comparison</h3>
          <p className="section-sub">Current vs. post-migration monthly spend</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <TrendingDown size={12} />
          ~64% savings
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={costComparisonData} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="current" name="Current" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Bar dataKey="projected" name="Projected" fill="#7c3aed" radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-6 mt-4 justify-center">
        {[
          { color: '#f59e0b', label: 'Current Monthly' },
          { color: '#7c3aed', label: 'Post-Migration' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
