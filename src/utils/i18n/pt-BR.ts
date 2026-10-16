// ==========================================
// 🌐 DICIONÁRIO PORTUGUÊS (BASE)
// ==========================================
// Este é o dicionário "fonte". As chaves dele viram o tipo `ChaveI18n`.
// Se você adicionar uma chave aqui, o TypeScript vai EXIGIR que EN e ES
// também tenham essa chave.
//
// Origem: união de TRADUCOES (script.js) + TRADUCOES_LOGIN (login.js).
// Duplicatas removidas: nav_inicio (aparecia 2x).
// ==========================================

export const ptBR = {
  // ==========================================
  // 📄 TÍTULOS DE PÁGINA
  // ==========================================
  titulo_pagina: 'Turma 2V | 1º Ano Informática IFRN',
  titulo_pagina_login: 'Login SUAP | Turma 2V IFRN',

  // ==========================================
  // 🧭 NAVEGAÇÃO / MENU LATERAL
  // ==========================================
  menu: 'Menu',
  nav_inicio: 'Início',
  nav_inicio_desc: 'Voltar ao topo',
  nav_inicio_desc_login: 'Página inicial',
  nav_curso: 'O Curso',
  nav_curso_desc: 'Sobre a formação',
  nav_numeros: 'Números',
  nav_numeros_desc: 'A turma em dados',
  nav_lideres: 'Líderes',
  nav_lideres_desc: 'Quem representa',
  nav_coord: 'Coordenadores',
  nav_coord_desc: 'Equipes e projetos',
  nav_horarios: 'Horários',
  nav_horarios_desc: 'Rotina semanal',
  nav_galeria: 'Galeria',
  nav_galeria_desc: 'Nossos momentos',
  nav_projetos: 'Projetos',
  nav_projetos_desc: 'O que construímos',
  nav_suap_desc: 'Portal acadêmico',
  nav_contato: 'Contato',
  nav_contato_desc: 'Fale com a turma',
  nav_mascote: 'Mascote',
  nav_mascote_desc: 'Interaja com ele',
  nav_notas: 'Notas',
  nav_notas_desc: 'Sua calculadora',
  nav_mural: 'Mural',
  nav_mural_desc: 'Recados da turma',
  nav_membros: 'Membros',
  nav_membros_desc: 'Colegas do sistema',
  nav_agenda: 'Agenda',
  nav_agenda_desc: 'Eventos do calendário',
  nav_sala: 'Sala dos Professores',
  nav_sala_desc: 'Acesso restrito',

  // ==========================================
  // 🎨 AÇÕES DE TEMA / IDIOMA
  // ==========================================
  idioma: 'Idioma',
  tema: 'Tema',
  cor_tema: 'Cor do tema',
  modo: 'Modo',
  cor_roxo: 'Roxo',
  cor_azul: 'Azul',
  cor_verde: 'Verde',
  cor_rosa: 'Rosa',
  cor_laranja: 'Laranja',
  modo_claro: 'Claro',
  modo_escuro: 'Escuro',
  instalar_app: 'Instalar app',

  // ==========================================
  // 🚀 HERO
  // ==========================================
  hero_badge: 'IFRN Campus Caicó',
  hero_titulo_1: 'A Turma do',
  hero_titulo_2: 'Futuro',
  hero_typing_1: '1º Ano de',
  hero_btn_curso: 'Conheça o Curso',
  hero_btn_suap: 'Acessar SUAP',

  // ==========================================
  // 📚 CURSO
  // ==========================================
  curso_titulo_1: 'Sobre o',
  curso_titulo_2: 'Curso',
  curso_sub: 'Informática para Internet no IFRN Caicó',
  curso_card1_t: 'O que é?',
  curso_card1_p:
    'O curso técnico integrado prepara os alunos para o desenvolvimento de sistemas web, unindo o ensino médio à formação profissional tecnológica de excelência oferecida pelo IFRN.',
  curso_card2_t: 'O que aprendemos?',
  curso_card2_p:
    'Dominamos a criação de interfaces (Front-end), regras de negócio (Back-end), modelagem de banco de dados, design de interação (UI/UX) e redes de computadores.',
  curso_card3_t: 'Nosso Perfil',
  curso_card3_p:
    'Formamos profissionais capazes de atuar em agências de tecnologia, startups e grandes empresas, sempre focados em resolver problemas reais através do raciocínio lógico e da inovação.',

  // ==========================================
  // 📊 ESTATÍSTICAS
  // ==========================================
  stats_titulo_1: 'Nossos',
  stats_titulo_2: 'Números',
  stats_sub: 'A turma 2V em dados',
  stats_alunos: 'Quantos Alunos?',
  stats_linhas: 'Linhas de Código',

  // ==========================================
  // 👑 LÍDERES
  // ==========================================
  lideres_titulo_1: 'Nossos',
  lideres_titulo_2: 'Líderes',
  lideres_sub: 'Quem representa a turma?',
  lider_lider: 'Líder de sala',
  lider_vice: 'Vice-líder',

  // ==========================================
  // 🎓 COORDENADORES
  // ==========================================
  coord_titulo_1: 'Nossos',
  coord_titulo_2: 'Coordenadores',
  coord_sub: 'A equipe que organiza e inspira',
  coord_midia: 'Coordenador de Mídia',
  coord_design: 'Coordenador de Design',
  coord_html_css: 'Coordenadores de html e css',
  coord_em_breve: 'Em breve',
  coord_em_breve_desc: 'Novo coordenador em breve...',

  // ==========================================
  // 📸 GALERIA
  // ==========================================
  galeria_titulo_1: 'Galeria da',
  galeria_titulo_2: 'Turma',
  galeria_sub: 'Momentos que construímos juntos',

  // ==========================================
  // 💻 PROJETOS
  // ==========================================
  projetos_titulo: 'Nossos Projetos',
  projetos_sub: 'O que estamos construindo',
  projetos_carregando: 'Carregando projetos do GitHub...',
  projetos_vazio_t: 'Nenhum projeto público ainda',
  projetos_vazio_p: 'Em breve nossos repositórios aparecerão aqui!',
  projetos_erro_t: 'Não foi possível carregar os projetos',
  projetos_erro_p: 'Verifique sua conexão ou tente novamente mais tarde.',
  projetos_sem_desc: 'Sem descrição fornecida.',
  projetos_ver_github: 'Ver no GitHub',

  // ==========================================
  // 🔧 STACK / TECNOLOGIAS
  // ==========================================
  tech_titulo: 'Nossa Stack',
  tech_sub: 'Ferramentas que dominamos',
  tech_vazio_t: 'Sem tecnologias disponíveis no momento',
  tech_vazio_p:
    'Nossa jornada está apenas começando. Logo adicionaremos as linguagens e frameworks que farão parte do nosso arsenal.',

  // ==========================================
  // 📞 CONTATO
  // ==========================================
  contato_titulo: 'Contato',
  contato_sub: 'Onde nos encontrar',
  contato_inst_t: 'Instituição',
  contato_turma_t: 'Pessoal (Turma 2V)',
  contato_fale_t: 'Fale com a Turma',
  contato_fale_p:
    'Siga-nos nas redes sociais ou envie uma mensagem direta para parcerias e troca de ideias.',

  // ==========================================
  // 🐾 MASCOTE
  // ==========================================
  mascote_titulo: 'Nosso Mascote',
  mascote_clique: '✨ Clique no mascote! ✨',
  mascote_conheca: 'Conheça nosso mascote!',
  mascote_desc:
    'Ele representa a energia, criatividade e inovação da turma 2V. Sempre pronto para novos desafios no mundo da tecnologia!',
  mascote_carinhos: '/ 1.000.000 carinhos',
  mascote_seus: 'Seus:',
  mascote_progresso: 'Progresso para 1 MILHÃO',
  mascote_btn: 'Dar carinho',
  mascote_avatar_titulo: 'Seu mascote',
  mascote_avatar_desc: 'Personalize o mascote que aparece quando você dá carinho.',

  // ==========================================
  // 🎭 SKINS DO MASCOTE
  // ==========================================
  proxima_skin: 'Próxima skin:',
  skin_padrao: 'Padrão',
  skin_alien: 'Alien',
  skin_pirata: 'Pirata',
  skin_genio: 'Gênio',
  skin_if: 'IF',
  skin_jojo: 'Jojo',
  skin_simpson: 'Mascote Simpson',
  skin_antigo: 'Antigo',
  skin_mafioso: 'Mascote Mafioso',
  skin_retro: 'Retro',
  skin_turma1: 'Turma 1',
  skin_turma2: 'Turma 2',
  skin_turma3: 'Turma 3',
  skin_100: '100',
  skin_vestuario: 'Vestuário?',
  skin_admin: 'Admin',
  skin_bloqueada: 'Bloqueada',
  skin_todas_desbloqueadas: '🎉 Todas as skins desbloqueadas!',

  // ==========================================
  // 🏆 RANKING DE CARINHOS
  // ==========================================
  ranking_titulo: 'Top Carinhos',
  ranking_carregando: 'Carregando ranking...',
  ranking_vazio: 'Ninguém deu carinho ainda. Seja o primeiro!',
  ranking_voce: 'Você está em:',
  ranking_lugar: 'º lugar',

  // ==========================================
  // 🦶 FOOTER
  // ==========================================
  footer_feito: '- Feito pela turma',
  footer_carinho: 'Com Carinho 💜',

  // ==========================================
  // 🔐 LOGIN
  // ==========================================
  voltar: 'Voltar',
  portal_suap: 'Portal SUAP',
  area_auth: 'Área de autenticação acadêmica',
  acesse_credenciais:
    'Acesse com suas credenciais institucionais do IFRN para integrar e visualizar seus dados acadêmicos.',
  login_suap: 'Login com SUAP',
  login_ok: 'Você foi logado com sucesso!',
  sessao_ativa: 'Sessão ativa e conectada ao SUAP.',
  bem_vindo: 'Bem-vindo,',
  editar_perfil: 'Editar Perfil',
  editar_perfil_sub: 'Personalize como você aparece para a turma.',
  encerrar_sessao: 'Encerrar Sessão',

  // ==========================================
  // 🎮 XP / NÍVEIS
  // ==========================================
  dias: 'dias',
  xp_nivel_nome_1: 'Novato',
  xp_nivel_nome_2: 'Curioso',
  xp_nivel_nome_3: 'Explorador',
  xp_nivel_nome_4: 'Aprendiz',
  xp_nivel_nome_5: 'Dedicado',
  xp_nivel_nome_6: 'Veterano',
  xp_nivel_nome_7: 'Mestre',
  xp_nivel_nome_8: 'Lenda',
  xp_proximo_nivel: 'Próximo nível',

  // ==========================================
  // 🎖️ CONQUISTAS
  // ==========================================
  conquistas_titulo: 'Conquistas',
  conquistas_visiveis_titulo: 'Conquistas no perfil',
  conquistas_visiveis_desc:
    'Escolha quais conquistas os outros verão no seu perfil. Sem seleção = mostra todas.',
  todas: 'Todas',
  desbloqueadas: 'Desbloqueadas',
  bloqueadas: 'Bloqueadas',

  // ==========================================
  // 📝 CALCULADORA DE NOTAS
  // ==========================================
  calc_titulo_1: 'Calculadora de',
  calc_titulo_2: 'Notas',
  calc_sub: 'Boletim atualizado diretamente pelo SUAP',
  media_geral: 'Média Geral',
  disciplinas: 'Disciplinas',
  em_risco: 'Em Risco',
  faltas_totais: 'Faltas Totais',
  periodo: 'Período',
  meta: 'Meta',
  atualizar: 'Atualizar',
  export_csv: 'Exportar CSV',
  export_pdf: 'Exportar PDF',
  limpar_simulador: 'Limpar simulador',
  filtro_todas: 'Todas',
  filtro_aprovadas: 'Aprovadas',
  filtro_recuperacao: 'Recuperação',
  filtro_reprovadas: 'Reprovadas',
  filtro_risco: 'Em risco',
  aguardando_suap: 'Aguardando dados do SUAP...',
  th_disciplina: 'Disciplina',
  th_etapas: 'Etapas',
  th_media: 'Média',
  th_faltas: 'Faltas',
  th_projecao: 'Projeção',
  th_status: 'Status',
  th_simulador: 'Simulador: digite uma nota hipotética na próxima etapa',
  th_meta_ind: 'Meta individual',
  notas_vazio: 'Faça login para carregar suas notas.',
  leg_aprovado: 'Aprovado',
  leg_recuperacao: 'Recuperação',
  leg_reprovado: 'Reprovado',
  leg_extra: '🧪 Simulador • 🎯 Meta individual',
  evolucao_titulo: 'Evolução das Médias',
  evolucao_sub: 'Sua média por período letivo',
  historico_titulo: 'Histórico de Períodos',
  historico_vazio: 'Carregue pelo menos 2 períodos para comparar.',

  // ==========================================
  // ⏰ HORÁRIOS
  // ==========================================
  horarios_titulo_1: 'Quadro de',
  horarios_titulo_2: 'Horários',
  horarios_sub: 'Nossa rotina semanal',
  th_horario: 'Horário',
  dia_seg: 'Segunda',
  dia_ter: 'Terça',
  dia_qua: 'Quarta',
  dia_qui: 'Quinta',
  dia_sex: 'Sexta',
  intervalo_1: 'I Intervalo',
  intervalo_2: 'II Intervalo',
  horario_sujeito: 'Horário sujeito a alterações. Consulte o',
  horario_versao: 'para a versão oficial.',

  // ==========================================
  // 💬 MURAL
  // ==========================================
  mural_titulo_1: 'Mural de',
  mural_titulo_2: 'Recados',
  mural_sub: 'Deixe um recado para a turma',
  busca_recados: '🔍 Buscar recados...',
  recado_msg: 'Sua mensagem...',
  recado_link: 'Link/Anexo opcional (https://...)',
  expirar_em: 'Expirar em:',
  dia_1: '1 Dia',
  dias_7: '7 Dias',
  dias_15: '15 Dias',
  publicar: 'Publicar',

  // ==========================================
  // 👥 PERFIS / MEMBROS
  // ==========================================
  membros_titulo_1: 'Membros do',
  membros_titulo_2: 'Sistema',
  membros_sub: 'Membros integrados ao sistema',
  busca_perfis: '🔍 Filtrar por nome ou matrícula...',

  // ==========================================
  // 📅 AGENDA / CALENDÁRIO
  // ==========================================
  agenda_titulo_1: 'Agenda da',
  agenda_titulo_2: 'Turma',
  agenda_sub: 'Eventos de Setembro a Dezembro de 2026',
  cal_provas: 'Provas e avaliações',
  cal_trabalhos: 'Trabalhos e listas',
  cal_feriados: 'Feriados e recessos',
  cal_reunioes: 'Reuniões e aulas',
  cal_esportes: 'Esportes e jogos',
  cal_festas: 'Festas e eventos',
  cal_outros: 'Outros eventos',

  // ==========================================
  // 🗓️ CONTAGEM REGRESSIVA
  // ==========================================
  contagem_titulo_1: 'Faltam',
  contagem_titulo_2: 'pouco!',
  contagem_sub: 'Próximos eventos importantes',
  contagem_vazio: 'Nenhum evento próximo nos próximos 30 dias.',
  contagem_dias: 'dias',
  contagem_horas: 'horas',
  contagem_min: 'min',
  contagem_seg: 'seg',

  // ==========================================
  // 🧑‍🎓 MODAL DE PERFIL
  // ==========================================
  matricula: 'Matrícula:',
  ultimo_acesso: 'Último Acesso:',
  nao_registrado: 'Não registrado',

  // ==========================================
  // ✏️ EDITAR PERFIL
  // ==========================================
  trocar_foto: 'Trocar foto',
  restaurar_suap: 'Voltar para a foto do SUAP',
  foto_hint: 'JPG/PNG até 5MB — será otimizada.',
  nome_exibicao: 'Nome de exibição',
  nome_placeholder: 'Como quer ser chamado',
  bio: 'Bio',
  bio_placeholder: 'Fale um pouco sobre você...',
  redes_sociais: 'Redes sociais',
  cancelar: 'Cancelar',
  salvar: 'Salvar',

  // ==========================================
  // 🎯 META INDIVIDUAL
  // ==========================================
  meta_individual: 'Meta individual',
  usar_meta_global: 'Usar meta global',

  // ==========================================
  // 🔔 NOTIFICAÇÕES
  // ==========================================
  notificacoes: 'Notificações',
  marcar_todas: 'Marcar todas',
  sem_notif: 'Sem notificações.',

  // ==========================================
  // 🧑‍🏫 SALA DOS PROFESSORES
  // ==========================================
  sala_titulo: 'Sala dos Professores',
  sala_sub: 'Visão geral da turma (acesso restrito)',
  sala_tab_alunos: 'Alunos',
  sala_tab_risco: 'Em Risco',
  sala_tab_engajamento: 'Engajamento',
  sala_busca: '🔍 Buscar aluno por nome ou matrícula...',
  sala_th_aluno: 'Aluno',
  sala_th_matricula: 'Matrícula',
  sala_th_media: 'Média',
  sala_th_faltas: 'Faltas',
  sala_th_carinhos: 'Carinhos',
  sala_th_conquistas: 'Conquistas',
  sala_th_status: 'Status',
  sala_carregando: 'Carregando dados...',
  sala_risco_carregando: 'Carregando...',
  sala_stat_carinhos: 'Carinhos totais',
  sala_stat_recados: 'Recados publicados',
  sala_stat_alunos: 'Alunos ativos',
    sala_stat_top: 'Top contribuinte',

  // ==========================================
  // 🆕 CHAVES ADICIONADAS NO FIX DE ALTA PRIORIDADE
  // ==========================================
  sair_conta: 'Sair da conta',
  confirmar_sair: 'Tem certeza que quer sair da conta?',
  painel_aluno: 'Painel do Aluno',
  grupo_site: 'Site',
  grupo_extras: 'Extras',
  como_usar_site: 'Como usar o site',
  proximos_eventos: 'Próximos eventos',
  ver_anexo: 'Ver anexo',
  sem_conquistas_categoria: 'Nenhuma conquista nesta categoria.',
  voltar_topo: 'Voltar ao topo',
  dia_inteiro: 'Dia inteiro',
  sem_titulo: 'Sem título',
  ir_para_secao: 'Ir para a seção',
  eventos_dia_titulo: 'Eventos do dia',
  clicar_google_calendar: 'Clique num evento pra abrir no Google Calendar',
  entrada_suap: 'Entrar com SUAP',
  entrada_suap_desc: 'Acesse suas notas e o mural',
  carregando_recados: 'Carregando recados...',
  sem_recado_ainda: 'Nenhum recado ainda. Seja o primeiro!',
  nenhum_recado_encontrado: 'Nenhum recado encontrado.',
  membros_cadastrados: 'Nenhum membro cadastrado ainda.',
  nenhum_perfil_filtro: 'Nenhum perfil corresponde ao filtro.',
  carregando_membros: 'Carregando membros...',
  carregando_agenda: 'Carregando agenda...',
  erro_agenda: 'Não foi possível carregar a agenda.',
  gcal_nao_configurado: 'Google Calendar não configurado no .env',
  carregando_dados_turma: 'Carregando dados da turma...',
  erro_dados_turma: 'Não foi possível carregar os dados da turma.',
  confirmar_recalcular: 'Recalcular os cargos de todos os alunos?',
  cargos_recalculados: 'Cargos recalculados',
  cargos_recalculados_erro: 'Erro ao recalcular',
  sem_engajamento: 'Sem dados de engajamento ainda.',
  sem_alunos_risco: 'Nenhum aluno em risco no momento!',
  ativar_notificacoes: 'Ativar notificações',
  notificacoes_ativas: 'Notificações ativas',
} as const;
// ==========================================
// TIPO DAS CHAVES
// ==========================================
export type ChaveI18n = keyof typeof ptBR;

// ==========================================
// TIPO DE UM DICIONÁRIO
// ==========================================
// Força que EN e ES tenham TODAS as chaves de PT-BR.
// Se faltar alguma, o TS avisa em vermelho.
export type Dicionario = Record<ChaveI18n, string>;