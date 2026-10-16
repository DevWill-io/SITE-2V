// ==========================================
// 🐙 SERVIÇO GITHUB
// ==========================================
// Busca os repositórios públicos da turma.
// Origem: carregarProjetosGitHub() em script.js.
//
// Mudança: agora retorna dados tipados em vez de montar HTML direto.
// A renderização vai pro componente <Projetos />.
// ==========================================

import { GITHUB_USERNAME } from '../utils/constants';

export interface RepoGitHub {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  language: string | null;
}

/**
 * Busca os repositórios públicos do usuário/org da turma.
 * Ordenados por atualização mais recente.
 *
 * @param limite Quantos repositórios trazer (padrão 6).
 * @throws Error se a API falhar.
 */
export async function buscarProjetos(
  limite = 6
): Promise<RepoGitHub[]> {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${limite}`;

  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!res.ok) {
    throw new Error(`GitHub API: HTTP ${res.status}`);
  }

  const repos = (await res.json()) as RepoGitHub[];
  return repos;
}