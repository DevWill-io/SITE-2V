// ==========================================
// 💬 TIPOS DE MURAL / RECADOS
// ==========================================

export interface Comentario {
  cId: string;
  autor_nome: string;
  autor_matricula: string;
  texto: string;
  timestamp: number;
}

export interface Recado {
  id: string;
  autor_nome: string;
  autor_matricula: string;
  mensagem: string;
  link_anexo?: string;
  likes?: string[];
  timestamp: number;
  duracao_horas?: number;
  duracao_dias?: number;
  editado?: boolean;
  comentarios?: Record<string, Omit<Comentario, 'cId'>>;
}

/**
 * Versão processada do recado (com campos calculados).
 * Usada na UI.
 */
export interface RecadoProcessado extends Recado {
  timestampCriacao: number;
  duracaoHoras: number;
}