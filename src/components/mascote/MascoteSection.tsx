import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../hooks/useAuth';
import { useMascote } from '../../hooks/useMascote';
import { MascoteImagem } from './MascoteImagem';
import { MascoteStats } from './MascoteStats';
import { MascoteSkinProgresso } from './MascoteSkinProgresso';
import { MascoteMarcos } from './MascoteMarcos';
import { MascoteRanking } from './MascoteRanking';

export function MascoteSection() {
  const { t } = useI18n();
  const { matricula } = useAuth();
  const { atingiuLimite, darCarinho } = useMascote();

  return (
    <section id="mascote" className="mascote-section">
      <div className="mascote-container reveal">
        <h2 className="mascote-title">
          🐾 <span>{t('mascote_titulo')}</span> 🤖
        </h2>

        <div className="mascote-wrapper">
          <MascoteImagem />

          <div className="mascote-info">
            <h3>{t('mascote_conheca')}</h3>
            <p>{t('mascote_desc')}</p>

            <MascoteStats />
            <MascoteSkinProgresso />
            <MascoteMarcos />

            {!matricula && (
              <p className="mascote-aviso-login">
                <i className="fa-solid fa-lock" />{' '}
                <a href="/login">Faça login com SUAP</a> para dar carinho
              </p>
            )}

            <button
              type="button"
              className={`btn-mascote ${!matricula ? 'btn-bloqueado-anon' : ''}`}
              onClick={() => darCarinho()}
              disabled={atingiuLimite || !matricula}
            >
              {atingiuLimite ? (
                <>
                  <i className="fa-solid fa-trophy" /> 🏆 MISSÃO CUMPRIDA! 🏆
                </>
              ) : !matricula ? (
                <>
                  <i className="fa-solid fa-lock" /> Faça login para dar carinho
                </>
              ) : (
                <>
                  <i className="fa-solid fa-heart" /> {t('mascote_btn')}
                </>
              )}
            </button>
          </div>
        </div>

        <MascoteRanking />
      </div>
    </section>
  );
}