import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
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
        </div>

        <div className="card text-center">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 mb-6 text-sm">
                We sent a password reset link to <span className="text-white">{email}</span>
              </p>
              <Link to="/login" className="btn-primary justify-center w-full">
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Forgot password?</h2>
              <p className="text-slate-400 mb-6 text-sm">
                Enter your email and we'll send you a reset link
              </p>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="input-label" htmlFor="forgot-email">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="you@brand.com"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  id="forgot-submit-btn"
                  disabled={loading}
                  className="w-full btn-primary justify-center py-3"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Send reset link</span> <ArrowRight size={18} /></>}
                </button>
              </form>
              <div className="mt-5">
                <Link to="/login" className="text-sm text-slate-400 hover:text-white flex items-center justify-center gap-2">
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
