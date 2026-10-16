// ==========================================
// 🗺️ MAPA DE ROTAS
// ==========================================
// Fonte única das URLs. Nunca escreva rota na mão.
// ==========================================

export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  TUTORIAL: '/tutorial',

  // Painel (logado)
  PAINEL: '/painel',
  PAINEL_NOTAS: '/painel/notas',
  PAINEL_HORARIOS: '/painel/horarios',
  PAINEL_MURAL: '/painel/mural',
  PAINEL_MEMBROS: '/painel/membros',
  PAINEL_AGENDA: '/painel/agenda',

  // Perfil público
  PERFIL: '/perfil/:matricula',
  perfil: (matricula: string) => `/perfil/${matricula}`,

  // Admin
  ADMIN_SALA: '/admin/sala',
} as const;