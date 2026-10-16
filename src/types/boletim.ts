// ==========================================
// 📚 TIPOS DE BOLETIM / NOTAS
// ==========================================

export type StatusDisciplina = 'aprovado' | 'recuperacao' | 'reprovado';
export type TipoDisciplina = 'Semestral' | 'Anual';

export interface NotaEtapa {
  nota: number | string | null;
}

export interface Disciplina {
  codigo_diario?: string;
  disciplina?: string;
  id?: string;
  media_disciplina?: number | string | null;
  numero_faltas?: number | string | null;
  segundo_semestre?: boolean;
  nota_etapa_1?: number | NotaEtapa | null;
  nota_etapa_2?: number | NotaEtapa | null;
  nota_etapa_3?: number | NotaEtapa | null;
  nota_etapa_4?: number | NotaEtapa | null;
}

export interface ConfiguracaoEtapas {
  tipo: TipoDisciplina;
  etapas: number[];
}

export interface ResultadoMedia {
  media: number | null;
  preenchidasReais: number;
  preenchidasComSim: number;
  somaReal: number;
  somaComSim: number;
  temEtapaAberta: boolean;
  simulando: boolean;
}

export interface ProjecaoDisciplina {
  texto: string;
  classe: 'projecao-ok' | 'projecao-alerta' | 'projecao-ruim';
}

export interface HistoricoPeriodo {
  periodo: string;
  media: number | null;
  disciplinas: number;
  ano: string;
}

export interface PeriodoLetivo {
  ano_letivo: number;
  periodo_letivo: number;
}

export interface RespostaBoletim {
  count?: number;
  results: Disciplina[];
}

export interface ResumoBoletim {
  mediaGeral: number | null;
  faltasTotais: number;
  disciplinasCount: number;
  periodo: string;
}