// ==========================================
// 🔧 REGISTRO DO SERVICE WORKER
// ==========================================
// Registra o /sw.js manualmente. Sem plugin, sem terser.
// Em dev, NÃO registra (evita conflito com HMR do Vite).
// ==========================================

export function registrarServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  // Só em produção (evita conflito com Vite HMR)
  if (import.meta.env.DEV) {
    console.log('[SW] Modo dev — service worker não registrado');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registrado:', registration.scope);

        // Verifica atualizações a cada 30min
        setInterval(() => registration.update(), 30 * 60 * 1000);
      })
      .catch((err) => {
        console.warn('[SW] Erro ao registrar:', err);
      });
  });
}