import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import KPICard from '../KPICards/KPICard';
import DataTable from '../Common/DataTable';
import AddEntryModal from '../Common/AddEntryModal';
import { format, parseISO } from 'date-fns';

// ─────────────────────────────────────────────────────────────────────────────
// KPI 5: Data Management & MIS
// ─────────────────────────────────────────────────────────────────────────────
export const KPI5 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const reports = filterByDate(data.dataMgmt, 'dueDate');
  const onTime = reports.filter(r => r.status === 'On Time').length;
  const compliance = reports.length ? Math.round((onTime / reports.length) * 100) : 0;

  const byType = ['Daily Report', 'Weekly MIS', 'Monthly Report'].map(type => {
    const items = reports.filter(r => r.reportType === type);
    const ot = items.filter(r => r.status === 'On Time').length;
    return { type: type.split(' ')[0], total: items.length, onTime: ot, rate: items.length ? Math.round((ot / items.length) * 100) : 0 };
  });

  const columns = [
    { key: 'reportType', label: 'Report Type' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'submissionDate', label: 'Submitted' },
    { key: 'status', label: 'Status', render: v => <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: v === 'On Time' ? 'rgba(74,222,128,0.15)' : v === 'Late' ? 'rgba(255,215,0,0.15)' : 'rgba(248,113,113,0.15)', color: v === 'On Time' ? '#4ADE80' : v === 'Late' ? '#FFD700' : '#F87171' }}>{v}</span> },
    { key: 'submittedBy', label: 'Submitted By' },
  ];

  return (
    <KPICard kpiNumber="5" title="Data Management & MIS Circulation" badge={`${compliance}% Compliance`} canEdit={canEdit} onAdd={() => setShowModal(true)}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {byType.map(t => (
          <div key={t.type} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke={t.rate >= 80 ? '#4ADE80' : t.rate >= 60 ? '#FFD700' : '#F87171'} strokeWidth="3" strokeDasharray={`${(t.rate / 100) * 94} 94`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{t.rate}%</span>
            </div>
            <p className="text-xs font-medium text-white">{t.type}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.onTime}/{t.total}</p>
          </div>
        ))}
      </div>
      <div className="mb-5">
        <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>SUBMISSION STATUS BY TYPE</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="type" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="total" name="Total" fill="rgba(0,180,216,0.25)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="onTime" name="On Time" fill="#4ADE80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <DataTable columns={columns} data={reports.slice(0, 20)} />
      {showModal && <AddEntryModal title="Add Report Submission" fields={[
        { name: 'reportType', label: 'Report Type', type: 'select', options: ['Daily Report', 'Weekly MIS', 'Monthly Report'] },
        { name: 'dueDate', label: 'Due Date', type: 'date' },
        { name: 'submissionDate', label: 'Submission Date', type: 'date' },
        { name: 'status', label: 'Status', type: 'select', options: ['On Time', 'Late', 'Missing'] },
        { name: 'submittedBy', label: 'Submitted By', type: 'text' },
      ]} onSubmit={d => { addRecord('dataMgmt', { ...d, ecId: 'EC001' }); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </KPICard>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI 6: Presentation Skills
// ─────────────────────────────────────────────────────────────────────────────
export const KPI6 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const sessions = filterByDate(data.presentationSkills);
  const salespersons = [...new Set(sessions.map(s => s.salesperson))];
  const spData = salespersons.map(sp => {
    const items = sessions.filter(s => s.salesperson === sp);
    const avgScore = items.length ? Math.round(items.reduce((a, s) => a + s.assessmentScore, 0) / items.length) : 0;
    return { name: sp.split(' ')[0], sessions: items.length, avgScore, target: 80 };
  });

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'salesperson', label: 'Salesperson' },
    { key: 'trainingTopic', label: 'Topic' },
    { key: 'assessmentScore', label: 'Score', render: v => <span className="font-bold" style={{ color: v >= 80 ? '#4ADE80' : v >= 60 ? '#FFD700' : '#F87171' }}>{v}%</span> },
    { key: 'certification', label: 'Certification', render: v => v || '—' },
    { key: 'nextTrainingDue', label: 'Next Due' },
  ];

  return (
    <KPICard kpiNumber="6" title="Presentation Skills & Product Knowledge" badge={`${sessions.length} Sessions`} canEdit={canEdit} onAdd={() => setShowModal(true)}>
      <div className="mb-5">
        <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>ASSESSMENT SCORE BY SALESPERSON (Target: 80%)</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="avgScore" name="Avg Score" radius={[6, 6, 0, 0]}>
                {spData.map((e, i) => <Cell key={i} fill={e.avgScore >= 80 ? '#4ADE80' : e.avgScore >= 60 ? '#FFD700' : '#F87171'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <DataTable columns={columns} data={sessions.slice(0, 20)} />
      {showModal && <AddEntryModal title="Add Training Session" fields={[
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'salesperson', label: 'Salesperson', type: 'select', options: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Rao'] },
        { name: 'trainingTopic', label: 'Training Topic', type: 'text' },
        { name: 'assessmentScore', label: 'Assessment Score (%)', type: 'number', min: 0, max: 100 },
        { name: 'certification', label: 'Certification Status', type: 'select', options: ['Completed', 'In Progress', 'Not Started'] },
        { name: 'nextTrainingDue', label: 'Next Training Due', type: 'date' },
      ]} onSubmit={d => { addRecord('presentationSkills', { ...d, assessmentScore: parseInt(d.assessmentScore), ecId: 'EC001' }); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </KPICard>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI 7: Architect Feedback / NPS
// ─────────────────────────────────────────────────────────────────────────────
export const KPI7 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const feedback = filterByDate(data.architectFeedback);
  const avgRating = feedback.length ? (feedback.reduce((a, f) => a + f.rating, 0) / feedback.length).toFixed(1) : 0;
  const nps = Math.round(avgRating * 20);
  const positive = feedback.filter(f => f.category === 'Positive').length;
  const neutral = feedback.filter(f => f.category === 'Neutral').length;
  const negative = feedback.filter(f => f.category === 'Negative').length;

  const paramAvg = (param) => {
    const items = feedback.filter(f => f.parameters?.[param]);
    return items.length ? (items.reduce((a, f) => a + f.parameters[param], 0) / items.length).toFixed(1) : 0;
  };

  const radarData = [
    { param: 'Knowledge', score: parseFloat(paramAvg('productKnowledge')), fullMark: 5 },
    { param: 'Presentation', score: parseFloat(paramAvg('presentation')), fullMark: 5 },
    { param: 'Hospitality', score: parseFloat(paramAvg('hospitality')), fullMark: 5 },
    { param: 'Overall', score: parseFloat(paramAvg('overallExperience')), fullMark: 5 },
  ];

  const sentimentData = [
    { name: 'Positive', value: positive, fill: '#4ADE80' },
    { name: 'Neutral', value: neutral, fill: '#FFD700' },
    { name: 'Negative', value: negative, fill: '#F87171' },
  ];

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'name', label: 'Architect' },
    { key: 'firmName', label: 'Firm' },
    { key: 'rating', label: 'Rating', render: v => <span className="font-bold" style={{ color: v >= 4 ? '#4ADE80' : v === 3 ? '#FFD700' : '#F87171' }}>{'★'.repeat(v)}{'☆'.repeat(5 - v)}</span> },
    { key: 'feedbackText', label: 'Feedback', render: v => <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{v?.slice(0, 60)}...</span> },
    { key: 'category', label: 'Sentiment', render: v => <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: v === 'Positive' ? 'rgba(74,222,128,0.15)' : v === 'Neutral' ? 'rgba(255,215,0,0.15)' : 'rgba(248,113,113,0.15)', color: v === 'Positive' ? '#4ADE80' : v === 'Neutral' ? '#FFD700' : '#F87171' }}>{v}</span> },
    { key: 'salesperson', label: 'Salesperson' },
  ];

  return (
    <KPICard kpiNumber="7" title="Architect Footfall Feedback & NPS" badge={`NPS: ${nps}`} canEdit={canEdit} onAdd={() => setShowModal(true)}>
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke={nps >= 70 ? '#4ADE80' : nps >= 50 ? '#FFD700' : '#F87171'} strokeWidth="8" strokeDasharray={`${(nps / 100) * 283} 283`} strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{nps}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>NPS</span>
            </div>
          </div>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Avg Rating: {avgRating}/5</p>
        </div>
        <div className="flex-1 space-y-2">
          {sentimentData.map(s => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-xs w-16" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.name}</span>
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${feedback.length ? (s.value / feedback.length) * 100 : 0}%`, background: s.fill }} />
              </div>
              <span className="text-xs font-bold w-8 text-right" style={{ color: s.fill }}>{s.value}</span>
            </div>
          ))}
        </div>
        <div className="h-40 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="param" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} />
              <Radar dataKey="score" stroke="#FFD700" fill="#FFD700" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <DataTable columns={columns} data={feedback.slice(0, 20)} />
      {showModal && <AddEntryModal title="Add Architect Feedback" fields={[
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'name', label: 'Architect Name', type: 'text', required: true },
        { name: 'firmName', label: 'Firm Name', type: 'text' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5 },
        { name: 'feedbackText', label: 'Feedback', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: ['Positive', 'Neutral', 'Negative'] },
        { name: 'salesperson', label: 'Salesperson', type: 'select', options: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Rao'] },
      ]} onSubmit={d => { addRecord('architectFeedback', { ...d, rating: parseInt(d.rating), type: 'architect', ecId: 'EC001' }); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </KPICard>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI 8: Expense Management
// ─────────────────────────────────────────────────────────────────────────────
export const KPI8 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const expenses = filterByDate(data.expenses);
  const COLORS = ['#00B4D8', '#4ADE80', '#FFD700', '#A78BFA', '#F472B6'];
  const catMap = expenses.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = { budget: 0, actual: 0 };
    acc[e.category].budget += e.budgetAmount;
    acc[e.category].actual += e.actualAmount;
    return acc;
  }, {});
  const catData = Object.entries(catMap).map(([cat, v], i) => ({ name: cat, budget: v.budget, actual: v.actual, variance: v.budget - v.actual, fill: COLORS[i] }));
  const totalBudget = catData.reduce((a, c) => a + c.budget, 0);
  const totalActual = catData.reduce((a, c) => a + c.actual, 0);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'budgetAmount', label: 'Budget', render: v => `₹${v.toLocaleString()}` },
    { key: 'actualAmount', label: 'Actual', render: v => `₹${v.toLocaleString()}` },
    { key: 'variance', label: 'Variance', render: v => <span style={{ color: v >= 0 ? '#4ADE80' : '#F87171' }}>{v >= 0 ? '+' : ''}₹{v.toLocaleString()}</span> },
    { key: 'approvedBy', label: 'Approved By' },
  ];

  return (
    <KPICard kpiNumber="8" title="Showroom Expense Management" badge={`₹${totalActual.toLocaleString()} / ₹${totalBudget.toLocaleString()}`} canEdit={canEdit} onAdd={() => setShowModal(true)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>BUDGET UTILIZATION</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} cx="50%" cy="45%" outerRadius={80} innerRadius={50} dataKey="actual" paddingAngle={3}>
                  {catData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} formatter={v => `₹${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>BUDGET VS ACTUAL</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} formatter={v => `₹${v.toLocaleString()}`} />
                <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
                  {catData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={expenses.slice(0, 20)} />
      {showModal && <AddEntryModal title="Add Expense Entry" fields={[
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Utilities', 'Maintenance', 'Hospitality', 'Marketing Materials', 'Miscellaneous'] },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'budgetAmount', label: 'Budget Amount (₹)', type: 'number' },
        { name: 'actualAmount', label: 'Actual Amount (₹)', type: 'number' },
        { name: 'approvedBy', label: 'Approved By', type: 'text' },
      ]} onSubmit={d => { addRecord('expenses', { ...d, budgetAmount: parseFloat(d.budgetAmount), actualAmount: parseFloat(d.actualAmount), variance: parseFloat(d.budgetAmount) - parseFloat(d.actualAmount), ecId: 'EC001' }); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </KPICard>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI 9: Audit Score
// ─────────────────────────────────────────────────────────────────────────────
export const KPI9 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const audits = data.auditScores; // Not date filtered — show all audits
  const totalScore = audits.reduce((a, s) => a + s.score, 0);
  const totalMax = audits.reduce((a, s) => a + s.maxScore, 0);
  const overallPct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;

  const byParam = audits.reduce((acc, a) => {
    if (!acc[a.parameter]) acc[a.parameter] = { score: 0, max: 0, count: 0 };
    acc[a.parameter].score += a.score;
    acc[a.parameter].max += a.maxScore;
    acc[a.parameter].count++;
    return acc;
  }, {});
  const paramData = Object.entries(byParam).map(([param, v]) => ({ param, pct: Math.round((v.score / v.max) * 100) }));

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'auditorName', label: 'Auditor' },
    { key: 'parameter', label: 'Parameter' },
    { key: 'score', label: 'Score', render: (v, row) => <span className="font-bold text-white">{v}/{row.maxScore}</span> },
    { key: 'findings', label: 'Findings' },
    { key: 'actionTaken', label: 'Action Taken' },
  ];

  return (
    <KPICard kpiNumber="9" title="EC Audit Score" badge={`Overall: ${overallPct}%`} canEdit={canEdit} onAdd={() => setShowModal(true)}>
      <div className="flex items-start gap-8 mb-6">
        <div className="text-center flex-shrink-0">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={overallPct >= 80 ? '#4ADE80' : overallPct >= 60 ? '#FFD700' : '#F87171'} strokeWidth="10" strokeDasharray={`${(overallPct / 100) * 314} 314`} strokeLinecap="round" style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{overallPct}%</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Audit</span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {paramData.map(p => (
            <div key={p.param}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.param}</span>
                <span className="text-xs font-bold" style={{ color: p.pct >= 80 ? '#4ADE80' : p.pct >= 60 ? '#FFD700' : '#F87171' }}>{p.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.pct >= 80 ? '#4ADE80' : p.pct >= 60 ? '#FFD700' : '#F87171' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <DataTable columns={columns} data={audits.slice(0, 20)} />
      {showModal && <AddEntryModal title="Add Audit Entry" fields={[
        { name: 'date', label: 'Audit Date', type: 'date', required: true },
        { name: 'auditorName', label: 'Auditor Name', type: 'text', required: true },
        { name: 'parameter', label: 'Parameter', type: 'select', options: ['Compliance', 'Documentation', 'Safety', 'Display Standards', 'Customer Service'] },
        { name: 'score', label: 'Score', type: 'number', min: 0, max: 20 },
        { name: 'maxScore', label: 'Max Score', type: 'number', placeholder: '20' },
        { name: 'findings', label: 'Findings', type: 'text' },
        { name: 'actionTaken', label: 'Action Taken', type: 'text' },
      ]} onSubmit={d => { addRecord('auditScores', { ...d, score: parseInt(d.score), maxScore: parseInt(d.maxScore || 20), ecId: 'EC001' }); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </KPICard>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI 10: Salesperson Performance Plan
// ─────────────────────────────────────────────────────────────────────────────
export const KPI10 = () => {
  const { data, updateRecord } = useData();
  const { canEdit } = useAuth();
  const [selected, setSelected] = useState(0);
  const plans = data.salesPlans;
  if (!plans?.length) return null;
  const plan = plans[selected];

  const chartData = plans.map(p => {
    const avgAch = p.lines.length ? Math.round(p.lines.reduce((a, l) => a + l.achievementPct, 0) / p.lines.length) : 0;
    return { name: p.salespersonName.split(' ')[0], achievement: avgAch };
  });

  return (
    <KPICard kpiNumber="10" title="Salesperson Performance Plan (20 Lines)" badge={`${plans.length} Salespersons`} canEdit={canEdit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>ACHIEVEMENT % BY SALESPERSON</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} axisLine={false} width={55} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="achievement" name="Achievement %" radius={[0, 6, 6, 0]}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.achievement >= 90 ? '#4ADE80' : e.achievement >= 70 ? '#FFD700' : '#F87171'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>SELECT SALESPERSON</p>
          <div className="flex flex-col gap-2">
            {plans.map((p, i) => {
              const avg = Math.round(p.lines.reduce((a, l) => a + l.achievementPct, 0) / p.lines.length);
              return (
                <button key={p.id} onClick={() => setSelected(i)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                  style={{ background: selected === i ? 'rgba(0,180,216,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selected === i ? 'rgba(0,180,216,0.4)' : 'rgba(255,255,255,0.06)'}` }}>
                  <span className="text-sm text-white">{p.salespersonName}</span>
                  <span className="text-sm font-bold" style={{ color: avg >= 90 ? '#4ADE80' : avg >= 70 ? '#FFD700' : '#F87171' }}>{avg}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 20-line table for selected salesperson */}
      <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>PERFORMANCE LINES — {plan.salespersonName}</p>
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: 'rgba(0,180,216,0.08)' }}>
              {['#', 'Target Area', 'Metric', 'Target', 'Actual', 'Achievement', 'Status', 'Remarks'].map(h => (
                <th key={h} className="px-3 py-3 text-left font-semibold" style={{ color: '#00B4D8', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.lines.map(l => (
              <tr key={l.lineNo} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="px-3 py-2.5 text-white opacity-50">{l.lineNo}</td>
                <td className="px-3 py-2.5 text-white">{l.targetArea}</td>
                <td className="px-3 py-2.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.targetMetric}</td>
                <td className="px-3 py-2.5 text-white">{l.targetValue}</td>
                <td className="px-3 py-2.5 text-white">{l.actualValue}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(l.achievementPct, 100)}%`, background: l.achievementPct >= 90 ? '#4ADE80' : l.achievementPct >= 70 ? '#FFD700' : '#F87171' }} />
                    </div>
                    <span className="font-bold" style={{ color: l.achievementPct >= 90 ? '#4ADE80' : l.achievementPct >= 70 ? '#FFD700' : '#F87171' }}>{l.achievementPct}%</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 rounded-full" style={{ background: l.achievementPct >= 90 ? 'rgba(74,222,128,0.15)' : l.achievementPct >= 70 ? 'rgba(255,215,0,0.15)' : 'rgba(248,113,113,0.15)', color: l.achievementPct >= 90 ? '#4ADE80' : l.achievementPct >= 70 ? '#FFD700' : '#F87171' }}>{l.status}</span>
                </td>
                <td className="px-3 py-2.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </KPICard>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// KPI 11: Customer Feedback
// ─────────────────────────────────────────────────────────────────────────────
export const KPI11 = () => {
  const { data, filterByDate, addRecord } = useData();
  const { canEdit } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const feedback = filterByDate(data.customerFeedback);
  const avgRating = feedback.length ? (feedback.reduce((a, f) => a + f.rating, 0) / feedback.length).toFixed(1) : 0;

  const ratingDist = [1, 2, 3, 4, 5].map(r => ({
    rating: `${'★'.repeat(r)}`,
    count: feedback.filter(f => f.rating === r).length,
  }));

  const paramKeys = ['productDisplay', 'staffBehavior', 'responseTime', 'solutionProvided', 'overallExperience'];
  const paramLabels = ['Product Display', 'Staff Behavior', 'Response Time', 'Solution', 'Overall'];
  const paramData = paramKeys.map((k, i) => {
    const items = feedback.filter(f => f.parameters?.[k]);
    const avg = items.length ? (items.reduce((a, f) => a + f.parameters[k], 0) / items.length).toFixed(1) : 0;
    return { param: paramLabels[i], avg: parseFloat(avg) };
  });

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'name', label: 'Customer' },
    { key: 'rating', label: 'Rating', render: v => <span style={{ color: v >= 4 ? '#4ADE80' : v === 3 ? '#FFD700' : '#F87171' }}>{'★'.repeat(v)}{'☆'.repeat(5 - v)}</span> },
    { key: 'feedbackText', label: 'Feedback', render: v => <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{v?.slice(0, 60)}</span> },
    { key: 'staffAttended', label: 'Staff' },
  ];

  return (
    <KPICard kpiNumber="11" title="Customer Footfall Feedback" badge={`★ ${avgRating}/5 Average`} canEdit={canEdit} onAdd={() => setShowModal(true)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>RATING DISTRIBUTION</p>
          <div className="space-y-2.5">
            {ratingDist.reverse().map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs w-20 text-yellow-400">{r.rating}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${feedback.length ? (r.count / feedback.length) * 100 : 0}%`, background: '#FFD700' }} />
                </div>
                <span className="text-xs w-6 text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl text-center" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <p className="text-4xl font-bold" style={{ color: '#FFD700', fontFamily: 'Rajdhani, sans-serif' }}>★ {avgRating}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Overall Rating · {feedback.length} Responses</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>PARAMETER SCORES</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paramData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="param" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 5]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="avg" name="Avg Score" fill="#FFD700" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={feedback.slice(0, 20)} />
      {showModal && <AddEntryModal title="Add Customer Feedback" fields={[
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'name', label: 'Customer Name', type: 'text' },
        { name: 'contact', label: 'Contact', type: 'text' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5 },
        { name: 'feedbackText', label: 'Feedback Text', type: 'text' },
        { name: 'staffAttended', label: 'Staff Attended', type: 'select', options: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Rao'] },
      ]} onSubmit={d => { addRecord('customerFeedback', { ...d, rating: parseInt(d.rating), type: 'customer', ecId: 'EC001' }); setShowModal(false); }} onClose={() => setShowModal(false)} />}
    </KPICard>
  );
};
