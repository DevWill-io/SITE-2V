import { useI18n } from '../../hooks/useI18n';

export function LideresSection() {
  const { t } = useI18n();

  return (
    <section id="lideres" className="lideres">
      <div className="container">
        <div className="section-title reveal">
          <h2>
            <span>{t('lideres_titulo_1')}</span>{' '}
            <span className="highlight">{t('lideres_titulo_2')}</span>
          </h2>
          <p>{t('lideres_sub')}</p>
        </div>

        <div className="curso-grid">
          <div className="curso-card reveal tilt-element">
            <i className="fa-solid fa-crown" />
            <h3>{t('lider_lider')}</h3>
            <div className="lider-nome">Bela Cardoso</div>
          </div>

          <div
            className="curso-card reveal tilt-element"
            style={{ transitionDelay: '0.1s' }}
          >
            <i className="fa-solid fa-star" />
            <h3>{t('lider_vice')}</h3>
            <div className="lider-nome">Samuel Nóbrega</div>
          </div>
        </div>
      </div>
    </section>
  );
}