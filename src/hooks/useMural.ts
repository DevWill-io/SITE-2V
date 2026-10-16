import { useCallback, useEffect, useMemo, useState } from 'react';
import { db, ref, onValue } from '../services/firebase';
import { apiMural } from '../services/api';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useXP } from './useXP';
import { calcularTempoRestante, parseDuracaoParaHoras } from '../utils/format';
import { normalizarBusca } from '../utils/validators';
import { ehAdmin } from '../utils/constants';
import type { Recado, RecadoProcessado } from '../types/recado';
import type { PerfilAluno } from '../types/usuario';

export function useMural() {
  const { matricula } = useAuth();
  const { toast } = useToast();
  const { incrementarXP, incrementarContador, desbloquearConquista } = useXP();

  const [recados, setRecados] = useState<RecadoProcessado[]>([]);
  const [perfis, setPerfis] = useState<Record<string, PerfilAluno>>({});
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  // Listener Firebase dos recados
  useEffect(() => {
    const r = ref(db, 'mural_recados');
    const unsub = onValue(r, (snap) => {
      const agora = Date.now();
      const lista: RecadoProcessado[] = [];

      snap.forEach((child) => {
        const dados = child.val() as Omit<Recado, 'id'>;
        const id = child.key || '';
        const ts = dados.timestamp || agora;
        const horas =
          dados.duracao_horas || (dados.duracao_dias ? dados.duracao_dias * 24 : 7 * 24);

        // Filtra recados expirados
        const tempoVida = horas * 60 * 60 * 1000;
        if (agora - ts > tempoVida) return;

        lista.push({
          ...dados,
          id,
          timestampCriacao: ts,
          duracaoHoras: horas,
        });
      });

      // Mais recentes primeiro
      lista.sort((a, b) => b.timestampCriacao - a.timestampCriacao);
      setRecados(lista);
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  // Listener perfis (para nome/foto)
  useEffect(() => {
    const r = ref(db, 'perfis_alunos');
    const unsub = onValue(r, (snap) => {
      setPerfis((snap.val() || {}) as Record<string, PerfilAluno>);
    });
    return () => unsub();
  }, []);

  // Filtra por busca
  const recadosFiltrados = useMemo(() => {
    if (!busca.trim()) return recados;
    const q = normalizarBusca(busca);
    return recados.filter((r) => {
      const msg = normalizarBusca(r.mensagem);
      const autor = normalizarBusca(r.autor_nome);
      return msg.includes(q) || autor.includes(q);
    });
  }, [recados, busca]);

  // Publicar recado
  const publicar = useCallback(
    async (mensagem: string, link: string, duracaoValor: string) => {
      const horas = parseDuracaoParaHoras(duracaoValor);
      try {
        await apiMural.criar(mensagem, link, horas);
        toast('Recado publicado! +10 XP', 'sucesso');
        incrementarXP(10, 'recado_postado').catch(() => {});
        incrementarContador('recados', 1)
          .then((total) => {
            if (total >= 10) desbloquearConquista('comunicador');
          })
          .catch(() => {});
        return true;
      } catch (err) {
        toast('Erro ao enviar: ' + (err as Error).message, 'erro');
        return false;
      }
    },
    [toast, incrementarXP, incrementarContador, desbloquearConquista]
  );

  // Curtir
  const curtir = useCallback(
    async (id: string) => {
      try {
        const r = await apiMural.curtir(id);
        if (r.curtiu) {
          incrementarXP(1, 'curtida').catch(() => {});
          incrementarContador('curtidas', 1)
            .then((total) => {
              if (total >= 20) desbloquearConquista('social');
            })
            .catch(() => {});
        }
      } catch (err) {
        toast('Erro: ' + (err as Error).message, 'erro');
      }
    },
    [toast, incrementarXP, incrementarContador, desbloquearConquista]
  );

  // Excluir
  const excluir = useCallback(
    async (id: string) => {
      if (!confirm('Excluir este recado?')) return;
      try {
        await apiMural.excluir(id);
        toast('Recado excluído.', 'sucesso');
      } catch (err) {
        toast('Erro: ' + (err as Error).message, 'erro');
      }
    },
    [toast]
  );

  // Editar
  const editar = useCallback(
    async (id: string, mensagem: string, duracaoHoras: number) => {
      try {
        await apiMural.editar(id, mensagem, duracaoHoras);
        toast('Recado atualizado!', 'sucesso');
      } catch (err) {
        toast('Erro: ' + (err as Error).message, 'erro');
      }
    },
    [toast]
  );

  // Comentar
  const comentar = useCallback(
    async (recadoId: string, texto: string) => {
      try {
        await apiMural.comentar(recadoId, texto);
        toast('Comentário adicionado! +3 XP', 'sucesso');
        incrementarXP(3, 'comentario').catch(() => {});
      } catch (err) {
        toast('Erro: ' + (err as Error).message, 'erro');
      }
    },
    [toast, incrementarXP]
  );

  // Excluir comentário
  const excluirComentario = useCallback(
    async (recadoId: string, comentarioId: string) => {
      if (!confirm('Excluir este comentário?')) return;
      try {
        await apiMural.excluirComentario(recadoId, comentarioId);
        toast('Comentário removido.', 'sucesso');
      } catch (err) {
        toast('Erro: ' + (err as Error).message, 'erro');
      }
    },
    [toast]
  );

  // Helper: dados do autor
  const dadosAutor = useCallback(
    (mat: string) => {
      const p = perfis[mat];
      const nome =
        p?.nome || p?.nomeCompleto || `Aluno ${mat.slice(-4)}`;
      const foto =
        p?.foto ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random`;
      return { nome, foto };
    },
    [perfis]
  );

  const souAdmin = ehAdmin(matricula);

  return {
    recados: recadosFiltrados,
    recadosBrutos: recados,
    carregando,
    busca,
    setBusca,
    publicar,
    curtir,
    excluir,
    editar,
    comentar,
    excluirComentario,
    dadosAutor,
    matricula,
    souAdmin,
    calcularTempoRestante,
  };
}