// ==========================================
// 🪝 HOOK — useTheme
// ==========================================
// Uso:
//   const { temaCor, modo, alternarModo } = useTheme();
// ==========================================

import { useContext } from 'react';
import { TemaContext } from '../contexts/TemaContext';

export function useTheme() {
  const ctx = useContext(TemaContext);
  if (!ctx) {
    throw new Error('useTheme precisa estar dentro de <TemaProvider>.');
  }
  return ctx;
}