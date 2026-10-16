// ==========================================
// 🔥 FIREBASE — inicialização via NPM
// ==========================================
// Antes: cada arquivo (login.js, xp-core.js, mascote.js) importava do CDN
//        https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js
//        com nomes de app diferentes ("loginApp", "mascoteApp").
//
// Agora: uma instância única via NPM. O Vite faz tree-shaking e
//        o bundle fica muito menor.
//
// ⚠️ As chaves vêm do .env.local (VITE_FIREBASE_*).
//     Elas NÃO são secretas — são públicas por design do Firebase.
// ==========================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

// ==========================================
// CONFIG (lida do .env)
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ==========================================
// VALIDAÇÃO (avisa cedo se esqueceu .env)
// ==========================================
function validarConfig(): void {
  const faltando = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (faltando.length > 0) {
    console.error(
      '[firebase] Variáveis de ambiente faltando:',
      faltando,
      '\nCrie o .env.local na raiz com os valores do .env.example'
    );
  }
}
validarConfig();

// ==========================================
// APP SINGLETON
// ==========================================
// getApps() evita "Firebase App named '[DEFAULT]' already exists" em HMR.
const app: FirebaseApp =
  getApps().find((a) => a.name === '[DEFAULT]') || initializeApp(firebaseConfig);

export const db: Database = getDatabase(app);

// ==========================================
// RE-EXPORTS
// ==========================================
// Centraliza os imports do Firebase aqui. Componentes importam
// `ref`, `onValue`, etc. deste módulo — não do `firebase/database`
// direto. Isso facilita trocar de backend no futuro (ex: Firestore).
// ==========================================
export {
  ref,
  get,
  set,
  update,
  push,
  remove,
  onValue,
  runTransaction,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database';