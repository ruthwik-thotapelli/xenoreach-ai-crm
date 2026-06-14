import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  brand: 'from-brand-500 to-brand-600 shadow-glow',
  violet: 'from-violet-500 to-violet-600 shadow-glow-violet',
  emerald: 'from-emerald-500 to-emerald-600 shadow-glow-emerald',
  amber: 'from-amber-500 to-amber-600',
  rose: 'from-rose-500 to-rose-600',
};

const bgMap = {
  brand: 'bg-brand-500/10',
  violet: 'bg-violet-500/10',
  emerald: 'bg-emerald-500/10',
  amber: 'bg-amber-500/10',
  rose: 'bg-rose-500/10',
};

export default function StatCard({ title, value, change, changeType = 'up', icon: Icon, color = 'brand', suffix = '', index = 0 }) {
  const isUp = changeType === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="stat-card group"
    >
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${bgMap[color]} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center flex-shrink-0`}>
            <Icon size={20} className="text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-white mb-1 tabular-nums">
          {value}{suffix}
        </div>
        <div className="text-sm text-slate-400 font-medium">{title}</div>
      </div>
    </motion.div>
  );
}
