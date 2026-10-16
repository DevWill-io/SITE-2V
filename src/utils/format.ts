// ==========================================
// 🔤 FORMATAÇÃO E CÁLCULOS DE APRESENTAÇÃO
// ==========================================
// Antes espalhado em script.js + login.js.
// Agora: funções puras (sem side effects), tipadas, testáveis.
// ==========================================

import { NIVEIS, type NivelXP } from './constants';
import type { InfoNivel } from '../types/xp';

// ==========================================
// 👤 NOMES E MATRÍCULAS
// ==========================================

/**
 * "João Pedro da Silva" → "João S."
 * "Maria" → "Maria"
 * "" → "Usuário"
 *
 * Origem: script.js + login.js (duplicado).
 * Mudança: aceita null/undefined explicitamente.
 */
export function nomeParaExibicao(nome: string | null | undefined): string {
  const partes = String(nome || 'Usuário').trim().split(/\s+/);
  if (partes.length < 2) return partes[0] || 'Usuário';
  return `${partes[0]} ${partes[partes.length - 1].charAt(0)}.`;
}

/**
 * "20261101110002" → "******0002"
 * "123" → "Matrícula protegida"
 *
 * Origem: login.js.
 */
export function matriculaParaExibicao(matricula: string | null | undefined): string {
  const valor = String(matricula || '');
  if (valor.length <= 4) return 'Matrícula protegida';
  return `******${valor.slice(-4)}`;
}

/**
 * Remove @ do começo e espaços de um handle.
 * "@joao_silva" → "joao_silva"
 */
export function limparArroba(valor: string | null | undefined): string {
  return String(valor || '').trim().replace(/^@+/, '').replace(/\s+/g, '');
}

// ==========================================
// 🎮 XP E NÍVEIS
// ==========================================

/**
 * Calcula o nível a partir do XP total.
 * Origem: login.js (era a versão "que valia" — 10 níveis).
 *
 * Retorna: nível atual, XP no nível, XP para o próximo, progresso %.
 * Se atingiu o nível máximo, progresso = 100 e proximoNome = null.
 */
export function calcularNivel(xp: number | null | undefined): InfoNivel {
  const xpTotal = Number(xp) || 0;

  let nivelAtual: NivelXP = NIVEIS[0];
  for (let i = 0; i < NIVEIS.length; i++) {
    if (xpTotal >= NIVEIS[i].xp) nivelAtual = NIVEIS[i];
    else break;
  }

  const proximo = NIVEIS.find((n) => n.nivel === nivelAtual.nivel + 1) || null;
  const xpProximo = proximo ? proximo.xp : nivelAtual.xp;
  const xpAtual = nivelAtual.xp;
  const progresso = proximo
    ? Math.round(((xpTotal - xpAtual) / (xpProximo - xpAtual)) * 100)
    : 100;

  return {
    nivel: nivelAtual.nivel,
    nome: nivelAtual.nome,
    xpAtual,
    xpProximo,
    progresso,
    proximoNome: proximo ? proximo.nome : null,
  };
}

// ==========================================
// 📅 DATAS
// ==========================================

/**
 * Retorna hoje no formato "YYYY-MM-DD" (UTC).
 * Origem: script.js + login.js (duplicado).
 */
export function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Formata uma data em pt-BR no fuso de Fortaleza.
 *
 * Aceita:
 *   - "2026-09-15"          (all-day)
 *   - "2026-09-15T13:00:00" (ISO com hora)
 *
 * Retorna:
 *   - "15 de setembro de 2026"
 *   - "15 de setembro de 2026" (idêntico, mas com timezone correto)
 *
 * Origem: login.js.
 */
export function formatarDataPtBR(dataStr: string | null | undefined): string {
  if (!dataStr) return '';

  // All-day: "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
    const [ano, mes, dia] = dataStr.split('-');
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
    ];
    return `${dia} de ${meses[parseInt(mes, 10) - 1]} de ${ano}`;
  }

  // ISO com hora
  return new Date(dataStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Fortaleza',
  });
}

/**
 * Diferença em dias de calendário entre hoje e uma data,
 * considerando o fuso America/Fortaleza.
 *
 * 0 = hoje, 1 = amanhã, -1 = ontem.
 *
 * Origem: login.js.
 */
export function calcularDiasCalendario(dataEventoISO: string | null | undefined): number {
  if (!dataEventoISO) return 0;

  const hojeStr = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Fortaleza',
  });

  let eventoStr: string;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataEventoISO)) {
    eventoStr = dataEventoISO;
  } else {
    eventoStr = new Date(dataEventoISO).toLocaleDateString('en-CA', {
      timeZone: 'America/Fortaleza',
    });
  }

  const hoje = new Date(`${hojeStr}T12:00:00Z`);
  const evento = new Date(`${eventoStr}T12:00:00Z`);
  return Math.round((evento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

// ==========================================
// ⏱️ DURAÇÃO DE RECADOS
// ==========================================

/**
 * Converte "7d" | "5h" | "3" | "1d" em horas totais.
 *
 * Origem: login.js.
 * Regras (mantidas):
 *   - Vazio → 7 dias (168h)
 *   - Sem sufixo → interpreta como dias
 *   - Mínimo 1h, máximo 360h (15 dias)
 */
export function parseDuracaoParaHoras(valor: string | number | null | undefined): number {
  if (!valor) return 24 * 7;

  const str = String(valor).trim().toLowerCase();
  let horas = 0;

  if (str.endsWith('h')) horas = parseFloat(str.replace('h', ''));
  else if (str.endsWith('d')) horas = parseFloat(str.replace('d', '')) * 24;
  else horas = parseFloat(str) * 24;

  if (isNaN(horas) || horas <= 0) horas = 24 * 7;
  if (horas < 1) horas = 1;
  if (horas > 360) horas = 360;

  return Math.round(horas);
}

/**
 * Texto amigável de quanto tempo falta para um recado expirar.
 * "Expira em 3 dias" / "Expira amanhã" / "Expira em 5h" / "Expirado"
 *
 * Origem: login.js.
 */
export function calcularTempoRestante(
  timestampCriacao: number,
  duracaoHoras: number
): string {
  const agora = Date.now();
  const tempoLimite = timestampCriacao + duracaoHoras * 60 * 60 * 1000;
  const msRestantes = tempoLimite - agora;

  if (msRestantes <= 0) return 'Expirado';

  const horasRestantes = Math.floor(msRestantes / (1000 * 60 * 60));
  const diasRestantes = Math.floor(horasRestantes / 24);

  if (diasRestantes > 1) return `Expira em ${diasRestantes} dias`;
  if (diasRestantes === 1) return 'Expira amanhã';
  if (horasRestantes > 0) return `Expira em ${horasRestantes}h`;
  return `Expira em ${Math.floor(msRestantes / (1000 * 60))} min`;
}

// ==========================================
// 📊 NOTAS
// ==========================================

/**
 * "8,5" | "8.5" | 8.5 → 8.5
 * null | "" | "abc" → null
 *
 * Origem: login.js.
 */
export function formatarNota(valor: number | string | null | undefined): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const nota = Number(String(valor).replace(',', '.'));
  return Number.isFinite(nota) ? nota : null;
}

/**
 * 8.5 → "8.5" / null → "-"
 *
 * Origem: login.js.
 */
export function textoNota(valor: number | null | undefined): string {
  return valor === null || valor === undefined ? '-' : valor.toFixed(1);
}

// ==========================================
// 🔢 NÚMEROS
// ==========================================

/**
 * Formata um número em pt-BR com separador de milhar.
 * 1234 → "1.234"
 */
export function formatarNumero(valor: number | null | undefined): string {
  return (Number(valor) || 0).toLocaleString('pt-BR');
}

/**
 * Arredonda para N casas decimais e retorna como número.
 * Usado em médias.
 */
export function arredondar(valor: number, casas = 1): number {
  const fator = Math.pow(10, casas);
  return Math.round(valor * fator) / fator;
}