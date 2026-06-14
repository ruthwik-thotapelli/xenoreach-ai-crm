import { motion } from 'framer-motion';

const channelIcons = {
  WhatsApp: '💬',
  SMS: '📱',
  Email: '✉️',
  RCS: '🔵',
};

const channelColors = {
  WhatsApp: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  SMS: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Email: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
  RCS: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

export default function ChannelBadge({ channel, showIcon = true }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${channelColors[channel] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
      {showIcon && <span>{channelIcons[channel]}</span>}
      {channel}
    </span>
  );
}
