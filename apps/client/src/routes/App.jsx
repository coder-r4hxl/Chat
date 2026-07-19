import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage.jsx';
import SignupPage from './auth/SignupPage.jsx';
import DashboardPage from './chat/DashboardPage.jsx';
import { useAuthStore } from '../stores/useAuthStore.js';
import { useEffect } from 'react';

export default function App() {
  const checkAuth = useAuthStore(s => s.checkAuth);
  const isCheckingAuth = useAuthStore(s => s.isCheckingAuth);
  const authUser = useAuthStore(s => s.authUser);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={authUser ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={authUser ? <Navigate to="/" replace /> : <SignupPage />} />
      <Route path="/" element={authUser ? <DashboardPage /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}


