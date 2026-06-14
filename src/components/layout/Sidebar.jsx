import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Layers, Zap, BarChart3, Settings,
  Megaphone, TrendingUp, Clock, Bot, ChevronRight, LogOut, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    label: 'Shoppers',
    items: [
      { to: '/customers', icon: Users, label: 'Customers' },
      { to: '/segments', icon: Layers, label: 'Segments' },
      { to: '/segments/ai-builder', icon: Bot, label: 'AI Segment Builder' },
    ],
  },
  {
    label: 'Campaigns',
    items: [
      { to: '/campaigns', icon: Megaphone, label: 'All Campaigns' },
      { to: '/campaigns/create', icon: Zap, label: 'Create Campaign' },
      { to: '/campaigns/ai-assistant', icon: Bot, label: 'AI Assistant' },
    ],
  },
];

export default function Sidebar({ collapsed, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-glow">
            <Zap size={18} className="text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-0"
            >
              <span className="font-bold text-white text-lg leading-none">XenoReach</span>
              <span className="block text-xs text-brand-400 font-medium">AI CRM</span>
            </motion.div>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    isActive ? 'nav-item-active flex' : 'nav-item flex'
                  }
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-800">
        <div className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-lg flex-shrink-0 bg-slate-700"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
