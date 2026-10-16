// ==========================================
// 🎮 TIPOS DE XP, NÍVEIS, CONQUISTAS
// ==========================================

import type { NivelXP, Conquista, Raridade } from '../utils/constants';

export type { NivelXP, Conquista, Raridade };

export interface InfoNivel {
  nivel: number;
  nome: string;
  xpAtual: number;
  xpProximo: number;
  progresso: number;
  proximoNome: string | null;
}

export interface DadosXP {
  xp: number;
  cliquesMascote: number;
  streak: number;
  ultimaVisita?: string;
  conquistas?: Record<string, { desbloqueadaEm: number }>;
  contadores?: Contadores;
  migracaoLocal?: {
    concluidaEm: number;
    xpLocal: number;
    xpFB: number;
    cliquesLocal: number;
    cliquesFB: number;
  };
}

export interface Contadores {
  recados: number;
  curtidas: number;
  simulador: number;
  periodos: number;
}

export type NomeContador = keyof Contadores;

export interface EstadoXP {
  matricula: string | null;
  ehAnonimo: boolean;
  xp: number;
  cliquesMascote: number;
  streak: number;
  ultimaVisita: string;
  skinAtiva: string;
  conquistas: Record<string, { desbloqueadaEm: number }>;
  contadores: Contadores;
  pronto: boolean;
  migrado: boolean;
}