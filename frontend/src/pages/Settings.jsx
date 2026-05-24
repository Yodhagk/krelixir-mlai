import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  User, Key, Bell, Shield, Globe, Palette, Building,
  Save, Eye, EyeOff, CheckCircle, AlertCircle, Trash2,
  RefreshCw, Download, Upload, Plus
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import useAppStore from '../store/appStore'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

function SectionHeader({ title, desc }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-slate-200">{title}</h2>
      {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
    </div>
  )
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-dark-600/30 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-300">{label}</div>
        {desc && <div className="text-xs text-slate-500 mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${value ? 'bg-brand-purple' : 'bg-dark-600'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  )
}

function ApiKeyRow({ name, value, description, status = 'not-set', onSave }) {
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value || '')

  return (
    <div className="p-4 rounded-xl bg-dark-700/30 border border-dark-600/50">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-sm font-medium text-slate-200">{name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${
          status === 'connected'
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : 'text-slate-500 bg-dark-600/50 border-dark-500/50'
        }`}>
          {status === 'connected' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
          {status === 'connected' ? 'Connected' : 'Not Set'}
        </div>
      </div>
      {editing ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={show ? 'text' : 'password'}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Enter API key..."
              className="input-field py-2 text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button
            onClick={() => { onSave?.(val); setEditing(false); toast.success(`${name} saved!`) }}
            className="btn-primary text-sm px-4"
          >
            Save
          </button>
          <button onClick={() => setEditing(false)} className="btn-secondary text-sm px-3">Cancel</button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-600">
            {status === 'connected' ? '••••••••••••••••••••' : '— not configured —'}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-brand-purple-light hover:text-brand-purple transition-colors"
          >
            {status === 'connected' ? 'Update' : 'Configure'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const { theme, toggleTheme } = useAppStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifSettings, setNotifSettings] = useState({
    migrationAlerts: true,
    costAlerts: true,
    weeklyReport: true,
    aiInsights: true,
    securityAlerts: true,
    teamActivity: false,
  })

  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', role: user?.role || '', company: '' }
  })

  const onSaveProfile = (data) => {
    updateUser(data)
    toast.success('Profile updated!')
  }

  const toggleNotif = (key) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account, integrations, and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`nav-item w-full ${activeTab === id ? 'active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6 min-h-[500px]">
          {/* Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-6">
              <SectionHeader title="Profile Settings" desc="Update your personal information and account details" />

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white text-2xl font-black">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <button type="button" className="btn-secondary text-sm py-2 px-4">Change Avatar</button>
                  <p className="text-xs text-slate-600 mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <input {...register('name', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Work Email</label>
                  <input {...register('email')} type="email" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Job Title</label>
                  <input {...register('role')} placeholder="e.g. Cloud Architect" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Company</label>
                  <input {...register('company')} placeholder="Your company name" className="input-field" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark-600/50">
                <div>
                  <p className="text-xs text-slate-500">Member since May 2025 · Pro Plan</p>
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
                  <Save size={15} />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* API Keys */}
          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <SectionHeader title="API Integrations" desc="Connect external services to enhance your migration platform" />

              <div className="space-y-3">
                <ApiKeyRow
                  name="OpenAI API Key"
                  description="Powers the AI Chat assistant and recommendations engine"
                  status="not-set"
                />
                <ApiKeyRow
                  name="AWS Access Key"
                  description="Connect your AWS account for real-time pricing and resource discovery"
                  status="not-set"
                />
                <ApiKeyRow
                  name="Azure Client Secret"
                  description="Microsoft Azure integration for migration targeting"
                  status="not-set"
                />
                <ApiKeyRow
                  name="GCP Service Account"
                  description="Google Cloud Platform integration"
                  status="not-set"
                />
              </div>

              <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/20">
                <h4 className="text-sm font-medium text-slate-300 mb-1">Krelixir API Key</h4>
                <p className="text-xs text-slate-500 mb-3">Use this to integrate Krelixir with your CI/CD pipelines</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-xs font-mono text-slate-400 bg-dark-800 px-3 py-2 rounded-lg truncate">
                    kxr_live_••••••••••••••••••••••••••••••••
                  </code>
                  <button className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
                    <RefreshCw size={12} />
                    Rotate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <SectionHeader title="Notification Preferences" desc="Choose what you want to be notified about" />
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Alerts</h3>
                <div className="glass-card p-4 divide-y-0">
                  <ToggleRow label="Migration Alerts" desc="Get notified when migrations start, complete, or fail" value={notifSettings.migrationAlerts} onChange={(v) => toggleNotif('migrationAlerts')} />
                  <ToggleRow label="Cost Threshold Alerts" desc="Alert when projected costs exceed budget" value={notifSettings.costAlerts} onChange={() => toggleNotif('costAlerts')} />
                  <ToggleRow label="Security Alerts" desc="Critical security vulnerabilities in your infrastructure" value={notifSettings.securityAlerts} onChange={() => toggleNotif('securityAlerts')} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Reports & Insights</h3>
                <div className="glass-card p-4">
                  <ToggleRow label="Weekly Migration Report" desc="Summary of progress, costs, and recommendations every Monday" value={notifSettings.weeklyReport} onChange={() => toggleNotif('weeklyReport')} />
                  <ToggleRow label="AI-Generated Insights" desc="New optimization opportunities detected by AI" value={notifSettings.aiInsights} onChange={() => toggleNotif('aiInsights')} />
                  <ToggleRow label="Team Activity" desc="When teammates make changes to inventory or settings" value={notifSettings.teamActivity} onChange={() => toggleNotif('teamActivity')} />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn-primary text-sm flex items-center gap-2" onClick={() => toast.success('Notification preferences saved!')}>
                  <Save size={15} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <SectionHeader title="Security Settings" desc="Manage your account security and access controls" />

              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Change Password</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Current Password</label>
                    <input type="password" className="input-field text-sm" placeholder="••••••••" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">New Password</label>
                      <input type="password" className="input-field text-sm" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Confirm Password</label>
                      <input type="password" className="input-field text-sm" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
                <button className="btn-primary text-sm" onClick={() => toast.success('Password updated!')}>Update Password</button>
              </div>

              <div className="glass-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <span className="badge badge-yellow">Recommended</span>
                </div>
                <button className="btn-secondary text-sm flex items-center gap-2">
                  <Shield size={14} />
                  Enable 2FA
                </button>
              </div>

              <div className="glass-card p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-200">Active Sessions</h3>
                {[
                  { device: 'Chrome on Windows 11', location: 'New York, US', current: true },
                  { device: 'Safari on iPhone', location: 'New York, US', current: false },
                ].map(({ device, location, current }) => (
                  <div key={device} className="flex items-center justify-between py-2 border-b border-dark-600/30 last:border-0">
                    <div>
                      <div className="text-sm text-slate-300">{device}</div>
                      <div className="text-xs text-slate-600">{location}</div>
                    </div>
                    {current ? (
                      <span className="badge badge-green">Current</span>
                    ) : (
                      <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="glass-card p-4 border-red-500/20">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-xs text-slate-500 mb-3">Permanently delete your account and all associated data.</p>
                <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10 border border-red-500/20">
                  <Trash2 size={14} />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <SectionHeader title="Appearance" desc="Customize how Krelixir looks and feels" />

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark', preview: 'bg-dark-900 border-dark-700' },
                    { id: 'light', label: 'Light', preview: 'bg-slate-100 border-slate-200' },
                    { id: 'auto', label: 'System', preview: 'bg-gradient-to-r from-dark-900 to-slate-100 border-dark-600' },
                  ].map(({ id, label, preview }) => (
                    <button
                      key={id}
                      onClick={() => { if (id !== 'auto') { if (id !== theme) toggleTheme() } toast.success(`${label} theme applied!`) }}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        (id === 'dark' && theme === 'dark') || (id === 'light' && theme === 'light')
                          ? 'border-brand-purple text-brand-purple-light'
                          : 'border-dark-600 text-slate-500 hover:border-dark-500'
                      }`}
                    >
                      <div className={`w-full h-8 rounded mb-2 border ${preview}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Sidebar</h3>
                <div className="glass-card p-4 space-y-3">
                  <ToggleRow label="Compact Mode" desc="Use a smaller sidebar with icons only" value={false} onChange={() => toast('Coming soon!')} />
                  <ToggleRow label="Show Status Bar" desc="Display system status at the bottom of sidebar" value={true} onChange={() => toast('Coming soon!')} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Data Display</h3>
                <div className="glass-card p-4 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">Currency Format</label>
                    <select className="input-field text-sm w-48">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">Date Format</label>
                    <select className="input-field text-sm w-48">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
