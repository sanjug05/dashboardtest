import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import KPICard from '../KPICards/KPICard';
import DataTable from '../Common/DataTable';
import AddEntryModal from '../Common/AddEntryModal';

const COLORS = { Website: '#00B4D8', 'Social Media': '#4ADE80', 'Google Ads': '#FFD700', Referral: '#A78BFA', 'Email Campaign': '#F472B6' };

const KPI1 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const leads = filterByDate(data.leadConversions);
  const total = leads.length;
  const qualified = leads.filter(l => l.status !== 'Cold').length;
  const converted = leads.filter(l => l.convertedToVisit).length;
  const convRate = total ? Math.round((converted / total) * 100) : 0;

  // Funnel data
  const funnelData = [
    { name: 'Total Leads', value: total, fill: '#00B4D8' },
    { name: 'Qualified', value: qualified, fill: '#4ADE80' },
    { name: 'EC Visits', value: converted, fill: '#FFD700' },
  ];

  // By source breakdown
  const bySource = leads.reduce((acc, l) => {
    if (!acc[l.leadSource]) acc[l.leadSource] = { source: l.leadSource, total: 0, converted: 0 };
    acc[l.leadSource].total++;
    if (l.convertedToVisit) acc[l.leadSource].converted++;
    return acc;
  }, {});
  const sourceData = Object.values(bySource).map(s => ({ ...s, rate: Math.round((s.converted / s.total) * 100) }));

  const columns = [
    { key: 'date', label: 'Date', width: '100px' },
    { key: 'leadSource', label: 'Lead Source' },
    { key: 'leadName', label: 'Lead Name' },
    { key: 'contact', label: 'Contact' },
    { key: 'status', label: 'Status', render: v => (
      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: v === 'Converted' ? 'rgba(74,222,128,0.15)' : v === 'Qualified' ? 'rgba(0,180,216,0.15)' : 'rgba(255,255,255,0.08)', color: v === 'Converted' ? '#4ADE80' : v === 'Qualified' ? '#00B4D8' : 'rgba(255,255,255,0.5)' }}>{v}</span>
    )},
    { key: 'convertedToVisit', label: 'EC Visit', render: v => v ? '✅ Yes' : '❌ No' },
    { key: 'salesperson', label: 'Salesperson' },
  ];

  const formFields = [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'leadSource', label: 'Lead Source', type: 'select', options: ['Website', 'Social Media', 'Google Ads', 'Referral', 'Email Campaign'], required: true },
    { name: 'leadName', label: 'Lead Name', type: 'text', required: true },
    { name: 'contact', label: 'Contact', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['Qualified', 'In Progress', 'Cold', 'Converted'] },
    { name: 'convertedToVisit', label: 'Converted to Visit', type: 'select', options: ['true', 'false'] },
    { name: 'salesperson', label: 'Salesperson', type: 'select', options: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Rao'] },
  ];

  return (
    <KPICard kpiNumber="1" title="Online Lead Conversion to EC Visit"
      badge={`${convRate}% Conversion`} canEdit={canEdit} onAdd={() => setShowModal(true)}>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: total, color: '#00B4D8' },
          { label: 'Qualified', value: qualified, color: '#4ADE80' },
          { label: 'EC Visits', value: converted, color: '#FFD700' },
        ].map(s => (
          <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Rajdhani, sans-serif' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Funnel */}
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>LEAD FUNNEL</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} axisLine={false} width={80} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Source */}
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>CONVERSION BY SOURCE</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} margin={{ top: 0, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="source" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="total" name="Total" fill="rgba(0,180,216,0.3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="converted" name="Converted" fill="#00B4D8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={leads.slice(0, 20)} />

      {showModal && (
        <AddEntryModal title="Add Lead Entry" fields={formFields}
          onSubmit={d => { addRecord('leadConversions', { ...d, convertedToVisit: d.convertedToVisit === 'true', kpiType: 'online_lead', ecId: 'EC001' }); setShowModal(false); }}
          onClose={() => setShowModal(false)} />
      )}
    </KPICard>
  );
};

export default KPI1;
