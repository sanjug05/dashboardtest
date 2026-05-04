import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Smartphone, Mail, Lock, ChevronRight, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login, enterViewOnly, error, setError } = useAuth();
  const [mode, setMode] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('sanju.gupta@aisglass.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleSendOTP = () => {
    if (phone.length === 10) setOtpSent(true);
  };

  const handleOtpChange = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp_${idx + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0d2040 40%, #061020 100%)' }}>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00B4D8 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #00B4D8 0%, transparent 70%)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,180,216,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo & Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,180,216,0.05))', border: '1px solid rgba(0,180,216,0.3)', backdropFilter: 'blur(10px)' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/AIS_logo.svg/200px-AIS_logo.svg.png"
              alt="AIS" className="w-12 h-12 object-contain"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <span className="text-3xl font-bold text-teal-400 hidden" style={{ color: '#00B4D8' }}>AIS</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
            AIS <span style={{ color: '#00B4D8' }}>Glass</span>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Experience Center KPI Dashboard</p>
        </div>

        {/* View Only Button - Prominent */}
        <button onClick={enterViewOnly}
          className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl mb-4 group transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))', border: '1px solid rgba(255,215,0,0.4)', backdropFilter: 'blur(10px)' }}>
          <span className="text-sm font-semibold" style={{ color: '#FFD700' }}>👁 View Dashboard Without Login</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" style={{ color: '#FFD700' }} />
        </button>

        {/* Main Login Card */}
        <div className="rounded-2xl p-6 animate-slide-in"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

          {/* Tab Switcher */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {[{ key: 'email', label: '✉ Email Login', Icon: Mail }, { key: 'otp', label: '📱 OTP Login', Icon: Smartphone }].map(t => (
              <button key={t.key} onClick={() => { setMode(t.key); setError(''); }}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  background: mode === t.key ? 'linear-gradient(135deg, #00B4D8, #0096C7)' : 'transparent',
                  color: mode === t.key ? '#fff' : 'rgba(255,255,255,0.5)',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
              ⚠ {error}
            </div>
          )}

          {mode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#00B4D8' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    onFocus={e => e.target.style.borderColor = '#00B4D8'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    placeholder="email@aisglass.com" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#00B4D8' }} />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    onFocus={e => e.target.style.borderColor = '#00B4D8'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(0,180,216,0.1)', color: 'rgba(0,180,216,0.8)' }}>
                Demo: sanju.gupta@aisglass.com / AISGlass@2025
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff', boxShadow: '0 4px 20px rgba(0,180,216,0.4)' }}>
                {isLoading ? <span className="animate-spin">⟳</span> : null}
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && <ChevronRight size={16} />}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Mobile Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>+91</div>
                  <div className="relative flex-1">
                    <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#00B4D8' }} />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                      placeholder="9876543210" />
                  </div>
                </div>
              </div>
              {!otpSent ? (
                <button onClick={handleSendOTP} disabled={phone.length !== 10}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{ background: phone.length === 10 ? 'linear-gradient(135deg, #00B4D8, #0096C7)' : 'rgba(255,255,255,0.1)', color: '#fff', opacity: phone.length !== 10 ? 0.5 : 1 }}>
                  Send OTP
                </button>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.6)' }}>Enter 6-digit OTP</label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, i) => (
                        <input key={i} id={`otp_${i}`} type="text" value={digit} onChange={e => handleOtpChange(e.target.value, i)}
                          maxLength={1} className="w-10 h-12 text-center rounded-lg text-lg font-bold outline-none"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,180,216,0.4)', color: '#fff' }} />
                      ))}
                    </div>
                    <p className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Demo OTP sent to +91 {phone}</p>
                  </div>
                  <button className="w-full py-3 rounded-xl font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #00B4D8, #0096C7)', color: '#fff' }}>
                    Verify OTP
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          AIS Glass Experience Center Management System v2.0
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
