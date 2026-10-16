import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { db, ref, onValue } from '../services/firebase';
import { suap } from '../services/suap';
import { apiMeta } from '../services/api';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useXP } from './useXP';
import { formatarNota } from '../utils/format';
import {
  CARGA_HORARIA_PADRAO,
  LIMITE_FALTAS_PCT,
  META_PADRAO,
} from '../utils/constants';
import type {
  Disciplina,
  PeriodoLetivo,
  ResultadoMedia,
  StatusDisciplina,
  ConfiguracaoEtapas,
  ProjecaoDisciplina,
} from '../types/boletim';

export type Filtro =
  | 'todas'
  | 'aprovado'
  | 'recuperacao'
  | 'reprovado'
  | 'risco';

export type SortKey = 'nome' | 'media' | 'faltas' | 'status';
export type SortDir = 'asc' | 'desc';

export interface DisciplinaCalculada {
  disciplina: Disciplina;
  codigo: string;
  etapas: ConfiguracaoEtapas;
  media: ResultadoMedia;
  projecao: ProjecaoDisciplina;
  status: StatusDisciplina;
  faltas: number;
  metaEfetiva: number;
  metaCustom: boolean;
}

export function obterCodigo(d: Disciplina): string {
  return String(d.codigo_diario || d.disciplina || d.id || 'disc').trim();
}

export function obterEtapas(d: Disciplina): ConfiguracaoEtapas {
  if (d.segundo_semestre === true) return { tipo: 'Semestral', etapas: [3, 4] };
  if (d.segundo_semestre === false) return { tipo: 'Semestral', etapas: [1, 2] };

  const tem12 = [1, 2].some((n) => {
    const e = d[`nota_etapa_${n}` as keyof Disciplina];
    const val = e && typeof e === 'object' ? (e as { nota: number }).nota : e;
    return formatarNota(val as never) !== null;
  });
  const tem34 = [3, 4].some((n) => {
    const e = d[`nota_etapa_${n}` as keyof Disciplina];
    const val = e && typeof e === 'object' ? (e as { nota: number }).nota : e;
    return formatarNota(val as never) !== null;
  });

  if (tem34 && !tem12) return { tipo: 'Semestral', etapas: [3, 4] };
  if (tem12 && tem34) return { tipo: 'Anual', etapas: [1, 2, 3, 4] };
  if (tem12) {
    const temCampo34 = 'nota_etapa_3' in d || 'nota_etapa_4' in d;
    if (temCampo34) return { tipo: 'Anual', etapas: [1, 2, 3, 4] };
    return { tipo: 'Semestral', etapas: [1, 2] };
  }
  if ('nota_etapa_3' in d || 'nota_etapa_4' in d) {
    return { tipo: 'Anual', etapas: [1, 2, 3, 4] };
  }
  return { tipo: 'Semestral', etapas: [1, 2] };
}

export function calcularMedia(
  d: Disciplina,
  etapas: number[],
  simulacao: number | null
): ResultadoMedia {
  const notas = etapas.map((n) => {
    const e = d[`nota_etapa_${n}` as keyof Disciplina];
    const val = e && typeof e === 'object' ? (e as { nota: number }).nota : e;
    return formatarNota(val as never);
  });
  const preenchidasReais = notas.filter((v): v is number => v !== null);
  const somaReal = preenchidasReais.reduce((a, b) => a + b, 0);
  const temEtapaAberta = preenchidasReais.length < etapas.length;
  const usarSim = simulacao != null && temEtapaAberta;

  if (usarSim) {
    const comSim = [...preenchidasReais, simulacao];
    const somaSim = comSim.reduce((a, b) => a + b, 0);
    return {
      media: somaSim / comSim.length,
      preenchidasReais: preenchidasReais.length,
      preenchidasComSim: comSim.length,
      somaReal,
      somaComSim: somaSim,
      temEtapaAberta,
      simulando: true,
    };
  }

  const mediaApi = formatarNota(d.media_disciplina as never);
  return {
    media: preenchidasReais.length ? somaReal / preenchidasReais.length : mediaApi,
    preenchidasReais: preenchidasReais.length,
    preenchidasComSim: preenchidasReais.length,
    somaReal,
    somaComSim: somaReal,
    temEtapaAberta,
    simulando: false,
  };
}

export function classificarStatus(
  media: number | null,
  faltas: number,
  meta: number
): StatusDisciplina {
  const limite = CARGA_HORARIA_PADRAO * LIMITE_FALTAS_PCT;
  if (faltas > limite) return 'reprovado';
  if (media === null) return 'recuperacao';
  if (media >= meta) return 'aprovado';
  if (media >= meta * 0.6) return 'recuperacao';
  return 'reprovado';
}

export function calcularProjecao(
  preenchidas: number,
  total: number,
  soma: number,
  meta: number
): ProjecaoDisciplina {
  const faltantes = total - preenchidas;
  if (faltantes <= 0) {
    const mediaFinal = preenchidas ? soma / preenchidas : null;
    if (mediaFinal === null) return { texto: 'Sem notas', classe: 'projecao-alerta' };
    return mediaFinal >= meta
      ? { texto: 'Meta atingida', classe: 'projecao-ok' }
      : { texto: 'Abaixo da meta', classe: 'projecao-ruim' };
  }
  const necessaria = (meta * total - soma) / faltantes;
  if (necessaria <= 0) return { texto: 'Meta garantida', classe: 'projecao-ok' };
  if (necessaria > 100) return { texto: 'Meta inviável', classe: 'projecao-ruim' };
  return { texto: `Precisa ${necessaria.toFixed(1)}`, classe: 'projecao-alerta' };
}

export function useBoletim() {
  const { matricula } = useAuth();
  const { toast } = useToast();
  const { registrarPeriodoVisto, incrementarXP } = useXP();

  const [periodos, setPeriodos] = useState<PeriodoLetivo[]>([]);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>('');
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [status, setStatus] = useState<'idle' | 'carregando' | 'ok' | 'erro'>('idle');
  const [mensagem, setMensagem] = useState('');

  const [metaGlobal, setMetaGlobal] = useState(META_PADRAO);
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [simulacoes, setSimulacoes] = useState<Record<string, number>>({});
  const [metas, setMetas] = useState<Record<string, number>>({});
  const ultimoPeriodoCarregado = useRef<string>('');

  // Metas individuais (Firebase)
  useEffect(() => {
    if (!matricula) return;
    const r = ref(db, `metas_disciplinas/${matricula}`);
    const unsub = onValue(r, (snap) => {
      setMetas((snap.val() as Record<string, number>) || {});
    });
    return () => unsub();
  }, [matricula]);

  // Busca períodos letivos
  const carregarPeriodos = useCallback(() => {
    setStatus('carregando');
    setMensagem('Buscando períodos no SUAP...');

    suap.getAuthenticatedResource<{ results?: PeriodoLetivo[] }>(
      '/api/ensino/meus-periodos-letivos/?page=1',
      (resposta) => {
        const lista = resposta.results || [];
        setPeriodos(lista);
        if (lista.length === 0) {
          setStatus('erro');
          setMensagem('Nenhum período disponível.');
          return;
        }
        // 🆕 SETA o período (o useEffect abaixo carrega o boletim)
        setPeriodoSelecionado(`${lista[0].ano_letivo}/${lista[0].periodo_letivo}`);
      },
      (xhr) => {
        setStatus('erro');
        setMensagem(`Erro nos períodos (HTTP ${xhr.status}).`);
      }
    );
  }, []);

  const carregarBoletim = useCallback(
  (ano: number, periodo: number) => {
    const label = `${ano}.${periodo}`;

    // 🆕 Se já carregou esse período, não refaz o fetch
    if (ultimoPeriodoCarregado.current === label) return;
    ultimoPeriodoCarregado.current = label;

    setStatus('carregando');
    setMensagem('Buscando notas no SUAP...');

      suap.getAuthenticatedResource<{ results?: Disciplina[]; count?: number }>(
        `/api/ensino/meu-boletim/${ano}/${periodo}/?page=1`,
        (resposta) => {
          const lista = resposta.results || [];
          setDisciplinas(lista);
          setStatus('ok');
          setMensagem(`${lista.length} disciplina(s) carregada(s).`);
          const label = `${ano}.${periodo}`;
          registrarPeriodoVisto(label).catch(() => {});
          incrementarXP(5, 'ver_boletim').catch(() => {});
        },
        (xhr) => {
          setDisciplinas([]);
          setStatus('erro');
          setMensagem(`Erro ao carregar boletim (HTTP ${xhr.status}).`);
        }
      );
    },
    [registrarPeriodoVisto, incrementarXP]
  );

  // Carrega períodos no boot
  useEffect(() => {
    if (matricula) carregarPeriodos();
  }, [matricula, carregarPeriodos]);

  // 🆕 CARREGA BOLETIM AUTOMATICAMENTE QUANDO O PERÍODO MUDA
  useEffect(() => {
    if (!periodoSelecionado) return;
    const [ano, per] = periodoSelecionado.split('/').map(Number);
    if (ano && per) carregarBoletim(ano, per);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodoSelecionado]);

  const selecionarPeriodo = useCallback((valor: string) => {
    setPeriodoSelecionado(valor);
  }, []);

  const atualizar = useCallback(() => {
    if (!periodoSelecionado) return;
    const [ano, per] = periodoSelecionado.split('/').map(Number);
    if (ano && per) {
    // 🆕 Limpa o cache pra forçar re-fetch
    ultimoPeriodoCarregado.current = '';
    carregarBoletim(ano, per);
  }
}, [periodoSelecionado, carregarBoletim]);

  const simular = useCallback((codigo: string, valor: number | null) => {
    setSimulacoes((prev) => {
      const novo = { ...prev };
      if (valor === null) delete novo[codigo];
      else novo[codigo] = valor;
      return novo;
    });
  }, []);

  const limparSimulacoes = useCallback(() => setSimulacoes({}), []);

  const definirMeta = useCallback(
    async (codigo: string, valor: number | null) => {
      const novas = { ...metas };
      if (valor === null) delete novas[codigo];
      else novas[codigo] = valor;
      setMetas(novas);
      try {
        await apiMeta.salvar(novas);
        toast('Meta salva!', 'sucesso');
        incrementarXP(5, 'definir_meta').catch(() => {});
      } catch (err) {
        toast('Erro ao salvar meta: ' + (err as Error).message, 'erro');
      }
    },
    [metas, toast, incrementarXP]
  );

  const trocarSort = useCallback((key: SortKey) => {
    setSortKey((atual) => {
      if (atual === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return key;
      }
      setSortDir(key === 'media' ? 'desc' : 'asc');
      return key;
    });
  }, []);

  const disciplinasCalculadas = useMemo<DisciplinaCalculada[]>(() => {
    const calculadas = disciplinas.map((d) => {
      const codigo = obterCodigo(d);
      const etapas = obterEtapas(d);
      const sim = simulacoes[codigo] ?? null;
      const media = calcularMedia(d, etapas.etapas, sim);
      const faltas = Number(d.numero_faltas) || 0;
      const metaEfetiva = metas[codigo] ?? metaGlobal;
      const status = classificarStatus(media.media, faltas, metaEfetiva);
      const projecao = calcularProjecao(
        media.preenchidasComSim,
        etapas.etapas.length,
        media.somaComSim,
        metaEfetiva
      );
      return {
        disciplina: d,
        codigo,
        etapas,
        media,
        projecao,
        status,
        faltas,
        metaEfetiva,
        metaCustom: metas[codigo] != null,
      };
    });

    let filtradas = calculadas;
    if (filtro !== 'todas') {
      filtradas = calculadas.filter((c) => {
        if (filtro === 'risco') return c.status !== 'aprovado';
        return c.status === filtro;
      });
    }

    if (sortKey) {
      const ordemStatus: Record<StatusDisciplina, number> = {
        reprovado: 0,
        recuperacao: 1,
        aprovado: 2,
      };
      filtradas = [...filtradas].sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'nome') {
          cmp = (a.disciplina.disciplina || '').localeCompare(
            b.disciplina.disciplina || ''
          );
        } else if (sortKey === 'media') {
          cmp = (a.media.media ?? -1) - (b.media.media ?? -1);
        } else if (sortKey === 'faltas') {
          cmp = a.faltas - b.faltas;
        } else if (sortKey === 'status') {
          cmp = ordemStatus[a.status] - ordemStatus[b.status];
        }
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return filtradas;
  }, [disciplinas, simulacoes, metas, metaGlobal, filtro, sortKey, sortDir]);

  const resumo = useMemo(() => {
    const todasCalculadas = disciplinas.map((d) => {
      const codigo = obterCodigo(d);
      const etapas = obterEtapas(d);
      const sim = simulacoes[codigo] ?? null;
      const media = calcularMedia(d, etapas.etapas, sim);
      const faltas = Number(d.numero_faltas) || 0;
      const metaEfetiva = metas[codigo] ?? metaGlobal;
      const status = classificarStatus(media.media, faltas, metaEfetiva);
      return { media: media.media, faltas, status };
    });

    const comMedia = todasCalculadas.filter((c) => c.media !== null);
    const mediaGeral = comMedia.length
      ? comMedia.reduce((s, c) => s + (c.media || 0), 0) / comMedia.length
      : null;
    const faltasTotais = todasCalculadas.reduce((s, c) => s + c.faltas, 0);
    const emRisco = todasCalculadas.filter((c) => c.status !== 'aprovado').length;

    return {
      mediaGeral,
      disciplinas: disciplinas.length,
      emRisco,
      faltasTotais,
    };
  }, [disciplinas, simulacoes, metas, metaGlobal]);

  return {
    periodos,
    periodoSelecionado,
    disciplinas: disciplinasCalculadas,
    disciplinasBrutas: disciplinas,
    status,
    mensagem,
    metaGlobal,
    filtro,
    sortKey,
    sortDir,
    resumo,
    carregarPeriodos,
    atualizar,
    selecionarPeriodo,
    setMetaGlobal,
    setFiltro,
    trocarSort,
    simular,
    limparSimulacoes,
    definirMeta,
  };
}