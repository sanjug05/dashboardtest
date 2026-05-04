import { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import KPICard from '../KPICards/KPICard';
import DataTable from '../Common/DataTable';
import AddEntryModal from '../Common/AddEntryModal';
import { format, parseISO } from 'date-fns';

const PARAMETERS = ['Cleanliness', 'Lighting', 'Display Arrangement', 'Ambience', 'Working Equipment', 'Safety'];

const KPI4 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const scores = filterByDate(data.showroomScores);

  // Radar data — avg score per parameter
  const radarData = PARAMETERS.map(param => {
    const items = scores.filter(s => s.parameter === param);
    const avg = items.length ? items.reduce((acc, s) => acc + s.score, 0) / items.length : 0;
    return { parameter: param.split(' ')[0], fullMark: 10, score: parseFloat(avg.toFixed(1)) };
  });

  // Trend — daily avg
  const dailyAvg = scores.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = { total: 0, count: 0 };
    acc[s.date].total += s.score;
    acc[s.date].count++;
    return acc;
  }, {});
  const trendData = Object.entries(dailyAvg).sort(([a], [b]) => a.localeCompare(b)).slice(-20).map(([date, v]) => ({
    date: format(parseISO(date), 'dd MMM'),
    avg: parseFloat((v.total / v.count).toFixed(1)),
  }));

  const overallAvg = scores.length ? (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1) : 0;

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'parameter', label: 'Parameter' },
    { key: 'score', label: 'Score', render: v => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', maxWidth: 60 }}>
          <div className="h-full rounded-full" style={{ width: `${v * 10}%`, background: v >= 8 ? '#4ADE80' : v >= 6 ? '#FFD700' : '#F87171' }} />
        </div>
        <span className="text-xs font-bold text-white">{v}/10</span>
      </div>
    )},
    { key: 'remarks', label: 'Remarks' },
    { key: 'checkedBy', label: 'Checked By' },
  ];

  const formFields = [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'parameter', label: 'Parameter', type: 'select', options: PARAMETERS },
    { name: 'score', label: 'Score (1-10)', type: 'number', min: 1, max: 10 },
    { name: 'remarks', label: 'Remarks', type: 'text' },
    { name: 'checkedBy', label: 'Checked By', type: 'text', placeholder: 'Manager name' },
  ];

  return (
    <KPICard kpiNumber="4" title="Showroom Upkeep & Maintenance Score"
      badge={`Overall: ${overallAvg}/10`} canEdit={canEdit} onAdd={() => setShowModal(true)}>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {radarData.map(p => (
          <div key={p.parameter} className="p-3 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: p.score >= 8 ? 'rgba(74,222,128,0.2)' : p.score >= 6 ? 'rgba(255,215,0,0.2)' : 'rgba(248,113,113,0.2)', color: p.score >= 8 ? '#4ADE80' : p.score >= 6 ? '#FFD700' : '#F87171' }}>
              {p.score}
            </div>
            <div>
              <p className="text-xs font-medium text-white">{PARAMETERS.find(param => param.split(' ')[0] === p.parameter) || p.parameter}</p>
              <div className="w-20 h-1 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${p.score * 10}%`, background: p.score >= 8 ? '#4ADE80' : p.score >= 6 ? '#FFD700' : '#F87171' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>PARAMETER RADAR</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="parameter" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#00B4D8" fill="#00B4D8" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>DAILY AVERAGE TREND</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} interval={3} />
                <YAxis domain={[0, 10]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Line type="monotone" dataKey="avg" stroke="#00B4D8" strokeWidth={2} dot={false} name="Avg Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={scores.slice(0, 20)} />

      {showModal && (
        <AddEntryModal title="Add Showroom Score" fields={formFields}
          onSubmit={d => { addRecord('showroomScores', { ...d, score: parseInt(d.score), ecId: 'EC001' }); setShowModal(false); }}
          onClose={() => setShowModal(false)} />
      )}
    </KPICard>
  );
};

export default KPI4;
