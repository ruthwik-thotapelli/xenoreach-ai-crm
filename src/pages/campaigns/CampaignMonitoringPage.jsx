import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Send, CheckCircle2, Eye, BookOpen, MousePointer, XCircle,
  TrendingUp, ArrowLeft, Clock, BarChart2
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts';
import { campaigns } from '../../data/mockData';
import ChannelBadge from '../../components/ui/ChannelBadge';
import StatusBadge from '../../components/ui/StatusBadge';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

const hourlyData = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  sent: Math.floor(Math.random() * 200) + 10,
  delivered: Math.floor(Math.random() * 180) + 5,
  opened: Math.floor(Math.random() * 80),
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CampaignMonitoringPage() {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === id) || campaigns[0];
  const [liveStats, setLiveStats] = useState(campaign.stats);

  // Simulate live updates
  useEffect(() => {
    if (campaign.status !== 'active') return;
    const interval = setInterval(() => {
      setLiveStats(s => ({
        ...s,
        delivered: Math.min(s.sent, s.delivered + Math.floor(Math.random() * 3)),
        opened: s.opened + (Math.random() > 0.7 ? 1 : 0),
        clicked: s.clicked + (Math.random() > 0.9 ? 1 : 0),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [campaign.status]);

  const statsItems = [
    { label: 'Sent', value: liveStats.sent, icon: Send, color: 'brand', pct: null },
    { label: 'Delivered', value: liveStats.delivered, icon: CheckCircle2, color: 'emerald', pct: ((liveStats.delivered / liveStats.sent) * 100).toFixed(1) },
    { label: 'Opened', value: liveStats.opened, icon: Eye, color: 'violet', pct: ((liveStats.opened / liveStats.delivered) * 100).toFixed(1) },
    { label: 'Read', value: Math.floor(liveStats.opened * 0.85), icon: BookOpen, color: 'brand', pct: null },
    { label: 'Clicked', value: liveStats.clicked, icon: MousePointer, color: 'amber', pct: ((liveStats.clicked / liveStats.opened) * 100).toFixed(1) },
    { label: 'Converted', value: liveStats.converted, icon: TrendingUp, color: 'emerald', pct: ((liveStats.converted / liveStats.sent) * 100).toFixed(1) },
    { label: 'Failed', value: liveStats.failed, icon: XCircle, color: 'rose', pct: ((liveStats.failed / liveStats.sent) * 100).toFixed(1) },
  ];

  const pieData = [
    { name: 'Delivered', value: liveStats.delivered },
    { name: 'Opened', value: liveStats.opened },
    { name: 'Clicked', value: liveStats.clicked },
    { name: 'Converted', value: liveStats.converted },
    { name: 'Failed', value: liveStats.failed },
  ];

  const colorMap = {
    brand: 'bg-brand-500/20 text-brand-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    violet: 'bg-violet-500/20 text-violet-400',
    amber: 'bg-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link to="/campaigns" className="btn-ghost p-2">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-white">{campaign.name}</h2>
            <StatusBadge status={campaign.status} />
            {campaign.status === 'active' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-400 flex-wrap">
            <ChannelBadge channel={campaign.channel} />
            <span>·</span>
            <span>{campaign.segmentName}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {campaign.createdAt}</span>
          </div>
        </div>
        <Link to={`/campaigns/${campaign.id}/timeline`} className="btn-secondary gap-2 text-sm">
          <BarChart2 size={16} /> Timeline
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {statsItems.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.06 }}
            className="card text-center"
          >
            <div className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center ${colorMap[stat.color]}`}>
              <stat.icon size={16} />
            </div>
            <div className="text-xl font-bold text-white tabular-nums">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            {stat.pct && (
              <div className="text-xs text-emerald-400 font-medium mt-1">{stat.pct}%</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hourly Activity */}
        <div className="xl:col-span-2 card">
          <h3 className="font-semibold text-white mb-5">Hourly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sent" name="Sent" stroke="#6366f1" fill="url(#sentGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#10b981" fill="none" strokeWidth={2} />
              <Area type="monotone" dataKey="opened" name="Opened" stroke="#8b5cf6" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie */}
        <div className="card flex flex-col">
          <h3 className="font-semibold text-white mb-5">Event Distribution</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="text-white font-medium">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Impact */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Campaign Revenue Impact</h3>
          <span className="text-2xl font-bold text-emerald-400">₹{campaign.revenue.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-1">{campaign.openRate}%</div>
            <div className="text-sm text-slate-400">Open Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">{campaign.clickRate}%</div>
            <div className="text-sm text-slate-400">Click Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">{campaign.conversionRate}%</div>
            <div className="text-sm text-slate-400">Conversion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
