import { useI18n } from '../../hooks/useI18n';

export function CoordenadoresSection() {
  const { t } = useI18n();

  return (
    <section id="coordenadores" className="coordenadores">
      <div className="container">
        <div className="section-title reveal">
          <h2>
            <span>{t('coord_titulo_1')}</span>{' '}
            <span className="highlight">{t('coord_titulo_2')}</span>
          </h2>
          <p>{t('coord_sub')}</p>
        </div>

        <div className="curso-grid">
          <div className="curso-card reveal tilt-element">
            <i className="fa-solid fa-photo-film" />
            <h3>{t('coord_midia')}</h3>
            <div className="lider-nome">Williams</div>
          </div>

          <div
            className="curso-card reveal tilt-element"
            style={{ transitionDelay: '0.1s' }}
          >
            <i className="fa-solid fa-pen-ruler" />
            <h3>{t('coord_design')}</h3>
            <div className="lider-nome">Kleber</div>
          </div>

          <div
            className="curso-card reveal tilt-element"
            style={{ transitionDelay: '0.2s' }}
          >
            <i className="fa-brands fa-html5" />{' '}
            <i className="fa-brands fa-css3-alt" />
            <h3>{t('coord_html_css')}</h3>
            <div className="lider-nome">Jonas e Ayslan</div>
          </div>

          <div
            className="curso-card reveal tilt-element"
            style={{ transitionDelay: '0.3s' }}
          >
            <i className="fa-solid fa-clock" />
            <h3>{t('coord_em_breve')}</h3>
            <div className="lider-nome">{t('coord_em_breve_desc')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}