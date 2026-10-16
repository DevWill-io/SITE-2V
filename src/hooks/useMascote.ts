import { useContext } from 'react';
import { MascoteContext } from '../contexts/MascoteContext';

export function useMascote() {
  const ctx = useContext(MascoteContext);
  if (!ctx) {
    throw new Error('useMascote precisa estar dentro de <MascoteProvider>.');
  }
  return ctx;
}