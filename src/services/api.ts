// ==========================================
// 🔌 SERVIÇO DE API (wrapper tipado)
// ==========================================
// Antes: função `chamarAPI` solta em login.js e xp-core.js (duplicada!),
//        sem tipagem de resposta, sem tratamento de erro padronizado.
//
// Agora: módulo único, tipado, com:
//   - Injeção de token via getter (vem do AuthContext)
//   - Timeout configurável
//   - Erro customizado (APIError)
//   - Suporte a AbortController (útil em useEffect)
// ==========================================

import { cookieGet, STORAGE_KEYS } from '../utils/storage';

// ==========================================
// TIPOS
// ==========================================
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
    public payload?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface OpcoesChamada {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

// ==========================================
// OBTENÇÃO DO TOKEN
// ==========================================
/**
 * Busca o token SUAP do cookie ou do localStorage.
 * Mesma lógica do código antigo — mas agora num só lugar.
 *
 * ⚠️ Quando o AuthContext estiver pronto, ele vai setar um getter customizado
 *    pra gente não depender de cookie. Ver `setTokenGetter()` abaixo.
 */
let tokenGetter: () => string | null = () => {
  const m = cookieGet(STORAGE_KEYS.SUAP_TOKEN);
  if (m) return m;
  return localStorage.getItem(STORAGE_KEYS.SUAP_TOKEN);
};

/**
 * Permite que o AuthContext sobrescreva como o token é lido.
 * Útil quando migrarmos o token pra memória (mais seguro que cookie).
 */
export function setTokenGetter(getter: () => string | null): void {
  tokenGetter = getter;
}

export function obterToken(): string | null {
  return tokenGetter();
}

// ==========================================
// FETCH COM TIMEOUT
// ==========================================
const TIMEOUT_PADRAO_MS = 15_000;

async function fetchComTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = TIMEOUT_PADRAO_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Se já veio um signal externo, respeita
  const signal = init.signal
    ? AbortSignal.any
      ? AbortSignal.any([init.signal, controller.signal])
      : init.signal
    : controller.signal;

  try {
    const res = await fetch(url, { ...init, signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ==========================================
// CHAMAR API
// ==========================================
/**
 * Chama um endpoint /api/* com o token SUAP.
 *
 * Uso:
 *   const dados = await chamarAPI<RespostaXPAdd>('/api/xp?tipo=add', { quantidade: 10 });
 *
 * Lança APIError em caso de erro HTTP ou de negócio (`dados.erro`).
 */
export async function chamarAPI<T = unknown>(
  endpoint: string,
  corpo: Record<string, unknown> = {},
  opcoes: OpcoesChamada = {}
): Promise<T> {
  const token = obterToken();
  if (!token) {
    throw new APIError('Sem token SUAP', 401, endpoint);
  }

  const { method = 'POST', signal, timeoutMs, headers = {} } = opcoes;

  let res: Response;
  try {
    res = await fetchComTimeout(
      endpoint,
      {
        method,
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...headers,
        },
        body: method === 'GET' ? undefined : JSON.stringify(corpo),
      },
      timeoutMs
    );
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new APIError('Requisição cancelada', 0, endpoint);
    }
    throw new APIError('Falha de rede', 0, endpoint, err);
  }

  let dados: Record<string, unknown> = {};
  try {
    dados = await res.json();
  } catch {
    // 204 No Content ou resposta não-JSON
    if (!res.ok) {
      throw new APIError(`HTTP ${res.status}`, res.status, endpoint);
    }
    return {} as T;
  }

  if (!res.ok) {
    const msg = (dados.erro as string) || `HTTP ${res.status}`;
    throw new APIError(msg, res.status, endpoint, dados);
  }

  // Se a resposta tem `sucesso: false`, ainda é um erro de negócio
  if (dados.sucesso === false) {
    const msg = (dados.erro as string) || 'Operação não concluída';
    throw new APIError(msg, res.status, endpoint, dados);
  }

  return dados as T;
}

// ==========================================
// ATALHOS ESPECÍFICOS
// ==========================================
// Mantém a API limpa nos componentes: `apiXP.add(10)` em vez de
// `chamarAPI('/api/xp?tipo=add', { quantidade: 10 })`.
//
// Se você adicionar endpoint novo, adiciona aqui o atalho.

import type {
  RespostaXPAdd,
  RespostaContador,
  RespostaAcessoDiario,
  RespostaConquista,
  RespostaCarinho,
  RespostaMural,
} from '../types/api';

export const apiXP = {
  add: (quantidade: number, motivo: string) =>
    chamarAPI<RespostaXPAdd>('/api/xp?tipo=add', { quantidade, motivo }),

  contador: (nome: string, quantidade: number) =>
    chamarAPI<RespostaContador>('/api/xp?tipo=contador', { nome, quantidade }),

  acessoDiario: () =>
    chamarAPI<RespostaAcessoDiario>('/api/xp?tipo=acesso-diario', {}),
};

export const apiConquista = {
  desbloquear: (id: string) =>
    chamarAPI<RespostaConquista>('/api/conquista', { id }),
};

export const apiMascote = {
  carinho: () =>
    chamarAPI<RespostaCarinho>('/api/mascote?tipo=carinho', {}),

  skin: (skinId: string) =>
    chamarAPI<{ sucesso: boolean }>('/api/mascote?tipo=skin', { skinId }),
};

export const apiMural = {
  criar: (mensagem: string, link: string, duracaoHoras: number) =>
    chamarAPI<RespostaMural>('/api/mural?tipo=recado', {
      mensagem,
      link,
      duracaoHoras,
    }),

  editar: (id: string, mensagem: string, duracaoHoras: number) =>
    chamarAPI<RespostaMural>('/api/mural?tipo=editar', {
      id,
      mensagem,
      duracaoHoras,
    }),

  excluir: (id: string) =>
    chamarAPI<RespostaMural>('/api/mural?tipo=recado', { id, acao: 'delete' }),

  curtir: (id: string) =>
    chamarAPI<RespostaMural>('/api/mural?tipo=curtir', { id }),

  comentar: (recadoId: string, texto: string) =>
    chamarAPI<RespostaMural>('/api/mural?tipo=comentar', { recadoId, texto }),

  excluirComentario: (recadoId: string, comentarioId: string) =>
    chamarAPI<RespostaMural>('/api/mural?tipo=excluir-comentario', {
      recadoId,
      comentarioId,
    }),
};

export const apiPerfil = {
  update: (dados: Record<string, unknown>) =>
    chamarAPI<{ sucesso: boolean }>('/api/perfil?tipo=update', dados),

  publico: (matricula: string) =>
    chamarAPI<Record<string, unknown>>('/api/perfil?tipo=publico', {
      matricula,
    }),
};

export const apiMeta = {
  salvar: (metas: Record<string, number>) =>
    chamarAPI<{ sucesso: boolean }>('/api/meta', { metas }),
};

export const apiBoletim = {
  salvarResumo: (resumo: {
    mediaGeral: number | null;
    faltasTotais: number;
    disciplinasCount: number;
    periodo: string;
  }) => chamarAPI<{ sucesso: boolean }>('/api/boletim', resumo),
};

export const apiCargos = {
  meus: () =>
    chamarAPI<Record<string, unknown>>('/api/cargos?tipo=meus', {}, {
      method: 'GET',
    }),

  top: () =>
    chamarAPI<Record<string, unknown>>('/api/cargos?tipo=top', {}, {
      method: 'GET',
    }),

  recalcular: () =>
    chamarAPI<Record<string, unknown>>('/api/cargos?tipo=recalcular', {}),
};

export const apiGcal = {
  cores: () =>
    chamarAPI<{ sucesso: boolean; cores: Record<string, string> }>(
      '/api/gcal?tipo=cores',
      {},
      { method: 'GET' }
    ),
};