import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/customers': 'Customers',
  '/segments': 'Audience Segments',
  '/segments/ai-builder': 'AI Segment Builder',
  '/campaigns': 'Campaigns',
  '/campaigns/create': 'Create Campaign',
  '/campaigns/ai-assistant': 'AI Campaign Assistant',
  '/settings': 'Settings',
};

export default function Topbar({ sidebarOpen, onToggleSidebar, onToggleMobile }) {
  const { user } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  )?.[1] || 'XenoReach AI';

  return (
    <header className="flex items-center gap-4 h-16 px-4 lg:px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onToggleMobile}
        className="lg:hidden text-slate-400 hover:text-white transition-colors"
        id="mobile-menu-btn"
      >
        <Menu size={22} />
      </button>

      {/* Desktop sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex text-slate-400 hover:text-white transition-colors"
        id="sidebar-toggle-btn"
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <p className="text-xs text-slate-500">{user?.brand}</p>
      </div>

      {/* Search */}
      <div className="hidden sm:flex items-center">
        {searchOpen ? (
          <input
            autoFocus
            onBlur={() => setSearchOpen(false)}
            className="input w-64 py-2 text-sm"
            placeholder="Search customers, campaigns..."
          />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="btn-ghost py-2 px-3 text-slate-400"
            id="search-btn"
          >
            <Search size={18} />
          </button>
        )}
      </div>

      {/* Notifications */}
      <button
        className="relative text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-800"
        id="notifications-btn"
        onClick={() => setNotifications(0)}
      >
        <Bell size={20} />
        {notifications > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold">
            {notifications}
          </span>
        )}
      </button>

      {/* User avatar */}
      <img
        src={user?.avatar}
        alt={user?.name}
        className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-700"
      />
    </header>
  );
}
