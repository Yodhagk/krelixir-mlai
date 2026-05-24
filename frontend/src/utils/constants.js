export const MIGRATION_STRATEGIES = {
  REHOST: {
    id: 'rehost',
    label: 'Rehost',
    subtitle: 'Lift & Shift',
    color: 'blue',
    description: 'Move workloads as-is to the cloud with minimal changes.',
    effort: 'Low',
    risk: 'Low',
    timeframe: '1-3 months',
  },
  REPLATFORM: {
    id: 'replatform',
    label: 'Replatform',
    subtitle: 'Lift & Reshape',
    color: 'purple',
    description: 'Make targeted optimizations to leverage cloud capabilities.',
    effort: 'Medium',
    risk: 'Medium',
    timeframe: '3-6 months',
  },
  REFACTOR: {
    id: 'refactor',
    label: 'Refactor',
    subtitle: 'Re-architect',
    color: 'cyan',
    description: 'Redesign applications to be cloud-native microservices.',
    effort: 'High',
    risk: 'High',
    timeframe: '6-18 months',
  },
  RETIRE: {
    id: 'retire',
    label: 'Retire',
    subtitle: 'Decommission',
    color: 'red',
    description: 'Identify and decommission redundant or unused resources.',
    effort: 'Low',
    risk: 'Low',
    timeframe: '1-2 months',
  },
  RETAIN: {
    id: 'retain',
    label: 'Retain',
    subtitle: 'Keep on-prem',
    color: 'yellow',
    description: 'Keep certain workloads on-premises due to compliance or latency.',
    effort: 'None',
    risk: 'Low',
    timeframe: 'N/A',
  },
}

export const CLOUD_PROVIDERS = [
  { id: 'aws', label: 'Amazon Web Services', logo: '☁️' },
  { id: 'azure', label: 'Microsoft Azure', logo: '⚡' },
  { id: 'gcp', label: 'Google Cloud Platform', logo: '🌐' },
  { id: 'oracle', label: 'Oracle Cloud', logo: '🔴' },
  { id: 'ibm', label: 'IBM Cloud', logo: '🔵' },
]

export const ASSET_TYPES = ['Server', 'Database', 'Application', 'Network']

export const STATUS_COLORS = {
  active: 'badge-green',
  inactive: 'badge-red',
  warning: 'badge-yellow',
  migrating: 'badge-blue',
  migrated: 'badge-purple',
  pending: 'badge-yellow',
  healthy: 'badge-green',
  critical: 'badge-red',
}

export const RISK_LEVELS = {
  low: { label: 'Low Risk', class: 'badge-green' },
  medium: { label: 'Medium Risk', class: 'badge-yellow' },
  high: { label: 'High Risk', class: 'badge-red' },
}
