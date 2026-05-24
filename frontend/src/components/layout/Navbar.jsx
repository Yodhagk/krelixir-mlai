import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Sun, Moon, ChevronDown, LogOut, User, Settings, Zap } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useAppStore from '../../store/appStore'
import { sampleActivity } from '../../utils/sampleData'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme, notifications } = useAppStore()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unread = sampleActivity.length

  return (
    <header className="h-16 bg-dark-800 border-b border-dark-600/50 flex items-center justify-between px-6 flex-shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search assets, recommendations..."
          className="w-full bg-dark-700 border border-dark-600/50 rounded-xl pl-9 pr-4 py-2 text-sm
                     text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-brand-purple/50
                     focus:bg-dark-700 transition-all duration-200"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400
                     hover:text-slate-100 hover:bg-dark-700 transition-all duration-200"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false) }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400
                       hover:text-slate-100 hover:bg-dark-700 transition-all duration-200"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-purple rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 glass-card shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-600/50 flex items-center justify-between">
                <span className="text-sm font-semibold">Notifications</span>
                <span className="text-xs text-brand-purple">{unread} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {sampleActivity.slice(0, 5).map((item) => (
                  <div key={item.id} className="px-4 py-3 border-b border-dark-600/30 hover:bg-dark-600/30 cursor-pointer">
                    <p className="text-xs text-slate-300">{item.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{item.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-brand-purple hover:text-brand-purple-light">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI badge */}
        <button
          onClick={() => navigate('/ai-chat')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-purple/20 to-brand-blue/20
                     border border-brand-purple/30 text-xs text-brand-purple-light hover:from-brand-purple/30
                     hover:to-brand-blue/30 transition-all duration-200"
        >
          <Zap size={12} />
          <span>AI Agent</span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false) }}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-dark-700 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium text-slate-200 leading-tight">{user?.name || 'User'}</div>
              <div className="text-[10px] text-slate-500 leading-tight capitalize">{user?.role || 'admin'}</div>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 glass-card shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-600/50">
                <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400
                             hover:text-slate-100 hover:bg-dark-600/60 transition-all duration-200"
                >
                  <Settings size={14} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400
                             hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(showProfile || showNotifs) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowProfile(false); setShowNotifs(false) }}
        />
      )}
    </header>
  )
}
