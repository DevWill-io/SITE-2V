import { useI18n } from '../hooks/useI18n';
import { useGCal } from '../hooks/useGCal';
import { CalendarioMensal } from '../components/painel/agenda/CalendarioMensal';
import { ProximosEventos } from '../components/painel/agenda/ProximosEventos';

export default function AgendaPage() {
  const { t } = useI18n();
  const { eventos, carregando, erro } = useGCal();

  return (
    <section className="agenda-page">
      <div className="section-title">
        <h2>
          <span>{t('agenda_titulo_1')}</span>{' '}
          <span className="highlight">{t('agenda_titulo_2')}</span>
        </h2>
        <p>{t('agenda_sub')}</p>
      </div>

      <div className="agenda-container">
        {carregando ? (
          <div className="agenda-carregando">
            <i className="fa-solid fa-spinner fa-spin" />
            <span>Carregando agenda...</span>
          </div>
        ) : erro ? (
          <div className="agenda-erro">
            <i className="fa-solid fa-triangle-exclamation" />
            <p>{erro}</p>
          </div>
        ) : (
          <div className="agenda-layout">
            <CalendarioMensal eventos={eventos} />
            <ProximosEventos eventos={eventos} />
          </div>
        )}
      </div>
    </section>
  );
}