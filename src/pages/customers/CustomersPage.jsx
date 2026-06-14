import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight, Phone, Mail, MapPin, ShoppingBag, Calendar, Award, TrendingUp } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import ChannelBadge from '../../components/ui/ChannelBadge';
import { customers, orders } from '../../data/mockData';

const PAGE_SIZE = 15;

const filterOptions = {
  status: ['active', 'inactive', 'at_risk', 'champion', 'new'],
  gender: ['Male', 'Female', 'Non-binary'],
  city: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'],
};

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', gender: '', city: '' });
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filters.status || c.status === filters.status;
      const matchGender = !filters.gender || c.gender === filters.gender;
      const matchCity = !filters.city || c.city === filters.city;
      return matchSearch && matchStatus && matchGender && matchCity;
    });
  }, [search, filters]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const customerOrders = selectedCustomer
    ? orders.filter(o => o.customerId === selectedCustomer.id).slice(0, 10)
    : [];

  const clearFilters = () => setFilters({ status: '', gender: '', city: '' });
  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{filtered.length.toLocaleString()} Customers</h2>
          <p className="text-sm text-slate-400">Manage and explore your shopper base</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="customer-search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input pl-10"
              placeholder="Search by name, email, city..."
            />
          </div>
          <button
            id="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary gap-2 ${activeFilters > 0 ? 'border-brand-500 text-brand-400' : ''}`}
          >
            <Filter size={16} />
            Filters
            {activeFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="btn-ghost text-rose-400 hover:text-rose-300">
              <X size={16} /> Clear
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800">
                {Object.entries(filterOptions).map(([key, options]) => (
                  <div key={key}>
                    <label className="input-label capitalize">{key}</label>
                    <select
                      id={`filter-${key}`}
                      value={filters[key]}
                      onChange={e => { setFilters({ ...filters, [key]: e.target.value }); setPage(1); }}
                      className="input"
                    >
                      <option value="">All {key}s</option>
                      {options.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="table-header">Customer</th>
                <th className="table-header hidden md:table-cell">Contact</th>
                <th className="table-header hidden lg:table-cell">Location</th>
                <th className="table-header">Orders</th>
                <th className="table-header">Total Spend</th>
                <th className="table-header hidden xl:table-cell">Last Purchase</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((customer, idx) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatar} alt={customer.name} className="w-9 h-9 rounded-xl bg-slate-700 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">{customer.name}</div>
                        <div className="text-xs text-slate-500">{customer.gender}, {customer.age}y</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <div className="text-xs text-slate-400">{customer.email}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{customer.phone}</div>
                  </td>
                  <td className="table-cell hidden lg:table-cell">{customer.city}</td>
                  <td className="table-cell font-medium">{customer.orderCount}</td>
                  <td className="table-cell font-semibold text-white">₹{customer.totalSpend.toLocaleString()}</td>
                  <td className="table-cell hidden xl:table-cell text-slate-400 text-xs">{customer.lastPurchaseDate}</td>
                  <td className="table-cell"><StatusBadge status={customer.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
          <p className="text-sm text-slate-400">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost py-2 px-3 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pg === page ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost py-2 px-3 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto custom-scrollbar"
            >
              <div className="p-6">
                {/* Close */}
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
                >
                  <X size={20} />
                </button>

                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-6">
                  <img src={selectedCustomer.avatar} className="w-16 h-16 rounded-2xl bg-slate-700" alt={selectedCustomer.name} />
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCustomer.name}</h2>
                    <p className="text-slate-400 text-sm">{selectedCustomer.gender}, {selectedCustomer.age} years old</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <StatusBadge status={selectedCustomer.status} />
                      {selectedCustomer.tags.map(tag => (
                        <span key={tag} className="badge bg-violet-500/20 text-violet-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {[
                    { icon: Mail, label: selectedCustomer.email },
                    { icon: Phone, label: selectedCustomer.phone },
                    { icon: MapPin, label: `${selectedCustomer.city}, ${selectedCustomer.state}` },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-slate-300">
                      <Icon size={15} className="text-slate-500" />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Orders', value: selectedCustomer.orderCount, icon: ShoppingBag, color: 'text-brand-400' },
                    { label: 'Total Spend', value: `₹${(selectedCustomer.totalSpend / 1000).toFixed(1)}k`, icon: TrendingUp, color: 'text-emerald-400' },
                    { label: 'Avg. Order', value: `₹${selectedCustomer.avgOrderValue.toLocaleString()}`, icon: Award, color: 'text-violet-400' },
                    { label: 'Loyalty Pts', value: selectedCustomer.loyaltyPoints, icon: Award, color: 'text-amber-400' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Icon size={18} className={`${color} mx-auto mb-1`} />
                      <div className="text-lg font-bold text-white">{value}</div>
                      <div className="text-xs text-slate-500">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Attributes */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Customer Attributes</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'Preferred Channel', value: <ChannelBadge channel={selectedCustomer.preferredChannel} /> },
                      { key: 'Member Since', value: selectedCustomer.createdAt },
                      { key: 'Last Purchase', value: selectedCustomer.lastPurchaseDate },
                      { key: 'RFM Score', value: `${selectedCustomer.rfmScore}/5` },
                    ].map(({ key, value }) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                        <span className="text-xs text-slate-500">{key}</span>
                        <span className="text-sm text-slate-200">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase History */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Purchase History</h3>
                  {customerOrders.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No orders found</p>
                  ) : (
                    <div className="space-y-2">
                      {customerOrders.map(order => (
                        <div key={order.id} className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{order.orderNumber}</p>
                            <p className="text-xs text-slate-500">{order.category} · {order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-emerald-400">₹{order.totalAmount.toLocaleString()}</p>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
