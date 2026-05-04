import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import KPICard from '../KPICards/KPICard';
import DataTable from '../Common/DataTable';
import AddEntryModal from '../Common/AddEntryModal';

const KPI2 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const invitations = filterByDate(data.architectInvitations);
  const categories = ['Cold Calls', 'Existing Relationships', 'Events', 'Referrals'];

  const chartData = categories.map(cat => {
    const items = invitations.filter(i => i.invitationCategory === cat);
    return {
      category: cat.split(' ')[0],
      planned: items.length,
      visited: items.filter(i => i.convertedToVisit).length,
      rate: items.length ? Math.round((items.filter(i => i.convertedToVisit).length / items.length) * 100) : 0,
    };
  });

  const totalPlanned = invitations.length;
  const totalVisited = invitations.filter(i => i.convertedToVisit).length;

  const columns = [
    { key: 'date', label: 'Date', width: '100px' },
    { key: 'architectName', label: 'Architect' },
    { key: 'firmName', label: 'Firm' },
    { key: 'invitationCategory', label: 'Category', render: v => <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(0,180,216,0.15)', color: '#00B4D8' }}>{v}</span> },
    { key: 'plannedVisitDate', label: 'Planned Date' },
    { key: 'actualVisitDate', label: 'Actual Date', render: v => v || '—' },
    { key: 'status', label: 'Status', render: v => (
      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: v === 'Visited' ? 'rgba(74,222,128,0.15)' : 'rgba(255,215,0,0.15)', color: v === 'Visited' ? '#4ADE80' : '#FFD700' }}>{v}</span>
    )},
    { key: 'salesperson', label: 'Salesperson' },
  ];

  const formFields = [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'architectName', label: 'Architect Name', type: 'text', required: true },
    { name: 'firmName', label: 'Firm Name', type: 'text' },
    { name: 'invitationCategory', label: 'Invitation Category', type: 'select', options: categories },
    { name: 'plannedVisitDate', label: 'Planned Visit Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'Visited', 'Pending', 'Rescheduled', 'Cancelled'] },
    { name: 'salesperson', label: 'Salesperson', type: 'select', options: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Rao'] },
  ];

  return (
    <KPICard kpiNumber="2" title="Architect Invitations — EC Visit Conversion"
      badge={`${totalPlanned} Planned · ${totalVisited} Visited`} canEdit={canEdit} onAdd={() => setShowModal(true)}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {chartData.map(d => (
          <div key={d.category} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{d.rate}%</p>
            <p className="text-xs font-medium" style={{ color: '#00B4D8' }}>{d.category}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{d.visited}/{d.planned} visited</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>PLANNED VS ACTUAL VISITS BY CATEGORY</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }} />
              <Bar dataKey="planned" name="Planned" fill="rgba(0,180,216,0.3)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="visited" name="Visited" fill="#00B4D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable columns={columns} data={invitations.slice(0, 20)} />

      {showModal && (
        <AddEntryModal title="Add Architect Invitation" fields={formFields}
          onSubmit={d => { addRecord('architectInvitations', { ...d, kpiType: 'architect_invitation', ecId: 'EC001' }); setShowModal(false); }}
          onClose={() => setShowModal(false)} />
      )}
    </KPICard>
  );
};

export default KPI2;
