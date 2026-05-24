import { useNavigate } from 'react-router-dom'
import {
  Server, Database, Cpu, AlertTriangle, DollarSign,
  TrendingDown, Shield, ArrowRight, Brain, Upload, Plus
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import StatsCard from '../components/dashboard/StatsCard'
import CostComparisonChart from '../components/dashboard/CostComparisonChart'
import InfraDistribution from '../components/dashboard/InfraDistribution'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import MigrationProgress from '../components/dashboard/MigrationProgress'
import { StatusBadge } from '../components/ui/Badge'
import { dashboardStats, sampleServers } from '../utils/sampleData'
import { formatCurrency } from '../utils/helpers'

const quickActions = [
  { icon: Brain, label: 'AI Analysis', desc: 'Run full infrastructure analysis', to: '/recommendations', color: 'purple' },
  { icon: Upload, label: 'Import Data', desc: 'Upload CSV or connect API', to: '/inventory', color: 'blue' },
  { icon: Server, label: 'View Inventory', desc: 'Browse all assets', to: '/inventory', color: 'cyan' },
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const criticalServers = sampleServers.filter((s) => s.status === 'critical' || s.status === 'warning')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Good morning, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your migration platform has {dashboardStats.criticalIssues} critical issues requiring attention.
          </p>
        </div>
        <button
          onClick={() => navigate('/ai-chat')}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Brain size={16} />
          Ask AI Agent
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assets"
          value={dashboardStats.totalAssets}
          subtitle={`${dashboardStats.migrated} migrated`}
          icon={Server}
          trend="up"
          trendValue="+3 this month"
          color="purple"
        />
        <StatsCard
          title="Monthly Savings"
          value={formatCurrency(dashboardStats.totalSavings)}
          subtitle="vs current spend"
          icon={DollarSign}
          trend="up"
          trendValue={`${dashboardStats.savingsPercent}% savings`}
          color="green"
        />
        <StatsCard
          title="Risk Score"
          value={dashboardStats.riskScore}
          subtitle={`${dashboardStats.criticalIssues} critical issues`}
          icon={Shield}
          trend="down"
          trendValue="Improving"
          color="amber"
        />
        <StatsCard
          title="Pending Migration"
          value={dashboardStats.pending}
          subtitle="assets to migrate"
          icon={Cpu}
          color="blue"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost chart - 2 cols */}
        <div className="lg:col-span-2">
          <CostComparisonChart />
        </div>
        {/* Migration progress */}
        <MigrationProgress />
      </div>

      {/* Secondary grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infrastructure distribution */}
        <InfraDistribution />

        {/* Critical alerts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-header text-red-400 flex items-center gap-2">
              <AlertTriangle size={16} />
              Critical Alerts
            </h3>
            <span className="badge badge-red">{criticalServers.length} issues</span>
          </div>
          <div className="space-y-3">
            {criticalServers.map((server) => (
              <div key={server.id} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20 cursor-pointer hover:bg-red-500/10 transition-colors" onClick={() => navigate('/inventory')}>
                <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200">{server.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {server.os} · {server.region}
                  </div>
                  {server.os.includes('CentOS 6') && (
                    <div className="text-xs text-red-400 mt-1">⚠ End-of-life OS detected</div>
                  )}
                  {server.status === 'warning' && (
                    <div className="text-xs text-amber-400 mt-1">⚠ High resource utilization</div>
                  )}
                </div>
                <StatusBadge status={server.status} />
              </div>
            ))}
            {criticalServers.length === 0 && (
              <div className="text-center py-8 text-slate-600 text-sm">
                No critical issues — all systems healthy!
              </div>
            )}
          </div>
        </div>

        {/* Activity */}
        <ActivityFeed />
      </div>

      {/* Quick actions */}
      <div className="glass-card p-6">
        <h3 className="section-header mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map(({ icon: Icon, label, desc, to, color }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="flex items-start gap-4 p-4 rounded-xl border border-dark-600/50 bg-dark-700/30
                         hover:border-brand-purple/30 hover:bg-dark-700/60 transition-all duration-200 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center flex-shrink-0 group-hover:from-brand-purple/30 group-hover:to-brand-blue/30 transition-all duration-200">
                <Icon size={18} className="text-brand-purple-light" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-200 group-hover:text-slate-100">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 mt-1 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Top servers table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-header">Top Assets by Cost</h3>
          <button onClick={() => navigate('/inventory')} className="text-xs text-brand-purple-light hover:text-brand-purple flex items-center gap-1 transition-colors">
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left pb-3 pr-4">Asset</th>
                <th className="text-left pb-3 pr-4">Type</th>
                <th className="text-left pb-3 pr-4">Region</th>
                <th className="text-left pb-3 pr-4">Status</th>
                <th className="text-right pb-3">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {[...sampleServers]
                .sort((a, b) => b.cost - a.cost)
                .slice(0, 5)
                .map((server) => (
                  <tr key={server.id} className="table-row">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          server.status === 'active' ? 'bg-emerald-400' :
                          server.status === 'critical' ? 'bg-red-400' : 'bg-amber-400'
                        }`} />
                        <span className="font-medium text-slate-200">{server.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400">{server.os}</td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{server.region}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={server.migration_status} />
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-200">
                      {formatCurrency(server.cost)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
