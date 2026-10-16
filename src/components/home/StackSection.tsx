import { useI18n } from '../../hooks/useI18n';

export function StackSection() {
  const { t } = useI18n();

  return (
    <section id="tecnologias" className="tecnologias">
      <div className="container">
        <div className="section-title reveal">
          <h2>{t('tech_titulo')}</h2>
          <p>{t('tech_sub')}</p>
        </div>

        <div className="empty-state reveal">
          <i className="fa-solid fa-microchip" />
          <h3>{t('tech_vazio_t')}</h3>
          <p>{t('tech_vazio_p')}</p>
        </div>
      </div>
    </section>
  );
}