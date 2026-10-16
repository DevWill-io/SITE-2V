// ==========================================
// 🎓 SERVIÇO SUAP — reescrita fiel do suapi/client.js
// ==========================================
// Mudanças em relação ao original:
//   - jQuery $.ajax → fetch nativo
//   - var → const/let + tipagem TS
//   - Interface pública mantida (mesmos nomes de método)
//   - Cookies do SUAP preservados (suapToken, suapTokenExpirationTime, suapScope)
//   - getResource / getAuthenticatedResource agora aceitam error callback
//
// Fluxo OAuth: implicit grant (response_type=token).
// O token vem no hash da URL: #access_token=...&expires_in=...&scope=...
// ==========================================

import { cookieGet } from '../utils/storage';
import type { DadosSuap } from '../types/usuario';

// ==========================================
// TIPOS
// ==========================================
export interface TokenSuap {
  getValue: () => string;
  getExpirationTime: () => string;
  getScope: () => string;
  isValid: () => boolean;
  revoke: () => void;
}

export interface SuapErroXHR {
  status: number;
  responseText: string;
}

// ==========================================
// COOKIES USADOS PELO SDK DO SUAP
// ==========================================
const COOKIE_TOKEN = 'suapToken';
const COOKIE_EXPIRATION = 'suapTokenExpirationTime';
const COOKIE_SCOPE = 'suapScope';

// ==========================================
// HELPERS DE COOKIE
// ==========================================
function setCookieSuap(nome: string, valor: string, expiraEmMs: number): void {
  const segundos = Math.floor((expiraEmMs - Date.now()) / 1000);
  if (segundos <= 0) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${nome}=${encodeURIComponent(
    valor
  )}; path=/; max-age=${segundos}; SameSite=Lax${secure}`;
}

function removeCookieSuap(nome: string): void {
  document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ==========================================
// FÁBRICA DE TOKEN
// ==========================================
function criarToken(
  value: string | null,
  expirationTimeInSeconds: number,
  scope: string | null
): TokenSuap {
  // Token: prioriza o que já está no cookie
  let valorFinal = value || '';
  const tokenExistente = cookieGet(COOKIE_TOKEN);
  if (tokenExistente) {
    valorFinal = tokenExistente;
  }
  
  // Expiração
const inicioMs = Date.now();
// Se o SUAP não mandou duração (veio do cookie), usa 1h padrão
const duracaoSeg = expirationTimeInSeconds > 0 ? expirationTimeInSeconds : 3600;
let fimMs = inicioMs + duracaoSeg * 1000;
const expiracaoExistente = cookieGet(COOKIE_EXPIRATION);
if (expiracaoExistente) {
  const parsed = parseInt(expiracaoExistente, 10);
  if (Number.isFinite(parsed)) fimMs = parsed;
}

  // Scope
  let scopeFinal = scope || '';
  const scopeExistente = cookieGet(COOKIE_SCOPE);
  if (scopeExistente) {
    scopeFinal = scopeExistente;
  }

  // Persiste os cookies (só se ainda não existiam)
  if (!tokenExistente && valorFinal) {
    setCookieSuap(COOKIE_TOKEN, valorFinal, fimMs);
  }
  if (!expiracaoExistente && fimMs > Date.now()) {
    setCookieSuap(COOKIE_EXPIRATION, String(fimMs), fimMs);
  }
  if (!scopeExistente && scopeFinal) {
    setCookieSuap(COOKIE_SCOPE, scopeFinal, fimMs);
  }

  return {
    getValue: () => valorFinal,
    getExpirationTime: () => String(fimMs),
    getScope: () => scopeFinal,
    isValid: () => !!cookieGet(COOKIE_TOKEN) && !!valorFinal,
    revoke: () => {
      valorFinal = '';
      removeCookieSuap(COOKIE_TOKEN);
      removeCookieSuap(COOKIE_EXPIRATION);
      removeCookieSuap(COOKIE_SCOPE);
    },
  };
}

// ==========================================
// CLIENTE
// ==========================================
export class SuapClient {
  public readonly authHost: string;
  public readonly clientID: string;
  public readonly redirectURI: string;
  public readonly scope: string;

  private readonly authorizationURL: string;
  private readonly logoutURL: string;

  // Implicit grant (o original chama de "implict" — typo preservado)
  private readonly responseType = 'token';
  private readonly grantType = 'implict';

  private token: TokenSuap | null = null;
  private dataJSON: Record<string, unknown> = {};

  constructor(
    authHost: string,
    clientID: string,
    redirectURI: string,
    scope: string
  ) {
    // Remove barra final do host (mesmo comportamento do original)
    const host = authHost || 'https://suap.ifrn.edu.br'; this.authHost = host.endsWith('/') ? host.slice(0, -1) : host;
    this.clientID = clientID;
    this.redirectURI = redirectURI;
    this.scope = scope;

    this.authorizationURL = `${this.authHost}/o/authorize/`;
    this.logoutURL = `${this.authHost}/o/revoke_token/`;
  }

  // ==========================================
  // EXTRAÇÃO DO HASH DA URL
  // ==========================================
  private extrairToken(): string | null {
    const match = window.location.hash.match(/access_token=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  private extrairScope(): string | null {
    const match = window.location.hash.match(/scope=([^&]+)/);
    if (!match) return null;
    return decodeURIComponent(match[1]).replace(/\+/g, ' ');
  }

  private extrairDuracao(): number {
    const match = window.location.hash.match(/expires_in=(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  // ==========================================
  // MÉTODOS PÚBLICOS (mesmos nomes do original)
  // ==========================================
  init(): void {
    this.token = criarToken(
      this.extrairToken(),
      this.extrairDuracao(),
      this.extrairScope()
    );
    this.dataJSON = {};

    // Limpa o hash da URL depois de extrair (evita reuso acidental)
    if (window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }

  getToken(): TokenSuap | null {
    return this.token;
  }

  getDataJSON(): Record<string, unknown> {
    return this.dataJSON;
  }

  getRedirectURI(): string {
    return this.redirectURI;
  }

  isAuthenticated(): boolean {
  if (!this.token) return false;
  if (!this.token.isValid()) return false;

  // Verifica se o token ainda está dentro da validade
  const expiraStr = cookieGet(COOKIE_EXPIRATION);
  if (expiraStr) {
    const expiraMs = parseInt(expiraStr, 10);
    if (Number.isFinite(expiraMs) && expiraMs < Date.now()) {
      // Token expirado — limpa tudo
      this.token.revoke();
      this.token = null;
      return false;
    }
  }

  return true;
  }

  getLoginURL(): string {
    return (
      `${this.authorizationURL}?response_type=${this.responseType}` +
      `&grant_type=${this.grantType}` +
      `&client_id=${this.clientID}` +
      `&scope=${encodeURIComponent(this.scope)}` +
      `&redirect_uri=${encodeURIComponent(this.redirectURI)}`
    );
  }

  getRegistrationURL(): string {
    return `${this.authHost}/register/?redirect_uri=${this.redirectURI}`;
  }

  login(): void {
    window.location.href = this.getLoginURL();
  }

  // ==========================================
  // DADOS DO USUÁRIO LOGADO
  // ==========================================
  // No original: getResource(scope, callback) — o scope nem é usado,
  // sempre bate em /api/rh/meus-dados/.
  // Adicionei errorCallback opcional (usado pelo AuthContext).
  // ==========================================
  getResource<T = DadosSuap>(
    _scope: string,
    callback: (data: T) => void,
    errorCallback?: (xhr: SuapErroXHR) => void
  ): void {
    const token = this.token?.getValue();
    if (!token) {
      errorCallback?.({ status: 401, responseText: 'Sem token' });
      return;
    }

    fetch(`${this.authHost}/api/rh/meus-dados/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(async (res) => {
        const texto = await res.text();
        let dados: unknown;
        try {
          dados = JSON.parse(texto);
        } catch {
          dados = texto;
        }

        if (!res.ok) {
  // Avisa o app que o token expirou
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('suap:401'));
  }
  errorCallback?.({ status: res.status, responseText: texto });
  return;
}
        this.dataJSON = dados as Record<string, unknown>;
        callback(dados as T);
      })
      .catch((err) => {
        errorCallback?.({
          status: 0,
          responseText:
            err instanceof Error ? err.message : 'Erro desconhecido',
        });
      });
  }

  // ==========================================
  // ENDPOINT GENÉRICO AUTENTICADO
  // ==========================================
  getAuthenticatedResource<T = unknown>(
    path: string,
    callback: (data: T) => void,
    errorCallback?: (xhr: SuapErroXHR) => void
  ): void {
    const token = this.token?.getValue();
    if (!token) {
      errorCallback?.({ status: 401, responseText: 'Sem token' });
      return;
    }

    fetch(`${this.authHost}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(async (res) => {
        const texto = await res.text();
        let dados: unknown;
        try {
          dados = JSON.parse(texto);
        } catch {
          dados = texto;
        }

        if (!res.ok) {
          errorCallback?.({ status: res.status, responseText: texto });
          return;
        }
        callback(dados as T);
      })
      .catch((err) => {
        errorCallback?.({
          status: 0,
          responseText:
            err instanceof Error ? err.message : 'Erro desconhecido',
        });
      });
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  logout(): void {
    const token = this.token?.getValue();
    if (!token) {
      this.limparERedirecionar();
      return;
    }

    const body = new URLSearchParams({
      token,
      client_id: this.clientID,
    });

    fetch(this.logoutURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
      .then(() => this.limparERedirecionar())
      .catch(() => this.limparERedirecionar());
  }

  private limparERedirecionar(): void {
    this.token?.revoke();
    this.token = null;
    this.dataJSON = {};
    window.location.href = this.redirectURI;
  }
}

// ==========================================
// SINGLETON
// ==========================================
// Defensivo: se as variáveis do .env faltarem, não quebra o app.
const SUAP_URL = import.meta.env.VITE_SUAP_URL || 'https://suap.ifrn.edu.br';
const SUAP_CLIENT_ID = import.meta.env.VITE_SUAP_CLIENT_ID || '';
const SUAP_REDIRECT_URI =
  import.meta.env.VITE_SUAP_REDIRECT_URI ||
  (typeof window !== 'undefined'
    ? `${window.location.origin}/login`
    : '/login');
const SUAP_SCOPE =
  import.meta.env.VITE_SUAP_SCOPE || 'identificacao email documentos_pessoais';

// Avisa cedo se faltou config
if (!SUAP_CLIENT_ID) {
  console.error(
    '[suap] ⚠️ VITE_SUAP_CLIENT_ID não está definido no .env.local. ' +
    'O login com SUAP não vai funcionar.'
  );
}

export const suap = new SuapClient(
  SUAP_URL,
  SUAP_CLIENT_ID,
  SUAP_REDIRECT_URI,
  SUAP_SCOPE
);