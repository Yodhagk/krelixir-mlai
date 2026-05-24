const sampleData = [
  // Servers
  { id: 's1', name: 'web-prod-01', type: 'Server', os: 'Ubuntu 22.04', cpu: 8, ram: 32, storage: 500, status: 'active', region: 'On-Prem / US-East', cost: 1800, migration_status: 'pending', tags: ['web', 'production'] },
  { id: 's2', name: 'app-prod-02', type: 'Server', os: 'CentOS 8', cpu: 16, ram: 64, storage: 1000, status: 'active', region: 'On-Prem / US-East', cost: 3200, migration_status: 'pending', tags: ['app', 'production'] },
  { id: 's3', name: 'db-master-01', type: 'Server', os: 'RHEL 8', cpu: 32, ram: 128, storage: 4000, status: 'active', region: 'On-Prem / US-East', cost: 6500, migration_status: 'pending', tags: ['database', 'production'] },
  { id: 's4', name: 'cache-01', type: 'Server', os: 'Ubuntu 20.04', cpu: 4, ram: 16, storage: 200, status: 'active', region: 'AWS us-east-1', cost: 420, migration_status: 'migrated', tags: ['cache', 'production'] },
  { id: 's5', name: 'worker-01', type: 'Server', os: 'Debian 11', cpu: 8, ram: 32, storage: 500, status: 'warning', region: 'On-Prem / US-West', cost: 1800, migration_status: 'migrating', tags: ['worker', 'production'] },
  { id: 's6', name: 'dev-server-01', type: 'Server', os: 'Ubuntu 22.04', cpu: 4, ram: 8, storage: 200, status: 'active', region: 'On-Prem / EU-West', cost: 600, migration_status: 'pending', tags: ['development'] },
  { id: 's7', name: 'staging-01', type: 'Server', os: 'Amazon Linux 2', cpu: 4, ram: 16, storage: 300, status: 'active', region: 'AWS us-east-1', cost: 420, migration_status: 'migrated', tags: ['staging'] },
  { id: 's8', name: 'legacy-monolith', type: 'Server', os: 'CentOS 6', cpu: 8, ram: 32, storage: 800, status: 'critical', region: 'On-Prem / US-East', cost: 2400, migration_status: 'pending', tags: ['legacy', 'production'] },
  // Databases
  { id: 'd1', name: 'prod-mysql-master', type: 'Database', engine: 'MySQL 8.0', size: '2.4 TB', connections: 450, status: 'active', region: 'On-Prem / US-East', cost: 2200, migration_status: 'pending', tags: [] },
  { id: 'd2', name: 'analytics-pg', type: 'Database', engine: 'PostgreSQL 15', size: '800 GB', connections: 120, status: 'active', region: 'On-Prem / US-West', cost: 1100, migration_status: 'pending', tags: [] },
  { id: 'd3', name: 'session-mongo', type: 'Database', engine: 'MongoDB 6.0', size: '150 GB', connections: 890, status: 'active', region: 'AWS us-east-1', cost: 380, migration_status: 'migrated', tags: [] },
  { id: 'd4', name: 'cache-redis', type: 'Database', engine: 'Redis 7.2', size: '32 GB', connections: 2100, status: 'active', region: 'On-Prem / US-East', cost: 450, migration_status: 'migrating', tags: [] },
  { id: 'd5', name: 'legacy-oracle', type: 'Database', engine: 'Oracle 19c', size: '5.2 TB', connections: 80, status: 'warning', region: 'On-Prem / US-East', cost: 8500, migration_status: 'pending', tags: ['legacy'] },
  // Applications
  { id: 'a1', name: 'E-Commerce Platform', type: 'Application', stack: 'React / Node.js', instances: 3, status: 'active', region: 'On-Prem / US-East', cost: 4200, migration_status: 'pending', tags: ['web', 'production'] },
  { id: 'a2', name: 'Analytics Dashboard', type: 'Application', stack: 'Python / Django', instances: 2, status: 'active', region: 'On-Prem / US-West', cost: 2100, migration_status: 'pending', tags: ['analytics'] },
  { id: 'a3', name: 'Auth Service', type: 'Application', stack: 'Node.js / Express', instances: 2, status: 'active', region: 'AWS us-east-1', cost: 680, migration_status: 'migrated', tags: ['auth'] },
  { id: 'a4', name: 'Payment Gateway', type: 'Application', stack: 'Java / Spring', instances: 4, status: 'active', region: 'On-Prem / US-East', cost: 3800, migration_status: 'pending', tags: ['payments', 'pci'] },
  { id: 'a5', name: 'Email Service', type: 'Application', stack: 'Python / FastAPI', instances: 1, status: 'warning', region: 'On-Prem / EU-West', cost: 650, migration_status: 'pending', tags: ['email'] },
  { id: 'a6', name: 'Reporting Engine', type: 'Application', stack: '.NET Core', instances: 2, status: 'active', region: 'On-Prem / US-East', cost: 1900, migration_status: 'pending', tags: ['reporting'] },
  // Network
  { id: 'n1', name: 'Main Load Balancer', type: 'Network', subtype: 'Load Balancer', bandwidth: '10 Gbps', status: 'active', region: 'On-Prem / US-East', cost: 1200, migration_status: 'pending', tags: [] },
  { id: 'n2', name: 'CDN Edge Layer', type: 'Network', subtype: 'CDN', bandwidth: '100 Gbps', status: 'active', region: 'Global', cost: 850, migration_status: 'migrated', tags: [] },
  { id: 'n3', name: 'VPN Gateway', type: 'Network', subtype: 'VPN', bandwidth: '1 Gbps', status: 'active', region: 'On-Prem / US-East', cost: 350, migration_status: 'pending', tags: [] },
  { id: 'n4', name: 'Firewall Cluster', type: 'Network', subtype: 'Firewall', bandwidth: '40 Gbps', status: 'active', region: 'On-Prem / US-East', cost: 2800, migration_status: 'pending', tags: [] },
]

module.exports = { sampleData }
