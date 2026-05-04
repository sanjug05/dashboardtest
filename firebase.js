import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDemo-AISGlass-KPI-Dashboard-Key",
  authDomain: "ais-glass-kpi.firebaseapp.com",
  projectId: "ais-glass-kpi",
  storageBucket: "ais-glass-kpi.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Try to enable offline persistence
try {
  enableIndexedDbPersistence(db).catch(() => {});
} catch (e) {}

export default app;
