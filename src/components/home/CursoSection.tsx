import { useI18n } from '../../hooks/useI18n';

export function CursoSection() {
  const { t } = useI18n();

  const cards = [
    { icone: 'fa-solid fa-laptop-code', chaveT: 'curso_card1_t', chaveP: 'curso_card1_p', delay: 0 },
    { icone: 'fa-solid fa-layer-group', chaveT: 'curso_card2_t', chaveP: 'curso_card2_p', delay: 0.1 },
    { icone: 'fa-solid fa-user',        chaveT: 'curso_card3_t', chaveP: 'curso_card3_p', delay: 0.2 },
  ] as const;

  return (
    <section id="curso" className="curso">
      <div className="container">
        <div className="section-title reveal">
          <h2>
            <span>{t('curso_titulo_1')}</span>{' '}
            <span className="highlight">{t('curso_titulo_2')}</span>
          </h2>
          <p>{t('curso_sub')}</p>
        </div>

        <div className="curso-grid">
          {cards.map((c) => (
            <div
              key={c.chaveT}
              className="curso-card reveal tilt-element"
              style={{ transitionDelay: `${c.delay}s` }}
            >
              <i className={c.icone} />
              <h3>{t(c.chaveT)}</h3>
              <p>{t(c.chaveP)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}