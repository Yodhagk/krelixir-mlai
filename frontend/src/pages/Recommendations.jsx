import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain, TrendingDown, AlertTriangle, Clock, ArrowRight,
  CheckCircle, DollarSign, ChevronDown, ChevronRight, Zap,
  BarChart3, Shield, RefreshCw, Filter, Star
} from 'lucide-react'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { sampleRecommendations } from '../utils/sampleData'
import { formatCurrency } from '../utils/helpers'
import Modal from '../components/ui/Modal'

const strategyConfig = {
  rehost: { label: 'Rehost', subtitle: 'Lift & Shift', color: 'blue', icon: '🚀' },
  replatform: { label: 'Replatform', subtitle: 'Optimize & Move', color: 'purple', icon: '⚡' },
  refactor: { label: 'Refactor', subtitle: 'Re-architect', color: 'cyan', icon: '🏗️' },
  retire: { label: 'Retire', subtitle: 'Decommission', color: 'red', icon: '🗑️' },
  retain: { label: 'Retain', subtitle: 'Keep On-Prem', color: 'yellow', icon: '🔒' },
}

const effortConfig = {
  low: { label: 'Low Effort', color: 'green' },
  medium: { label: 'Medium Effort', color: 'yellow' },
  high: { label: 'High Effort', color: 'red' },
}

function RecommendationCard({ rec, onExpand, isExpanded }) {
  const strategy = strategyConfig[rec.strategy] || strategyConfig.rehost

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 ${isExpanded ? 'border-brand-purple/40' : ''}`}>
      {/* Card header */}
      <div
        className="p-5 cursor-pointer hover:bg-dark-600/20 transition-colors"
        onClick={() => onExpand(rec.id)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-2xl flex-shrink-0">{strategy.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-slate-100">{rec.assetName}</span>
                <Badge variant="gray" className="text-[10px]">{rec.assetType}</Badge>
                <Badge variant={strategy.color}>{strategy.label} · {strategy.subtitle}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><Shield size={11} />{rec.targetPlatform}</span>
                <span>→</span>
                <span className="text-slate-400 font-medium">{rec.targetService}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Savings badge */}
            <div className="text-right hidden sm:block">
              <div className="text-xl font-black text-emerald-400">{formatCurrency(rec.savings)}</div>
              <div className="text-xs text-slate-500">savings/month</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Badge status={rec.risk}>{rec.risk} risk</Badge>
              <Badge variant={effortConfig[rec.effort]?.color || 'gray'}>
                {effortConfig[rec.effort]?.label}
              </Badge>
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Metrics bar */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-dark-600/30">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">{formatCurrency(rec.currentCost)}</div>
            <div className="text-[10px] text-slate-600 uppercase tracking-wide">Current</div>
          </div>
          <div className="text-center relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-full h-px bg-dark-600" />
              <ArrowRight size={14} className="text-emerald-400 absolute bg-dark-700 rounded px-0.5" />
            </div>
            <div className="text-lg font-bold text-emerald-400">{formatCurrency(rec.projectedCost)}</div>
            <div className="text-[10px] text-slate-600 uppercase tracking-wide">Projected</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-purple-light">{rec.savingsPercent}%</div>
            <div className="text-[10px] text-slate-600 uppercase tracking-wide">Reduction</div>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-dark-600/50 p-5 space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Benefits */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-400" />
                Benefits
              </h4>
              <ul className="space-y-2">
                {rec.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-400">
                    <Star size={11} className="text-emerald-400 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                Risks to Consider
              </h4>
              <ul className="space-y-2">
                {rec.risks.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Migration steps */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Zap size={14} className="text-brand-purple" />
              Migration Steps
              <span className="ml-1 text-xs text-slate-500">({rec.timeframe})</span>
            </h4>
            <div className="space-y-2">
              {rec.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 text-sm text-slate-400 pt-0.5">{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Zap size={14} />
              Start Migration
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <BarChart3 size={14} />
              Detailed Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Recommendations() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState(null)
  const [strategyFilter, setStrategyFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [analyzing, setAnalyzing] = useState(false)

  const filtered = sampleRecommendations.filter((r) => {
    if (strategyFilter !== 'all' && r.strategy !== strategyFilter) return false
    if (riskFilter !== 'all' && r.risk !== riskFilter) return false
    return true
  })

  const totalSavings = filtered.reduce((s, r) => s + r.savings, 0)
  const totalCurrent = filtered.reduce((s, r) => s + r.currentCost, 0)

  const handleAnalyze = async () => {
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2000))
    setAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">AI Recommendations</h1>
          <p className="text-slate-500 text-sm mt-1">
            {sampleRecommendations.length} migration recommendations generated by AI analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshCw size={15} className={analyzing ? 'animate-spin' : ''} />
            {analyzing ? 'Analyzing...' : 'Re-analyze'}
          </button>
          <button
            onClick={() => navigate('/ai-chat')}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Brain size={15} />
            Ask AI
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Recommendations', value: sampleRecommendations.length, icon: BarChart3, color: 'text-brand-purple' },
          { label: 'Monthly Savings', value: formatCurrency(totalSavings), icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Assets Analyzed', value: '23', icon: Brain, color: 'text-blue-400' },
          { label: 'Avg Time to Migrate', value: '8 wks', icon: Clock, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <div className={`${color} mb-2`}><Icon size={18} /></div>
            <div className="text-xl font-bold text-slate-100">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Strategy breakdown */}
      <div className="glass-card p-5">
        <h3 className="section-header mb-4">Recommended Migration Strategies</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(strategyConfig).map(([key, { label, icon, color }]) => {
            const count = sampleRecommendations.filter(r => r.strategy === key).length
            return (
              <button
                key={key}
                onClick={() => setStrategyFilter(strategyFilter === key ? 'all' : key)}
                className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                  strategyFilter === key
                    ? 'border-brand-purple bg-brand-purple/10'
                    : 'border-dark-600/50 hover:border-dark-500 bg-dark-700/30'
                }`}
              >
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-xs font-semibold text-slate-300">{label}</div>
                <div className="text-lg font-black gradient-text mt-1">{count}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter size={14} />
          <span>Filter:</span>
        </div>
        {[
          { label: 'All Risks', value: 'all' },
          { label: 'Low Risk', value: 'low' },
          { label: 'Medium Risk', value: 'medium' },
          { label: 'High Risk', value: 'high' },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setRiskFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              riskFilter === value
                ? 'bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30'
                : 'bg-dark-700 text-slate-500 hover:text-slate-300 border border-dark-600'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="text-xs text-slate-600 ml-auto">
          Showing {filtered.length} of {sampleRecommendations.length} recommendations ·
          <span className="text-emerald-400 font-medium ml-1">{formatCurrency(totalSavings)}/mo savings</span>
        </span>
      </div>

      {/* Recommendations list */}
      <div className="space-y-4">
        {filtered.map((rec) => (
          <RecommendationCard
            key={rec.id}
            rec={rec}
            isExpanded={expandedId === rec.id}
            onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Brain size={40} className="mx-auto mb-3 opacity-30" />
            <p>No recommendations match the current filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
