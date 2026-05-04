import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ALL_SEED_DATA } from '../data/seedData';

const DataContext = createContext(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(ALL_SEED_DATA);
  const [dateRange, setDateRange] = useState({ start: '2025-10-01', end: '2025-12-31' });
  const [loading, setLoading] = useState(false);
  const [selectedEC] = useState('EC001');

  const filterByDate = useCallback((items, dateField = 'date') => {
    if (!dateRange.start || !dateRange.end) return items;
    return items.filter(item => {
      const d = item[dateField];
      return d >= dateRange.start && d <= dateRange.end;
    });
  }, [dateRange]);

  const addRecord = useCallback((collection, record) => {
    setData(prev => ({
      ...prev,
      [collection]: [...(prev[collection] || []), { ...record, id: `${collection}_${Date.now()}` }],
    }));
    return Promise.resolve({ id: `${collection}_${Date.now()}` });
  }, []);

  const updateRecord = useCallback((collection, id, updates) => {
    setData(prev => ({
      ...prev,
      [collection]: prev[collection].map(r => r.id === id ? { ...r, ...updates } : r),
    }));
    return Promise.resolve();
  }, []);

  const deleteRecord = useCallback((collection, id) => {
    setData(prev => ({
      ...prev,
      [collection]: prev[collection].filter(r => r.id !== id),
    }));
    return Promise.resolve();
  }, []);

  // Computed stats
  const stats = {
    totalFootfall: filterByDate(data.footfall).length,
    totalLeads: filterByDate(data.leadConversions).length,
    conversionRate: (() => {
      const leads = filterByDate(data.leadConversions);
      const converted = leads.filter(l => l.convertedToVisit).length;
      return leads.length ? Math.round((converted / leads.length) * 100) : 0;
    })(),
    avgNPS: (() => {
      const fb = filterByDate(data.architectFeedback);
      if (!fb.length) return 0;
      const avg = fb.reduce((acc, f) => acc + f.rating, 0) / fb.length;
      return Math.round(avg * 20); // Convert 1-5 to 0-100
    })(),
    auditScore: (() => {
      const audits = data.auditScores;
      if (!audits.length) return 0;
      const total = audits.reduce((acc, a) => acc + (a.score / a.maxScore) * 100, 0);
      return Math.round(total / audits.length);
    })(),
    avgShowroomScore: (() => {
      const scores = filterByDate(data.showroomScores);
      if (!scores.length) return 0;
      return (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1);
    })(),
  };

  return (
    <DataContext.Provider value={{ data, setData, dateRange, setDateRange, filterByDate, addRecord, updateRecord, deleteRecord, loading, selectedEC, stats }}>
      {children}
    </DataContext.Provider>
  );
};
