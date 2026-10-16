// ==========================================
// 🎮 CONTEXTO DE XP — porta do xp-core.js
// ==========================================
// Este é o arquivo mais delicado da migração.
//
// xp-core.js tem:
//   - Cache em memória + localStorage
//   - Fonte de verdade: Firebase usuarios_xp/{matricula}
//   - Observers em tempo real (onValue)
//   - Rate limiting client-side
//   - Tetos por chamada
//   - Fila offline (reenvio quando volta online)
//   - Migração local → Firebase (comparação Math.max)
//   - Contadores específicos (recados, curtidas, simulador, periodos)
//
// TUDO isso é preservado aqui, dentro do React, com estado controlado.
// ==========================================

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { db, ref, get, update, onValue } from '../services/firebase';
import { apiXP, apiMascote, apiConquista } from '../services/api';
import {
  RATE_LIMITS,
  TETOS_POR_CHAMADA,
} from '../utils/constants';
import {
  STORAGE_KEYS,
  lsGetNumber,
  lsSetNumber,
  lsRemoveVarias,
  lsSetString,
  lsGetString,
} from '../utils/storage';
import { hojeISO } from '../utils/format';
import type {
  Contadores,
  NomeContador,
} from '../types/xp';
import { useAuth } from '../hooks/useAuth';

// ==========================================
// TIPOS
// ==========================================
type TipoRate = keyof typeof RATE_LIMITS;

interface RateEntry {
  max: number;
  janela: number;
  historico: number[];
}

interface ItemFilaOffline {
  tipo: 'xp' | 'cliques' | 'contador';
  qtd?: number;
  motivo?: string;
  nome?: NomeContador;
}

interface XPContextValue {
  // ---- Leituras (síncronas) ----
  xp: number;
  cliquesMascote: number;
  streak: number;
  skinAtiva: string;
  conquistas: Record<string, { desbloqueadaEm: number }>;
  contadores: Contadores;
  pronto: boolean;
  ehAnonimo: boolean;

  // ---- Leituras genéricas ----
  obterContador: (nome: NomeContador) => number;

  // ---- Ações ----
  incrementarXP: (quantidade: number, motivo?: string) => Promise<number>;
  incrementarCliquesMascote: (quantidade?: number) => Promise<number>;
  incrementarContador: (nome: NomeContador, quantidade?: number) => Promise<number>;
  registrarAcessoDiario: () => Promise<{ streak: number; novo: boolean; bonusXP: number }>;
  desbloquearConquista: (id: string) => Promise<boolean>;
  definirSkinAtiva: (skinId: string) => Promise<boolean>;
  registrarPeriodoVisto: (periodo: string) => Promise<boolean>;
}

// ==========================================
// CONTEXT
// ==========================================
export const XPContext = createContext<XPContextValue | null>(null);

// ==========================================
// PROVIDER
// ==========================================
interface Props {
  children: ReactNode;
}

export function XPProvider({ children }: Props) {
  const { matricula, status: statusAuth } = useAuth();

  // ==========================================
  // ESTADO — espelha o `cache` do xp-core.js
  // ==========================================
  const [xp, setXp] = useState(0);
  const [cliquesMascote, setCliquesMascote] = useState(0);
  const [streak, setStreak] = useState(0);
  const [skinAtiva, setSkinAtiva] = useState('padrao');
  const [conquistas, setConquistas] = useState<
    Record<string, { desbloqueadaEm: number }>
  >({});
  const [contadores, setContadores] = useState<Contadores>({
    recados: 0,
    curtidas: 0,
    simulador: 0,
    periodos: 0,
  });
  const [pronto, setPronto] = useState(false);

  // Refs mutáveis (não causam re-render, úteis pra rate limit e fila)
  const ultimaVisitaRef = useRef('');
  const rateLimitsRef = useRef<Record<TipoRate, RateEntry>>({
    xp:         { ...RATE_LIMITS.xp,         historico: [] },
    cliques:    { ...RATE_LIMITS.cliques,    historico: [] },
    contadores: { ...RATE_LIMITS.contadores, historico: [] },
    conquistas: { ...RATE_LIMITS.conquistas, historico: [] },
  });
  const filaOfflineRef = useRef<ItemFilaOffline[]>([]);

  // Flag de "pronto" pra callbacks não dispararem durante o boot
  const prontoRef = useRef(false);

  const ehAnonimo = !matricula;

  // ==========================================
  // RATE LIMITING
  // ==========================================
  const verificarRate = useCallback((tipo: TipoRate): boolean => {
    const cfg = rateLimitsRef.current[tipo];
    const agora = Date.now();
    cfg.historico = cfg.historico.filter((t) => agora - t < cfg.janela);
    if (cfg.historico.length >= cfg.max) {
      console.warn(
        `[xp] 🛡️ rate limit ${tipo} (máx ${cfg.max}/${cfg.janela / 1000}s)`
      );
      return false;
    }
    cfg.historico.push(agora);
    return true;
  }, []);

  const aplicarTeto = useCallback(
    (tipo: keyof typeof TETOS_POR_CHAMADA, qtd: number): number => {
      const teto = TETOS_POR_CHAMADA[tipo];
      if (teto && qtd > teto) {
        console.warn(`[xp] 🛡️ teto ${tipo}: ${qtd} → ${teto}`);
        return teto;
      }
      return qtd;
    },
    []
  );

  // ==========================================
  // BOOT — Sincroniza local + Firebase
  // ==========================================
  useEffect(() => {
    if (statusAuth === 'carregando') return;

    let cancelado = false;

    async function sincronizar() {
      // ---- 1. Lê localStorage como ponto de partida ----
      const xpLocal = lsGetNumber(STORAGE_KEYS.XP, 0);
      const cliquesLocal = lsGetNumber(STORAGE_KEYS.CLIQUES, 0);
      const streakLocal = lsGetNumber(STORAGE_KEYS.STREAK, 0);
      const ultimaVisita = lsGetString(STORAGE_KEYS.ULTIMO_ACESSO, '');
      const skinLS =
        lsGetString(STORAGE_KEYS.SKIN, '') ||
        lsGetString(STORAGE_KEYS.AVATAR_LEGADO, '') ||
        'padrao';
      const contadoresLocal: Contadores = {
        recados: lsGetNumber(STORAGE_KEYS.RECADOS, 0),
        curtidas: lsGetNumber(STORAGE_KEYS.CURTIDAS, 0),
        simulador: lsGetNumber(STORAGE_KEYS.SIMULADOR, 0),
        periodos: lsGetNumber(STORAGE_KEYS.PERIODOS, 0),
      };

      if (cancelado) return;

      // ---- 2. Anônimo: só local, marca pronto e sai ----
      if (ehAnonimo) {
        setXp(xpLocal);
        setCliquesMascote(cliquesLocal);
        setStreak(streakLocal);
        setSkinAtiva(skinLS);
        setContadores(contadoresLocal);
        ultimaVisitaRef.current = ultimaVisita;
        setPronto(true);
        prontoRef.current = true;
        return;
      }

      // ---- 3. Logado: busca do Firebase ----
      try {
        const snap = await get(ref(db, `usuarios_xp/${matricula}`));
        const dados = snap.val() || {};

        const xpFB = Number(dados.xp) || 0;
        const cliquesFB = Number(dados.cliquesMascote) || 0;
        const streakFB = Number(dados.streak) || 0;
        const ultimaVisitaFB = dados.ultimaVisita || '';
        const conquistasFB = dados.conquistas || {};
        const contadoresFB: Contadores = {
          recados: Number(dados.contadores?.recados) || 0,
          curtidas: Number(dados.contadores?.curtidas) || 0,
          simulador: Number(dados.contadores?.simulador) || 0,
          periodos: Number(dados.contadores?.periodos) || 0,
        };

        // Skin: prioridade Firebase (perfis_alunos)
        let skinFinal = skinLS;
        try {
          const snapSkin = await get(
            ref(db, `perfis_alunos/${matricula}/mascoteAvatar`)
          );
          if (snapSkin.exists()) {
            skinFinal = snapSkin.val();
          }
        } catch {
          /* ignora */
        }

        if (cancelado) return;

        // ---- 4. Aplica estado ----
        setXp(xpFB);
        setCliquesMascote(cliquesFB);
        setStreak(streakFB);
        setSkinAtiva(skinFinal);
        setConquistas(conquistasFB);
        setContadores(contadoresFB);
        ultimaVisitaRef.current = ultimaVisitaFB;

        // ---- 5. Persiste no localStorage como cache ----
        lsSetNumber(STORAGE_KEYS.XP, xpFB);
        lsSetNumber(STORAGE_KEYS.CLIQUES, cliquesFB);
        lsSetNumber(STORAGE_KEYS.STREAK, streakFB);
        if (ultimaVisitaFB) lsSetString(STORAGE_KEYS.ULTIMO_ACESSO, ultimaVisitaFB);
        lsSetString(STORAGE_KEYS.SKIN, skinFinal);
        lsSetString(STORAGE_KEYS.AVATAR_LEGADO, skinFinal);
        lsSetNumber(STORAGE_KEYS.RECADOS, contadoresFB.recados);
        lsSetNumber(STORAGE_KEYS.CURTIDAS, contadoresFB.curtidas);
        lsSetNumber(STORAGE_KEYS.SIMULADOR, contadoresFB.simulador);
        lsSetNumber(STORAGE_KEYS.PERIODOS, contadoresFB.periodos);

        setPronto(true);
        prontoRef.current = true;

        // ---- 6. Migração local → Firebase (só na primeira vez) ----
        await migrarLocalSeNecessario({
          matricula,
          xpLocal,
          xpFB,
          cliquesLocal,
          cliquesFB,
          contadoresLocal,
          contadoresFB,
          jaMigrado: !!dados.migracaoLocal?.concluidaEm,
        }).catch(() => {});
      } catch (err) {
        console.warn('[xp] erro ao sincronizar com Firebase:', err);
        // Fallback: mantém valores locais
        setXp(xpLocal);
        setCliquesMascote(cliquesLocal);
        setStreak(streakLocal);
        setSkinAtiva(skinLS);
        setContadores(contadoresLocal);
        setPronto(true);
        prontoRef.current = true;
      }
    }

    sincronizar();

    return () => {
      cancelado = true;
    };
  }, [matricula, statusAuth, ehAnonimo]);

  // ==========================================
  // OBSERVER EM TEMPO REAL
  // ==========================================
  useEffect(() => {
    if (ehAnonimo || !pronto) return;

    const refXP = ref(db, `usuarios_xp/${matricula}`);
    const unsubscribe = onValue(refXP, (snap) => {
      const dados = snap.val() || {};
      if (dados.xp !== undefined) setXp(Number(dados.xp) || 0);
      if (dados.cliquesMascote !== undefined)
        setCliquesMascote(Number(dados.cliquesMascote) || 0);
      if (dados.streak !== undefined) setStreak(Number(dados.streak) || 0);
      if (dados.conquistas) setConquistas(dados.conquistas);
      if (dados.contadores) {
        setContadores({
          recados: Number(dados.contadores.recados) || 0,
          curtidas: Number(dados.contadores.curtidas) || 0,
          simulador: Number(dados.contadores.simulador) || 0,
          periodos: Number(dados.contadores.periodos) || 0,
        });
      }
    });

    return () => unsubscribe();
  }, [matricula, ehAnonimo, pronto]);

  // ==========================================
  // AÇÕES
  // ==========================================
  const incrementarXP = useCallback(
    async (quantidade: number, motivo = 'geral'): Promise<number> => {
      const qtd = Number(quantidade) || 0;
      if (qtd <= 0) return xp;
      if (!verificarRate('xp')) return xp;

      const final = aplicarTeto('xp', qtd);

      // Atualização otimista
      setXp((v) => {
        const novo = v + final;
        lsSetNumber(STORAGE_KEYS.XP, novo);
        return novo;
      });

      // Se logado, envia pra API
      if (!ehAnonimo && matricula) {
        try {
          await apiXP.add(final, motivo);
        } catch (err) {
          console.warn('[xp] erro API incrementarXP, enfileirando:', err);
          filaOfflineRef.current.push({ tipo: 'xp', qtd: final, motivo });
        }
      }
      return xp + final;
    },
    [xp, ehAnonimo, matricula, verificarRate, aplicarTeto]
  );

  const incrementarCliquesMascote = useCallback(
    async (quantidade = 1): Promise<number> => {
      const qtd = Number(quantidade) || 1;
      if (qtd <= 0) return cliquesMascote;
      if (!verificarRate('cliques')) return cliquesMascote;

      const final = aplicarTeto('cliques', qtd);

      setCliquesMascote((v) => {
        const novo = v + final;
        lsSetNumber(STORAGE_KEYS.CLIQUES, novo);
        return novo;
      });

      if (!ehAnonimo && matricula) {
        try {
          // A API de carinho incrementa 1 por vez — chamamos em loop
          for (let i = 0; i < final; i++) {
            await apiMascote.carinho();
          }
        } catch (err) {
          console.warn('[xp] erro API cliques, enfileirando:', err);
          filaOfflineRef.current.push({ tipo: 'cliques', qtd: final });
        }
      }
      return cliquesMascote + final;
    },
    [cliquesMascote, ehAnonimo, matricula, verificarRate, aplicarTeto]
  );

  const incrementarContador = useCallback(
    async (nome: NomeContador, quantidade = 1): Promise<number> => {
      const qtd = Number(quantidade) || 1;
      if (qtd <= 0) return contadores[nome] || 0;
      if (!verificarRate('contadores')) return contadores[nome] || 0;

      const final = aplicarTeto('contadores', qtd);

      setContadores((v) => {
        const novo = { ...v, [nome]: (v[nome] || 0) + final };
        // Persiste a chave específica
        const chave = {
          recados: STORAGE_KEYS.RECADOS,
          curtidas: STORAGE_KEYS.CURTIDAS,
          simulador: STORAGE_KEYS.SIMULADOR,
          periodos: STORAGE_KEYS.PERIODOS,
        }[nome];
        if (chave) lsSetNumber(chave, novo[nome]);
        return novo;
      });

      if (!ehAnonimo && matricula) {
        try {
          await apiXP.contador(nome, final);
        } catch (err) {
          console.warn('[xp] erro API contador, enfileirando:', err);
          filaOfflineRef.current.push({ tipo: 'contador', nome, qtd: final });
        }
      }
      return (contadores[nome] || 0) + final;
    },
    [contadores, ehAnonimo, matricula, verificarRate, aplicarTeto]
  );

  const registrarAcessoDiario = useCallback(async () => {
    const hoje = hojeISO();
    if (ultimaVisitaRef.current === hoje) {
      return { streak, novo: false, bonusXP: 0 };
    }

    let novoStreak: number;
    if (ultimaVisitaRef.current) {
      const ontem = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      novoStreak =
        ultimaVisitaRef.current === ontem ? streak + 1 : 1;
    } else {
      novoStreak = 1;
    }

    const bonusXP =
      novoStreak >= 30 ? 100 : novoStreak >= 7 ? 50 : novoStreak >= 3 ? 20 : 10;

    setStreak(novoStreak);
    ultimaVisitaRef.current = hoje;
    lsSetNumber(STORAGE_KEYS.STREAK, novoStreak);
    lsSetString(STORAGE_KEYS.ULTIMO_ACESSO, hoje);

    if (!ehAnonimo && matricula) {
      try {
        const r = await apiXP.acessoDiario();
        setStreak(r.streak || novoStreak);
        if (r.bonusXP) {
          setXp((v) => {
            const novo = v + r.bonusXP;
            lsSetNumber(STORAGE_KEYS.XP, novo);
            return novo;
          });
        }
        return { streak: r.streak, novo: r.novo, bonusXP: r.bonusXP };
      } catch (err) {
        console.warn('[xp] erro API acesso-diario:', err);
        setXp((v) => {
          const novo = v + bonusXP;
          lsSetNumber(STORAGE_KEYS.XP, novo);
          return novo;
        });
      }
    } else {
      setXp((v) => {
        const novo = v + bonusXP;
        lsSetNumber(STORAGE_KEYS.XP, novo);
        return novo;
      });
    }

    return { streak: novoStreak, novo: true, bonusXP };
  }, [streak, ehAnonimo, matricula]);

  const desbloquearConquista = useCallback(
    async (id: string): Promise<boolean> => {
      if (!id) return false;
      if (conquistas[id]) return false;
      if (!verificarRate('conquistas')) return false;

      if (!ehAnonimo && matricula) {
        try {
          const r = await apiConquista.desbloquear(id);
          if (!r.desbloqueada && r.jaTinha) {
            setConquistas((v) => ({
              ...v,
              [id]: { desbloqueadaEm: Date.now() },
            }));
            return false;
          }
          const agora = r.desbloqueadaEm || Date.now();
          setConquistas((v) => ({
            ...v,
            [id]: { desbloqueadaEm: agora },
          }));
          return true;
        } catch (err) {
          console.warn('[xp] erro API desbloquearConquista:', err);
          return false;
        }
      }

      const agora = Date.now();
      setConquistas((v) => ({ ...v, [id]: { desbloqueadaEm: agora } }));
      return true;
    },
    [conquistas, ehAnonimo, matricula, verificarRate]
  );

  const definirSkinAtiva = useCallback(
    async (skinId: string): Promise<boolean> => {
      if (!skinId) return false;
      setSkinAtiva(skinId);
      lsSetString(STORAGE_KEYS.SKIN, skinId);
      lsSetString(STORAGE_KEYS.AVATAR_LEGADO, skinId);

      if (!ehAnonimo && matricula) {
        try {
          await apiMascote.skin(skinId);
        } catch (err) {
          console.warn('[xp] erro API definirSkinAtiva:', err);
          return false;
        }
      }
      return true;
    },
    [ehAnonimo, matricula]
  );

  const registrarPeriodoVisto = useCallback(
    async (periodo: string): Promise<boolean> => {
      if (!periodo) return false;
      let vistos: string[] = [];
      try {
        const raw = lsGetString(STORAGE_KEYS.PERIODOS_VISTOS, '');
        vistos = raw ? JSON.parse(raw) : [];
      } catch {
        vistos = [];
      }

      if (vistos.includes(periodo)) return false;

      vistos.push(periodo);
      lsSetString(STORAGE_KEYS.PERIODOS_VISTOS, JSON.stringify(vistos));
      await incrementarContador('periodos', 1);
      return true;
    },
    [incrementarContador]
  );

  // ==========================================
  // FILA OFFLINE
  // ==========================================
  useEffect(() => {
    function processar() {
      if (!ehAnonimo && matricula && filaOfflineRef.current.length > 0) {
        const fila = [...filaOfflineRef.current];
        filaOfflineRef.current = [];
        (async () => {
          for (const item of fila) {
            try {
              if (item.tipo === 'xp' && item.qtd) {
                await apiXP.add(item.qtd, item.motivo || 'geral');
              } else if (item.tipo === 'cliques' && item.qtd) {
                for (let i = 0; i < item.qtd; i++) {
                  await apiMascote.carinho();
                }
              } else if (item.tipo === 'contador' && item.nome && item.qtd) {
                await apiXP.contador(item.nome, item.qtd);
              }
            } catch {
              filaOfflineRef.current.push(item);
              break;
            }
          }
        })();
      }
    }

    window.addEventListener('online', processar);
    return () => window.removeEventListener('online', processar);
  }, [ehAnonimo, matricula]);

  // ==========================================
  // VALUE
  // ==========================================
  const obterContador = useCallback(
    (nome: NomeContador) => contadores[nome] || 0,
    [contadores]
  );

  const value = useMemo<XPContextValue>(
    () => ({
      xp,
      cliquesMascote,
      streak,
      skinAtiva,
      conquistas,
      contadores,
      pronto,
      ehAnonimo,
      obterContador,
      incrementarXP,
      incrementarCliquesMascote,
      incrementarContador,
      registrarAcessoDiario,
      desbloquearConquista,
      definirSkinAtiva,
      registrarPeriodoVisto,
    }),
    [
      xp,
      cliquesMascote,
      streak,
      skinAtiva,
      conquistas,
      contadores,
      pronto,
      ehAnonimo,
      obterContador,
      incrementarXP,
      incrementarCliquesMascote,
      incrementarContador,
      registrarAcessoDiario,
      desbloquearConquista,
      definirSkinAtiva,
      registrarPeriodoVisto,
    ]
  );

  return <XPContext.Provider value={value}>{children}</XPContext.Provider>;
}

// ==========================================
// MIGRAÇÃO local → Firebase
// ==========================================
// Porta fiel do `migrarLocalSeNecessario` do xp-core.js.
// Comparação Math.max preservada exatamente pra não perder XP
// de alunos que usavam o site antes da migração.
// ==========================================
interface MigracaoArgs {
  matricula: string;
  xpLocal: number;
  xpFB: number;
  cliquesLocal: number;
  cliquesFB: number;
  contadoresLocal: Contadores;
  contadoresFB: Contadores;
  jaMigrado: boolean;
}

async function migrarLocalSeNecessario(args: MigracaoArgs): Promise<void> {
  const {
    matricula,
    xpLocal,
    xpFB,
    cliquesLocal,
    cliquesFB,
    contadoresLocal,
    contadoresFB,
    jaMigrado,
  } = args;

  if (jaMigrado) {
    console.log('[xp] migração já feita.');
    return;
  }

  console.log('[xp] 🔄 Iniciando migração local → Firebase...');

  const xpFinal = Math.max(xpLocal, xpFB);
  const cliquesFinal = Math.max(cliquesLocal, cliquesFB);
  const recadosFinal = Math.max(contadoresLocal.recados, contadoresFB.recados);
  const curtidasFinal = Math.max(contadoresLocal.curtidas, contadoresFB.curtidas);
  const simuladorFinal = Math.max(
    contadoresLocal.simulador,
    contadoresFB.simulador
  );
  const periodosFinal = Math.max(
    contadoresLocal.periodos,
    contadoresFB.periodos
  );

  await update(ref(db, `usuarios_xp/${matricula}`), {
    xp: xpFinal,
    cliquesMascote: cliquesFinal,
    contadores: {
      recados: recadosFinal,
      curtidas: curtidasFinal,
      simulador: simuladorFinal,
      periodos: periodosFinal,
    },
    migracaoLocal: {
      concluidaEm: Date.now(),
      xpLocal,
      xpFB,
      cliquesLocal,
      cliquesFB,
    },
  });

  // Limpa localStorage (já está no Firebase)
  lsRemoveVarias([
    STORAGE_KEYS.XP,
    STORAGE_KEYS.CLIQUES,
    STORAGE_KEYS.RECADOS,
    STORAGE_KEYS.CURTIDAS,
    STORAGE_KEYS.SIMULADOR,
    STORAGE_KEYS.PERIODOS,
    STORAGE_KEYS.PERIODOS_VISTOS,
  ]);

  console.log('[xp] ✅ Migração concluída:', {
    xp: xpFinal,
    cliques: cliquesFinal,
  });
}