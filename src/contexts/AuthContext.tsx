// ==========================================
// 🔐 CONTEXTO DE AUTENTICAÇÃO — o coração
// ==========================================
// ⚠️ ESTE É O ARQUIVO QUE RESOLVE O "às vezes não loga".
//
// Antes:
//   - window.usuarioLogado (objeto global mutável)
//   - document.cookie('matricula')
//   - localStorage('matricula_suap')
//   - Firebase 'perfis_alunos/{mat}'
//   - SuapClient interno com .getToken()
//   → 5 fontes de verdade concorrentes, atualizadas em ordens diferentes.
//
// Agora:
//   - UM único estado (user) no React.
//   - Boot único: valida uma vez, popula o user, define loading=false.
//   - Todos os componentes leem daqui via useAuth().
//   - Persistência (cookie + localStorage) continua, mas como cache,
//     não como fonte da verdade.
//
// 🆕 Patches aplicados:
//   - Detecta token SUAP expirado (via suap.isAuthenticated())
//   - Escuta evento global 'suap:401' e desloga automaticamente
//   - Trata erro 401 no boot limpando sessão
// ==========================================

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { suap } from '../services/suap';
import { apiPerfil } from '../services/api';
import { setTokenGetter, obterToken } from '../services/api';
import { ehAdmin } from '../utils/constants';
import {
  STORAGE_KEYS,
  cookieSet,
  lsRemove,
  lsSetString,
} from '../utils/storage';
import { nomeParaExibicao } from '../utils/format';
import type { DadosSuap, UsuarioLogado } from '../types/usuario';
import { useToast } from '../hooks/useToast';

// ==========================================
// TIPOS
// ==========================================
export type StatusAuth = 'carregando' | 'logado' | 'deslogado';

interface AuthContextValue {
  /** Estado atual. */
  status: StatusAuth;

  /** Dados do usuário logado. null se deslogado. */
  user: UsuarioLogado | null;

  /** Matrícula do usuário (atalho). */
  matricula: string | null;

  /** Se é admin (verifica contra MATRICULAS_ADMIN do .env). */
  isAdmin: boolean;

  /** Abre a URL de login do SUAP. */
  entrar: () => void;

  /** Faz logout e limpa tudo. */
  sair: () => void;

  /** URL pronta pra redirecionar pro SUAP. */
  urlLogin: string;
}

// ==========================================
// CONTEXT
// ==========================================
export const AuthContext = createContext<AuthContextValue | null>(null);

// ==========================================
// PROVIDER
// ==========================================
interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const { toast } = useToast();
  const [status, setStatus] = useState<StatusAuth>('carregando');
  const [user, setUser] = useState<UsuarioLogado | null>(null);

  const urlLogin = useMemo(() => suap.getLoginURL(), []);

  // ==========================================
  // BOOT — Roda UMA VEZ quando o app monta
  // ==========================================
  // Essa é a parte que resolve o bug de "às vezes não loga":
  //   - Não importa se o cookie existe, se o localStorage tem valor,
  //     se o Firebase respondeu. TUDO é validado AQUI, uma vez,
  //     com estado de loading explícito.
  //   - Nenhum componente renderiza tela logada até status != 'carregando'.
  // ==========================================
  useEffect(() => {
    let cancelado = false;

    async function boot() {
      // 1. Inicializa o SuapClient (lê cookie/localStorage/URL)
      suap.init();

      // 2. Não está logado? Define deslogado e sai.
      //    🆕 isAuthenticated() agora verifica expiração do token.
      if (!suap.isAuthenticated()) {
        if (!cancelado) {
          setStatus('deslogado');
          setUser(null);
        }
        return;
      }

      // 3. Tem token. Configura o tokenGetter do services/api
      //    pra que chamarAPI use esse token automaticamente.
      setTokenGetter(() => obterToken());

      // 4. Busca dados do usuário no SUAP
      try {
        const dadosSuap = await new Promise<DadosSuap>((resolve, reject) => {
          const scope = suap.getToken()?.getScope() || '';
          suap.getResource<DadosSuap>(
            scope,
            (dados) => resolve(dados),
            (xhr) => reject(new Error(`SUAP HTTP ${xhr.status}`))
          );
        });

        if (cancelado) return;

        // 5. Monta o objeto User
        const nomeSuap = dadosSuap.nome_usual || dadosSuap.nome || 'Usuário';
        const nomeCompletoSuap = dadosSuap.nome || nomeSuap;
        const matricula =
          dadosSuap.matricula || dadosSuap.siape || 'Matrícula não disponível';

        const fotoUrl = montarUrlFoto(dadosSuap, nomeSuap);

        const usuario: UsuarioLogado = {
          nome: nomeParaExibicao(nomeSuap),
          matricula,
          foto: fotoUrl,
          fotoOriginal: fotoUrl,
        };

        // 6. Salva cookie + localStorage (cache)
        try {
          lsSetString(STORAGE_KEYS.MATRICULA_SUAP, matricula);
          cookieSet(STORAGE_KEYS.MATRICULA_SUAP, matricula, 60 * 60 * 24 * 30);
        } catch {
          /* ignora */
        }

        // 7. Sincroniza o perfil com o Firebase via API (background)
        sincronizarPerfil(matricula, nomeCompletoSuap, usuario).catch((e) =>
          console.warn('[auth] erro ao sincronizar perfil:', e)
        );

        if (cancelado) return;
        setUser(usuario);
        setStatus('logado');
      } catch (err) {
        console.error('[auth] erro no boot:', err);
        if (cancelado) return;

        // 🆕 Se for 401, o token tá expirado — limpa pra forçar re-login
        const msg = err instanceof Error ? err.message : '';
        if (msg.includes('401')) {
          console.warn('[auth] token expirado — limpando');
          suap.logout();
        }

        setUser(null);
        setStatus('deslogado');
      }
    }

    boot();

    // 🆕 Listener: se qualquer fetch pro SUAP voltar 401, desloga
    // automaticamente. Funciona em qualquer ponto do app (boletim,
    // agenda, mural, etc) sem precisar de tratamento individual.
    const interceptar401 = () => {
      console.warn('[auth] 401 detectado — deslogando automaticamente');
      suap.logout();
      setUser(null);
      setStatus('deslogado');
    };
    window.addEventListener('suap:401', interceptar401);

    return () => {
      cancelado = true;
      window.removeEventListener('suap:401', interceptar401);
    };
  }, []);

  // ==========================================
  // AÇÕES
  // ==========================================
  const entrar = useCallback(() => {
    window.location.href = urlLogin;
  }, [urlLogin]);

  const sair = useCallback(() => {
    suap.logout();
    // Limpa TODAS as fontes possíveis
    lsRemove(STORAGE_KEYS.SUAP_TOKEN);
    lsRemove(STORAGE_KEYS.MATRICULA_SUAP);
    try {
      document.cookie =
        'suapToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'suapTokenExpirationTime=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'suapScope=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'matricula=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch {
      /* ignora */
    }
    sessionStorage.clear();

    setUser(null);
    setStatus('deslogado');

    toast('Sessão encerrada.', 'info');
    // Redireciona pro login depois de um tick
    setTimeout(() => {
      window.location.href = '/login';
    }, 300);
  }, [toast]);

  // ==========================================
  // VALORES DERIVADOS
  // ==========================================
  const matricula = user?.matricula ?? null;
  const isAdmin = useMemo(() => ehAdmin(matricula), [matricula]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      matricula,
      isAdmin,
      entrar,
      sair,
      urlLogin,
    }),
    [status, user, matricula, isAdmin, entrar, sair, urlLogin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==========================================
// HELPERS INTERNOS
// ==========================================

/**
 * Monta a URL da foto do SUAP.
 * Se não vier foto, gera avatar via ui-avatars.com.
 */
function montarUrlFoto(dados: DadosSuap, nomeFallback: string): string {
  const fotoPath =
    dados.url_foto_150x200 || dados.url_foto_75x100 || dados.foto || '';

  if (!fotoPath) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nomeFallback
    )}&background=random`;
  }

  if (fotoPath.startsWith('http://') || fotoPath.startsWith('https://')) {
    return fotoPath;
  }

  const base = 'https://suap.ifrn.edu.br';
  return `${base}${fotoPath.startsWith('/') ? '' : '/'}${fotoPath}`;
}

/**
 * Envia os dados básicos do usuário pro backend salvar no Firebase.
 * O backend decide se sobrescreve ou preserva campos editados.
 */
async function sincronizarPerfil(
  matricula: string,
  nomeCompleto: string,
  usuario: UsuarioLogado
): Promise<void> {
  if (!matricula || matricula === 'Matrícula não disponível') return;

  try {
    await apiPerfil.update({
      nome: usuario.nome,
      nomeCompleto,
      foto: usuario.foto,
    });
  } catch (err) {
    // Erro na API não impede o login — apenas loga
    console.warn('[auth] falha ao salvar perfil:', err);
  }
}