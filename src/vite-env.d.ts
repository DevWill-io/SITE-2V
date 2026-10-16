/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;

  // Admin
  readonly VITE_MATRICULA_ADMIN: string;
  readonly VITE_MATRICULAS_ADMIN: string;

  // SUAP
  readonly VITE_SUAP_URL: string;
  readonly VITE_SUAP_CLIENT_ID: string;
  readonly VITE_SUAP_REDIRECT_URI: string;
  readonly VITE_SUAP_SCOPE: string;

  // APIs externas
  readonly VITE_GCAL_API_KEY: string;
  readonly VITE_GCAL_CALENDAR_ID: string;
  readonly VITE_GITHUB_USERNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}