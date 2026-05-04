import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, TrendingUp, Users, Building2, FileText, BookOpen,
  Star, DollarSign, ClipboardCheck, Target, MessageSquare, LogOut,
  Menu, X, Bell, Calendar, ChevronDown, Eye, User
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, sub: 'Overview' },
  { id: 'kpi1', label: 'Online Lead Conversion', icon: TrendingUp, sub: 'KPI 1' },
  { id: 'kpi2', label: 'Architect Invitations', icon: Building2, sub: 'KPI 2' },
  { id: 'kpi3', label: 'Customer Footfall', icon: Users, sub: 'KPI 3' },
  { id: 'kpi4', label: 'Showroom Upkeep', icon: Building2, sub: 'KPI 4' },
  { id: 'kpi5', label: 'Data Management', icon: FileText, sub: 'KPI 5' },
  { id: 'kpi6', label: 'Presentation Skills', icon: BookOpen, sub: 'KPI 6' },
  { id: 'kpi7', label: 'Architect Feedback', icon: Star, sub: 'KPI 7' },
  { id: 'kpi8', label: 'Expense Management', icon: DollarSign, sub: 'KPI 8' },
  { id: 'kpi9', label: 'Audit Score', icon: ClipboardCheck, sub: 'KPI 9' },
  { id: 'kpi10', label: 'Sales Plan', icon: Target, sub: 'KPI 10' },
  { id: 'kpi11', label: 'Customer Feedback', icon: MessageSquare, sub: 'KPI 11' },
  { id: 'analytics', label: 'Analytics & Insights', icon: TrendingUp, sub: 'AI Insights' },
];

const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => {
  const { logout, user, viewOnlyMode } = useAuth();

  return (
    <aside className="flex flex-col h-full"
      style={{ width: collapsed ? 72 : 240, transition: 'width 0.3s ease', background: 'rgba(10,22,40,0.95)', borderRight: '1px solid rgba(0,180,216,0.1)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
          style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>
          AIS
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm leading-tight text-white" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>AIS Glass</p>
            <p className="text-xs leading-tight" style={{ color: 'rgba(0,180,216,0.7)' }}>EC Dashboard</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* View Only Badge */}
      {viewOnlyMode && !collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <Eye size={12} style={{ color: '#FFD700' }} />
          <span className="text-xs font-medium" style={{ color: '#FFD700' }}>View Only Mode</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 group text-left"
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,180,216,0.08))' : 'transparent',
                border: isActive ? '1px solid rgba(0,180,216,0.3)' : '1px solid transparent',
              }}>
              <Icon size={18} className="flex-shrink-0" style={{ color: isActive ? '#00B4D8' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} />
              {!collapsed && (
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-medium leading-tight truncate"
                    style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}>{item.label}</p>
                  <p className="text-xs leading-tight" style={{ color: isActive ? 'rgba(0,180,216,0.7)' : 'rgba(255,255,255,0.3)' }}>{item.sub}</p>
                </div>
              )}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00B4D8' }} />}
            </button>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff' }}>
              {viewOnlyMode ? <Eye size={14} /> : (user?.displayName?.[0] || user?.email?.[0] || 'S')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{viewOnlyMode ? 'View Only' : (user?.displayName || user?.email?.split('@')[0] || 'Sanju Gupta')}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{viewOnlyMode ? 'Read Only Access' : 'EC Manager'}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={logout} className="w-full flex justify-center p-2 rounded-xl hover:bg-red-500/20 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
