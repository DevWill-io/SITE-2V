// ==========================================
// 📅 TIPOS DO GOOGLE CALENDAR
// ==========================================

export interface EventoGCal {
  id: string;
  title: string;
  start: Date | string;
  startStr?: string;
  url?: string;
}

export interface CoresGCalCache {
  [eventoId: string]: string; // "#hex"
}

export interface ContagemEvento {
  titulo: string;
  data: Date;
  dataStr: string;
  diasRestantes: number;
}