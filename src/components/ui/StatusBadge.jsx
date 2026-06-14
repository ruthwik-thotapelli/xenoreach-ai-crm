const colorMap = {
  active: 'badge-success',
  completed: 'badge-info',
  draft: 'bg-slate-700/50 text-slate-400',
  scheduled: 'badge-warning',
  paused: 'bg-slate-700/50 text-amber-400',
  inactive: 'bg-slate-700/50 text-slate-400',
  champion: 'badge-success',
  at_risk: 'badge-danger',
  new: 'badge-info',
  delivered: 'badge-success',
  failed: 'badge-danger',
  sent: 'badge-info',
  opened: 'badge-purple',
  clicked: 'badge-warning',
  converted: 'badge-success',
  processing: 'badge-warning',
  shipped: 'badge-info',
  returned: 'badge-danger',
  cancelled: 'badge-danger',
};

const labelMap = {
  at_risk: 'At Risk',
};

export default function StatusBadge({ status }) {
  const className = colorMap[status] || 'badge bg-slate-700 text-slate-300';
  const label = labelMap[status] || status?.replace(/_/g, ' ');

  return (
    <span className={`badge capitalize ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
