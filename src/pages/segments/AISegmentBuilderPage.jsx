import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { customers } from '../../data/mockData';

const suggestions = [
  'Show customers who spent more than ₹5000 in the last 60 days',
  'Find inactive customers who haven\'t purchased in 90 days',
  'Get VIP shoppers from Mumbai with 10+ orders',
  'Show women aged 25–35 who bought clothing last month',
  'Find customers who clicked our last campaign but didn\'t convert',
];

const parseQuery = (query) => {
  const q = query.toLowerCase();
  let conditions = [];
  let count = 0;

  if (q.includes('spent more than') || q.includes('spend more than')) {
    const match = q.match(/₹?(\d+[\d,]*)/);
    const amount = match ? parseInt(match[1].replace(',', '')) : 5000;
    conditions.push({ field: 'totalSpend', operator: 'greater_than', value: amount });
    count = customers.filter(c => c.totalSpend > amount).length;
  }

  if (q.includes('inactive') || q.includes('haven\'t purchased')) {
    const match = q.match(/(\d+)\s*days?/);
    const days = match ? parseInt(match[1]) : 60;
    conditions.push({ field: 'lastPurchaseDate', operator: 'older_than_days', value: days });
    count = customers.filter(c => {
      const diffDays = (Date.now() - new Date(c.lastPurchaseDate).getTime()) / 86400000;
      return diffDays > days;
    }).length;
  }

  if (q.includes('mumbai')) {
    conditions.push({ field: 'city', operator: 'equals', value: 'Mumbai' });
    count = customers.filter(c => c.city === 'Mumbai').length;
  }

  if (q.includes('vip') || q.includes('champion')) {
    conditions.push({ field: 'status', operator: 'equals', value: 'champion' });
    count = customers.filter(c => c.status === 'champion').length;
  }

  if (conditions.length === 0) {
    const randomCount = Math.floor(Math.random() * 200) + 50;
    conditions = [{ field: 'totalSpend', operator: 'greater_than', value: 1000 }];
    count = randomCount;
  }

  return { conditions, count };
};

const generateAIResponse = (query) => {
  const { conditions, count } = parseQuery(query);
  const segmentName = `AI Segment — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

  return {
    text: `I've analyzed your customer data and built a segment matching your criteria. Here's what I found:`,
    segment: {
      name: segmentName,
      count,
      conditions,
    },
  };
};

export default function AISegmentBuilderPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: 'Hi! I\'m your AI Segment Builder. Tell me in plain language who you want to reach, and I\'ll build the segment for you.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedSegment, setSavedSegment] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = generateAIResponse(text);
    const aiMsg = { id: Date.now() + 1, role: 'ai', ...response, timestamp: new Date() };
    setMessages(m => [...m, aiMsg]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Segment Builder</h2>
          <p className="text-sm text-slate-400">Describe your audience in natural language</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: '60vh', minHeight: 400 }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-brand-500 to-violet-600' : 'bg-slate-700'}`}>
                {msg.role === 'ai' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
              </div>
              <div className={`max-w-[80%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai' ? 'chat-bubble-ai text-slate-200' : 'chat-bubble-user text-white'}`}>
                  {msg.text}
                </div>
                {/* Segment Preview Card */}
                {msg.segment && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-slate-800/50 border border-brand-500/30 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-brand-400" />
                      <span className="text-sm font-semibold text-brand-400">Generated Segment</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">{msg.segment.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={16} className="text-emerald-400" />
                      <span className="text-2xl font-bold text-emerald-400">{msg.segment.count.toLocaleString()}</span>
                      <span className="text-slate-400 text-sm">customers match</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {msg.segment.conditions.map((cond, i) => (
                        <div key={i} className="text-xs text-slate-400 bg-slate-700/50 rounded-lg px-3 py-2">
                          {cond.field} {cond.operator.replace(/_/g, ' ')} {cond.value}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSavedSegment(msg.segment)}
                        className="btn-primary py-2 text-xs"
                      >
                        Save Segment
                      </button>
                      <Link to="/campaigns/create" className="btn-secondary py-2 text-xs">
                        Create Campaign <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="chat-bubble-ai px-4 py-3 rounded-2xl flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-brand-400" />
                <span className="text-sm text-slate-400">Analyzing your customer data...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-800 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              id="ai-segment-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="input flex-1"
              placeholder="e.g. Show customers who spent more than ₹5000 in the last 60 days"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4 disabled:opacity-40">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div>
        <p className="text-sm text-slate-500 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-brand-500/50 hover:text-brand-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Segment Success */}
      <AnimatePresence>
        {savedSegment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Users size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Segment saved!</p>
                <p className="text-xs text-slate-400">{savedSegment.name} — {savedSegment.count} customers</p>
              </div>
            </div>
            <Link to="/segments" className="btn-secondary py-2 text-xs">View Segments</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
