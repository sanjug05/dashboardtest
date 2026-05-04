import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const DataTable = ({ columns, data, pageSize = 10 }) => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = search
    ? data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    : data;

  const pages = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);

  if (!data?.length) return (
    <div className="flex flex-col items-center justify-center py-12 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
      <p className="text-4xl mb-3">📋</p>
      <p className="text-sm font-medium text-white mb-1">No data yet</p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Add entries to see them here</p>
    </div>
  );

  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }} />
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{filtered.length} records</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <table className="w-full text-xs min-w-max">
          <thead>
            <tr style={{ background: 'rgba(0,180,216,0.08)' }}>
              {columns.map(col => (
                <th key={col.key} className="px-3 py-3 text-left font-semibold whitespace-nowrap"
                  style={{ color: '#00B4D8', borderBottom: '1px solid rgba(255,255,255,0.06)', width: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={row.id || i} className="hover:bg-white/5 transition-colors"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {columns.map(col => (
                  <td key={col.key} className="px-3 py-2.5 whitespace-nowrap"
                    style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Page {page + 1} of {pages}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
              const pg = pages <= 5 ? i : Math.max(0, Math.min(page - 2, pages - 5)) + i;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                  style={{ background: pg === page ? 'linear-gradient(135deg, #00B4D8, #0096C7)' : 'transparent', color: pg === page ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {pg + 1}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}
              className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
