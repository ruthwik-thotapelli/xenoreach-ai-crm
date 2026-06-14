import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Bell, Palette, Shield, Check, Loader2, Building } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const tabs = [
  { id: 'brand', label: 'Brand', icon: Building },
  { id: 'user', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between py-4 border-b border-slate-800 last:border-0">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-brand-600' : 'bg-slate-700'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('brand');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [brandSettings, setBrandSettings] = useState({
    brandName: user?.brand || 'Lumière Fashion',
    website: 'https://lumiere.in',
    industry: 'Fashion & Apparel',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    primaryColor: '#6366f1',
  });
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || 'Priya Sharma',
    email: user?.email || 'priya@lumiere.in',
    role: user?.role || 'Marketing Manager',
    phone: '+91 98765 43210',
  });
  const [notifications, setNotifications] = useState({
    campaignLaunched: true,
    campaignCompleted: true,
    aiInsights: true,
    weeklyReport: false,
    customerMilestones: true,
    failureAlerts: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400">Manage your brand, profile, and preferences</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`settings-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}
          >
            <tab.icon size={15} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Brand Settings */}
      {activeTab === 'brand' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Building size={18} className="text-brand-400" /> Brand Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Brand Name', key: 'brandName', placeholder: 'Your Brand Name' },
              { label: 'Website', key: 'website', placeholder: 'https://yourbrand.com' },
              { label: 'Industry', key: 'industry', placeholder: 'e.g. Fashion, Beauty' },
              { label: 'Timezone', key: 'timezone', placeholder: 'Asia/Kolkata' },
              { label: 'Currency', key: 'currency', placeholder: 'INR' },
            ].map(field => (
              <div key={field.key}>
                <label className="input-label">{field.label}</label>
                <input
                  id={`brand-${field.key}`}
                  value={brandSettings[field.key]}
                  onChange={e => setBrandSettings(s => ({ ...s, [field.key]: e.target.value }))}
                  className="input"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <div>
              <label className="input-label">Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandSettings.primaryColor}
                  onChange={e => setBrandSettings(s => ({ ...s, primaryColor: e.target.value }))}
                  className="w-12 h-10 rounded-xl border border-slate-700 bg-slate-800 cursor-pointer"
                />
                <input
                  value={brandSettings.primaryColor}
                  onChange={e => setBrandSettings(s => ({ ...s, primaryColor: e.target.value }))}
                  className="input flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Settings */}
      {activeTab === 'user' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5">
          <div className="flex items-center gap-4">
            <img src={user?.avatar} className="w-16 h-16 rounded-2xl bg-slate-700" alt={user?.name} />
            <div>
              <h3 className="font-semibold text-white">{user?.name}</h3>
              <p className="text-sm text-slate-400">{user?.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Role', key: 'role', type: 'text' },
              { label: 'Phone', key: 'phone', type: 'tel' },
            ].map(field => (
              <div key={field.key}>
                <label className="input-label">{field.label}</label>
                <input
                  id={`profile-${field.key}`}
                  type={field.type}
                  value={profileSettings[field.key]}
                  onChange={e => setProfileSettings(s => ({ ...s, [field.key]: e.target.value }))}
                  className="input"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Bell size={18} className="text-brand-400" /> Notification Preferences
          </h3>
          <Toggle
            label="Campaign Launched"
            description="When a campaign goes live"
            checked={notifications.campaignLaunched}
            onChange={v => setNotifications(n => ({ ...n, campaignLaunched: v }))}
          />
          <Toggle
            label="Campaign Completed"
            description="When a campaign finishes sending"
            checked={notifications.campaignCompleted}
            onChange={v => setNotifications(n => ({ ...n, campaignCompleted: v }))}
          />
          <Toggle
            label="AI Insights"
            description="Receive AI-powered recommendations"
            checked={notifications.aiInsights}
            onChange={v => setNotifications(n => ({ ...n, aiInsights: v }))}
          />
          <Toggle
            label="Weekly Report"
            description="Weekly performance summary email"
            checked={notifications.weeklyReport}
            onChange={v => setNotifications(n => ({ ...n, weeklyReport: v }))}
          />
          <Toggle
            label="Customer Milestones"
            description="When customers hit loyalty milestones"
            checked={notifications.customerMilestones}
            onChange={v => setNotifications(n => ({ ...n, customerMilestones: v }))}
          />
          <Toggle
            label="Failure Alerts"
            description="Immediate alerts for delivery failures"
            checked={notifications.failureAlerts}
            onChange={v => setNotifications(n => ({ ...n, failureAlerts: v }))}
          />
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Shield size={18} className="text-brand-400" /> Security Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="input-label">Current Password</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div>
              <label className="input-label">New Password</label>
              <input type="password" className="input" placeholder="Minimum 8 characters" />
            </div>
            <div>
              <label className="input-label">Confirm New Password</label>
              <input type="password" className="input" placeholder="Repeat new password" />
            </div>
          </div>
          <div className="border-t border-slate-800 pt-5">
            <Toggle
              label="Two-Factor Authentication"
              description="Add extra security to your account"
              checked={false}
              onChange={() => {}}
            />
            <Toggle
              label="Login Notifications"
              description="Get notified of new logins"
              checked={true}
              onChange={() => {}}
            />
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <button
        id="save-settings-btn"
        onClick={handleSave}
        disabled={saving}
        className={`btn-primary w-full justify-center py-3 transition-all ${saved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
      >
        {saving ? (
          <><Loader2 size={18} className="animate-spin" /> Saving...</>
        ) : saved ? (
          <><Check size={18} /> Settings Saved!</>
        ) : (
          <><Save size={18} /> Save Settings</>
        )}
      </button>
    </div>
  );
}
