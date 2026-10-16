// ==========================================
// 🎨 UTILITÁRIOS DE COR
// ==========================================
// Funções que convertem cores para hex (Chart.js exige hex).
// Origem: login.js.
// ==========================================

/**
 * Converte QUALQUER formato de cor para "#rrggbb".
 *
 * Aceita:
 *   - "#abc"           → "#aabbcc"
 *   - "#aabbcc"        → "#aabbcc"
 *   - "#aabbccdd"      → "#aabbcc"  (ignora alpha)
 *   - "rgb(255,0,0)"   → "#ff0000"
 *   - "rgba(255,0,0,0.5)" → "#ff0000"
 *   - "hsl(120,50%,50%)"  → "#40bf40"
 *   - "hsla(...)"      → hex
 *   - inválido         → fallback
 *
 * Origem: login.js.
 */
export function corParaHex(
  cor: string | null | undefined,
  fallback = '#8b5edd'
): string {
  if (!cor) return fallback;
  const str = String(cor).trim();

  // Hex de 6 dígitos
  if (/^#[0-9a-f]{6}$/i.test(str)) return str;

  // Hex de 3 dígitos → expande
  if (/^#[0-9a-f]{3}$/i.test(str)) {
    return `#${str[1]}${str[1]}${str[2]}${str[2]}${str[3]}${str[3]}`;
  }

  // Hex de 8 dígitos → corta alpha
  if (/^#[0-9a-f]{8}$/i.test(str)) return str.slice(0, 7);

  // rgb / rgba
  const mRgb = str.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (mRgb) {
    const r = parseInt(mRgb[1], 10);
    const g = parseInt(mRgb[2], 10);
    const b = parseInt(mRgb[3], 10);
    return `#${[r, g, b]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')}`;
  }

  // hsl / hsla
  const mHsl = str.match(/^hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/i);
  if (mHsl) {
    const h = parseFloat(mHsl[1]) / 360;
    const s = parseFloat(mHsl[2]) / 100;
    const l = parseFloat(mHsl[3]) / 100;

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

    return `#${[r, g, b]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')}`;
  }

  return fallback;
}

/**
 * Alias mantido por compatibilidade com código legado.
 * Chart.js precisa de hex no canvas.
 */
export function corParaCanvas(
  cor: string | null | undefined,
  fallback = '#8b5edd'
): string {
  return corParaHex(cor, fallback);
}

/**
 * Adiciona um stop de gradiente com segurança.
 * Se a cor for inválida, cai no fallback em vez de quebrar o canvas.
 *
 * Origem: login.js.
 */
export function addStopSeguro(
  gradient: CanvasGradient,
  posicao: number,
  cor: string | null | undefined,
  fallback = '#8b5edd'
): void {
  try {
    gradient.addColorStop(posicao, corParaCanvas(cor, fallback));
  } catch (err) {
    console.warn('[gradient] cor inválida:', cor, '→ usando fallback');
    gradient.addColorStop(posicao, fallback);
  }
}

/**
 * Constrói a cor com alpha em hex (ex: "#8b5edd" + "cc" → "#8b5eddcc").
 * Usado no gradiente do gráfico de evolução.
 */
export function comAlpha(hex: string, alphaHex: string): string {
  const base = corParaHex(hex);
  return `${base}${alphaHex}`;
}