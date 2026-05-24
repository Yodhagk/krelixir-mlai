import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, ArrowRight, Server, Database, Brain, Shield, BarChart3,
  CheckCircle, ChevronDown, Star, Github, Twitter, Linkedin,
  Cloud, TrendingDown, Clock, Globe, Lock, Cpu
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'GPT-4 powered engine analyzes your infrastructure and generates personalized migration roadmaps with risk assessment.',
    color: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Server,
    title: 'Complete Inventory Discovery',
    desc: 'Auto-discover servers, databases, applications, and network components. Import via API, CSV, or manual entry.',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: TrendingDown,
    title: 'Cost Optimization',
    desc: 'Identify up to 70% cost savings with intelligent right-sizing, reserved instance recommendations, and waste elimination.',
    color: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Shield,
    title: 'Risk & Compliance',
    desc: 'Automated risk scoring with compliance checks for GDPR, HIPAA, SOC2, and PCI-DSS across all migration paths.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Cloud,
    title: 'Multi-Cloud Support',
    desc: 'Target AWS, Azure, GCP, or hybrid environments. Get platform-specific service recommendations and pricing.',
    color: 'from-orange-500/20 to-orange-600/5',
    border: 'border-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: Zap,
    title: 'Automated Workflows',
    desc: 'AI agent generates step-by-step migration plans, Terraform scripts, and CI/CD pipelines ready to execute.',
    color: 'from-pink-500/20 to-pink-600/5',
    border: 'border-pink-500/20',
    iconColor: 'text-pink-400',
  },
]

const steps = [
  {
    step: '01',
    title: 'Connect & Discover',
    desc: 'Connect your infrastructure via API integrations or upload your inventory as CSV/Excel. Our scanner auto-discovers all assets.',
    icon: Globe,
  },
  {
    step: '02',
    title: 'AI Analysis',
    desc: 'Our AI engine analyzes dependencies, performance metrics, costs, and compliance requirements to build a comprehensive migration strategy.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Execute & Monitor',
    desc: 'Follow AI-generated runbooks, execute migrations with confidence, and monitor progress in real-time on your dashboard.',
    icon: BarChart3,
  },
]

const stats = [
  { label: 'Average Cost Savings', value: '64%', icon: TrendingDown },
  { label: 'Faster Migration', value: '3x', icon: Clock },
  { label: 'Assets Analyzed', value: '50K+', icon: Cpu },
  { label: 'Uptime SLA', value: '99.9%', icon: Shield },
]

const testimonials = [
  {
    quote: 'Krelixir cut our migration planning from 6 months to 3 weeks. The AI recommendations were spot-on — we saved $180K in the first year.',
    name: 'Sarah Chen',
    role: 'CTO, TechForward Inc',
    stars: 5,
  },
  {
    quote: 'The dependency mapping alone is worth it. We found 12 hidden dependencies that would have caused outages during migration.',
    name: 'Marcus Williams',
    role: 'Infrastructure Lead, FinEdge',
    stars: 5,
  },
  {
    quote: 'Best migration tool we\'ve used. The AI chat assistant answers any question about our infrastructure and gives actionable advice.',
    name: 'Priya Patel',
    role: 'VP Engineering, DataFlow',
    stars: 5,
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    desc: 'Perfect for small teams getting started with cloud migration.',
    features: ['Up to 25 assets', 'AI recommendations', 'CSV import', 'Email support'],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$149',
    period: '/month',
    desc: 'Full-featured platform for growing organizations.',
    features: ['Up to 200 assets', 'AI Agent mode', 'API integrations', 'Multi-cloud support', 'Priority support', 'Custom reports'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large-scale migrations with enterprise requirements.',
    features: ['Unlimited assets', 'Dedicated AI model', 'On-premise option', 'SSO / SAML', 'SLA guarantee', '24/7 support', 'Custom integrations'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

const faqs = [
  { q: 'How does Krelixir connect to my infrastructure?', a: 'Krelixir connects via read-only API integrations with AWS, Azure, GCP, VMware, and other platforms. You can also upload inventory data via CSV/Excel or use our manual entry form.' },
  { q: 'Is my infrastructure data secure?', a: 'Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never store credentials and use IAM roles with least-privilege access.' },
  { q: 'Which cloud platforms does Krelixir support?', a: 'We support AWS, Microsoft Azure, Google Cloud Platform, Oracle Cloud, and IBM Cloud as migration targets, as well as hybrid and on-premises scenarios.' },
  { q: 'How accurate are the cost estimates?', a: 'Our cost estimates are based on real-time cloud pricing APIs and are typically within 5-10% of actual costs. We factor in compute, storage, networking, and managed service costs.' },
]

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-100 text-lg">krelixir<span className="gradient-text">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-slate-100 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-100 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="btn-primary text-sm py-2 px-4">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-sm text-brand-purple-light mb-8 animate-fade-in">
            <Zap size={12} />
            <span>AI-Powered Infrastructure Migration</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-brand-purple/20 text-brand-purple">NEW</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 animate-slide-up">
            Migrate Your{' '}
            <span className="gradient-text">Infrastructure</span>
            <br />
            with AI Confidence
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 animate-slide-up leading-relaxed">
            Krelixir analyzes your entire infrastructure, generates AI-powered migration strategies,
            and guides your team from on-premise to cloud — saving an average of <strong className="text-slate-200">64% in costs</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to="/signup" className="btn-primary flex items-center gap-2 text-base">
              Start Free Migration Analysis
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-dark-600 text-slate-300
                         hover:border-dark-500 hover:text-slate-100 transition-all duration-200 text-base"
            >
              View Demo Dashboard
            </Link>
          </div>

          <p className="text-xs text-slate-600 mt-4">No credit card required · 14-day free trial · Cancel anytime</p>

          {/* Hero stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-card p-4 text-center">
                <div className="text-3xl font-black gradient-text mb-1">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-xs text-brand-blue-light mb-4">
              Platform Features
            </div>
            <h2 className="text-4xl font-black mb-4">
              Everything you need to{' '}
              <span className="gradient-text">migrate with confidence</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From initial discovery to final cutover, Krelixir provides AI-powered tools at every stage of your migration journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, border, iconColor }) => (
              <div
                key={title}
                className={`glass-card p-6 hover:scale-[1.02] transition-transform duration-300 bg-gradient-to-br ${color} ${border}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center mb-4 ${iconColor}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-dark-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-xs text-brand-cyan mb-4">
              How It Works
            </div>
            <h2 className="text-4xl font-black mb-4">
              From discovery to migration{' '}
              <span className="gradient-text">in 3 steps</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map(({ step, title, desc, icon: Icon }, i) => (
                <div key={step} className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue mx-auto mb-6 flex items-center justify-center shadow-glow-purple relative z-10">
                    <Icon size={28} className="text-white" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-2">Step {step}</div>
                  <h3 className="text-lg font-bold text-slate-100 mb-3">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Trusted by <span className="gradient-text">engineering teams</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role, stars }) => (
              <div key={name} className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">"{quote}"</p>
                <div>
                  <div className="font-semibold text-slate-100 text-sm">{name}</div>
                  <div className="text-xs text-slate-500">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-dark-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Simple, <span className="gradient-text">transparent pricing</span>
            </h2>
            <p className="text-slate-400">Start free, scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(({ name, price, period, desc, features: planFeatures, cta, highlight }) => (
              <div
                key={name}
                className={`glass-card p-6 relative ${highlight ? 'gradient-border scale-105' : ''}`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-brand text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-medium text-slate-400 mb-2">{name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-100">{price}</span>
                    <span className="text-sm text-slate-500">{period}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{desc}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {planFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block text-center py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    highlight
                      ? 'btn-primary'
                      : 'border border-dark-600 text-slate-300 hover:border-dark-500 hover:text-slate-100'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Frequently asked <span className="gradient-text">questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-slate-200 text-sm">{q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-dark-600/50 pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-brand-blue/5 to-brand-cyan/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4">
                Ready to start your{' '}
                <span className="gradient-text">migration journey?</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Join hundreds of engineering teams using Krelixir to migrate faster, cheaper, and with confidence.
              </p>
              <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-base">
                Start Free Analysis
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700/50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
              <span className="font-bold text-slate-300">krelixir.ai</span>
            </div>
            <div className="flex gap-8 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Github size={18} className="hover:text-slate-300 cursor-pointer transition-colors" />
              <Twitter size={18} className="hover:text-slate-300 cursor-pointer transition-colors" />
              <Linkedin size={18} className="hover:text-slate-300 cursor-pointer transition-colors" />
            </div>
          </div>
          <div className="text-center text-xs text-slate-700 mt-8">
            © 2025 Krelixir. All rights reserved. Built with ❤️ for the cloud-native era.
          </div>
        </div>
      </footer>
    </div>
  )
}
