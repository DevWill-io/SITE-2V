// ==========================================
// SERVICE WORKER — Portal InfoWeb 2V (React)
// ==========================================
// Versão: bump manual a cada deploy pra invalidar cache antigo
const CACHE_VERSION = 'infoweb-2v-v1';
const CACHE_SHELL = `${CACHE_VERSION}-shell`;
const CACHE_ASSETS = `${CACHE_VERSION}-assets`;

// Arquivos essenciais pra funcionar offline
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/img/2V.png',
  '/img/favicon.ico',
  '/img/icon-192.png',
  '/img/icon-512.png',
];

// ==========================================
// INSTALL — Pré-cacheia o shell
// ==========================================
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) =>
      cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[SW] Falha ao cachear alguns assets:', err);
      })
    )
  );
});

// ==========================================
// ACTIVATE — Limpa caches antigos
// ==========================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(CACHE_VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ==========================================
// FETCH — Estratégia de cache
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora métodos não-GET
  if (request.method !== 'GET') return;

  // Ignora requisições pra fora do domínio (APIs externas)
  if (url.origin !== self.location.origin) return;

  // Ignora chamadas de API (sempre online)
  if (url.pathname.startsWith('/api/')) return;

  // Ignora Hot Module Replacement do Vite em dev
  if (url.pathname.startsWith('/@') || url.pathname.startsWith('/src/')) return;

  // ==========================================
  // NAVEGAÇÃO (HTML) — Network first, fallback cache
  // ==========================================
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_SHELL).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => {
          // Offline: tenta a rota específica, depois o index.html
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // ==========================================
  // ASSETS (JS, CSS, imagens, fontes) — Cache first
  // ==========================================
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Atualiza em background sem bloquear
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              caches
                .open(CACHE_ASSETS)
                .then((cache) => cache.put(request, response.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }

      // Não tá no cache: busca e guarda
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches
            .open(CACHE_ASSETS)
            .then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// ==========================================
// SKIP WAITING (aplicar atualização imediatamente)
// ==========================================
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});