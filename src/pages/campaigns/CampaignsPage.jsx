import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Megaphone, ChevronRight, Plus, Filter, Search, BarChart2, Clock,
  CheckCircle, Zap, PlayCircle, PauseCircle, Loader2
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import ChannelBadge from '../../components/ui/ChannelBadge';
import { campaigns } from '../../data/mockData';

export default function CampaignsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = campaigns.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Campaigns</h2>
          <p className="text-sm text-slate-400">Manage all your shopper communications</p>
        </div>
        <div className="flex gap-3">
          <Link to="/campaigns/ai-assistant" className="btn-secondary gap-2">
            <Zap size={16} /> AI Assistant
          </Link>
          <Link to="/campaigns/create" id="new-campaign-btn" className="btn-primary">
            <Plus size={16} /> New Campaign
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Megaphone, color: 'text-brand-400 bg-brand-500/20' },
          { label: 'Active', value: stats.active, icon: PlayCircle, color: 'text-emerald-400 bg-emerald-500/20' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-violet-400 bg-violet-500/20' },
          { label: 'Drafts', value: stats.draft, icon: Clock, color: 'text-amber-400 bg-amber-500/20' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color.split(' ')[1]}`}>
              <s.icon size={18} className={s.color.split(' ')[0]} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
          {['all', 'active', 'completed', 'draft', 'scheduled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10 py-2"
            placeholder="Search campaigns..."
          />
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-3">
        {filtered.map((camp, idx) => (
          <motion.div
            key={camp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="card-hover cursor-pointer"
            onClick={() => navigate(`/campaigns/${camp.id}/monitoring`)}
          >
            <div className="flex items-start gap-4 flex-wrap">
              {/* Left */}
              <div className="flex-1 min-w-64">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-white">{camp.name}</h3>
                  {camp.aiGenerated && (
                    <span className="badge bg-violet-500/20 text-violet-400">
                      <Zap size={10} /> AI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {camp.segmentName} · Created {camp.createdAt}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <ChannelBadge channel={camp.channel} />
                  <StatusBadge status={camp.status} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                {[
                  { label: 'Sent', value: camp.stats.sent.toLocaleString() },
                  { label: 'Delivered', value: camp.stats.delivered.toLocaleString() },
                  { label: 'Opened', value: camp.stats.opened.toLocaleString() },
                  { label: 'Clicked', value: camp.stats.clicked.toLocaleString() },
                  { label: 'Converted', value: camp.stats.converted.toLocaleString() },
                  { label: 'Conv. Rate', value: `${camp.conversionRate}%`, highlight: true },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className={`text-sm font-bold ${stat.highlight ? 'text-emerald-400' : 'text-white'}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <ChevronRight size={18} className="text-slate-600 self-center flex-shrink-0" />
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Delivery rate</span>
                <span>{((camp.stats.delivered / camp.stats.sent) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(camp.stats.delivered / camp.stats.sent) * 100}%` }}
                  transition={{ delay: idx * 0.04 + 0.3, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
