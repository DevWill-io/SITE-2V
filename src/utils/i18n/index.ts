// ==========================================
// 🌐 I18N — PONTO DE ENTRADA
// ==========================================
// Exporta os dicionários e o mapa completo por idioma.
// Os contextos e hooks importam daqui.
// ==========================================

import { ptBR, type ChaveI18n, type Dicionario } from './pt-BR';
import { en } from './en';
import { es } from './es';
import { IDIOMA_PADRAO, IDIOMAS_SUPORTADOS, type Idioma } from '../constants';

export { ptBR, en, es };
export type { ChaveI18n, Dicionario };

/**
 * Mapa completo: idioma → dicionário.
 */
export const DICIONARIOS: Record<Idioma, Dicionario> = {
  'pt-BR': ptBR,
  en,
  es,
};

/**
 * Traduz uma chave.
 * Se a chave não existir no idioma, cai no pt-BR.
 * Se não existir em nenhum, retorna a própria chave.
 *
 * ⚠️ Normalmente você NÃO vai chamar isso direto — use o hook `useI18n`.
 * Essa função existe pra contextos que não são componentes React (ex: services).
 */
export function traduzir(idioma: Idioma, chave: ChaveI18n): string {
  const dict = DICIONARIOS[idioma] || DICIONARIOS[IDIOMA_PADRAO];
  return dict[chave] || DICIONARIOS[IDIOMA_PADRAO][chave] || chave;
}

/**
 * Detecta o idioma a partir do navegador.
 * Fallback: pt-BR.
 */
export function detectarIdioma(): Idioma {
  const nav = (navigator.language || 'pt-BR').toLowerCase();
  if (nav.startsWith('en')) return 'en';
  if (nav.startsWith('es')) return 'es';
  return IDIOMA_PADRAO;
}

/**
 * Valida se uma string é um idioma suportado.
 */
export function ehIdiomaValido(valor: string | null | undefined): valor is Idioma {
  return IDIOMAS_SUPORTADOS.includes(valor as Idioma);
}