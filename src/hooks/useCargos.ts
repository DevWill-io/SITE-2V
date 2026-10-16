import { useEffect, useState } from 'react';
import { db, ref, onValue } from '../services/firebase';
import { useAuth } from './useAuth';
import type { CargoAluno } from '../types/cargo';

export function useCargos() {
  const { matricula } = useAuth();
  const [cargo, setCargo] = useState<CargoAluno | null>(null);

  useEffect(() => {
    if (!matricula) {
      setCargo(null);
      return;
    }

    const r = ref(db, `cargos/${matricula}`);
    const unsubscribe = onValue(r, (snap) => {
      setCargo(snap.val() as CargoAluno | null);
    });

    return () => unsubscribe();
  }, [matricula]);

  return cargo;
}