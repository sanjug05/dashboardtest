import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

const KPICard = ({ kpiNumber, title, children, onAdd, canEdit, badge }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl overflow-hidden mb-5 animate-fade-in"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
        style={{ borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>
            {kpiNumber}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.03em' }}>{title}</h3>
            {badge && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,180,216,0.15)', color: '#00B4D8' }}>{badge}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && onAdd && !expanded === false && (
            <button onClick={e => { e.stopPropagation(); onAdd(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff' }}>
              <Plus size={12} /> Add Entry
            </button>
          )}
          {expanded ? <ChevronUp size={16} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />}
        </div>
      </div>

      {/* Content */}
      {expanded && <div className="p-5">{children}</div>}
    </div>
  );
};

export default KPICard;
