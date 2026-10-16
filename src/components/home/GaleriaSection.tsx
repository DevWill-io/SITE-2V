import { useI18n } from '../../hooks/useI18n';

export function GaleriaSection() {
  const { t } = useI18n();

  return (
    <section id="galeria" className="galeria">
      <div className="container">
        <div className="section-title reveal">
          <h2>
            <span>{t('galeria_titulo_1')}</span>{' '}
            <span className="highlight">{t('galeria_titulo_2')}</span>
          </h2>
          <p>{t('galeria_sub')}</p>
        </div>

        <div className="galeria-grid">
          <div className="galeria-item reveal">
            <img
              src="/img/turma01.jpg"
              alt="Primeiro Dia da Turma 2V"
              loading="lazy"
            />
          </div>
          <div className="galeria-item reveal">
            <img
              src="/img/turma02.jpg"
              alt="Foto Oficial da Turma 2V"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}