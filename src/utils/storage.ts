// ==========================================
// 💾 WRAPPER TIPADO DO localStorage
// ==========================================
// Antes: cada arquivo chamava localStorage.getItem/setItem direto,
// com try/catch espalhado e conversão de número repetida.
// Agora: uma API só, segura, tipada.
// ==========================================

// ==========================================
// CHAVES (fonte única da verdade)
// ==========================================
export const STORAGE_KEYS = {
  // Tema / Idioma
  IDIOMA: 'idioma',
  TEMA_COR: 'tema-cor',
  TEMA_MODO: 'theme',

  // XP (fallback local)
  XP: 'xp_total',
  CLIQUES: 'xp_cliques_mascote',
  STREAK: 'xp_streak',
  ULTIMO_ACESSO: 'xp_ultimo_acesso',
  SKIN: 'skin_ativa',
  AVATAR_LEGADO: 'mascote_avatar',
  RECADOS: 'xp_recados_total',
  CURTIDAS: 'xp_curtidas_total',
  SIMULADOR: 'xp_simulador_total',
  PERIODOS: 'xp_periodos_total',
  PERIODOS_VISTOS: 'xp_periodos_vistos',

  // Mascote
  MASCOTE_SOM: 'mascote_som',
  MATRICULA_TEMP: 'mascote_matricula_temp',

  // SUAP
  SUAP_TOKEN: 'suapToken',
  MATRICULA_SUAP: 'matricula_suap',

  // Notificações
  // (prefixo + matrícula; helper abaixo)
} as const;

// ==========================================
// HELPERS INTERNOS
// ==========================================
function seguro<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

// ==========================================
// STRING
// ==========================================
export function lsGetString(chave: string, fallback = ''): string {
  return seguro(() => localStorage.getItem(chave) ?? fallback, fallback);
}

export function lsSetString(chave: string, valor: string): void {
  seguro(() => localStorage.setItem(chave, valor), undefined);
}

// ==========================================
// NÚMERO
// ==========================================
export function lsGetNumber(chave: string, fallback = 0): number {
  return seguro(() => {
    const v = localStorage.getItem(chave);
    if (v === null) return fallback;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  }, fallback);
}

export function lsSetNumber(chave: string, valor: number): void {
  seguro(() => localStorage.setItem(chave, String(valor)), undefined);
}

// ==========================================
// BOOLEANO
// ==========================================
export function lsGetBool(chave: string, fallback = false): boolean {
  return seguro(() => {
    const v = localStorage.getItem(chave);
    if (v === null) return fallback;
    return v === 'true' || v === '1' || v === 'on';
  }, fallback);
}

export function lsSetBool(chave: string, valor: boolean): void {
  seguro(() => localStorage.setItem(chave, valor ? 'true' : 'false'), undefined);
}

// ==========================================
// JSON
// ==========================================
export function lsGetJSON<T>(chave: string, fallback: T): T {
  return seguro(() => {
    const raw = localStorage.getItem(chave);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  }, fallback);
}

export function lsSetJSON(chave: string, valor: unknown): void {
  seguro(() => localStorage.setItem(chave, JSON.stringify(valor)), undefined);
}

// ==========================================
// REMOÇÃO
// ==========================================
export function lsRemove(chave: string): void {
  seguro(() => localStorage.removeItem(chave), undefined);
}

export function lsRemoveVarias(chaves: readonly string[]): void {
  seguro(() => {
    chaves.forEach((c) => localStorage.removeItem(c));
  }, undefined);
}

// ==========================================
// HELPERS ESPECÍFICOS (evitam concatenação na mão)
// ==========================================

/** Chave de notificações lidas por matrícula. */
export function chaveNotificacoesLidas(matricula: string): string {
  return `notif_lidas_${matricula || 'anon'}`;
}

/** Chave de metas de disciplinas por matrícula. */
export function chaveMetasDisciplinas(matricula: string): string {
  return `metas_disc_${matricula || 'anon'}`;
}

/** Chave de perfil custom (cache local) por matrícula. */
export function chavePerfilCustom(matricula: string): string {
  return `perfil_custom_${matricula}`;
}

// ==========================================
// COOKIES (usado só pelo SUAP)
// ==========================================
export function cookieGet(nome: string): string | null {
  return seguro(() => {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${nome}=([^;]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  }, null);
}

export function cookieSet(nome: string, valor: string, maxAgeSegundos: number): void {
  seguro(() => {
    document.cookie = `${nome}=${encodeURIComponent(valor)}; path=/; max-age=${maxAgeSegundos}; SameSite=Lax`;
  }, undefined);
}

export function cookieRemove(nome: string): void {
  seguro(() => {
    document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }, undefined);
}