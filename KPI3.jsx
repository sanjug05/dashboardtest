import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import KPICard from '../KPICards/KPICard';
import DataTable from '../Common/DataTable';
import AddEntryModal from '../Common/AddEntryModal';
import { format, parseISO, eachDayOfInterval, parseJSON } from 'date-fns';

const TYPE_COLORS = { New: '#00B4D8', Repeat: '#4ADE80', Referral: '#FFD700', 'Walk-in': '#F472B6' };

const KPI3 = () => {
  const { data, filterByDate, dateRange, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const footfall = filterByDate(data.footfall);

  // Daily trend
  const dailyMap = footfall.reduce((acc, f) => {
    acc[f.date] = (acc[f.date] || 0) + 1;
    return acc;
  }, {});

  const trendData = Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b)).slice(-30).map(([date, count]) => ({
    date: format(parseISO(date), 'dd MMM'),
    count,
  }));

  // By type
  const typeCount = footfall.reduce((acc, f) => {
    acc[f.customerType] = (acc[f.customerType] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

  // Time slot heatmap
  const timeSlotMap = {};
  footfall.forEach(f => {
    if (f.timeIn) {
      const hour = f.timeIn.split(':')[0];
      timeSlotMap[hour] = (timeSlotMap[hour] || 0) + 1;
    }
  });
  const peakHour = Object.entries(timeSlotMap).sort(([, a], [, b]) => b - a)[0]?.[0];

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'name', label: 'Customer' },
    { key: 'customerType', label: 'Type', render: v => (
      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${TYPE_COLORS[v]}20`, color: TYPE_COLORS[v] }}>{v}</span>
    )},
    { key: 'timeIn', label: 'Time In' },
    { key: 'timeOut', label: 'Time Out' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'salesperson', label: 'Staff' },
  ];

  const formFields = [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'name', label: 'Customer Name', type: 'text' },
    { name: 'contact', label: 'Contact', type: 'text' },
    { name: 'customerType', label: 'Type', type: 'select', options: ['New', 'Repeat', 'Referral', 'Walk-in'] },
    { name: 'timeIn', label: 'Time In', type: 'time' },
    { name: 'timeOut', label: 'Time Out', type: 'time' },
    { name: 'purpose', label: 'Purpose', type: 'select', options: ['Product Enquiry', 'Purchase', 'After Sales', 'General Browse', 'Specification Review'] },
    { name: 'salesperson', label: 'Staff', type: 'select', options: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Rao'] },
  ];

  return (
    <KPICard kpiNumber="3" title="Footfall Entity — Customers"
      badge={`${footfall.length} Total · Peak: ${peakHour}:00`} canEdit={canEdit} onAdd={() => setShowModal(true)}>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(typeCount).map(([type, count]) => (
          <div key={type} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" style={{ color: TYPE_COLORS[type] }}>{type}</p>
              <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[type] }} />
            </div>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{count}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{Math.round((count / footfall.length) * 100)}% of total</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>DAILY FOOTFALL TREND</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="footfallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} interval={4} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="#00B4D8" strokeWidth={2} fill="url(#footfallGrad)" name="Footfall" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>BY VISITOR TYPE</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" outerRadius={65} innerRadius={35} dataKey="value" paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={TYPE_COLORS[e.name] || '#00B4D8'} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak Hours Mini Heatmap */}
      <div className="mb-6">
        <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>PEAK HOURS DISTRIBUTION</p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 9).map(hour => {
            const count = timeSlotMap[hour.toString()] || 0;
            const maxCount = Math.max(...Object.values(timeSlotMap), 1);
            const intensity = count / maxCount;
            return (
              <div key={hour} className="flex flex-col items-center gap-1">
                <div className="w-8 h-10 rounded-lg transition-all" style={{ background: `rgba(0,180,216,${0.1 + intensity * 0.8})` }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      <DataTable columns={columns} data={footfall.slice(0, 20)} />

      {showModal && (
        <AddEntryModal title="Add Footfall Entry" fields={formFields}
          onSubmit={d => { addRecord('footfall', { ...d, type: 'customer', ecId: 'EC001' }); setShowModal(false); }}
          onClose={() => setShowModal(false)} />
      )}
    </KPICard>
  );
};

export default KPI3;
