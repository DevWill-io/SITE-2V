// ==========================================
// ✅ VALIDAÇÕES E SANITIZAÇÃO
// ==========================================

/**
 * Escapa HTML para evitar XSS.
 *
 * Origem: login.js.
 * ⚠️ No React vamos usar JSX quase sempre (React escapa sozinho),
 * mas essa função continua útil pra casos onde precisamos montar
 * strings (ex: atributos `title`, ou conteúdo de `<option>` dinâmico).
 */
export function escaparHTML(texto: string | null | undefined): string {
  if (!texto) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Valida email simples.
 * Retorna true se passa no regex mais permissivo.
 */
export function emailValido(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

/**
 * Valida URL começando com http:// ou https://
 */
export function urlValida(url: string | null | undefined): boolean {
  if (!url) return false;
  return /^https?:\/\/.+/.test(String(url).trim());
}

/**
 * Valida se uma string não está vazia após trim.
 */
export function naoVazio(valor: string | null | undefined): boolean {
  return String(valor || '').trim().length > 0;
}

/**
 * Trunca texto com reticências.
 * truncar("abcdefgh", 5) → "abcde..."
 */
export function truncar(texto: string, max: number): string {
  const str = String(texto || '');
  return str.length > max ? `${str.slice(0, max)}...` : str;
}

/**
 * Normaliza texto para busca (lowercase + sem acentos).
 * Usado no filtro de mural e perfis.
 */
export function normalizarBusca(texto: string | null | undefined): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}