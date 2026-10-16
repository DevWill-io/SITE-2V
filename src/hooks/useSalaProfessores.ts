import { useEffect, useState } from 'react';
import { db, ref, get } from '../services/firebase';
import { CONQUISTAS } from '../utils/constants';
import type { PerfilAluno } from '../types/usuario';

export interface AlunoSala {
  matricula: string;
  nome: string;
  foto: string;
  carinhos: number;
  ultimoAcesso: number;
  mediaGeral: number | null;
  faltasTotais: number | null;
  numConquistas: number;
  xpTotal: number;
  cargo: {
    id: string;
    nome: string;
    icone: string;
    raridade: string;
    desc?: string;
  } | null;
}

export interface StatsEngajamento {
  totalCarinhos: number;
  totalRecados: number;
  totalAlunos: number;
  topContribuinte: { nome: string; carinhos: number } | null;
}

export function useSalaProfessores() {
  const [alunos, setAlunos] = useState<AlunoSala[]>([]);
  const [stats, setStats] = useState<StatsEngajamento>({
    totalCarinhos: 0,
    totalRecados: 0,
    totalAlunos: 0,
    topContribuinte: null,
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        const [
          perfisSnap,
          carinhosSnap,
          resumosSnap,
          recadosSnap,
          xpSnap,
          cargosSnap,
        ] = await Promise.all([
          get(ref(db, 'perfis_alunos')),
          get(ref(db, 'mascote/por_aluno')),
          get(ref(db, 'resumo_boletim')),
          get(ref(db, 'mural_recados')),
          get(ref(db, 'usuarios_xp')),
          get(ref(db, 'cargos')),
        ]);

        if (cancelado) return;

        const perfis = (perfisSnap.val() || {}) as Record<string, PerfilAluno>;
        const carinhos = (carinhosSnap.val() || {}) as Record<string, number>;
        const resumos = (resumosSnap.val() || {}) as Record<
          string,
          { mediaGeral?: number; faltasTotais?: number }
        >;
        const recados = (recadosSnap.val() || {}) as Record<string, unknown>;
        const xpData = (xpSnap.val() || {}) as Record<
          string,
          {
            xp?: number;
            conquistas?: Record<string, unknown>;
          }
        >;
        const cargos = (cargosSnap.val() || {}) as Record<
          string,
          {
            ativo?: string;
            raridade?: string;
            nome?: string;
            icone?: string;
            desc?: string;
          }
        >;

        const lista: AlunoSala[] = Object.entries(perfis)
          .filter(([mat]) => !String(mat).startsWith('anon_'))
          .map(([mat, p]) => {
            const r = resumos[mat] || {};
            const xp = xpData[mat] || {};
            const numConquistas = xp.conquistas
              ? Object.keys(xp.conquistas).length
              : 0;
            const cargoData = cargos[mat];
            const cargo =
              cargoData?.ativo
                ? {
                    id: cargoData.ativo,
                    nome: cargoData.nome || cargoData.ativo,
                    icone: cargoData.icone || 'fa-medal',
                    raridade: cargoData.raridade || 'comum',
                    desc: cargoData.desc,
                  }
                : null;

            return {
              matricula: mat,
              nome: p.nome || p.nomeCompleto || `Aluno ${mat.slice(-4)}`,
              foto:
                p.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  p.nome || mat
                )}&background=random`,
              carinhos: Number(carinhos[mat]) || 0,
              ultimoAcesso: p.ultimoAcesso || 0,
              mediaGeral:
                typeof r.mediaGeral === 'number' ? r.mediaGeral : null,
              faltasTotais:
                typeof r.faltasTotais === 'number' ? r.faltasTotais : null,
              numConquistas,
              xpTotal: Number(xp.xp) || 0,
              cargo,
            };
          })
          .sort((a, b) => a.nome.localeCompare(b.nome));

        const totalCarinhos = Object.values(carinhos).reduce(
          (s, c) => s + (Number(c) || 0),
          0
        );
        const top = lista.reduce(
          (max, a) => (a.carinhos > (max?.carinhos || 0) ? a : max),
          null as AlunoSala | null
        );

        if (cancelado) return;

        setAlunos(lista);
        setStats({
          totalCarinhos,
          totalRecados: Object.keys(recados).length,
          totalAlunos: lista.length,
          topContribuinte: top
            ? { nome: top.nome, carinhos: top.carinhos }
            : null,
        });
        setCarregando(false);
      } catch (err) {
        console.error('[sala] erro:', err);
        if (!cancelado) {
          setErro('Não foi possível carregar os dados da turma.');
          setCarregando(false);
        }
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  const totalConquistas = CONQUISTAS.length;

  return { alunos, stats, carregando, erro, totalConquistas };
}