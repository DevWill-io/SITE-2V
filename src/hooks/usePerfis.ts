import { useEffect, useMemo, useState } from 'react';
import { db, ref, onValue } from '../services/firebase';
import { normalizarBusca } from '../utils/validators';
import type { PerfilAluno } from '../types/usuario';

export function usePerfis() {
  const [perfis, setPerfis] = useState<PerfilAluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const r = ref(db, 'perfis_alunos');
    const unsub = onValue(r, (snap) => {
      const dados = (snap.val() || {}) as Record<string, PerfilAluno>;
      const lista = Object.entries(dados)
        .filter(([mat]) => !String(mat).startsWith('anon_'))
        .map(([mat, p]) => ({ ...p, id: mat, matricula: p.matricula || mat }))
        .sort((a, b) =>
          (a.nome || a.nomeCompleto || '').localeCompare(
            b.nome || b.nomeCompleto || ''
          )
        );
      setPerfis(lista);
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  const filtrados = useMemo(() => {
    if (!busca.trim()) return perfis;
    const q = normalizarBusca(busca);
    return perfis.filter((p) => {
      const nome = normalizarBusca(p.nome || p.nomeCompleto || '');
      const mat = normalizarBusca(p.matricula || '');
      return nome.includes(q) || mat.includes(q);
    });
  }, [perfis, busca]);

  return {
    perfis: filtrados,
    total: perfis.length,
    carregando,
    busca,
    setBusca,
  };
}