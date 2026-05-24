import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Server, Brain, BarChart3, MessageSquare,
  Settings, ChevronLeft, ChevronRight, Zap, TrendingUp, Shield
} from 'lucide-react'
import useAppStore from '../../store/appStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventory', icon: Server, label: 'Inventory' },
  { to: '/recommendations', icon: TrendingUp, label: 'Recommendations' },
  { to: '/ai-chat', icon: MessageSquare, label: 'AI Agent' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <aside
      className={`
        relative flex flex-col h-full bg-dark-800 border-r border-dark-600/50
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-dark-600/50 ${!sidebarOpen && 'justify-center'}`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <div className="font-bold text-slate-100 text-sm leading-tight">Krelixir</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Migration AI</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarOpen && (
          <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-slate-600 font-medium">
            Main Menu
          </p>
        )}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`
            }
            title={!sidebarOpen ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Status indicator */}
      {sidebarOpen && (
        <div className="p-4 border-t border-dark-600/50">
          <div className="glass-card p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-brand-cyan" />
              <span className="text-xs font-medium text-slate-300">Platform Status</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">API</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">AI Engine</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-700 border border-dark-600
                   flex items-center justify-center text-slate-400 hover:text-slate-100
                   hover:bg-dark-600 transition-all duration-200 z-10 shadow-lg"
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  )
}
