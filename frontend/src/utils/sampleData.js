export const sampleServers = [
  { id: 's1', name: 'web-prod-01', type: 'Server', os: 'Ubuntu 22.04', cpu: 8, ram: 32, storage: 500, status: 'active', region: 'On-Prem / US-East', cost: 1800, migration_status: 'pending', tags: ['web', 'production'] },
  { id: 's2', name: 'app-prod-02', type: 'Server', os: 'CentOS 8', cpu: 16, ram: 64, storage: 1000, status: 'active', region: 'On-Prem / US-East', cost: 3200, migration_status: 'pending', tags: ['app', 'production'] },
  { id: 's3', name: 'db-master-01', type: 'Server', os: 'RHEL 8', cpu: 32, ram: 128, storage: 4000, status: 'active', region: 'On-Prem / US-East', cost: 6500, migration_status: 'pending', tags: ['database', 'production'] },
  { id: 's4', name: 'cache-01', type: 'Server', os: 'Ubuntu 20.04', cpu: 4, ram: 16, storage: 200, status: 'active', region: 'On-Prem / US-West', cost: 900, migration_status: 'migrated', tags: ['cache', 'production'] },
  { id: 's5', name: 'worker-01', type: 'Server', os: 'Debian 11', cpu: 8, ram: 32, storage: 500, status: 'warning', region: 'On-Prem / US-West', cost: 1800, migration_status: 'migrating', tags: ['worker', 'production'] },
  { id: 's6', name: 'dev-server-01', type: 'Server', os: 'Ubuntu 22.04', cpu: 4, ram: 8, storage: 200, status: 'active', region: 'On-Prem / EU-West', cost: 600, migration_status: 'pending', tags: ['development'] },
  { id: 's7', name: 'staging-01', type: 'Server', os: 'Amazon Linux 2', cpu: 4, ram: 16, storage: 300, status: 'active', region: 'AWS us-east-1', cost: 420, migration_status: 'migrated', tags: ['staging'] },
  { id: 's8', name: 'legacy-monolith', type: 'Server', os: 'CentOS 6', cpu: 8, ram: 32, storage: 800, status: 'critical', region: 'On-Prem / US-East', cost: 2400, migration_status: 'pending', tags: ['legacy', 'production'] },
]

export const sampleDatabases = [
  { id: 'd1', name: 'prod-mysql-master', type: 'Database', engine: 'MySQL 8.0', size: '2.4 TB', connections: 450, status: 'active', region: 'On-Prem / US-East', cost: 2200, migration_status: 'pending' },
  { id: 'd2', name: 'analytics-pg', type: 'Database', engine: 'PostgreSQL 15', size: '800 GB', connections: 120, status: 'active', region: 'On-Prem / US-West', cost: 1100, migration_status: 'pending' },
  { id: 'd3', name: 'session-mongo', type: 'Database', engine: 'MongoDB 6.0', size: '150 GB', connections: 890, status: 'active', region: 'AWS us-east-1', cost: 380, migration_status: 'migrated' },
  { id: 'd4', name: 'cache-redis', type: 'Database', engine: 'Redis 7.2', size: '32 GB', connections: 2100, status: 'active', region: 'On-Prem / US-East', cost: 450, migration_status: 'migrating' },
  { id: 'd5', name: 'legacy-oracle', type: 'Database', engine: 'Oracle 19c', size: '5.2 TB', connections: 80, status: 'warning', region: 'On-Prem / US-East', cost: 8500, migration_status: 'pending' },
]

export const sampleApplications = [
  { id: 'a1', name: 'E-Commerce Platform', type: 'Application', stack: 'React / Node.js', instances: 3, status: 'active', region: 'On-Prem / US-East', cost: 4200, migration_status: 'pending', dependencies: ['prod-mysql-master', 'session-mongo'] },
  { id: 'a2', name: 'Analytics Dashboard', type: 'Application', stack: 'Python / Django', instances: 2, status: 'active', region: 'On-Prem / US-West', cost: 2100, migration_status: 'pending', dependencies: ['analytics-pg'] },
  { id: 'a3', name: 'Auth Service', type: 'Application', stack: 'Node.js / Express', instances: 2, status: 'active', region: 'AWS us-east-1', cost: 680, migration_status: 'migrated', dependencies: ['session-mongo'] },
  { id: 'a4', name: 'Payment Gateway', type: 'Application', stack: 'Java / Spring', instances: 4, status: 'active', region: 'On-Prem / US-East', cost: 3800, migration_status: 'pending', dependencies: ['prod-mysql-master', 'legacy-oracle'] },
  { id: 'a5', name: 'Email Service', type: 'Application', stack: 'Python / FastAPI', instances: 1, status: 'warning', region: 'On-Prem / EU-West', cost: 650, migration_status: 'pending', dependencies: [] },
  { id: 'a6', name: 'Reporting Engine', type: 'Application', stack: '.NET Core', instances: 2, status: 'active', region: 'On-Prem / US-East', cost: 1900, migration_status: 'pending', dependencies: ['analytics-pg', 'legacy-oracle'] },
]

export const sampleNetwork = [
  { id: 'n1', name: 'Main Load Balancer', type: 'Network', subtype: 'Load Balancer', bandwidth: '10 Gbps', status: 'active', region: 'On-Prem / US-East', cost: 1200, migration_status: 'pending' },
  { id: 'n2', name: 'CDN Edge Layer', type: 'Network', subtype: 'CDN', bandwidth: '100 Gbps', status: 'active', region: 'Global', cost: 850, migration_status: 'migrated' },
  { id: 'n3', name: 'VPN Gateway', type: 'Network', subtype: 'VPN', bandwidth: '1 Gbps', status: 'active', region: 'On-Prem / US-East', cost: 350, migration_status: 'pending' },
  { id: 'n4', name: 'Firewall Cluster', type: 'Network', subtype: 'Firewall', bandwidth: '40 Gbps', status: 'active', region: 'On-Prem / US-East', cost: 2800, migration_status: 'pending' },
]

export const sampleRecommendations = [
  {
    id: 'r1',
    assetId: 's1',
    assetName: 'web-prod-01',
    assetType: 'Server',
    strategy: 'replatform',
    targetPlatform: 'AWS',
    targetService: 'EC2 t3.xlarge (Auto Scaling)',
    currentCost: 1800,
    projectedCost: 680,
    savings: 1120,
    savingsPercent: 62,
    risk: 'low',
    effort: 'medium',
    timeframe: '4-6 weeks',
    benefits: ['62% cost reduction', 'Auto-scaling capability', 'Managed patching', 'High availability'],
    risks: ['Configuration migration', 'Initial learning curve'],
    steps: [
      'Create AWS account and set up VPC',
      'Set up Auto Scaling Group with t3.xlarge instances',
      'Configure Application Load Balancer',
      'Migrate static assets to S3 + CloudFront',
      'Test and validate in staging',
      'DNS cutover and go-live',
    ],
  },
  {
    id: 'r2',
    assetId: 'd5',
    assetName: 'legacy-oracle',
    assetType: 'Database',
    strategy: 'replatform',
    targetPlatform: 'AWS',
    targetService: 'Amazon Aurora PostgreSQL',
    currentCost: 8500,
    projectedCost: 2100,
    savings: 6400,
    savingsPercent: 75,
    risk: 'high',
    effort: 'high',
    timeframe: '3-4 months',
    benefits: ['75% cost savings', 'Eliminate Oracle licensing', 'Managed backups', 'Read replicas'],
    risks: ['Oracle-specific SQL migration', 'Application compatibility testing', 'Data migration complexity'],
    steps: [
      'Audit Oracle-specific features and stored procedures',
      'Set up AWS SCT (Schema Conversion Tool)',
      'Convert schema to PostgreSQL compatible format',
      'Migrate data using AWS DMS',
      'Update application connection strings',
      'Parallel run for validation',
      'Cutover and decommission Oracle',
    ],
  },
  {
    id: 'r3',
    assetId: 'a1',
    assetName: 'E-Commerce Platform',
    assetType: 'Application',
    strategy: 'refactor',
    targetPlatform: 'AWS',
    targetService: 'ECS Fargate + RDS + ElastiCache',
    currentCost: 4200,
    projectedCost: 1580,
    savings: 2620,
    savingsPercent: 62,
    risk: 'medium',
    effort: 'high',
    timeframe: '4-6 months',
    benefits: ['Containerized microservices', 'Independent scaling', '62% cost reduction', 'Zero-downtime deployments'],
    risks: ['Significant refactoring required', 'Team upskilling needed', 'Complex testing phase'],
    steps: [
      'Containerize with Docker',
      'Set up ECS cluster with Fargate',
      'Configure RDS Multi-AZ for database',
      'Set up ElastiCache for sessions',
      'Implement CI/CD with CodePipeline',
      'Blue/green deployment strategy',
      'Load testing and go-live',
    ],
  },
  {
    id: 'r4',
    assetId: 's8',
    assetName: 'legacy-monolith',
    assetType: 'Server',
    strategy: 'retire',
    targetPlatform: 'N/A',
    targetService: 'Decommission',
    currentCost: 2400,
    projectedCost: 0,
    savings: 2400,
    savingsPercent: 100,
    risk: 'low',
    effort: 'low',
    timeframe: '2-4 weeks',
    benefits: ['$2,400/month savings', 'Reduced maintenance burden', 'Security risk eliminated'],
    risks: ['Verify no active traffic', 'Dependency audit needed'],
    steps: [
      'Audit traffic logs for last 90 days',
      'Identify any active dependencies',
      'Migrate any remaining services',
      'Decommission and remove from inventory',
    ],
  },
]

export const sampleActivity = [
  { id: 1, type: 'migration', message: 'cache-01 migration to AWS ElastiCache completed', time: '2 hours ago', status: 'success' },
  { id: 2, type: 'analysis', message: 'AI analysis completed for 8 servers', time: '4 hours ago', status: 'info' },
  { id: 3, type: 'warning', message: 'legacy-monolith: CentOS 6 end-of-life detected', time: '6 hours ago', status: 'warning' },
  { id: 4, type: 'migration', message: 'Auth Service migration to AWS ECS completed', time: '1 day ago', status: 'success' },
  { id: 5, type: 'upload', message: 'Infrastructure inventory CSV uploaded (23 assets)', time: '2 days ago', status: 'info' },
  { id: 6, type: 'warning', message: 'worker-01: High CPU utilization detected (87%)', time: '2 days ago', status: 'warning' },
]

export const dashboardStats = {
  totalAssets: 23,
  migrated: 4,
  migrating: 2,
  pending: 17,
  totalCurrentCost: 34650,
  totalProjectedCost: 12480,
  totalSavings: 22170,
  savingsPercent: 64,
  migrationReadiness: 72,
  riskScore: 'Medium',
  criticalIssues: 2,
}

export const costComparisonData = [
  { month: 'Jan', current: 34650, projected: 12480 },
  { month: 'Feb', current: 34650, projected: 13200 },
  { month: 'Mar', current: 35100, projected: 11800 },
  { month: 'Apr', current: 35100, projected: 11500 },
  { month: 'May', current: 34800, projected: 11200 },
  { month: 'Jun', current: 34650, projected: 10800 },
]

export const infraDistribution = [
  { name: 'Servers', value: 8, color: '#7c3aed' },
  { name: 'Databases', value: 5, color: '#2563eb' },
  { name: 'Applications', value: 6, color: '#06b6d4' },
  { name: 'Network', value: 4, color: '#10b981' },
]

export const migrationStatusData = [
  { name: 'Migrated', value: 4, color: '#10b981' },
  { name: 'Migrating', value: 2, color: '#3b82f6' },
  { name: 'Pending', value: 17, color: '#7c3aed' },
]
