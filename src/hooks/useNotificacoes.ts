import { useEffect, useMemo, useState } from 'react';
import { db, ref, onValue } from '../services/firebase';
import { useAuth } from './useAuth';
import { chaveNotificacoesLidas, lsGetJSON, lsSetJSON } from '../utils/storage';
import { nomeParaExibicao } from '../utils/format';
import type { Recado } from '../types/recado';

export interface Notificacao {
  id: string;
  tipo: 'recado' | 'comentario';
  icone: string;
  titulo: string;
  descricao: string;
  data: number;
  lida: boolean;
}

export function useNotificacoes() {
  const { matricula } = useAuth();
  const [recados, setRecados] = useState<Recado[]>([]);
  const [lidas, setLidas] = useState<Record<string, boolean>>({});

  // Listener dos recados
  useEffect(() => {
    const r = ref(db, 'mural_recados');
    const unsub = onValue(r, (snap) => {
      const lista: Recado[] = [];
      snap.forEach((child) => {
        const dados = child.val();
        lista.push({ ...dados, id: child.key || '' });
      });
      setRecados(lista);
    });
    return () => unsub();
  }, []);

  // Carrega lidas do localStorage quando muda a matrícula
  useEffect(() => {
    if (!matricula) return;
    const salvas = lsGetJSON<Record<string, boolean>>(
      chaveNotificacoesLidas(matricula),
      {}
    );
    setLidas(salvas);
  }, [matricula]);

  // Gera notificações a partir dos recados dos outros
  const notificacoes = useMemo<Notificacao[]>(() => {
    if (!matricula) return [];

    const agora = Date.now();
    const lista: Notificacao[] = [];

    recados.forEach((r) => {
      if (r.autor_matricula === matricula) return;

      const ts = r.timestamp || 0;
      const idade = agora - ts;
      if (idade > 30 * 24 * 60 * 60 * 1000) return; // >30 dias

      const msg = r.mensagem || '';
      lista.push({
        id: r.id,
        tipo: 'recado',
        icone: 'fa-regular fa-comment-dots',
        titulo: `Novo recado de ${nomeParaExibicao(r.autor_nome)}`,
        descricao: msg.slice(0, 80) + (msg.length > 80 ? '...' : ''),
        data: ts,
        lida: !!lidas[r.id],
      });
    });

    lista.sort((a, b) => b.data - a.data);
    return lista;
  }, [recados, matricula, lidas]);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  const marcarLida = (id: string) => {
    if (!matricula) return;
    const novo = { ...lidas, [id]: true };
    setLidas(novo);
    lsSetJSON(chaveNotificacoesLidas(matricula), novo);
  };

  const marcarTodasLidas = () => {
    if (!matricula) return;
    const novo: Record<string, boolean> = {};
    notificacoes.forEach((n) => (novo[n.id] = true));
    setLidas(novo);
    lsSetJSON(chaveNotificacoesLidas(matricula), novo);
  };

  return {
    notificacoes,
    naoLidas,
    marcarLida,
    marcarTodasLidas,
  };
}