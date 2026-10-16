import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { db, ref, onValue } from '../services/firebase';
import { useXP } from '../hooks/useXP';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useMascoteSom } from '../hooks/useMascoteSom';
import {
  LIMITE_CARINHOS,
  COOLDOWN_CARINHO_MS,
  MARCOS_MASCOTE,
  AVATARES_MASCOTE,
} from '../utils/constants';
import { criarCoracao, soltarConfete } from '../utils/mascoteHelpers';
import type { PerfilAluno } from '../types/usuario';

export interface EntradaRanking {
  matricula: string;
  carinhos: number;
}

interface MascoteContextValue {
  carinhosGlobais: number;
  meusCarinhos: number;
  somLigado: boolean;
  atingiuLimite: boolean;
  ranking: EntradaRanking[];
  perfisCache: Record<string, PerfilAluno>;
  darCarinho: (event?: { clientX: number; clientY: number }) => Promise<void>;
  toggleSom: () => void;
}

export const MascoteContext = createContext<MascoteContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function MascoteProvider({ children }: Props) {
  const { matricula } = useAuth();
  const { cliquesMascote, incrementarCliquesMascote, skinAtiva } = useXP();
  const { toast } = useToast();
  const { somLigado, tocarSom, toggleSom } = useMascoteSom();

  const [carinhosGlobais, setCarinhosGlobais] = useState(0);
  const [meusCarinhos, setMeusCarinhos] = useState(0);
  const [ranking, setRanking] = useState<EntradaRanking[]>([]);
  const [perfisCache, setPerfisCache] = useState<Record<string, PerfilAluno>>({});

  const podeClicar = useRef(true);
  const marcosAnteriores = useRef<Set<number>>(new Set());
  // 🆕 Flag pra ignorar animações na primeira leitura do Firebase
  const primeiraLeitura = useRef(true);

  // ==========================================
  // Firebase: total de carinhos
  // ==========================================
  useEffect(() => {
    const totalRef = ref(db, 'mascote/total_carinhos');
    return onValue(totalRef, (snap) => {
      const valor = Number(snap.val()) || 0;

      // 🆕 PRIMEIRA LEITURA: só registra os marcos já batidos como "anteriores"
      // sem disparar confete/som/toast
      if (primeiraLeitura.current) {
        primeiraLeitura.current = false;
        MARCOS_MASCOTE.forEach((m) => {
          if (valor >= m.valor) {
            marcosAnteriores.current.add(m.valor);
          }
        });
        setCarinhosGlobais(valor);
        return;
      }

      // Leituras seguintes: comparação normal + dispara marcos novos
      setCarinhosGlobais((anterior) => {
        MARCOS_MASCOTE.forEach((m) => {
          if (anterior < m.valor && valor >= m.valor) {
            if (!marcosAnteriores.current.has(m.valor)) {
              marcosAnteriores.current.add(m.valor);
              soltarConfete(m.valor >= 1000000 ? 120 : 40);
              tocarSom(m.valor >= 1000000 ? 'limite' : 'marco');
              toast(
                `${m.icone} NOVO MARCO: ${m.valor.toLocaleString('pt-BR')} CARINHOS! 🎉`,
                'sucesso'
              );
            }
          }
        });
        return valor;
      });
    });
  }, [tocarSom, toast]);

  // ==========================================
  // Firebase: meus carinhos
  // ==========================================
  useEffect(() => {
    if (!matricula) {
      setMeusCarinhos(0);
      return;
    }
    const meuRef = ref(db, `mascote/por_aluno/${matricula}`);
    return onValue(meuRef, (snap) => {
      setMeusCarinhos(Number(snap.val()) || 0);
    });
  }, [matricula]);

  // ==========================================
  // Firebase: ranking
  // ==========================================
  useEffect(() => {
    const rankRef = ref(db, 'mascote/por_aluno');
    return onValue(rankRef, (snap) => {
      const dados = (snap.val() || {}) as Record<string, number>;
      const entradas: EntradaRanking[] = Object.entries(dados)
        .map(([mat, carinhos]) => ({ matricula: mat, carinhos: Number(carinhos) || 0 }))
        .filter((e) => e.carinhos > 0)
        .sort((a, b) => b.carinhos - a.carinhos);
      setRanking(entradas);
    });
  }, []);

  // ==========================================
  // Firebase: perfis
  // ==========================================
  useEffect(() => {
    const perfisRef = ref(db, 'perfis_alunos');
    return onValue(perfisRef, (snap) => {
      setPerfisCache((snap.val() || {}) as Record<string, PerfilAluno>);
    });
  }, []);

  // Sincroniza meus carinhos do XPContext como fallback
  useEffect(() => {
    setMeusCarinhos((atual) => (atual === 0 ? cliquesMascote : atual));
  }, [cliquesMascote]);

  // ==========================================
  // darCarinho
  // ==========================================
  const darCarinho = useCallback(
    async (event?: { clientX: number; clientY: number }) => {
      if (!matricula) {
        toast('🔒 Faça login com SUAP para dar carinho no mascote!', 'erro');
        setTimeout(() => {
          if (confirm('Quer ir para a página de login?')) {
            window.location.href = '/login';
          }
        }, 1500);
        return;
      }

      if (!podeClicar.current) return;
      podeClicar.current = false;
      setTimeout(() => {
        podeClicar.current = true;
      }, COOLDOWN_CARINHO_MS);

      if (carinhosGlobais >= LIMITE_CARINHOS) {
        toast('🎉 JÁ BATEMOS 1 MILHÃO! O MASCOTE É LENDÁRIO! 🎉', 'erro');
        return;
      }

      tocarSom('carinho');

      const cliquesAntes = cliquesMascote;
      await incrementarCliquesMascote(1);
      const cliquesDepois = cliquesAntes + 1;

      const SKINS_POR_CLIQUE = AVATARES_MASCOTE.filter(
        (s) => !s.gratis && s.tipo === 'cliques' && s.cliquesNecessarios
      );
      SKINS_POR_CLIQUE.forEach((s) => {
        const meta = s.cliquesNecessarios || 0;
        if (cliquesAntes < meta && cliquesDepois >= meta) {
          soltarConfete(80);
          tocarSom('desbloqueio');
          setTimeout(() => {
            toast(`🎉 NOVA SKIN DESBLOQUEADA: ${s.nome}!`, 'sucesso');
          }, 400);
        }
      });

      let x: number;
      let y: number;
      if (event) {
        x = event.clientX;
        y = event.clientY;
      } else {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      }
      const num = carinhosGlobais / LIMITE_CARINHOS > 0.9 ? 6 : 3;
      for (let i = 0; i < num; i++) {
        setTimeout(() => {
          criarCoracao(
            x + (Math.random() - 0.5) * 80,
            y + (Math.random() - 0.5) * 80,
            skinAtiva
          );
        }, i * 60);
      }

      if (Math.random() < 0.35) {
        const faltam = LIMITE_CARINHOS - carinhosGlobais - 1;
        let frases: string[];
        if (faltam <= 1000) {
          frases = [
            `🎯 FALTAM ${faltam.toLocaleString('pt-BR')} CARINHOS!`,
            '💪 ÚLTIMO EMPURRÃO!',
            '🏁 QUASE 1 MILHÃO!',
          ];
        } else if (faltam <= 100000) {
          frases = [
            `🔥 Faltam só ${faltam.toLocaleString('pt-BR')}!`,
            '💪 Continue assim!',
            '✨ Rumo ao 1 MILHÃO!',
          ];
        } else {
          frases = [
            '🥰 Obrigado pelo carinho!',
            '💖 Você é demais!',
            '🐾 Adorei!',
            '🤗 Mais um carinho!',
            '✨ Que fofo!',
          ];
        }
        toast(frases[Math.floor(Math.random() * frases.length)], 'sucesso');
      }
    },
    [
      matricula,
      toast,
      carinhosGlobais,
      cliquesMascote,
      incrementarCliquesMascote,
      tocarSom,
      skinAtiva,
    ]
  );

  const value = useMemo<MascoteContextValue>(
    () => ({
      carinhosGlobais,
      meusCarinhos,
      somLigado,
      atingiuLimite: carinhosGlobais >= LIMITE_CARINHOS,
      ranking,
      perfisCache,
      darCarinho,
      toggleSom,
    }),
    [
      carinhosGlobais,
      meusCarinhos,
      somLigado,
      ranking,
      perfisCache,
      darCarinho,
      toggleSom,
    ]
  );

  return (
    <MascoteContext.Provider value={value}>{children}</MascoteContext.Provider>
  );
}