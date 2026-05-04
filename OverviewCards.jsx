import { useData } from '../../contexts/DataContext';
import { Users, TrendingUp, Star, ClipboardCheck, Building2, DollarSign } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="rounded-2xl p-5 relative overflow-hidden transition-transform hover:scale-[1.02] duration-200"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
    {/* Background glow */}
    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />

    <div className="flex items-start justify-between mb-3 relative z-10">
      <div className="p-2.5 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      {trend !== undefined && (
        <span className="text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ background: trend >= 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: trend >= 0 ? '#4ADE80' : '#F87171' }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>

    <div className="relative z-10">
      <p className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{sub}</p>}
    </div>
  </div>
);

const OverviewCards = () => {
  const { stats } = useData();

  const cards = [
    { icon: Users, label: 'Total Footfall', value: stats.totalFootfall, sub: 'Customers visited', color: '#00B4D8', trend: 12 },
    { icon: TrendingUp, label: 'Lead Conversion', value: `${stats.conversionRate}%`, sub: 'Online leads → visits', color: '#4ADE80', trend: 5 },
    { icon: Star, label: 'NPS Score', value: stats.avgNPS, sub: 'Architect satisfaction', color: '#FFD700', trend: -3 },
    { icon: ClipboardCheck, label: 'Audit Score', value: `${stats.auditScore}%`, sub: 'Overall compliance', color: '#A78BFA', trend: 8 },
    { icon: Building2, label: 'Showroom Score', value: `${stats.avgShowroomScore}/10`, sub: 'Upkeep rating', color: '#FB923C', trend: 2 },
    { icon: DollarSign, label: 'Total Leads', value: stats.totalLeads, sub: 'This period', color: '#F472B6', trend: 15 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map(c => <MetricCard key={c.label} {...c} />)}
    </div>
  );
};

export default OverviewCards;
