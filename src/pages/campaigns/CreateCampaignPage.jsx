import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Loader2, ChevronRight, MessageSquare, Users, Calendar } from 'lucide-react';
import ChannelBadge from '../../components/ui/ChannelBadge';
import { segments } from '../../data/mockData';

const CHANNELS = ['WhatsApp', 'SMS', 'Email', 'RCS'];

const variables = ['{{name}}', '{{city}}', '{{brand}}', '{{discount}}', '{{link}}'];

const aiSuggestions = [
  { label: 'Win-back inactive (15% off)', prompt: 'Create a win-back message for inactive customers with a 15% discount offer' },
  { label: 'VIP early access', prompt: 'Write an exclusive early access message for our VIP customers' },
  { label: 'Festive sale announcement', prompt: 'Create a festive sale announcement with 20% off for loyal customers' },
  { label: 'New collection launch', prompt: 'Draft a new collection launch message with personalization' },
];

const mockGenerateMessage = async (prompt) => {
  await new Promise(r => setTimeout(r, 1500));
  const templates = {
    'win-back': `Hi {{name}}! 👋 We miss you at {{brand}}!\n\nIt's been a while since your last visit. As a special gesture, enjoy an exclusive 15% off your next purchase.\n\nUse code COMEBACK15 — valid for 48 hours only!\n\nShop now → {{link}}`,
    'vip': `Hey {{name}}! 🌟 You're a VIP!\n\nBefore we open to everyone, YOU get exclusive early access to our newest collection.\n\nBe the first to explore → {{link}}\n\nYour loyalty means everything to us. ❤️`,
    'festive': `{{name}}, festive season is here! 🎉\n\nCelebrate with flat 20% off on everything at {{brand}}.\n\nOffer ends Sunday midnight. Shop now → {{link}}`,
    'collection': `Hi {{name}}! 🆕 New arrivals just landed at {{brand}}!\n\nBe among the first to explore our latest collection — curated just for you based on your style.\n\nDiscover now → {{link}}`,
  };

  const p = prompt.toLowerCase();
  if (p.includes('win') || p.includes('inactive') || p.includes('15%')) return templates['win-back'];
  if (p.includes('vip') || p.includes('early')) return templates['vip'];
  if (p.includes('festive') || p.includes('sale')) return templates['festive'];
  return templates['collection'];
};

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    segmentId: segments[0].id,
    channel: 'WhatsApp',
    message: '',
    scheduledAt: '',
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedSegment = segments.find(s => s.id === form.segmentId) || segments[0];

  const handleGenerateMessage = async (prompt) => {
    setAiPrompt(prompt);
    setGeneratingAI(true);
    const msg = await mockGenerateMessage(prompt);
    setForm(f => ({ ...f, message: msg }));
    setGeneratingAI(false);
  };

  const insertVariable = (variable) => {
    setForm(f => ({ ...f, message: f.message + ' ' + variable }));
  };

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 2000));
    setSent(true);
    setSending(false);
    setTimeout(() => navigate('/campaigns'), 2000);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 animate-glow-pulse">
          <Zap size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Campaign Launched! 🚀</h2>
        <p className="text-slate-400 mb-2">{form.name}</p>
        <p className="text-sm text-slate-500">
          Sending to {selectedSegment.count} customers via {form.channel}...
        </p>
        <p className="text-xs text-slate-600 mt-4">Redirecting to campaigns...</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Create Campaign</h2>
        <p className="text-sm text-slate-400">Set up your message and audience</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {['Details', 'Audience & Channel', 'Message', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i + 1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${step === i + 1 ? 'bg-brand-600 text-white' : step > i + 1 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${step === i + 1 ? 'bg-white text-brand-600' : step > i + 1 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < 3 && <ChevronRight size={14} className="text-slate-700" />}
          </div>
        ))}
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card space-y-5">
          <h3 className="font-semibold text-white">Campaign Details</h3>
          <div>
            <label className="input-label">Campaign Name *</label>
            <input
              id="campaign-name-input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input"
              placeholder="e.g. Monsoon Sale Blast"
            />
          </div>
          <div>
            <label className="input-label">Schedule (optional)</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                className="input pl-10"
              />
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.name}
            className="btn-primary disabled:opacity-40"
          >
            Continue <ChevronRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Step 2: Audience & Channel */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card space-y-5">
          <h3 className="font-semibold text-white">Audience & Channel</h3>

          <div>
            <label className="input-label">Select Audience Segment</label>
            <div className="space-y-2">
              {segments.map(seg => (
                <label
                  key={seg.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.segmentId === seg.id ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 hover:border-slate-700'}`}
                >
                  <input
                    type="radio"
                    name="segment"
                    value={seg.id}
                    checked={form.segmentId === seg.id}
                    onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}
                    className="accent-brand-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{seg.name}</p>
                    <p className="text-xs text-slate-400">{seg.count} customers</p>
                  </div>
                  <span className="text-brand-400 font-bold text-sm">{seg.count}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">Channel</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHANNELS.map(ch => (
                <button
                  key={ch}
                  onClick={() => setForm(f => ({ ...f, channel: ch }))}
                  className={`p-3 rounded-xl border text-center transition-all ${form.channel === ch ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 hover:border-slate-700'}`}
                >
                  <ChannelBadge channel={ch} showIcon={true} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary">
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Message */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card space-y-5">
          <h3 className="font-semibold text-white">Compose Message</h3>

          {/* AI Generator */}
          <div className="bg-gradient-to-r from-brand-600/10 to-violet-600/10 border border-brand-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-brand-400" />
              <span className="text-sm font-semibold text-brand-300">AI Message Generator</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {aiSuggestions.map(s => (
                <button
                  key={s.label}
                  onClick={() => handleGenerateMessage(s.prompt)}
                  disabled={generatingAI}
                  className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors disabled:opacity-40"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Describe the message you want..."
                className="input flex-1 py-2 text-sm"
              />
              <button
                onClick={() => handleGenerateMessage(aiPrompt)}
                disabled={generatingAI || !aiPrompt}
                className="btn-primary px-4 disabled:opacity-40"
                id="ai-generate-btn"
              >
                {generatingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              </button>
            </div>
          </div>

          {/* Message Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="input-label mb-0">Message</label>
              <span className="text-xs text-slate-500">{form.message.length} chars</span>
            </div>
            <textarea
              id="message-editor"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="input h-40 resize-none"
              placeholder="Type your message or use AI generator above..."
            />
          </div>

          {/* Personalization Variables */}
          <div>
            <label className="input-label">Personalization Variables</label>
            <div className="flex gap-2 flex-wrap">
              {variables.map(v => (
                <button
                  key={v}
                  onClick={() => insertVariable(v)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-brand-300 hover:bg-slate-700 border border-slate-700 font-mono"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.message && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Message Preview</p>
              <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {form.message.replace('{{name}}', 'Priya').replace('{{brand}}', 'Lumière').replace('{{discount}}', '20%')}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
            <button onClick={() => setStep(4)} disabled={!form.message} className="btn-primary disabled:opacity-40">
              Review <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card space-y-5">
          <h3 className="font-semibold text-white">Review & Launch</h3>

          <div className="space-y-3">
            {[
              { label: 'Campaign Name', value: form.name },
              { label: 'Audience', value: `${selectedSegment.name} (${selectedSegment.count} customers)` },
              { label: 'Channel', value: <ChannelBadge channel={form.channel} /> },
              { label: 'Scheduled', value: form.scheduledAt || 'Send immediately' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-sm text-white font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2">Message</p>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{form.message}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="btn-secondary">Back</button>
            <button
              id="launch-campaign-btn"
              onClick={handleSend}
              disabled={sending}
              className="btn-primary flex-1 justify-center py-3"
            >
              {sending ? (
                <><Loader2 size={18} className="animate-spin" /> Launching...</>
              ) : (
                <><Zap size={18} /> Launch Campaign</>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
