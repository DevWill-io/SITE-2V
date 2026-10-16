// ==========================================
// 🎨 CONTEXTO DE TEMA (cor + claro/escuro)
// ==========================================
// Antes: `aplicarTema()` e o toggle claro/escuro mexiam direto em
//        document.body.classList e localStorage, espalhados em
//        script.js e login.js.
//
// Agora: Context que centraliza, tipado, e persiste automaticamente.
//
// Aplica no <body>:
//   - classe "tema-roxo" | "tema-azul" | ... (cor)
//   - classe "light-theme" (modo claro)
// Atualiza <meta name="theme-color"> também.
// ==========================================

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CORES_TEMA,
  TEMA_PADRAO,
  TEMAS_DISPONIVEIS,
  type TemaCor,
} from '../utils/constants';
import {
  STORAGE_KEYS,
  lsGetString,
  lsSetString,
} from '../utils/storage';

// ==========================================
// TIPOS
// ==========================================
export type ModoTema = 'claro' | 'escuro';

interface TemaContextValue {
  /** Cor do tema atual. */
  temaCor: TemaCor;
  /** Modo atual (claro/escuro). */
  modo: ModoTema;
  /** Troca a cor. */
  trocarCor: (cor: TemaCor) => void;
  /** Troca o modo. */
  trocarModo: (modo: ModoTema) => void;
  /** Alterna entre claro e escuro. */
  alternarModo: () => void;
}

// ==========================================
// CONTEXT
// ==========================================
export const TemaContext = createContext<TemaContextValue | null>(null);

// ==========================================
// PROVIDER
// ==========================================
interface Props {
  children: ReactNode;
}

export function TemaProvider({ children }: Props) {
  // ---- Cor (roxo, azul, etc) ----
  const [temaCor, setTemaCor] = useState<TemaCor>(() => {
    const salvo = lsGetString(STORAGE_KEYS.TEMA_COR, '');
    return TEMAS_DISPONIVEIS.includes(salvo as TemaCor)
      ? (salvo as TemaCor)
      : TEMA_PADRAO;
  });

  // ---- Modo (claro/escuro) ----
  const [modo, setModo] = useState<ModoTema>(() => {
    const salvo = lsGetString(STORAGE_KEYS.TEMA_MODO, '');
    if (salvo === 'light') return 'claro';
    if (salvo === 'dark') return 'escuro';
    // Fallback: preferência do sistema
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'claro'
      : 'escuro';
  });

  // ==========================================
  // Aplica classes no <body> e meta theme-color
  // ==========================================
  useEffect(() => {
    const body = document.body;

    // Cor
    TEMAS_DISPONIVEIS.forEach((t) => body.classList.remove(`tema-${t}`));
    body.classList.add(`tema-${temaCor}`);

    // Modo
    body.classList.toggle('light-theme', modo === 'claro');

    // meta theme-color
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (meta) {
      meta.setAttribute('content', CORES_TEMA[temaCor]);
    }
  }, [temaCor, modo]);

  // ==========================================
  // Ações
  // ==========================================
  const trocarCor = useCallback((cor: TemaCor) => {
    if (!TEMAS_DISPONIVEIS.includes(cor)) return;
    lsSetString(STORAGE_KEYS.TEMA_COR, cor);
    setTemaCor(cor);
  }, []);

  const trocarModo = useCallback((novo: ModoTema) => {
    lsSetString(STORAGE_KEYS.TEMA_MODO, novo === 'claro' ? 'light' : 'dark');
    setModo(novo);
  }, []);

  const alternarModo = useCallback(() => {
    setModo((atual) => {
      const proximo = atual === 'claro' ? 'escuro' : 'claro';
      lsSetString(
        STORAGE_KEYS.TEMA_MODO,
        proximo === 'claro' ? 'light' : 'dark'
      );
      return proximo;
    });
  }, []);

  const value = useMemo<TemaContextValue>(
    () => ({ temaCor, modo, trocarCor, trocarModo, alternarModo }),
    [temaCor, modo, trocarCor, trocarModo, alternarModo]
  );

  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}