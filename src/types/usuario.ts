// ==========================================
// 👤 TIPOS DE USUÁRIO
// ==========================================

export interface UsuarioLogado {
  nome: string;
  matricula: string;
  foto: string;
  fotoOriginal: string;
}

export interface DadosSuap {
  nome: string;
  nome_usual?: string;
  matricula?: string;
  siape?: string;
  url_foto_150x200?: string;
  url_foto_75x100?: string;
  foto?: string;
  email?: string;
  [key: string]: unknown;
}

export interface PerfilAluno {
  id: string;
  matricula: string;
  nome: string;
  nomeCompleto?: string;
  foto: string;
  bio?: string;
  redes?: RedesSociais;
  mascoteAvatar?: string;
  conquistasVisiveis?: ConquistasVisiveisPayload | null;
  ultimoAcesso?: number;
  perfilEditadoEm?: number;
}

export interface RedesSociais {
  tiktok?: string;
  instagram?: string;
  github?: string;
  email?: string;
  site?: string;
}

/**
 * Formato do campo conquistasVisiveis no Firebase.
 * - null: mostra todas
 * - { mostraTodas: false }: não mostra nenhuma
 * - { mostraTodas: false, ativos: { id: true } }: mostra só os ativos
 */
export interface ConquistasVisiveisPayload {
  mostraTodas: boolean;
  ativos?: Record<string, true>;
}