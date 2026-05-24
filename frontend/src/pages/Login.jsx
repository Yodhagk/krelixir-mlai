import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Zap, ArrowRight, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

const DEMO_CREDENTIALS = { email: 'demo@krelixir.ai', password: 'demo1234' }

export default function Login() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const onSubmit = async ({ email, password }) => {
    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(result.error)
    }
  }

  const fillDemo = () => {
    setValue('email', DEMO_CREDENTIALS.email)
    setValue('password', DEMO_CREDENTIALS.password)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/8 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center group-hover:shadow-glow-purple transition-all duration-300">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-black text-xl text-slate-100">krelixir<span className="gradient-text">.ai</span></span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to your migration platform</p>
          </div>

          {/* Demo banner */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full mb-6 p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20
                       text-sm text-brand-purple-light hover:bg-brand-purple/15 transition-all duration-200 text-left"
          >
            <span className="font-medium">Try Demo</span>
            <span className="text-brand-purple/60 ml-2">→ demo@krelixir.ai / demo1234</span>
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                  type="email"
                  placeholder="you@company.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-dark-700 border-dark-600 text-brand-purple" />
                <span className="text-slate-400">Remember me</span>
              </label>
              <button type="button" className="text-brand-purple-light hover:text-brand-purple transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-purple-light hover:text-brand-purple transition-colors font-medium">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          Protected by enterprise-grade encryption
        </p>
      </div>
    </div>
  )
}
