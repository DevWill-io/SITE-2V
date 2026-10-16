import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { lsGetJSON, lsSetJSON } from '../utils/storage';

// Reaproveita o helper de chave, mas com prefixo próprio
function chaveHistorico(matricula: string): string {
  return `historico_periodos_${matricula || 'anon'}`;
}

export interface PeriodoHistorico {
  periodo: string;
  media: number | null;
  disciplinas: number;
  salvoEm: number;
}

export function useHistoricoPeriodos() {
  const { matricula } = useAuth();
  const [periodos, setPeriodos] = useState<PeriodoHistorico[]>([]);

  useEffect(() => {
    if (!matricula) {
      setPeriodos([]);
      return;
    }
    const salvos = lsGetJSON<PeriodoHistorico[]>(chaveHistorico(matricula), []);
    setPeriodos(salvos.sort((a, b) => b.periodo.localeCompare(a.periodo)));
  }, [matricula]);

  const salvarPeriodo = useCallback(
    (novo: PeriodoHistorico) => {
      if (!matricula) return;

      setPeriodos((prev) => {
        const idx = prev.findIndex((p) => p.periodo === novo.periodo);
        const atualizado =
          idx >= 0
            ? prev.map((p) => (p.periodo === novo.periodo ? novo : p))
            : [...prev, novo];

        const ordenado = atualizado.sort((a, b) =>
          b.periodo.localeCompare(a.periodo)
        );
        lsSetJSON(chaveHistorico(matricula), ordenado);
        return ordenado;
      });
    },
    [matricula]
  );

  const limparHistorico = useCallback(() => {
    if (!matricula) return;
    setPeriodos([]);
    lsSetJSON(chaveHistorico(matricula), []);
  }, [matricula]);

  return { periodos, salvarPeriodo, limparHistorico };
}