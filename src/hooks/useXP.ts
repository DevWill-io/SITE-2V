// ==========================================
// 🪝 HOOK — useXP
// ==========================================
// Uso:
//   const { xp, incrementarXP, desbloquearConquista } = useXP();
// ==========================================

import { useContext } from 'react';
import { XPContext } from '../contexts/XPContext';

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) {
    throw new Error('useXP precisa estar dentro de <XPProvider>.');
  }
  return ctx;
}