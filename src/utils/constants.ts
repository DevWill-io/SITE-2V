// ==========================================
// 🎯 CONSTANTES GLOBAIS DO SITE
// ==========================================
// Antes: espalhadas em script.js, login.js, mascote.js,
//        com duplicação perigosa (NIVEIS e NIVEIS_XP eram diferentes!)
// Agora: fonte única da verdade.
// ==========================================

// ==========================================
// 👑 ADMIN
// ==========================================
// Lê do .env (não vai pro Git).
// ⚠️ Isso NÃO é segurança — é só pra esconder UI.
// O backend /api/* é a autoridade real.
const _adminB64 = import.meta.env.VITE_MATRICULA_ADMIN;
const _adminsB64 = import.meta.env.VITE_MATRICULAS_ADMIN;

/**
 * Matrícula do admin principal.
 * Fonte: variável de ambiente VITE_MATRICULA_ADMIN.
 */
export const MATRICULA_ADMIN = _adminB64 || '';

/**
 * Lista de todas as matrículas admin.
 * Hoje só tem uma, mas o campo já está preparado pra crescer.
 */
export const MATRICULAS_ADMIN: readonly string[] = _adminsB64
  ? _adminsB64.split(',').map((s) => s.trim()).filter(Boolean)
  : [MATRICULA_ADMIN].filter(Boolean);

/**
 * Verifica se uma matrícula pertence ao admin.
 * Usado só pra UI (esconder botões, mostrar badge, etc).
 * ⚠️ Nunca use isso pra autorizar ação crítica no front.
 */
export function ehAdmin(matricula: string | null | undefined): boolean {
  if (!matricula) return false;
  return MATRICULAS_ADMIN.includes(matricula);
}

// ==========================================
// 🎮 XP — NÍVEIS
// ==========================================
// ⚠️ Antes existiam DUAS listas conflitantes:
//    - window.NIVEIS_XP (script.js)  → 8 níveis, até 12000 XP
//    - const NIVEIS (login.js)       → 10 níveis, até 5000 XP
// O que valia era login.js (o xp-core.js chamava calcularNivel do login).
// Agora: uma lista só. Se você quiser ajustar, mexe aqui.
// ==========================================

export interface NivelXP {
  nivel: number;
  xp: number;
  nome: string;
}

export const NIVEIS: readonly NivelXP[] = [
  { nivel: 1,  xp: 0,    nome: 'Novato' },
  { nivel: 2,  xp: 100,  nome: 'Curioso' },
  { nivel: 3,  xp: 300,  nome: 'Aprendiz' },
  { nivel: 4,  xp: 600,  nome: 'Dev Júnior' },
  { nivel: 5,  xp: 1000, nome: 'Dev Pleno' },
  { nivel: 6,  xp: 1500, nome: 'Dev Sênior' },
  { nivel: 7,  xp: 2200, nome: 'Tech Lead' },
  { nivel: 8,  xp: 3000, nome: 'Arquiteto' },
  { nivel: 9,  xp: 4000, nome: 'CTO' },
  { nivel: 10, xp: 5000, nome: 'Lenda' },
] as const;

// ==========================================
// 🎁 XP — RECOMPENSAS
// ==========================================
export const XP_RECOMPENSAS = {
  recado_postado: 10,
  comentario: 3,
  curtida: 1,
  trocar_avatar: 5,
  simulador: 2,
  ver_boletim: 5,
  definir_meta: 5,
  conquista: 10,
  login_diario: 5,
  clique_mascote: 1,
} as const;

// ==========================================
// 🏆 CONQUISTAS
// ==========================================
export type Raridade = 'comum' | 'raro' | 'epico' | 'lendario';

export type TipoConquista =
  | 'cliques'
  | 'nivel'
  | 'streak'
  | 'manual'
  | 'recados'
  | 'curtidas'
  | 'simulador'
  | 'metas'
  | 'periodos';

export interface Conquista {
  id: string;
  icone: string;
  emoji: string;
  nome: string;
  desc: string;
  raridade: Raridade;
  tipo: TipoConquista;
  meta: number;
}

export const CONQUISTAS: readonly Conquista[] = [
  { id: 'primeiro_carinho',  icone: 'fa-solid fa-hand-pointer',         emoji: '🎯', nome: 'Primeiro Carinho',  desc: 'Deu seu primeiro carinho no mascote', raridade: 'comum',    tipo: 'cliques',  meta: 1 },
  { id: 'cliques_100',       icone: 'fa-solid fa-hand',                 emoji: '👋', nome: '100 Carinhos',      desc: 'Deu 100 carinhos no mascote',         raridade: 'comum',    tipo: 'cliques',  meta: 100 },
  { id: 'cliques_250',       icone: 'fa-solid fa-hands-clapping',       emoji: '👏', nome: '250 Carinhos',      desc: 'Deu 250 carinhos no mascote',         raridade: 'comum',    tipo: 'cliques',  meta: 250 },
  { id: 'carinhoso',         icone: 'fa-solid fa-heart',                emoji: '❤️', nome: 'Carinhoso',         desc: 'Deu 500 carinhos no mascote',         raridade: 'raro',     tipo: 'cliques',  meta: 500 },
  { id: 'cliques_1000',      icone: 'fa-solid fa-heart-circle-plus',    emoji: '💗', nome: '1000 Carinhos',     desc: 'Deu 1000 carinhos no mascote',        raridade: 'raro',     tipo: 'cliques',  meta: 1000 },
  { id: 'simpson_unlocked',  icone: 'fa-solid fa-cookie-bite',          emoji: '🍩', nome: 'Simpson Chegou',    desc: 'Desbloqueou a skin do Simpson',       raridade: 'epico',    tipo: 'cliques',  meta: 1500 },
  { id: 'cliques_2500',      icone: 'fa-solid fa-fire-flame-curved',    emoji: '🔥', nome: '2500 Carinhos',     desc: 'Deu 2500 carinhos no mascote',        raridade: 'epico',    tipo: 'cliques',  meta: 2500 },
  { id: 'mafioso_unlocked',  icone: 'fa-solid fa-user-tie',             emoji: '🕴️', nome: 'Mafioso no Pedaço', desc: 'Desbloqueou a skin Mafioso',          raridade: 'lendario', tipo: 'cliques',  meta: 3000 },
  { id: 'cliques_5000',      icone: 'fa-solid fa-crown',                emoji: '👑', nome: '5000 Carinhos',     desc: 'Deu 5000 carinhos no mascote',        raridade: 'lendario', tipo: 'cliques',  meta: 5000 },
  { id: 'cliques_10000',     icone: 'fa-solid fa-gem',                  emoji: '💎', nome: '10000 Carinhos',    desc: 'Deu 10000 carinhos no mascote',       raridade: 'lendario', tipo: 'cliques',  meta: 10000 },
  { id: 'nivel_5',           icone: 'fa-solid fa-star-half-stroke',     emoji: '⭐', nome: 'Dev Pleno',         desc: 'Alcançou o nível 5',                  raridade: 'raro',     tipo: 'nivel',    meta: 5 },
  { id: 'nivel_10',          icone: 'fa-solid fa-star',                 emoji: '🌟', nome: 'Lenda Viva',        desc: 'Alcançou o nível 10',                 raridade: 'lendario', tipo: 'nivel',    meta: 10 },
  { id: 'streak_7',          icone: 'fa-solid fa-fire',                 emoji: '🔥', nome: 'Streak 7',          desc: 'Logou 7 dias seguidos',               raridade: 'raro',     tipo: 'streak',   meta: 7 },
  { id: 'streak_30',         icone: 'fa-solid fa-star',                 emoji: '⭐', nome: 'Streak 30',         desc: 'Logou 30 dias seguidos',              raridade: 'lendario', tipo: 'streak',   meta: 30 },
  { id: 'nota_100',          icone: 'fa-solid fa-graduation-cap',       emoji: '🎓', nome: 'Nota 100',          desc: 'Tirou 100 em alguma matéria',         raridade: 'raro',     tipo: 'manual',   meta: 1 },
  { id: 'nota_maxima',       icone: 'fa-solid fa-trophy',               emoji: '🏆', nome: 'Nota Máxima',       desc: 'Média geral ≥ 90',                    raridade: 'epico',    tipo: 'manual',   meta: 1 },
  { id: 'estiloso',          icone: 'fa-solid fa-palette',              emoji: '🎨', nome: 'Estiloso',          desc: 'Mudou o avatar do mascote',           raridade: 'comum',    tipo: 'manual',   meta: 1 },
  { id: 'comunicador',       icone: 'fa-solid fa-comments',             emoji: '💬', nome: 'Comunicador',       desc: 'Postou 10 recados no mural',          raridade: 'comum',    tipo: 'recados',  meta: 10 },
  { id: 'social',            icone: 'fa-solid fa-share-nodes',          emoji: '🔗', nome: 'Sociável',          desc: 'Curtiu 20 recados',                   raridade: 'comum',    tipo: 'curtidas', meta: 20 },
  { id: 'cientista',         icone: 'fa-solid fa-flask',                emoji: '🧪', nome: 'Cientista',         desc: 'Usou o simulador 10 vezes',           raridade: 'comum',    tipo: 'simulador',meta: 10 },
  { id: 'metódico',          icone: 'fa-solid fa-bullseye',             emoji: '🎯', nome: 'Metódico',          desc: 'Definiu 5 metas individuais',         raridade: 'raro',     tipo: 'metas',    meta: 5 },
  { id: 'explorador',        icone: 'fa-solid fa-compass',              emoji: '🧭', nome: 'Explorador',        desc: 'Consultou 3 períodos diferentes',     raridade: 'raro',     tipo: 'periodos', meta: 3 },
  { id: 'nerd',              icone: 'fa-solid fa-graduation-cap',       emoji: '🎓', nome: 'Nerd',              desc: 'Tirou nota 100 em alguma matéria',    raridade: 'epico',    tipo: 'manual',   meta: 1 },
  { id: 'vestuario',         icone: 'fa-solid fa-shirt',                emoji: '👕', nome: 'Vestuário?',        desc: 'Desbloqueou skins IF + Turmas',       raridade: 'lendario', tipo: 'cliques',  meta: 10000 },
] as const;

// ==========================================
// 🎭 SKINS DO MASCOTE
// ==========================================
export interface SkinMascote {
  id: string;
  nome: string;
  arquivo: string;
  emoji: string;
  gratis: boolean;
  tipo?: 'cliques' | 'conquista';
  cliquesNecessarios?: number;
  conquistaNecessaria?: string;
  apenasAdmin?: boolean;
}

export const AVATARES_MASCOTE: readonly SkinMascote[] = [
  // Gratuitas
  { id: 'padrao',  nome: 'Padrão',  arquivo: '/img/MascotePadrao.png',  emoji: '🐾', gratis: true },
  { id: 'alien',   nome: 'Alien',   arquivo: '/img/MascoteAlien.png',   emoji: '👽', gratis: true },
  { id: 'pirata',  nome: 'Pirata',  arquivo: '/img/MascotePirata.png',  emoji: '🏴‍☠️', gratis: true },
  { id: 'genio',   nome: 'Gênio',   arquivo: '/img/MascoteGenio.png',   emoji: '🧞', gratis: true },

  // Por cliques
  { id: 'if',       nome: 'IF',       arquivo: '/img/MascoteIf.png',       emoji: '🎓', gratis: false, tipo: 'cliques', cliquesNecessarios: 500 },
  { id: 'jojo',     nome: 'Jojo',     arquivo: '/img/MascoteJojo.png',     emoji: '✨', gratis: false, tipo: 'cliques', cliquesNecessarios: 1000 },
  { id: 'simpson',  nome: 'Simpson',  arquivo: '/img/MascoteSimpson.png',  emoji: '🍩', gratis: false, tipo: 'cliques', cliquesNecessarios: 1500 },
  { id: 'antigo',   nome: 'Antigo',   arquivo: '/img/MascoteAntigo.png',   emoji: '🕰️', gratis: false, tipo: 'cliques', cliquesNecessarios: 2000 },
  { id: 'mafioso',  nome: 'Mafioso',  arquivo: '/img/MascoteMafioso.png',  emoji: '🕴️', gratis: false, tipo: 'cliques', cliquesNecessarios: 2500 },
  { id: 'retro',    nome: 'Retro',    arquivo: '/img/MascoteRetro.png',    emoji: '📼', gratis: false, tipo: 'cliques', cliquesNecessarios: 3000 },
  { id: 'turma1',   nome: 'Turma 1',  arquivo: '/img/MascoteTurma1.png',   emoji: '1️⃣', gratis: false, tipo: 'cliques', cliquesNecessarios: 4000 },
  { id: 'turma2',   nome: 'Turma 2',  arquivo: '/img/MascoteTurma2.png',   emoji: '2️⃣', gratis: false, tipo: 'cliques', cliquesNecessarios: 5000 },
  { id: 'turma3',   nome: 'Turma 3',  arquivo: '/img/MascoteTurma3.png',   emoji: '3️⃣', gratis: false, tipo: 'cliques', cliquesNecessarios: 10000 },

  // Por conquista
  { id: '100',       nome: '100',        arquivo: '/img/Mascote100.png',       emoji: '💯', gratis: false, tipo: 'conquista', conquistaNecessaria: 'nerd' },
  { id: 'vestuario', nome: 'Vestuário?', arquivo: '/img/MascoteVestuario.png', emoji: '👕', gratis: false, tipo: 'conquista', conquistaNecessaria: 'vestuario' },

  // Exclusiva admin
  { id: 'admin', nome: 'Admin', arquivo: '/img/MascoteAdmin.png', emoji: '👑', gratis: false, apenasAdmin: true },
] as const;

// ==========================================
// 🎨 TEMAS
// ==========================================
export const TEMAS_DISPONIVEIS = ['roxo', 'azul', 'verde', 'rosa', 'laranja'] as const;
export type TemaCor = (typeof TEMAS_DISPONIVEIS)[number];
export const TEMA_PADRAO: TemaCor = 'roxo';

export const CORES_TEMA: Record<TemaCor, string> = {
  roxo: '#8b5edd',
  azul: '#3b82f6',
  verde: '#10b981',
  rosa: '#ec4899',
  laranja: '#f97316',
};

// ==========================================
// 🌐 IDIOMAS
// ==========================================
export const IDIOMAS_SUPORTADOS = ['pt-BR', 'en', 'es'] as const;
export type Idioma = (typeof IDIOMAS_SUPORTADOS)[number];
export const IDIOMA_PADRAO: Idioma = 'pt-BR';

// ==========================================
// 🐾 MASCOTE
// ==========================================
export const LIMITE_CARINHOS = 1_000_000;
export const COOLDOWN_CARINHO_MS = 350;

export const MARCOS_MASCOTE = [
  { valor: 100,     icone: '🥉', texto: '100' },
  { valor: 1000,    icone: '🥈', texto: '1k' },
  { valor: 10000,   icone: '🥇', texto: '10k' },
  { valor: 100000,  icone: '💎', texto: '100k' },
  { valor: 500000,  icone: '🌟', texto: '500k' },
  { valor: 1000000, icone: '👑', texto: '1M' },
] as const;

// ==========================================
// 📚 CALENDÁRIO — Matérias com cores fixas
// ==========================================
export const MATERIAS_CALENDARIO = [
  { nome: 'Matemática', cor: '#D50000' },
  { nome: 'Geografia',  cor: '#F6BF26' },
  { nome: 'Química',    cor: '#0B8043' },
  { nome: 'Português',  cor: '#3F51B5' },
  { nome: 'Autoria',    cor: '#8E24AA' },
  { nome: 'Sociologia', cor: '#E67C73' },
] as const;

export const COR_PADRAO_CALENDARIO = '#8b5edd';
export const COR_QUIMICA = '#0B8043';

// ==========================================
// 📊 BOLETIM
// ==========================================
export const LIMITE_FALTAS_PCT = 0.25;       // 25% = reprovação por falta
export const LIMITE_FALTAS_ALERTA = 0.2;     // 20% = alerta
export const CARGA_HORARIA_PADRAO = 60;
export const META_PADRAO = 60;

// ==========================================
// 🛡️ RATE LIMITS (client-side)
// ==========================================
// A proteção REAL é server-side.
// Isso aqui é só pra UX (não martelar a API e economizar banda).
export const RATE_LIMITS = {
  xp:         { max: 200, janela: 60_000 },
  cliques:    { max: 60,  janela: 1_000 },
  contadores: { max: 30,  janela: 60_000 },
  conquistas: { max: 10,  janela: 60_000 },
} as const;

export const TETOS_POR_CHAMADA = {
  xp: 500,
  cliques: 10,
  contadores: 5,
} as const;

// ==========================================
// 🔗 APIs EXTERNAS
// ==========================================
export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'infoWeb2026-2V';
export const GCAL_API_KEY = import.meta.env.VITE_GCAL_API_KEY || '';
export const GCAL_CALENDAR_ID = import.meta.env.VITE_GCAL_CALENDAR_ID || '';