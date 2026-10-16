// ==========================================
// 🐾 TIPOS DO MASCOTE
// ==========================================

export interface EntradaRanking {
  matricula: string;
  carinhos: number;
}

export interface ItemRankingRenderizado extends EntradaRanking {
  posicao: number;
  nome: string;
  foto: string;
  ehEu: boolean;
  medalha: string;
}

export type TipoSomMascote = 'carinho' | 'marco' | 'limite' | 'desbloqueio';

export interface MascoteEstado {
  carinhosGlobais: number;
  meusCarinhos: number;
  avatarAtual: string;
  somLigado: boolean;
  atingiuLimite: boolean;
}