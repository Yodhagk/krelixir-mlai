import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { dashboardStats } from '../../utils/sampleData'
import { formatCurrency } from '../../utils/helpers'
import { DollarSign, TrendingDown } from 'lucide-react'

export default function MigrationProgress() {
  const { migrationReadiness, totalCurrentCost, totalProjectedCost, totalSavings, savingsPercent } = dashboardStats
  const data = [{ value: migrationReadiness, fill: '#7c3aed' }]

  return (
    <div className="glass-card p-6">
      <h3 className="section-header mb-5">Migration Readiness</h3>

      {/* Radial gauge */}
      <div className="relative h-36 flex items-center justify-center mb-4">
        <ResponsiveContainer width={140} height={140}>
          <RadialBarChart
            innerRadius="60%"
            outerRadius="80%"
            data={data}
            startAngle={225}
            endAngle={-45}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#1e293b' }}
              dataKey="value"
              cornerRadius={6}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-black gradient-text">{migrationReadiness}%</div>
          <div className="text-xs text-slate-500">Ready</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Assets migrated</span>
          <span>4 / {dashboardStats.totalAssets}</span>
        </div>
        <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full"
            style={{ width: `${(4 / dashboardStats.totalAssets) * 100}%` }}
          />
        </div>
      </div>

      {/* Cost savings */}
      <div className="space-y-2 border-t border-dark-600/50 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Current monthly cost</span>
          <span className="text-amber-400 font-medium">{formatCurrency(totalCurrentCost)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Projected cost</span>
          <span className="text-emerald-400 font-medium">{formatCurrency(totalProjectedCost)}</span>
        </div>
        <div className="flex items-center justify-between text-xs border-t border-dark-600/30 pt-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <TrendingDown size={12} className="text-emerald-400" />
            Annual savings
          </span>
          <span className="gradient-text font-bold">{formatCurrency(totalSavings * 12)}</span>
        </div>
      </div>
    </div>
  )
}
