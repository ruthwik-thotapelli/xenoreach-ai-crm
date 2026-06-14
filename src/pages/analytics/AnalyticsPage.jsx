import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, FunnelChart, Funnel, LabelList,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  monthlyRevenueData, channelPerformanceData,
  conversionFunnelData, audienceGrowthData, campaigns
} from '../../data/mockData';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-slate-400 text-xs mb-2 font-medium">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const channelShare = channelPerformanceData.map(c => ({
    name: c.channel,
    value: c.sent,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <p className="text-sm text-slate-400">Campaign performance and engagement insights</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: campaigns.length, change: '+5', color: 'text-brand-400' },
          { label: 'Total Reach', value: `${campaigns.reduce((s, c) => s + c.stats.sent, 0).toLocaleString()}`, change: '+12%', color: 'text-violet-400' },
          { label: 'Total Revenue', value: `₹${(campaigns.reduce((s, c) => s + c.revenue, 0) / 100000).toFixed(1)}L`, change: '+18.4%', color: 'text-emerald-400' },
          { label: 'Avg Open Rate', value: `${(campaigns.reduce((s, c) => s + parseFloat(c.openRate), 0) / campaigns.length).toFixed(1)}%`, change: '+2.1%', color: 'text-amber-400' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card"
          >
            <div className={`text-2xl font-bold mb-1 ${kpi.color}`}>{kpi.value}</div>
            <div className="text-sm text-slate-400">{kpi.label}</div>
            <div className="text-xs text-emerald-400 mt-1 font-medium">{kpi.change} vs last period</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Revenue & Engagement Trends</h3>
          <span className="badge-success">6-month view</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyRevenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2.5} />
            <Line type="monotone" dataKey="customers" name="Customers" stroke="#10b981" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Channel Performance */}
        <div className="card">
          <h3 className="font-semibold text-white mb-5">Channel Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="channel" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey="sent" name="Sent" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delivered" name="Delivered" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="opened" name="Opened" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicked" name="Clicked" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Audience Growth */}
        <div className="card">
          <h3 className="font-semibold text-white mb-5">Audience Growth (30 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={audienceGrowthData.slice(-14)}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="customers" name="Customers" stroke="#10b981" fill="url(#growthGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-white mb-5">Conversion Funnel</h3>
          <div className="space-y-3">
            {conversionFunnelData.map((stage, idx) => {
              const pct = ((stage.value / conversionFunnelData[0].value) * 100).toFixed(1);
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{stage.value.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 w-12 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: stage.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Campaigns by Revenue */}
        <div className="card">
          <h3 className="font-semibold text-white mb-5">Top Campaigns by Revenue</h3>
          <div className="space-y-3">
            {topCampaigns.map((camp, idx) => (
              <div key={camp.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-4 tabular-nums">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-200 font-medium truncate">{camp.name}</span>
                    <span className="text-sm font-bold text-emerald-400 ml-2">₹{(camp.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(camp.revenue / topCampaigns[0].revenue) * 100}%` }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
