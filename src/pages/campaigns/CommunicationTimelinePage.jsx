import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle2, Eye, BookOpen, MousePointer, TrendingUp, XCircle } from 'lucide-react';
import { campaigns, generateTimeline } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import ChannelBadge from '../../components/ui/ChannelBadge';

const eventIcons = {
  sent: { icon: Send, color: 'bg-brand-500/20 text-brand-400' },
  delivered: { icon: CheckCircle2, color: 'bg-emerald-500/20 text-emerald-400' },
  opened: { icon: Eye, color: 'bg-violet-500/20 text-violet-400' },
  read: { icon: BookOpen, color: 'bg-blue-500/20 text-blue-400' },
  clicked: { icon: MousePointer, color: 'bg-amber-500/20 text-amber-400' },
  converted: { icon: TrendingUp, color: 'bg-emerald-500/20 text-emerald-400' },
  failed: { icon: XCircle, color: 'bg-rose-500/20 text-rose-400' },
};

export default function CommunicationTimelinePage() {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === id) || campaigns[0];
  const timeline = generateTimeline(id, 30);

  // Sort by timestamp descending
  const sortedTimeline = [...timeline].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link to={`/campaigns/${campaign.id}/monitoring`} className="btn-ghost p-2">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white">Communication Timeline</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-400">{campaign.name}</span>
            <ChannelBadge channel={campaign.channel} />
          </div>
        </div>
      </div>

      {/* Event Type Legend */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          {Object.entries(eventIcons).map(([type, { icon: Icon, color }]) => (
            <div key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${color.split(' ')[0]}`}>
              <Icon size={14} className={color.split(' ')[1]} />
              <span className="text-xs font-medium capitalize text-slate-300">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Events ({sortedTimeline.length})</h3>
          <span className="text-xs text-slate-500">Real-time delivery events</span>
        </div>
        <div className="divide-y divide-slate-800/50">
          {sortedTimeline.map((event, idx) => {
            const { icon: Icon, color } = eventIcons[event.eventType] || eventIcons.sent;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color.split(' ')[0]}`}>
                  <Icon size={16} className={color.split(' ')[1]} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white text-sm">{event.customerName}</span>
                    <StatusBadge status={event.eventType} />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                    <span>{event.metadata.location}</span>
                    <span>·</span>
                    <span className="capitalize">{event.metadata.deviceType}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <ChannelBadge channel={event.channel} showIcon={false} />
                  <div className="text-xs text-slate-500 mt-1">{event.timestamp.split(' ')[1]}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
