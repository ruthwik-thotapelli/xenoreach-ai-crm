import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@xenoreach.ai');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-violet-950" />
        <div className="absolute inset-0">
          {/* Decorative circles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-brand-500/20"
              style={{
                width: `${(i + 1) * 160}px`,
                height: `${(i + 1) * 160}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.3 - i * 0.04,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-xl">XenoReach</span>
              <span className="block text-xs text-brand-400 font-medium">AI CRM</span>
            </div>
          </div>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4 leading-tight"
            >
              Reach your shoppers
              <br />
              <span className="gradient-text">intelligently.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-lg"
            >
              AI-powered campaigns, smart segmentation, and
              real-time analytics — all in one platform.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex gap-8"
            >
              {[
                { label: '500+', sublabel: 'Customers' },
                { label: '20', sublabel: 'Campaigns' },
                { label: '18.4%', sublabel: 'Avg. Conversion' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.sublabel}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <p className="text-slate-600 text-sm">© 2026 XenoReach AI. All rights reserved.</p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl">XenoReach AI</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 mb-8">Sign in to your CRM dashboard</p>

          {/* Demo hint */}
          <div className="bg-brand-600/10 border border-brand-600/30 rounded-xl px-4 py-3 mb-6 text-sm text-brand-300">
            <span className="font-semibold">Demo:</span> Use any email and password to sign in
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label" htmlFor="login-email">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@brand.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="input-label mb-0" htmlFor="login-password">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
