import { useEffect, useState } from 'react';
import { db, ref, get, onValue } from '../services/firebase';
import { calcularNivel } from '../utils/format';
import type { InfoNivel } from '../types/xp';
import type { PerfilAluno } from '../types/usuario';
import type { CargoAluno } from '../types/cargo';

export interface PerfilPublico {
  perfil: PerfilAluno | null;
  nivel: InfoNivel | null;
  cargo: CargoAluno | null;
  conquistas: string[]; // IDs visíveis
  carregando: boolean;
}

export function usePerfilPublico(matricula: string | null): PerfilPublico {
  const [perfil, setPerfil] = useState<PerfilAluno | null>(null);
  const [nivel, setNivel] = useState<InfoNivel | null>(null);
  const [cargo, setCargo] = useState<CargoAluno | null>(null);
  const [conquistas, setConquistas] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!matricula) {
      setPerfil(null);
      setNivel(null);
      setCargo(null);
      setConquistas([]);
      setCarregando(false);
      return;
    }

    let cancelado = false;
    setCarregando(true);

    // 1. Perfil
    const unsubPerfil = onValue(
      ref(db, `perfis_alunos/${matricula}`),
      (snap) => {
        if (cancelado) return;
        const p = snap.val() as PerfilAluno | null;
        setPerfil(p);

        // 2. Conquistas visíveis
        if (p?.conquistasVisiveis !== undefined) {
          const cv = p.conquistasVisiveis;
          if (cv === null) {
            // Mostra todas
            setConquistas([]);
          } else if (cv.mostraTodas === false && cv.ativos) {
            setConquistas(Object.keys(cv.ativos));
          } else if (cv.mostraTodas === false) {
            setConquistas([]);
          }
        }
        setCarregando(false);
      }
    );

    // 3. XP / Nível
    get(ref(db, `usuarios_xp/${matricula}`)).then((snap) => {
      if (cancelado) return;
      const dados = snap.val() || {};
      const xp = Number(dados.xp) || 0;
      setNivel(calcularNivel(xp));
    });

    // 4. Cargo
    onValue(ref(db, `cargos/${matricula}`), (snap) => {
      if (cancelado) return;
      setCargo(snap.val() as CargoAluno | null);
    });

    return () => {
      cancelado = true;
      unsubPerfil();
    };
  }, [matricula]);

  return { perfil, nivel, cargo, conquistas, carregando };
}