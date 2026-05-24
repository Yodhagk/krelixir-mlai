import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { infraDistribution, migrationStatusData } from '../../utils/sampleData'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0]
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="font-medium text-slate-200">{name}</p>
        <p className="text-slate-400">{value} assets</p>
      </div>
    )
  }
  return null
}

function DonutChart({ data, title, subtitle }) {
  return (
    <div>
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-200">{title}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map(({ name, value, color }) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-400">{name}</span>
              </div>
              <span className="text-xs font-semibold text-slate-200">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function InfraDistribution() {
  return (
    <div className="glass-card p-6">
      <h3 className="section-header mb-6">Infrastructure Overview</h3>
      <div className="grid grid-cols-1 gap-8">
        <DonutChart
          data={infraDistribution}
          title="Asset Distribution"
          subtitle="23 total assets"
        />
        <div className="border-t border-dark-600/50 pt-6">
          <DonutChart
            data={migrationStatusData}
            title="Migration Status"
            subtitle="4 migrated, 2 in progress"
          />
        </div>
      </div>
    </div>
  )
}
