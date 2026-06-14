import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, ShoppingCart, Megaphone, DollarSign, TrendingUp,
  AlertTriangle, Zap, Clock, CheckCircle, UserPlus, Cpu, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import StatCard from '../../components/ui/StatCard';
import ChannelBadge from '../../components/ui/ChannelBadge';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  dashboardKPIs,
  monthlyRevenueData,
  channelPerformanceData,
  recentActivities,
  aiInsights,
  campaigns,
} from '../../data/mockData';

const activityIcons = {
  'zap': Zap,
  'users': Users,
  'trending-up': TrendingUp,
  'user-plus': UserPlus,
  'check-circle': CheckCircle,
  'cpu': Cpu,
};
const activityColors = {
  brand: 'bg-brand-500/20 text-brand-400',
  violet: 'bg-violet-500/20 text-violet-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/20 text-amber-400',
};

const insightPriorityColors = {
  high: 'border-rose-500/30 bg-rose-500/5',
  medium: 'border-amber-500/30 bg-amber-500/5',
  low: 'border-brand-500/30 bg-brand-500/5',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.dataKey === 'revenue' ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const activeCampaigns = campaigns.filter(c => c.status === 'active').slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, Priya 👋</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your shoppers today.</p>
        </div>
        <Link to="/campaigns/create" className="btn-primary">
          <Zap size={16} /> New Campaign
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard title="Total Customers" value={dashboardKPIs.totalCustomers.toLocaleString()} change={dashboardKPIs.customerGrowth} icon={Users} color="brand" index={0} />
        <StatCard title="Total Orders" value={dashboardKPIs.totalOrders.toLocaleString()} change="+8.2%" icon={ShoppingCart} color="violet" index={1} />
        <StatCard title="Active Campaigns" value={dashboardKPIs.activeCampaigns} change={dashboardKPIs.campaignGrowth} icon={Megaphone} color="amber" index={2} />
        <StatCard title="Revenue Generated" value={`₹${(dashboardKPIs.totalRevenue / 100000).toFixed(1)}L`} change={dashboardKPIs.revenueGrowth} icon={DollarSign} color="emerald" index={3} />
        <StatCard title="Avg. Conversion" value={dashboardKPIs.avgConversionRate} suffix="%" change="+2.1%" icon={TrendingUp} color="brand" index={4} />
        <StatCard title="Segments Active" value="5" change="+2" icon={Users} color="violet" index={5} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue & Campaigns</h3>
              <p className="text-sm text-slate-400">Last 6 months performance</p>
            </div>
            <span className="badge-success">↑ 18.4% vs last period</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="customerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="customers" name="Customers" stroke="#8b5cf6" strokeWidth={2} fill="url(#customerGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Performance */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Channel Performance</h3>
            <p className="text-sm text-slate-400">Messages by channel</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={channelPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="channel" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sent" name="Sent" fill="#6366f1" radius={[0, 4, 4, 0]} />
              <Bar dataKey="delivered" name="Delivered" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="opened" name="Opened" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Link to="/campaigns" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => {
              const Icon = activityIcons[activity.icon] || Zap;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activityColors[activity.color]}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{activity.message}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock size={11} /> {activity.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <Cpu size={14} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border ${insightPriorityColors[insight.priority]}`}
              >
                <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{insight.description}</p>
                <button className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
                  {insight.action} <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Active Campaigns</h3>
          <Link to="/campaigns" className="btn-secondary py-2 text-sm">
            View All Campaigns
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="table-header">Campaign</th>
                <th className="table-header">Channel</th>
                <th className="table-header">Sent</th>
                <th className="table-header">Delivered</th>
                <th className="table-header">Conversion</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeCampaigns.map((camp) => (
                <tr key={camp.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="table-cell">
                    <div className="font-medium text-white">{camp.name}</div>
                    <div className="text-xs text-slate-500">{camp.segmentName}</div>
                  </td>
                  <td className="table-cell"><ChannelBadge channel={camp.channel} /></td>
                  <td className="table-cell">{camp.stats.sent.toLocaleString()}</td>
                  <td className="table-cell">{camp.stats.delivered.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className="text-emerald-400 font-semibold">{camp.conversionRate}%</span>
                  </td>
                  <td className="table-cell"><StatusBadge status={camp.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
