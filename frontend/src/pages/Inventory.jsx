import { useState, useMemo } from 'react'
import {
  Server, Database, Globe, Network, Search, Upload, Plus,
  Filter, Download, RefreshCw, Cpu, HardDrive, MemoryStick as Ram,
  Trash2, Edit, ChevronUp, ChevronDown
} from 'lucide-react'
import Modal from '../components/ui/Modal'
import FileUpload from '../components/inventory/FileUpload'
import { StatusBadge, Badge } from '../components/ui/Badge'
import { formatCurrency } from '../utils/helpers'
import {
  sampleServers, sampleDatabases, sampleApplications, sampleNetwork
} from '../utils/sampleData'

const tabs = [
  { id: 'servers', label: 'Servers', icon: Server, data: sampleServers },
  { id: 'databases', label: 'Databases', icon: Database, data: sampleDatabases },
  { id: 'applications', label: 'Applications', icon: Globe, data: sampleApplications },
  { id: 'network', label: 'Network', icon: Network, data: sampleNetwork },
]

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <div className="w-3" />
  return sortDir === 'asc' ? <ChevronUp size={12} className="text-brand-purple" /> : <ChevronDown size={12} className="text-brand-purple" />
}

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('servers')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [selectedIds, setSelectedIds] = useState(new Set())

  const currentTab = tabs.find((t) => t.id === activeTab)
  const allData = currentTab?.data || []

  const filtered = useMemo(() => {
    let data = allData
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((item) =>
        item.name.toLowerCase().includes(q) ||
        (item.os || item.engine || item.stack || item.subtype || '').toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      data = data.filter((item) => item.status === statusFilter)
    }
    return [...data].sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [allData, search, statusFilter, sortField, sortDir])

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(d => d.id)))
  }

  const totalCost = filtered.reduce((sum, item) => sum + (item.cost || 0), 0)

  const ThCol = ({ field, children, className = '' }) => (
    <th
      className={`text-left pb-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
      </div>
    </th>
  )

  const ServerTable = ({ data }) => (
    <table className="w-full text-sm min-w-[800px]">
      <thead>
        <tr>
          <th className="pb-3 pr-4 w-10"><input type="checkbox" onChange={toggleAll} checked={selectedIds.size === data.length && data.length > 0} className="w-4 h-4 rounded bg-dark-700 border-dark-600" /></th>
          <ThCol field="name">Name</ThCol>
          <ThCol field="os">OS</ThCol>
          <ThCol field="cpu">CPU</ThCol>
          <ThCol field="ram">RAM</ThCol>
          <ThCol field="region">Region</ThCol>
          <ThCol field="status">Status</ThCol>
          <ThCol field="migration_status">Migration</ThCol>
          <ThCol field="cost" className="text-right">Monthly Cost</ThCol>
          <th className="pb-3 w-16"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className={`table-row ${selectedIds.has(row.id) ? 'bg-brand-purple/5' : ''}`}>
            <td className="py-3 pr-4"><input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 rounded bg-dark-700 border-dark-600" /></td>
            <td className="py-3 pr-4">
              <div className="font-medium text-slate-200">{row.name}</div>
              <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                {row.tags?.map(t => <span key={t} className="px-1.5 py-0.5 bg-dark-600/60 rounded text-slate-500">{t}</span>)}
              </div>
            </td>
            <td className="py-3 pr-4 text-slate-400">{row.os}</td>
            <td className="py-3 pr-4"><span className="flex items-center gap-1 text-slate-400"><Cpu size={12} />{row.cpu}</span></td>
            <td className="py-3 pr-4 text-slate-400">{row.ram} GB</td>
            <td className="py-3 pr-4 text-slate-500 text-xs">{row.region}</td>
            <td className="py-3 pr-4"><StatusBadge status={row.status} /></td>
            <td className="py-3 pr-4"><StatusBadge status={row.migration_status} /></td>
            <td className="py-3 text-right font-semibold text-slate-200">{formatCurrency(row.cost)}</td>
            <td className="py-3">
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-dark-600 transition-all"><Edit size={12} /></button>
                <button className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={12} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const DatabaseTable = ({ data }) => (
    <table className="w-full text-sm min-w-[800px]">
      <thead>
        <tr>
          <ThCol field="name">Name</ThCol>
          <ThCol field="engine">Engine</ThCol>
          <ThCol field="size">Size</ThCol>
          <ThCol field="connections">Connections</ThCol>
          <ThCol field="region">Region</ThCol>
          <ThCol field="status">Status</ThCol>
          <ThCol field="migration_status">Migration</ThCol>
          <ThCol field="cost" className="text-right">Monthly Cost</ThCol>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="table-row">
            <td className="py-3 pr-4 font-medium text-slate-200">{row.name}</td>
            <td className="py-3 pr-4 text-slate-400">{row.engine}</td>
            <td className="py-3 pr-4 text-slate-400">{row.size}</td>
            <td className="py-3 pr-4 text-slate-400">{row.connections?.toLocaleString()}</td>
            <td className="py-3 pr-4 text-slate-500 text-xs">{row.region}</td>
            <td className="py-3 pr-4"><StatusBadge status={row.status} /></td>
            <td className="py-3 pr-4"><StatusBadge status={row.migration_status} /></td>
            <td className="py-3 text-right font-semibold text-slate-200">{formatCurrency(row.cost)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const AppTable = ({ data }) => (
    <table className="w-full text-sm min-w-[800px]">
      <thead>
        <tr>
          <ThCol field="name">Name</ThCol>
          <ThCol field="stack">Tech Stack</ThCol>
          <ThCol field="instances">Instances</ThCol>
          <ThCol field="region">Region</ThCol>
          <ThCol field="status">Status</ThCol>
          <ThCol field="migration_status">Migration</ThCol>
          <ThCol field="cost" className="text-right">Monthly Cost</ThCol>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="table-row">
            <td className="py-3 pr-4 font-medium text-slate-200">{row.name}</td>
            <td className="py-3 pr-4 text-slate-400">{row.stack}</td>
            <td className="py-3 pr-4 text-slate-400">{row.instances}</td>
            <td className="py-3 pr-4 text-slate-500 text-xs">{row.region}</td>
            <td className="py-3 pr-4"><StatusBadge status={row.status} /></td>
            <td className="py-3 pr-4"><StatusBadge status={row.migration_status} /></td>
            <td className="py-3 text-right font-semibold text-slate-200">{formatCurrency(row.cost)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const NetworkTable = ({ data }) => (
    <table className="w-full text-sm min-w-[800px]">
      <thead>
        <tr>
          <ThCol field="name">Name</ThCol>
          <ThCol field="subtype">Type</ThCol>
          <ThCol field="bandwidth">Bandwidth</ThCol>
          <ThCol field="region">Region</ThCol>
          <ThCol field="status">Status</ThCol>
          <ThCol field="migration_status">Migration</ThCol>
          <ThCol field="cost" className="text-right">Monthly Cost</ThCol>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="table-row">
            <td className="py-3 pr-4 font-medium text-slate-200">{row.name}</td>
            <td className="py-3 pr-4 text-slate-400">{row.subtype}</td>
            <td className="py-3 pr-4 text-slate-400">{row.bandwidth}</td>
            <td className="py-3 pr-4 text-slate-500 text-xs">{row.region}</td>
            <td className="py-3 pr-4"><StatusBadge status={row.status} /></td>
            <td className="py-3 pr-4"><StatusBadge status={row.migration_status} /></td>
            <td className="py-3 text-right font-semibold text-slate-200">{formatCurrency(row.cost)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const renderTable = () => {
    if (!filtered.length) {
      return (
        <div className="text-center py-16 text-slate-600">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>No assets found matching your search.</p>
        </div>
      )
    }
    switch (activeTab) {
      case 'servers': return <ServerTable data={filtered} />
      case 'databases': return <DatabaseTable data={filtered} />
      case 'applications': return <AppTable data={filtered} />
      case 'network': return <NetworkTable data={filtered} />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">
            {allData.length} assets across {tabs.length} categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={15} />
            Export
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Upload size={15} />
            Import
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} />
            Add Asset
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-2 border-b border-dark-600/50 pb-0">
        {tabs.map(({ id, label, icon: Icon, data }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setSearch(''); setStatusFilter('all') }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 -mb-px ${
              activeTab === id
                ? 'border-brand-purple text-brand-purple-light'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={15} />
            {label}
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              activeTab === id ? 'bg-brand-purple/20 text-brand-purple' : 'bg-dark-700 text-slate-600'
            }`}>
              {data.length}
            </span>
          </button>
        ))}
      </div>

      {/* Main card */}
      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-dark-600/50 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 py-2 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-2 text-sm w-36"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="migrated">Migrated</option>
          </select>
          <button className="btn-ghost flex items-center gap-2 text-sm py-2">
            <Filter size={14} />
            More Filters
          </button>
          <button className="btn-ghost flex items-center gap-2 text-sm py-2">
            <RefreshCw size={14} />
            Refresh
          </button>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-400">{selectedIds.size} selected</span>
              <button className="badge badge-red cursor-pointer hover:bg-red-500/30 transition-colors">
                Delete selected
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          {renderTable()}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-dark-600/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {allData.length} assets</span>
          <span className="font-medium text-slate-300">
            Total: <span className="text-amber-400">{formatCurrency(totalCost)}</span>/month
          </span>
        </div>
      </div>

      {/* Upload modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Import Inventory">
        <FileUpload onClose={() => setShowUpload(false)} onSuccess={() => setShowUpload(false)} />
      </Modal>
    </div>
  )
}
