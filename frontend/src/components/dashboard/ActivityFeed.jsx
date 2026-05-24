import { CheckCircle, AlertTriangle, Info, Upload, Server } from 'lucide-react'
import { sampleActivity } from '../../utils/sampleData'

const icons = {
  migration: { icon: Server, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  analysis: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  upload: { icon: Upload, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
}

export default function ActivityFeed() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-header">Recent Activity</h3>
        <button className="text-xs text-brand-purple-light hover:text-brand-purple transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {sampleActivity.map((item) => {
          const config = icons[item.type] || icons.analysis
          const Icon = config.icon
          return (
            <div key={item.id} className="flex items-start gap-3 group">
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 leading-snug group-hover:text-slate-200 transition-colors">
                  {item.message}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                item.status === 'success' ? 'bg-emerald-400' :
                item.status === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
              }`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
