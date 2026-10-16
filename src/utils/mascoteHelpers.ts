// ==========================================
// 🎉 HELPERS — corações + confete
// ==========================================
// Porta fiel do criarCoracao() e soltarConfete() do mascote.js.
// ==========================================

const EMOJIS_SKIN: Record<string, string> = {
  padrao: '🐾',
  alien: '👽',
  pirata: '🏴‍☠️',
  genio: '🧠',
  if: '🎓',
  jojo: '✨',
  simpson: '🍩',
  antigo: '🕰️',
  mafioso: '🕴️',
  retro: '📼',
  turma1: '1️⃣',
  turma2: '2️⃣',
  turma3: '3️⃣',
  '100': '💯',
  vestuario: '👕',
  admin: '👑',
};

export function emojiDaSkin(skinId: string): string {
  return EMOJIS_SKIN[skinId] || '💖';
}

export function criarCoracao(x: number, y: number, skinId: string): void {
  const c = document.createElement('div');
  c.textContent = emojiDaSkin(skinId);
  c.className = 'coracao-animado';
  c.style.fontSize = '1.6rem';
  c.style.left = `${x - 15}px`;
  c.style.top = `${y - 15}px`;
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 1200);
}

export function soltarConfete(qtd = 40): void {
  const cores = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#a55eea', '#ffd700'];
  for (let i = 0; i < qtd; i++) {
    setTimeout(() => {
      const confete = document.createElement('div');
      confete.className = 'confete';
      confete.style.left = `${Math.random() * 100}vw`;
      confete.style.top = '-10px';
      confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
      confete.style.transform = `rotate(${Math.random() * 360}deg)`;
      confete.style.animationDelay = `${Math.random() * 0.5}s`;
      document.body.appendChild(confete);
      setTimeout(() => confete.remove(), 3200);
    }, i * 35);
  }
}