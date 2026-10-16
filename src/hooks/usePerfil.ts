import { useEffect, useState } from 'react';
import { db, ref, onValue } from '../services/firebase';
import { useAuth } from './useAuth';
import type { PerfilAluno } from '../types/usuario';

export function usePerfil() {
  const { matricula } = useAuth();
  const [perfil, setPerfil] = useState<PerfilAluno | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!matricula) {
      setPerfil(null);
      setCarregando(false);
      return;
    }

    const r = ref(db, `perfis_alunos/${matricula}`);
    const unsubscribe = onValue(r, (snap) => {
      setPerfil(snap.val() as PerfilAluno | null);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, [matricula]);

  return { perfil, carregando };
}