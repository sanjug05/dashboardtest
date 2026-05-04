import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Bell, Download, RefreshCw, Eye, LogOut } from 'lucide-react';
import { format } from 'date-fns';

const Header = ({ title }) => {
  const { dateRange, setDateRange } = useData();
  const { user, viewOnlyMode, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);

  const presets = [
    { label: 'Oct 2025', start: '2025-10-01', end: '2025-10-31' },
    { label: 'Nov 2025', start: '2025-11-01', end: '2025-11-30' },
    { label: 'Dec 2025', start: '2025-12-01', end: '2025-12-31' },
    { label: 'Q4 2025', start: '2025-10-01', end: '2025-12-31' },
  ];

  const notifications = [
    { text: 'Audit Score below 80% — action required', type: 'alert', time: '2h ago' },
    { text: 'Weekly MIS due today at 12 PM', type: 'reminder', time: '3h ago' },
    { text: 'Rajesh Kumar achieved 95% target', type: 'success', time: '5h ago' },
    { text: 'New architect visit scheduled for tomorrow', type: 'info', time: '1d ago' },
  ];

  return (
    <header className="flex items-center gap-4 px-6 py-3 flex-shrink-0"
      style={{ background: 'rgba(10,22,40,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,180,216,0.1)', zIndex: 10 }}>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white truncate" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
          {title}
        </h1>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Gurugram Experience Center · {format(new Date(), 'dd MMM yyyy, EEEE')}
        </p>
      </div>

      {/* Date Presets */}
      <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {presets.map(p => {
          const isActive = dateRange.start === p.start && dateRange.end === p.end;
          return (
            <button key={p.label} onClick={() => setDateRange({ start: p.start, end: p.end })}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: isActive ? 'linear-gradient(135deg, #00B4D8, #0096C7)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              }}>
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Range */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Calendar size={14} style={{ color: '#00B4D8' }} />
        <input type="date" value={dateRange.start} onChange={e => setDateRange(d => ({ ...d, start: e.target.value }))}
          className="bg-transparent text-xs outline-none" style={{ color: 'rgba(255,255,255,0.7)' }} />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>to</span>
        <input type="date" value={dateRange.end} onChange={e => setDateRange(d => ({ ...d, end: e.target.value }))}
          className="bg-transparent text-xs outline-none" style={{ color: 'rgba(255,255,255,0.7)' }} />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#00B4D8' }} />
        </button>
        {showNotif && (
          <div className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden z-50"
            style={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold text-white">Notifications</p>
            </div>
            {notifications.map((n, i) => (
              <div key={i} className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <p className="text-xs text-white mb-0.5">{n.text}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Only Badge / User */}
      {viewOnlyMode ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <Eye size={14} style={{ color: '#FFD700' }} />
          <span className="text-xs font-medium" style={{ color: '#FFD700' }}>View Only</span>
          <button onClick={logout} className="ml-1 p-0.5 rounded hover:opacity-70" style={{ color: '#FFD700' }}>
            <LogOut size={12} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff' }}>
            {user?.email?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white leading-tight">{user?.displayName || 'Sanju Gupta'}</p>
            <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>Manager</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
