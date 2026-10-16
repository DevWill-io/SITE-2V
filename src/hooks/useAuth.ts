// ==========================================
// 🪝 HOOK — useAuth
// ==========================================
// Uso:
//   const { user, status, isAdmin, sair } = useAuth();
//   if (status === 'carregando') return <Loader />;
//   if (!user) return <Navigate to="/login" />;
// ==========================================

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  }
  return ctx;
}