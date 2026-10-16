import { useState } from 'react';
import { useMascote } from '../../hooks/useMascote';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';

export function MascoteRanking() {
  const { ranking, perfisCache, meusCarinhos } = useMascote();
  const { matricula } = useAuth();
  const { t } = useI18n();
  const [aberto, setAberto] = useState(true);

  const top10 = ranking.slice(0, 10);
  const minhasPosicao = ranking.findIndex((e) => e.matricula === matricula) + 1;
  const medalhas = ['🥇', '🥈', '🥉'];

  return (
    <div className={`mascote-ranking ${aberto ? '' : 'colapsado'}`}>
      <div className="ranking-header">
        <h3>
          <i className="fa-solid fa-trophy" />
          <span>{t('ranking_titulo')}</span>
        </h3>
        <button
          type="button"
          className="btn-acao-ranking"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
        >
          <i className={`fa-solid fa-chevron-${aberto ? 'up' : 'down'}`} />
        </button>
      </div>

      <div className="ranking-lista">
        {top10.length === 0 ? (
          <div className="ranking-vazio">
            <i className="fa-regular fa-heart" />
            <span>{t('ranking_vazio')}</span>
          </div>
        ) : (
          top10.map((e, i) => {
            const perfil = perfisCache[e.matricula] || ({} as never);
            const nome =
              perfil.nome ||
              perfil.nomeCompleto ||
              `Aluno ${e.matricula.slice(-4)}`;
            const foto =
              perfil.foto ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random`;
            const ehEu = e.matricula === matricula;
            const medalha = medalhas[i] || '';

            return (
              <div
                key={e.matricula}
                className={`ranking-item ${ehEu ? 'eu' : ''}`}
              >
                <span className="ranking-posicao">{medalha || `${i + 1}º`}</span>
                <img
                  className="ranking-avatar"
                  src={foto}
                  alt={nome}
                  onError={(ev) => {
                    (ev.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random`;
                  }}
                />
                <div className="ranking-info">
                  <span className="ranking-nome">
                    {nome}
                    {ehEu ? ' (você)' : ''}
                  </span>
                  {medalha && (
                    <span className="ranking-medalha">Top {i + 1}</span>
                  )}
                </div>
                <span className="ranking-carinhos">
                  <i className="fa-solid fa-heart" />{' '}
                  {e.carinhos.toLocaleString('pt-BR')}
                </span>
              </div>
            );
          })
        )}
      </div>

      <p className="ranking-meu">
        <i className="fa-solid fa-user" />
        <span>{t('ranking_voce')}</span>
        <strong>{minhasPosicao > 0 ? `${minhasPosicao}º` : '—'}</strong>
        <span id="ranking-meus-carinhos" className="ranking-meus-carinhos">
          ({meusCarinhos.toLocaleString('pt-BR')} carinho
          {meusCarinhos === 1 ? '' : 's'})
        </span>
      </p>
    </div>
  );
}