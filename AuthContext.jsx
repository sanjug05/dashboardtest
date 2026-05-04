import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setViewOnlyMode(false);
      return { success: true };
    } catch (e) {
      // For demo: accept demo credentials
      if (email === 'sanju.gupta@aisglass.com' && password === 'AISGlass@2025') {
        setUser({ email, displayName: 'Sanju Gupta', uid: 'demo-user-001' });
        setViewOnlyMode(false);
        return { success: true };
      }
      const msg = e.code === 'auth/user-not-found' ? 'User not found'
        : e.code === 'auth/wrong-password' ? 'Wrong password'
        : e.code === 'auth/network-request-failed' ? 'Network error - using demo mode'
        : 'Login failed. Try: sanju.gupta@aisglass.com / AISGlass@2025';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try { await signOut(auth); } catch (e) {}
    setUser(null);
    setViewOnlyMode(false);
  };

  const enterViewOnly = () => {
    setViewOnlyMode(true);
    setUser(null);
  };

  const isAuthenticated = !!user && !viewOnlyMode;
  const canEdit = isAuthenticated;
  const hasAccess = isAuthenticated || viewOnlyMode;

  return (
    <AuthContext.Provider value={{ user, viewOnlyMode, loading, error, login, logout, enterViewOnly, isAuthenticated, canEdit, hasAccess, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
