import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Bot, Trash2, Edit2, Layers, TrendingUp } from 'lucide-react';
import { segments, customers } from '../../data/mockData';

const colorMap = {
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  brand: { bg: 'bg-brand-500/20', text: 'text-brand-400', border: 'border-brand-500/30' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
};

const fieldLabels = {
  totalSpend: 'Total Spend (₹)',
  orderCount: 'Order Count',
  lastPurchaseDate: 'Last Purchase Date',
  city: 'City',
  gender: 'Gender',
  age: 'Age',
  createdAt: 'Joined Date',
};

const operatorLabels = {
  greater_than: '>',
  less_than: '<',
  equals: '=',
  within_days: 'within last N days',
  older_than_days: 'older than N days',
};

export default function SegmentsPage() {
  const [segmentList, setSegmentList] = useState(segments);
  const [showCreate, setShowCreate] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    conditions: [{ field: 'totalSpend', operator: 'greater_than', value: 5000 }],
  });
  const [preview, setPreview] = useState(null);

  const addCondition = () => {
    setNewSegment(s => ({
      ...s,
      conditions: [...s.conditions, { field: 'orderCount', operator: 'greater_than', value: 1 }],
    }));
  };

  const removeCondition = (idx) => {
    setNewSegment(s => ({
      ...s,
      conditions: s.conditions.filter((_, i) => i !== idx),
    }));
  };

  const updateCondition = (idx, field, value) => {
    setNewSegment(s => {
      const conds = [...s.conditions];
      conds[idx] = { ...conds[idx], [field]: value };
      return { ...s, conditions: conds };
    });
  };

  const computePreview = () => {
    const matched = customers.filter(c => {
      return newSegment.conditions.every(cond => {
        const val = parseFloat(cond.value);
        if (cond.field === 'totalSpend') {
          return cond.operator === 'greater_than' ? c.totalSpend > val : c.totalSpend < val;
        }
        if (cond.field === 'orderCount') {
          return cond.operator === 'greater_than' ? c.orderCount > val : c.orderCount < val;
        }
        if (cond.field === 'city') {
          return cond.operator === 'equals' && c.city.toLowerCase() === cond.value.toLowerCase();
        }
        if (cond.field === 'gender') {
          return c.gender === cond.value;
        }
        return true;
      });
    });
    setPreview(matched.length);
  };

  const createSegment = () => {
    const seg = {
      id: `seg_${Date.now()}`,
      name: newSegment.name,
      description: newSegment.description,
      count: preview || 0,
      conditions: newSegment.conditions,
      createdAt: new Date().toISOString().slice(0, 10),
      color: ['emerald', 'rose', 'violet', 'brand', 'amber'][Math.floor(Math.random() * 5)],
    };
    setSegmentList(s => [seg, ...s]);
    setShowCreate(false);
    setNewSegment({ name: '', description: '', conditions: [{ field: 'totalSpend', operator: 'greater_than', value: 5000 }] });
    setPreview(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{segmentList.length} Audience Segments</h2>
          <p className="text-sm text-slate-400">Create and manage targeted shopper audiences</p>
        </div>
        <div className="flex gap-3">
          <Link to="/segments/ai-builder" className="btn-secondary gap-2">
            <Bot size={16} /> AI Builder
          </Link>
          <button id="create-segment-btn" onClick={() => setShowCreate(!showCreate)} className="btn-primary">
            <Plus size={16} /> New Segment
          </button>
        </div>
      </div>

      {/* Create Segment UI */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-brand-500/30"
        >
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Layers size={20} className="text-brand-400" /> Create New Segment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="input-label">Segment Name</label>
              <input
                id="segment-name-input"
                value={newSegment.name}
                onChange={e => setNewSegment(s => ({ ...s, name: e.target.value }))}
                className="input"
                placeholder="e.g. High Value Mumbai"
              />
            </div>
            <div>
              <label className="input-label">Description</label>
              <input
                value={newSegment.description}
                onChange={e => setNewSegment(s => ({ ...s, description: e.target.value }))}
                className="input"
                placeholder="Brief description..."
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Conditions (AND)</h4>
            <div className="space-y-3">
              {newSegment.conditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-3 flex-wrap">
                  <select
                    value={cond.field}
                    onChange={e => updateCondition(idx, 'field', e.target.value)}
                    className="input w-auto flex-1 min-w-40"
                  >
                    {Object.entries(fieldLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <select
                    value={cond.operator}
                    onChange={e => updateCondition(idx, 'operator', e.target.value)}
                    className="input w-auto flex-1 min-w-40"
                  >
                    {Object.entries(operatorLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <input
                    value={cond.value}
                    onChange={e => updateCondition(idx, 'value', e.target.value)}
                    className="input w-auto flex-1 min-w-32"
                    placeholder="Value"
                  />
                  {newSegment.conditions.length > 1 && (
                    <button onClick={() => removeCondition(idx)} className="text-rose-400 hover:text-rose-300 p-2">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addCondition} className="btn-ghost mt-3 text-sm text-brand-400">
              + Add Condition
            </button>
          </div>

          {/* Preview + Create */}
          <div className="flex items-center gap-3 flex-wrap">
            <button id="preview-segment-btn" onClick={computePreview} className="btn-secondary">
              <Users size={16} /> Preview Audience
            </button>
            {preview !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-400 font-semibold text-sm"
              >
                {preview} customers match
              </motion.div>
            )}
            <button
              id="save-segment-btn"
              onClick={createSegment}
              disabled={!newSegment.name}
              className="btn-primary disabled:opacity-40"
            >
              Save Segment
            </button>
          </div>
        </motion.div>
      )}

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {segmentList.map((seg, idx) => {
          const colors = colorMap[seg.color] || colorMap.brand;
          return (
            <motion.div
              key={seg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <Users size={18} className={colors.text} />
                </div>
                <div className="flex gap-2">
                  <button className="text-slate-500 hover:text-slate-300 p-1">
                    <Edit2 size={14} />
                  </button>
                  <button className="text-slate-500 hover:text-rose-400 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1">{seg.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{seg.description}</p>
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${colors.text}`}>{seg.count.toLocaleString()}</div>
                <span className="text-xs text-slate-500">customers</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800">
                <div className="flex gap-2 flex-wrap">
                  {seg.conditions.slice(0, 2).map((cond, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded-lg ${colors.bg} ${colors.text}`}>
                      {fieldLabels[cond.field] || cond.field} {operatorLabels[cond.operator] || cond.operator} {cond.value}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/campaigns/create"
                  state={{ segmentId: seg.id }}
                  className="btn-primary py-2 text-xs flex-1 justify-center"
                >
                  Create Campaign
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
