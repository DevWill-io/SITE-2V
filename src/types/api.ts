// ==========================================
// 🔌 TIPOS DE API
// ==========================================
// Padrão de resposta de TODOS os endpoints /api/*.
// Antes era `dados.erro || 'Erro'` — agora tipado.
// ==========================================

export interface RespostaAPI<T = unknown> {
  sucesso?: boolean;
  erro?: string;
  dados?: T;
  [key: string]: unknown;
}

export interface RespostaXPAdd {
  sucesso: boolean;
  xp: number;
}

export interface RespostaContador {
  sucesso: boolean;
  total: number;
}

export interface RespostaAcessoDiario {
  sucesso: boolean;
  streak: number;
  novo: boolean;
  bonusXP: number;
}

export interface RespostaConquista {
  sucesso: boolean;
  desbloqueada: boolean;
  jaTinha?: boolean;
  desbloqueadaEm?: number;
}

export interface RespostaCarinho {
  sucesso: boolean;
  totalGlobal: number;
  meusCarinhos: number;
}

export interface RespostaMural {
  sucesso: boolean;
  curtiu?: boolean;
  [key: string]: unknown;
}