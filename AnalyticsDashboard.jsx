import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Target } from 'lucide-react';

const InsightCard = ({ icon: Icon, title, body, type }) => {
  const colors = { alert: '#F87171', success: '#4ADE80', info: '#00B4D8', warning: '#FFD700' };
  const c = colors[type] || colors.info;
  return (
    <div className="p-4 rounded-xl" style={{ background: `${c}10`, border: `1px solid ${c}25` }}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${c}20` }}>
          <Icon size={14} style={{ color: c }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-white mb-0.5">{title}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{body}</p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const { data, filterByDate, stats } = useData();
  const [activeTab, setActiveTab] = useState('insights');

  // Monthly comparative data
  const monthlyData = [
    { month: 'Oct', footfall: 285, leads: 75, nps: 72, audit: 82 },
    { month: 'Nov', footfall: 312, leads: 82, nps: 78, audit: 85 },
    { month: 'Dec', footfall: 341, leads: 90, nps: 81, audit: 88 },
  ];

  // Predictive (Jan 2026 forecast)
  const predictiveData = [
    ...monthlyData,
    { month: 'Jan*', footfall: 368, leads: 96, nps: 84, audit: 89, predicted: true },
  ];

  // Salesperson ranking
  const spRankings = data.salesPlans?.map(p => ({
    name: p.salespersonName.split(' ')[0],
    avg: p.lines.length ? Math.round(p.lines.reduce((a, l) => a + l.achievementPct, 0) / p.lines.length) : 0,
  })).sort((a, b) => b.avg - a.avg) || [];

  // AI Insights
  const insights = [
    { icon: TrendingUp, title: 'Footfall Growing +20% QoQ', body: 'Customer visits increased steadily from Oct to Dec 2025. Peak hours shifted to 11 AM–2 PM. Consider deploying additional staff during this window.', type: 'success' },
    { icon: AlertTriangle, title: 'MIS Submission Compliance Below 85%', body: 'Weekly MIS on-time rate dropped to 78% in December. Recommend setting automated reminders at 9 AM on Mondays.', type: 'warning' },
    { icon: Zap, title: 'Architect Conversion Rate Improving', body: 'Referral-based architect visits have the highest conversion rate at 73%. Expanding referral programs could yield 15–20 additional visits per month.', type: 'info' },
    { icon: AlertTriangle, title: 'Hospitality Expense Over Budget', body: 'Hospitality spend exceeded budget by ₹12,400 in Q4. Review hospitality guidelines to align with monthly allocation.', type: 'alert' },
    { icon: CheckCircle, title: 'Audit Score Trending Upward', body: 'EC audit scores improved from 82% (Oct) to 88% (Dec). Safety and Display Standards categories show the most improvement.', type: 'success' },
    { icon: Target, title: 'Rajesh Kumar — Top Performer', body: 'Rajesh Kumar leads with 91% average achievement across all 20 performance lines. Recognize and share best practices with the team.', type: 'info' },
  ];

  const tabs = [
    { id: 'insights', label: '🧠 AI Insights' },
    { id: 'comparative', label: '📊 Comparative' },
    { id: 'predictive', label: '🔮 Predictive' },
    { id: 'rankings', label: '🏆 Rankings' },
  ];

  return (
    <div className="rounded-2xl overflow-hidden mb-5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,180,216,0.05)' }}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #FFD700, #E6C200)' }}>🧠</span>
          <div>
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Analytics & AI Insights</h3>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Powered by data patterns · Q4 2025</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full animate-pulse" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80' }}>
          ● Live
        </span>
      </div>

      <div className="p-5">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: activeTab === t.id ? 'linear-gradient(135deg, #00B4D8, #0096C7)' : 'rgba(255,255,255,0.06)',
                color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.55)',
                border: activeTab === t.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
          </div>
        )}

        {/* Comparative Tab */}
        {activeTab === 'comparative' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>MONTHLY FOOTFALL COMPARISON</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Bar dataKey="footfall" name="Footfall" fill="#00B4D8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>KPI METRICS TREND</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Line type="monotone" dataKey="nps" stroke="#FFD700" strokeWidth={2} dot={{ fill: '#FFD700', r: 3 }} name="NPS" />
                    <Line type="monotone" dataKey="audit" stroke="#4ADE80" strokeWidth={2} dot={{ fill: '#4ADE80', r: 3 }} name="Audit %" />
                    <Line type="monotone" dataKey="leads" stroke="#A78BFA" strokeWidth={2} dot={{ fill: '#A78BFA', r: 3 }} name="Leads" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Period comparison table */}
            <div className="lg:col-span-2">
              <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>PERIOD OVER PERIOD COMPARISON</p>
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'rgba(0,180,216,0.08)' }}>
                      {['Metric', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Change'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: '#00B4D8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { metric: 'Footfall', oct: 285, nov: 312, dec: 341 },
                      { metric: 'Leads', oct: 75, nov: 82, dec: 90 },
                      { metric: 'NPS Score', oct: 72, nov: 78, dec: 81 },
                      { metric: 'Audit Score', oct: '82%', nov: '85%', dec: '88%' },
                    ].map(row => {
                      const octN = parseFloat(row.oct), decN = parseFloat(row.dec);
                      const change = Math.round(((decN - octN) / octN) * 100);
                      return (
                        <tr key={row.metric} className="hover:bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="px-4 py-3 font-medium text-white">{row.metric}</td>
                          <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.6)' }}>{row.oct}</td>
                          <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.6)' }}>{row.nov}</td>
                          <td className="px-4 py-3 text-white font-medium">{row.dec}</td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1" style={{ color: change >= 0 ? '#4ADE80' : '#F87171' }}>
                              {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(change)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Predictive Tab */}
        {activeTab === 'predictive' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <span className="text-lg flex-shrink-0">🔮</span>
              <div>
                <p className="text-xs font-semibold text-white mb-1">Predictive Model (Jan 2026 Forecast)</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Based on Q4 2025 trend analysis using linear regression. Confidence interval: ±8%</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>FOOTFALL FORECAST</p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictiveData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                      <Line type="monotone" dataKey="footfall" stroke="#00B4D8" strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          return <circle key={cx} cx={cx} cy={cy} r={4} fill={payload.predicted ? '#FFD700' : '#00B4D8'} stroke="none" />;
                        }}
                        name="Footfall" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>JAN 2026 PREDICTIONS</p>
                {[
                  { label: 'Expected Footfall', value: '368', delta: '+8%', color: '#00B4D8' },
                  { label: 'Projected Leads', value: '96', delta: '+7%', color: '#4ADE80' },
                  { label: 'Forecast NPS', value: '84', delta: '+4%', color: '#FFD700' },
                  { label: 'Predicted Audit', value: '89%', delta: '+1%', color: '#A78BFA' },
                ].map(p => (
                  <div key={p.label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{p.value}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${p.color}20`, color: p.color }}>↑ {p.delta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>SALESPERSON PERFORMANCE RANKINGS</p>
              <div className="space-y-3">
                {spRankings.map((sp, i) => (
                  <div key={sp.name} className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.1)', color: i < 3 ? '#000' : 'rgba(255,255,255,0.5)' }}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-white">{sp.name}</span>
                        <span className="text-sm font-bold" style={{ color: sp.avg >= 90 ? '#4ADE80' : sp.avg >= 70 ? '#FFD700' : '#F87171', fontFamily: 'Rajdhani, sans-serif' }}>
                          {sp.avg}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sp.avg}%`, background: sp.avg >= 90 ? '#4ADE80' : sp.avg >= 70 ? '#FFD700' : '#F87171' }} />
                      </div>
                    </div>
                    {i === 0 && <span className="text-lg flex-shrink-0">🏆</span>}
                  </div>
                ))}
              </div>
            </div>
            {/* Action Recommendations */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>ACTION RECOMMENDATIONS</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {[
                  { icon: '📅', text: 'Schedule product knowledge refresher for Neha Patel & Vikram Rao (scores below 70%)' },
                  { icon: '📧', text: 'Send personalized thank-you notes to top 3 architects who visited in Dec 2025' },
                  { icon: '💡', text: 'Review lighting and display arrangement — scored lowest in showroom upkeep this quarter' },
                  { icon: '📊', text: 'Prepare December MIS summary before 2nd Jan — submission deadline approaching' },
                ].map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(0,180,216,0.06)', border: '1px solid rgba(0,180,216,0.15)' }}>
                    <span className="text-base flex-shrink-0">{rec.icon}</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
