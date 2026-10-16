import { useEffect, useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { buscarProjetos, type RepoGitHub } from '../../services/github';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'ok'; repos: RepoGitHub[] }
  | { tipo: 'vazio' }
  | { tipo: 'erro' };

export function ProjetosSection() {
  const { t } = useI18n();
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });

  useEffect(() => {
    let cancelado = false;

    buscarProjetos(6)
      .then((repos) => {
        if (cancelado) return;
        setEstado(repos.length === 0 ? { tipo: 'vazio' } : { tipo: 'ok', repos });
      })
      .catch((err) => {
        console.error('[projetos] erro:', err);
        if (!cancelado) setEstado({ tipo: 'erro' });
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <section id="projetos" className="projetos">
      <div className="container">
        <div className="section-title reveal">
          <h2>{t('projetos_titulo')}</h2>
          <p>{t('projetos_sub')}</p>
        </div>

        <div className="projetos-grid">
          {estado.tipo === 'carregando' && (
            <div className="loading-projetos">{t('projetos_carregando')}</div>
          )}

          {estado.tipo === 'vazio' && (
            <div className="empty-state">
              <i className="fa-regular fa-folder-open" />
              <h3>{t('projetos_vazio_t')}</h3>
              <p>{t('projetos_vazio_p')}</p>
            </div>
          )}

          {estado.tipo === 'erro' && (
            <div className="empty-state">
              <i className="fa-regular fa-folder-open" />
              <h3>{t('projetos_erro_t')}</h3>
              <p>{t('projetos_erro_p')}</p>
            </div>
          )}

          {estado.tipo === 'ok' &&
            estado.repos.map((repo) => (
              <div key={repo.id} className="projeto-card tilt-element">
                <h3>
                  <i className="fa-regular fa-bookmark" /> {repo.name}
                </h3>
                <p>{repo.description || t('projetos_sem_desc')}</p>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="projeto-tags">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="projeto-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <i className="fa-regular fa-star" /> {repo.stargazers_count}
                    <i
                      className="fa-solid fa-code-branch"
                      style={{ marginLeft: 10 }}
                    />{' '}
                    {repo.forks_count}
                  </span>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projeto-link"
                  >
                    {t('projetos_ver_github')}{' '}
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}