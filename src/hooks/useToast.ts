// ==========================================
// 🪝 HOOK — useToast
// ==========================================
// Uso:
//   const { toast } = useToast();
//   toast('Recado publicado!', 'sucesso');
// ==========================================

import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      'useToast precisa estar dentro de <ToastProvider>.'
    );
  }
  return ctx;
}