import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(form.name, form.email, form.password);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl">XenoReach AI</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-slate-400">Start reaching your shoppers intelligently</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label" htmlFor="reg-name">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Priya Sharma"
                  required
                />
              </div>
            </div>
            <div>
              <label className="input-label" htmlFor="reg-email">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="you@brand.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="input-label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Minimum 8 characters"
                  minLength={6}
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

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Create account</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
