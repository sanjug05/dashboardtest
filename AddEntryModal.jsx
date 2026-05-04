import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const AddEntryModal = ({ title, fields, onSubmit, onClose }) => {
  const [form, setForm] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.name]: f.default ?? '' }), {})
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = () => {
    const errs = {};
    fields.forEach(f => {
      if (f.required && !form[f.name]) errs[f.name] = 'Required';
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-lg rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: '#0d1f3c', border: '1px solid rgba(0,180,216,0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,180,216,0.06)' }}>
          <h3 className="font-semibold text-white" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16 }}>{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          <div className="p-5 grid grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.name} className={f.type === 'text' && f.name === 'feedbackText' ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {f.label} {f.required && <span style={{ color: '#F87171' }}>*</span>}
                </label>
                {f.type === 'select' ? (
                  <select value={form[f.name]} onChange={e => setForm(d => ({ ...d, [f.name]: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="" style={{ background: '#0d1f3c' }}>Select...</option>
                    {f.options.map(o => <option key={o} value={o} style={{ background: '#0d1f3c' }}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type || 'text'} value={form[f.name]}
                    onChange={e => setForm(d => ({ ...d, [f.name]: e.target.value }))}
                    min={f.min} max={f.max} placeholder={f.placeholder}
                    onFocus={e => e.target.style.borderColor = '#00B4D8'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    style={inputStyle} />
                )}
                {errors[f.name] && <p className="text-xs mt-1" style={{ color: '#F87171' }}>{errors[f.name]}</p>}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Cancel
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff', boxShadow: '0 4px 15px rgba(0,180,216,0.3)' }}>
              <Save size={14} />
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
