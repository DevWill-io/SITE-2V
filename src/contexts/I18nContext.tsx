// ==========================================
// 🌐 CONTEXTO DE I18N
// ==========================================
// Antes: i18n era feito com `data-i18n` + `aplicarTraducoes()` lendo
// o DOM. O trocar de idioma manipulava texto direto.
//
// Agora: Context React. Trocar idioma re-renderiza os componentes.
// Sem querySelector, sem mutate DOM, sem chave perdida.
//
// ⚠️ Persistência: o idioma fica em localStorage (mesma chave do site antigo).
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
  DICIONARIOS,
  detectarIdioma,
  ehIdiomaValido,
  traduzir,
} from '../utils/i18n';
import { IDIOMA_PADRAO, type Idioma } from '../utils/constants';
import { STORAGE_KEYS, lsGetString, lsSetString } from '../utils/storage';
import type { ChaveI18n } from '../utils/i18n';

// ==========================================
// TIPOS
// ==========================================
interface I18nContextValue {
  /** Idioma atual. */
  idioma: Idioma;
  /** Troca o idioma e persiste. */
  trocarIdioma: (novo: Idioma) => void;
  /**
   * Traduz uma chave.
   * Uso: `const { t } = useI18n(); t('hero_botao_curso')`
   */
  t: (chave: ChaveI18n) => string;
}

// ==========================================
// CONTEXT
// ==========================================
export const I18nContext = createContext<I18nContextValue | null>(null);

// ==========================================
// PROVIDER
// ==========================================
interface Props {
  children: ReactNode;
}

export function I18nProvider({ children }: Props) {
  // Inicializa: localStorage > navegador > pt-BR
  const [idioma, setIdioma] = useState<Idioma>(() => {
    const salvo = lsGetString(STORAGE_KEYS.IDIOMA, '');
    if (ehIdiomaValido(salvo)) return salvo;
    return detectarIdioma();
  });

  // ==========================================
  // Sincroniza o atributo lang do <html>
  // ==========================================
  useEffect(() => {
    document.documentElement.setAttribute('lang', idioma);
  }, [idioma]);

  // ==========================================
  // Troca de idioma
  // ==========================================
  const trocarIdioma = useCallback((novo: Idioma) => {
    if (!ehIdiomaValido(novo)) return;
    lsSetString(STORAGE_KEYS.IDIOMA, novo);
    setIdioma(novo);
  }, []);

  // ==========================================
  // Função t() — estável, muda só se idioma muda
  // ==========================================
  const t = useCallback(
    (chave: ChaveI18n) => traduzir(idioma, chave),
    [idioma]
  );

  // ==========================================
  // Value memoizado
  // ==========================================
  const value = useMemo<I18nContextValue>(
    () => ({ idioma, trocarIdioma, t }),
    [idioma, trocarIdioma, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ==========================================
// EXPORTA DICIONÁRIOS (útil pra debug/devtools)
// ==========================================
export { DICIONARIOS, IDIOMA_PADRAO };