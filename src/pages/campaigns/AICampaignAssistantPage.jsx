import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, Megaphone, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChannelBadge from '../../components/ui/ChannelBadge';

const suggestions = [
  'Create a campaign for inactive customers with a 15% discount',
  'Send a VIP early access message to high-value Mumbai shoppers',
  'Launch a festive sale campaign for all customers via WhatsApp',
  'Re-engage customers who haven\'t purchased in 2 months',
  'Create a birthday campaign for customers with birthdays this month',
];

const parseAIIntent = (text) => {
  const t = text.toLowerCase();
  let channel = 'WhatsApp';
  let segment = 'At-Risk Customers';
  let segmentCount = 132;
  let message = '';
  let name = 'AI Generated Campaign';
  let discount = '';

  if (t.includes('email')) channel = 'Email';
  if (t.includes('sms')) channel = 'SMS';
  if (t.includes('rcs')) channel = 'RCS';

  if (t.includes('inactive') || t.includes('re-engage') || t.includes('2 month')) {
    segment = 'At-Risk Customers'; segmentCount = 132;
  } else if (t.includes('vip') || t.includes('high-value') || t.includes('mumbai')) {
    segment = 'Mumbai VIP Shoppers'; segmentCount = 63;
  } else if (t.includes('new customer') || t.includes('welcome')) {
    segment = 'New Customers (30 days)'; segmentCount = 88;
  } else if (t.includes('birthday')) {
    segment = 'Birthday Month Customers'; segmentCount = 41;
  }

  const discMatch = t.match(/(\d+)%/);
  if (discMatch) discount = discMatch[1] + '%';

  if (t.includes('inactive') || t.includes('re-engage')) {
    name = 'Win-Back Campaign';
    message = `Hi {{name}}! 👋 We miss you!\n\nIt's been a while since your last visit. Come back and enjoy${discount ? ` ${discount} off` : ' an exclusive offer'} on your next purchase.\n\nShop now → {{link}}`;
  } else if (t.includes('vip') || t.includes('early access')) {
    name = 'VIP Early Access';
    message = `Hey {{name}}! 🌟 As one of our VIP shoppers, you get exclusive early access to our newest collection!\n\nBe the first to explore → {{link}}`;
  } else if (t.includes('festive') || t.includes('sale')) {
    name = 'Festive Sale Campaign';
    message = `{{name}}, festive season is here! 🎉\n\nEnjoy${discount ? ` flat ${discount} off` : ' amazing deals'} on everything at {{brand}}.\n\nShop now → {{link}}`;
  } else if (t.includes('birthday')) {
    name = 'Birthday Special';
    message = `Happy Birthday {{name}}! 🎂🎉\n\nOn your special day, enjoy an exclusive 25% off as our birthday gift to you!\n\nRedeem now → {{link}}`;
  } else {
    name = 'AI Campaign';
    message = `Hi {{name}}! 🎉 Special offer just for you from {{brand}}.\n\nDon't miss out! Shop now → {{link}}`;
  }

  return { name, channel, segment, segmentCount, message };
};

export default function AICampaignAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: "Hi! I'm your AI Campaign Assistant. Tell me what kind of campaign you want to run and I'll create everything — the audience, the message, and the channel.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    setMessages(m => [...m, { id: Date.now(), role: 'user', text, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

    const campaign = parseAIIntent(text);
    setMessages(m => [...m, {
      id: Date.now() + 1,
      role: 'ai',
      text: `Got it! Here's a campaign I've prepared based on your request:`,
      campaign,
      timestamp: new Date(),
    }]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-brand-600 flex items-center justify-center shadow-glow-violet">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Campaign Assistant</h2>
          <p className="text-sm text-slate-400">Describe your intent — I'll build the full campaign</p>
        </div>
      </div>

      {/* Chat */}
      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: '60vh', minHeight: 400 }}>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-violet-500 to-brand-600' : 'bg-slate-700'}`}>
                {msg.role === 'ai' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
              </div>
              <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai' ? 'chat-bubble-ai text-slate-200' : 'chat-bubble-user text-white'}`}>
                  {msg.text}
                </div>

                {/* Campaign Preview Card */}
                {msg.campaign && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-slate-800/50 border border-violet-500/30 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-violet-400" />
                      <span className="text-sm font-semibold text-violet-400">Generated Campaign</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-lg">{msg.campaign.name}</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800 rounded-xl p-3 text-center">
                        <Users size={16} className="text-brand-400 mx-auto mb-1" />
                        <p className="text-white font-bold text-sm">{msg.campaign.segmentCount}</p>
                        <p className="text-xs text-slate-500">Customers</p>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-3 text-center">
                        <MessageSquare size={16} className="text-violet-400 mx-auto mb-1" />
                        <p className="text-white font-bold text-xs">{msg.campaign.channel}</p>
                        <p className="text-xs text-slate-500">Channel</p>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-3 text-center">
                        <Megaphone size={16} className="text-emerald-400 mx-auto mb-1" />
                        <p className="text-white font-bold text-xs">{msg.campaign.segment.split(' ').slice(0, 2).join(' ')}</p>
                        <p className="text-xs text-slate-500">Segment</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2">Generated Message</p>
                      <div className="bg-slate-900 rounded-xl p-3 text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                        {msg.campaign.message.replace('{{name}}', 'Priya').replace('{{brand}}', 'Lumière').replace('{{link}}', 'lumiere.in/shop')}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Link to="/campaigns/create" className="btn-primary py-2 text-xs">
                        Launch This Campaign <ArrowRight size={12} />
                      </Link>
                      <button className="btn-secondary py-2 text-xs">
                        Edit Message
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-brand-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="chat-bubble-ai px-4 py-3 rounded-2xl flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-violet-400" />
                <span className="text-sm text-slate-400">Creating your campaign...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-800 p-4">
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) sendMessage(input.trim()); }} className="flex gap-3">
            <input
              id="ai-campaign-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="input flex-1"
              placeholder="e.g. Create a campaign for inactive customers with a 15% discount"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4 disabled:opacity-40">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <p className="text-sm text-slate-500 mb-3">Try these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:border-violet-500/50 hover:text-violet-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
