// ==========================================
// 🎖️ TIPOS DE CARGO
// ==========================================

import type { Raridade } from '../utils/constants';

export interface Cargo {
  id: string;
  nome: string;
  icone: string;
  raridade: Raridade;
  desc?: string;
}

export interface CargoAluno {
  ativo: string | null;
  raridade?: Raridade;
  nome?: string;
  icone?: string;
  desc?: string;
  desde?: number;
}

export interface RespostaCargos {
  sucesso: boolean;
  ativoInfo?: Cargo;
  todosInfo?: Cargo[];
  desde?: number;
  cargos?: Record<string, { cargo: Cargo; total: number }>;
  totalCargos?: number;
  totalAlunos?: number;
  erro?: string;
}