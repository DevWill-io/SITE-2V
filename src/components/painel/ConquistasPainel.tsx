import { useState } from 'react';
import { useXP } from '../../hooks/useXP';
import { useI18n } from '../../hooks/useI18n';
import { CONQUISTAS, type Raridade } from '../../utils/constants';

type Filtro = 'todas' | 'desbloqueadas' | 'bloqueadas';

export function ConquistasPainel() {
  const { conquistas } = useXP();
  const { t } = useI18n();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [aberto, setAberto] = useState(false);

  const totalDesbloqueadas = CONQUISTAS.filter((c) => !!conquistas[c.id]).length;

  const filtradas = CONQUISTAS.filter((c) => {
    const desbloqueada = !!conquistas[c.id];
    if (filtro === 'desbloqueadas') return desbloqueada;
    if (filtro === 'bloqueadas') return !desbloqueada;
    return true;
  });

  return (
    <div className={`conquistas-box ${aberto ? 'aberto' : ''}`}>
      {/* Header clicável */}
      <button
        type="button"
        className="conquistas-header"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
      >
        <h3>
          <i className="fa-solid fa-medal" />
          <span>{t('conquistas_titulo')}</span>
        </h3>

        <div className="conquistas-header-direita">
          <span className="conquistas-contador">
            {totalDesbloqueadas}/{CONQUISTAS.length}
          </span>
          <i className="fa-solid fa-chevron-down conquistas-seta" />
        </div>
      </button>

      {/* Conteúdo colapsável */}
      <div className="conquistas-conteudo-wrapper">
        <div className="conquistas-conteudo-inner">
          <div className="conquistas-filtros">
            <button
              type="button"
              className={`conquista-filtro ${filtro === 'todas' ? 'ativo' : ''}`}
              onClick={() => setFiltro('todas')}
            >
              <span>{t('todas')}</span>
            </button>
            <button
              type="button"
              className={`conquista-filtro ${filtro === 'desbloqueadas' ? 'ativo' : ''}`}
              onClick={() => setFiltro('desbloqueadas')}
            >
              <i className="fa-solid fa-check" />
              <span>{t('desbloqueadas')}</span>
            </button>
            <button
              type="button"
              className={`conquista-filtro ${filtro === 'bloqueadas' ? 'ativo' : ''}`}
              onClick={() => setFiltro('bloqueadas')}
            >
              <i className="fa-solid fa-lock" />
              <span>{t('bloqueadas')}</span>
            </button>
          </div>

          <div className="conquistas-grid">
            {filtradas.length === 0 ? (
              <p className="conquistas-vazio">
                Nenhuma conquista nesta categoria.
              </p>
            ) : (
              filtradas.map((c) => {
                const desbloqueada = !!conquistas[c.id];
                const raridade = (c.raridade || 'comum') as Raridade;
                return (
                  <div
                    key={c.id}
                    className={`conquista-card ${desbloqueada ? 'desbloqueada' : 'bloqueada'} ${raridade}`}
                    title={c.desc}
                  >
                    <div className="conquista-icone">
                      <i className={c.icone} />
                    </div>
                    <div className="conquista-info">
                      <span className="conquista-titulo">{c.nome}</span>
                      <span className="conquista-desc">{c.desc}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}