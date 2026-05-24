import { useState, useRef, useEffect } from 'react'
import {
  Send, Bot, User, Zap, Brain, Copy, Check, RefreshCw,
  Server, Database, TrendingDown, Shield, BarChart3, MessageSquare,
  Sparkles, ChevronRight, Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { dashboardStats } from '../utils/sampleData'
import { formatCurrency } from '../utils/helpers'

const SYSTEM_CONTEXT = {
  totalAssets: dashboardStats.totalAssets,
  totalCurrentCost: dashboardStats.totalCurrentCost,
  totalProjectedCost: dashboardStats.totalProjectedCost,
  savingsPercent: dashboardStats.savingsPercent,
  criticalIssues: dashboardStats.criticalIssues,
  pendingMigrations: dashboardStats.pending,
}

const suggestedPrompts = [
  { icon: BarChart3, text: 'Give me a summary of my infrastructure and migration readiness', category: 'Analysis' },
  { icon: TrendingDown, text: 'What are my top 3 cost optimization opportunities?', category: 'Cost' },
  { icon: Shield, text: 'What are the highest risk items in my migration plan?', category: 'Risk' },
  { icon: Server, text: 'Create a step-by-step migration plan for legacy-oracle database', category: 'Planning' },
  { icon: Brain, text: 'Which workloads should I migrate first and why?', category: 'Strategy' },
  { icon: Sparkles, text: 'Generate Terraform code for migrating web-prod-01 to AWS', category: 'Automation' },
]

const aiResponses = {
  default: (msg) => `I've analyzed your infrastructure query: "${msg.slice(0, 60)}..."

Based on your current inventory of **${SYSTEM_CONTEXT.totalAssets} assets** with a monthly spend of **${formatCurrency(SYSTEM_CONTEXT.totalCurrentCost)}**, here are my recommendations:

**Key Findings:**
- You have **${SYSTEM_CONTEXT.criticalIssues} critical issues** requiring immediate attention
- **${SYSTEM_CONTEXT.pendingMigrations} assets** are pending migration
- Estimated savings after full migration: **${SYSTEM_CONTEXT.savingsPercent}%** (${formatCurrency(SYSTEM_CONTEXT.totalCurrentCost - SYSTEM_CONTEXT.totalProjectedCost)}/month)

Would you like me to dive deeper into any specific area?`,

  summary: () => `## Infrastructure Summary

Your environment has **${SYSTEM_CONTEXT.totalAssets} total assets** across 4 categories:
- 🖥️ **8 Servers** — Mix of on-prem and cloud (1 critical: legacy-monolith on CentOS 6 EOL)
- 🗄️ **5 Databases** — MySQL, PostgreSQL, MongoDB, Redis, Oracle
- ⚙️ **6 Applications** — E-commerce, Auth, Analytics, Payments
- 🌐 **4 Network Components** — Load balancer, CDN, VPN, Firewall

**Migration Readiness: 72%**

**Current Monthly Spend:** ${formatCurrency(SYSTEM_CONTEXT.totalCurrentCost)}
**Post-Migration Estimate:** ${formatCurrency(SYSTEM_CONTEXT.totalProjectedCost)}
**Annual Savings:** ${formatCurrency((SYSTEM_CONTEXT.totalCurrentCost - SYSTEM_CONTEXT.totalProjectedCost) * 12)}

**🚨 Critical Action Required:**
1. \`legacy-monolith\` is running CentOS 6 (EOL since 2020) — security risk
2. \`legacy-oracle\` Oracle 19c license costing $8,500/month — migrate to Aurora PostgreSQL

Ready to generate a detailed migration roadmap?`,

  cost: () => `## Top Cost Optimization Opportunities

**1. legacy-oracle → Amazon Aurora PostgreSQL**
- Current: **$8,500/month** (Oracle license + hardware)
- Target: **$2,100/month** (Aurora Serverless v2)
- **Savings: $6,400/month (75%)** 🎯
- Risk: High | Timeline: 3-4 months
- Note: Schema conversion needed for Oracle-specific features

**2. web-prod-01 → AWS EC2 Auto Scaling**
- Current: **$1,800/month** (on-prem)
- Target: **$680/month** (t3.xlarge + ALB)
- **Savings: $1,120/month (62%)**
- Risk: Low | Timeline: 4-6 weeks

**3. E-Commerce Platform → ECS Fargate**
- Current: **$4,200/month**
- Target: **$1,580/month**
- **Savings: $2,620/month (62%)**
- Risk: Medium | Timeline: 4-6 months

**Total potential savings: ~${formatCurrency(10140)}/month = ${formatCurrency(10140 * 12)}/year**

Which opportunity should I analyze in detail?`,

  risk: () => `## Migration Risk Assessment

### 🔴 High Risk
**legacy-oracle (Oracle 19c)**
- Complex Oracle-specific SQL and stored procedures
- Application dependencies on Oracle features
- Large dataset (5.2 TB) migration
- Mitigation: Use AWS SCT + DMS with parallel run period

### 🟡 Medium Risk
**E-Commerce Platform**
- Monolithic architecture needs decomposition
- Multiple database dependencies
- Session management migration
- Mitigation: Strangler fig pattern, feature flags

**Payment Gateway**
- Strict PCI-DSS compliance requirements
- 4 instances with zero-downtime requirement
- Mitigation: Blue-green deployment, extensive testing

### 🟢 Low Risk
**web-prod-01, cache-01, Auth Service**
- Standard workloads with straightforward migration paths
- Lift-and-shift or simple replatform
- Start here to build team confidence

**Recommended order:** Start with low-risk assets to build experience, then tackle medium-risk, saving high-risk for last with maximum preparation.`,

  terraform: () => `## Terraform for web-prod-01 → AWS EC2

\`\`\`hcl
# main.tf - Krelixir Migration: web-prod-01
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC & Networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "krelixir-vpc", ManagedBy = "terraform" }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet("10.0.0.0/16", 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

# Auto Scaling Group
resource "aws_launch_template" "web" {
  name_prefix   = "web-prod-"
  image_id      = "ami-0abcdef1234567890" # Ubuntu 22.04 LTS
  instance_type = "t3.xlarge"

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.web.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    apt-get update && apt-get install -y nginx
    # Your application bootstrap here
  EOF
  )
  tags = { Name = "web-prod-01", MigratedBy = "krelixir" }
}

resource "aws_autoscaling_group" "web" {
  name                = "web-prod-asg"
  vpc_zone_identifier = aws_subnet.public[*].id
  min_size            = 2
  max_size            = 8
  desired_capacity    = 3

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
}

# Application Load Balancer
resource "aws_lb" "web" {
  name               = "web-prod-alb"
  load_balancer_type = "application"
  subnets            = aws_subnet.public[*].id
}
\`\`\`

**Estimated monthly cost:** ~$680 (vs $1,800 on-prem)
**Next step:** Run \`terraform init && terraform plan\` to preview changes.`,

  strategy: () => `## Recommended Migration Sequence

Based on your infrastructure profile, I recommend this **phased migration approach:**

### Phase 1: Quick Wins (Month 1-2) 🟢
**Low risk, high confidence**
1. **legacy-monolith** → Retire (saves $2,400/month)
2. **cache-01** → Already migrated ✅
3. **staging-01** → Already on AWS ✅

### Phase 2: Core Services (Month 2-4) 🟡
**Build momentum with medium-risk items**
4. **web-prod-01** → AWS EC2 Auto Scaling (saves $1,120/month)
5. **Auth Service** → Already migrated ✅
6. **session-mongo** → Amazon DocumentDB (saves ~$200/month)

### Phase 3: Data Migration (Month 4-7) 🔴
**Most complex, requires careful planning**
7. **analytics-pg** → Amazon Aurora PostgreSQL (saves $500/month)
8. **prod-mysql-master** → Amazon RDS MySQL Multi-AZ (saves $800/month)
9. **legacy-oracle** → Amazon Aurora PostgreSQL (saves $6,400/month)

### Phase 4: Application Modernization (Month 6-12) 🔵
**Refactor for cloud-native benefits**
10. **E-Commerce Platform** → ECS Fargate (saves $2,620/month)
11. **Payment Gateway** → ECS with PCI-DSS compliance

**Total timeline:** 10-12 months
**Total annual savings upon completion:** ~${formatCurrency(10140 * 12)}

Shall I create a detailed runbook for Phase 1?`
}

function getAIResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('summar') || lower.includes('overview') || lower.includes('readiness')) return aiResponses.summary()
  if (lower.includes('cost') || lower.includes('saving') || lower.includes('expensive') || lower.includes('cheap')) return aiResponses.cost()
  if (lower.includes('risk') || lower.includes('danger') || lower.includes('critical')) return aiResponses.risk()
  if (lower.includes('terraform') || lower.includes('script') || lower.includes('code') || lower.includes('automat')) return aiResponses.terraform()
  if (lower.includes('first') || lower.includes('order') || lower.includes('sequence') || lower.includes('strategy') || lower.includes('which')) return aiResponses.strategy()
  return aiResponses.default(message)
}

function ChatMessage({ msg }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'

  const copyText = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatContent = (text) => {
    return text
      .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="bg-dark-900 border border-dark-600/50 rounded-lg p-4 overflow-x-auto my-3 text-xs font-mono text-slate-300">${code.trim()}</pre>`
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
      .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-slate-100 mt-4 mb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-slate-200 mt-3 mb-1.5">$1</h3>')
      .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-sm text-slate-300 ml-2"><span class="text-brand-purple mt-1 text-xs">•</span><span>$1</span></li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="text-sm text-slate-300 ml-4">$1</li>')
      .replace(/\n\n/g, '<br />')
  }

  return (
    <div className={`flex gap-3 group ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={15} className="text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'max-w-[70%]' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-br-sm'
              : 'glass-card text-slate-300 rounded-bl-sm'
          }`}
        >
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <div
              className="prose-sm"
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
            />
          )}
        </div>
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          <span className="text-[10px] text-slate-600">{msg.time}</span>
          {!isUser && (
            <button
              onClick={copyText}
              className="text-slate-600 hover:text-slate-400 transition-colors"
              title="Copy response"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={15} className="text-slate-400" />
        </div>
      )}
    </div>
  )
}

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: `👋 Hello! I'm your **Krelixir AI Migration Agent**.

I've analyzed your infrastructure and I'm ready to help you plan and execute your cloud migration.

**Your current status:**
- 📊 **${SYSTEM_CONTEXT.totalAssets} assets** under management
- 💰 **${formatCurrency(SYSTEM_CONTEXT.totalCurrentCost)}/month** current spend
- 🎯 **${SYSTEM_CONTEXT.savingsPercent}% savings** potential identified
- ⚠️ **${SYSTEM_CONTEXT.criticalIssues} critical issues** need attention

What would you like to explore? You can ask me about migration strategies, cost optimization, risk analysis, or I can generate infrastructure-as-code for specific migrations.`,
    time: 'just now',
  }
]

export default function AIChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agentMode, setAgentMode] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))

    const response = getAIResponse(text)
    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
    inputRef.current?.focus()
  }

  const clearChat = () => {
    setMessages(initialMessages)
    toast.success('Chat cleared')
  }

  return (
    <div className="flex h-[calc(100vh-112px)] gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4">
        {/* Agent mode toggle */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className={agentMode ? 'text-brand-purple animate-pulse' : 'text-slate-500'} />
              <span className="text-sm font-medium text-slate-200">Agent Mode</span>
            </div>
            <button
              onClick={() => { setAgentMode(!agentMode); toast(agentMode ? 'Agent mode off' : 'Agent mode enabled — AI can now trigger actions') }}
              className={`w-10 h-5 rounded-full transition-all duration-200 relative ${agentMode ? 'bg-brand-purple' : 'bg-dark-600'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${agentMode ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {agentMode
              ? 'AI can execute migration actions autonomously.'
              : 'AI provides recommendations only. Enable to allow automated actions.'}
          </p>
        </div>

        {/* Suggested prompts */}
        <div className="glass-card p-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Suggested Questions</p>
          <div className="space-y-2">
            {suggestedPrompts.map(({ icon: Icon, text, category }) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                disabled={loading}
                className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-dark-600/40 transition-all duration-200 text-left group disabled:opacity-50"
              >
                <Icon size={13} className="text-brand-purple flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-brand-purple/60 font-medium uppercase tracking-wide mb-0.5">{category}</div>
                  <div className="text-xs text-slate-400 group-hover:text-slate-300 leading-tight line-clamp-2">{text}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat actions */}
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-dark-600 text-xs text-slate-500 hover:text-slate-300 hover:border-dark-500 transition-all duration-200"
          >
            <Trash2 size={12} />
            Clear
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-dark-600 text-xs text-slate-500 hover:text-slate-300 hover:border-dark-500 transition-all duration-200">
            <RefreshCw size={12} />
            New Chat
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-dark-600/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">Krelixir AI Agent</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online · GPT-4o powered
              </div>
            </div>
          </div>
          {agentMode && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
              <Zap size={12} className="text-brand-purple animate-pulse" />
              <span className="text-xs text-brand-purple">Agent Mode Active</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center flex-shrink-0">
                <Bot size={15} className="text-white" />
              </div>
              <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-purple typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-brand-purple typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-brand-purple typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-dark-600/50 flex-shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask about migration strategies, costs, risks, or generate IaC code..."
                rows={1}
                className="w-full input-field resize-none py-3 pr-12 min-h-[48px] max-h-32 overflow-y-auto leading-relaxed"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
                }}
              />
              <div className="absolute right-3 bottom-3 text-xs text-slate-600">
                ⏎ Send
              </div>
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue text-white flex items-center justify-center
                         hover:from-brand-purple/90 hover:to-brand-blue/90 transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-700 mt-2 text-center">
            AI responses are for planning purposes. Always validate before executing in production.
          </p>
        </div>
      </div>
    </div>
  )
}
