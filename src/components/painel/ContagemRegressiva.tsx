import { useEffect, useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { GCAL_API_KEY, GCAL_CALENDAR_ID } from '../../utils/constants';
import { calcularDiasCalendario, formatarDataPtBR } from '../../utils/format';

interface Evento {
  titulo: string;
  data: Date;
  dataStr: string;
  dias: number;
}

export function ContagemRegressiva() {
  const { t } = useI18n();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!GCAL_API_KEY || !GCAL_CALENDAR_ID) {
      setCarregando(false);
      return;
    }

    const agora = new Date();
    const em30dias = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);

    const params = new URLSearchParams({
      key: GCAL_API_KEY,
      timeMin: agora.toISOString(),
      timeMax: em30dias.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '4',
    });

    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        GCAL_CALENDAR_ID
      )}/events?${params.toString()}`
    )
      .then((r) => r.json())
      .then((data) => {
        const items = (data.items || []) as Array<{
          summary?: string;
          start?: { date?: string; dateTime?: string };
        }>;

        const eventosProcessados: Evento[] = items
          .map((ev) => {
            const startStr = ev.start?.date || ev.start?.dateTime || '';
            const data = ev.start?.date
              ? new Date(`${ev.start.date}T12:00:00-03:00`)
              : new Date(ev.start?.dateTime || '');
            return {
              titulo: ev.summary || 'Evento',
              data,
              dataStr: startStr,
              dias: calcularDiasCalendario(startStr),
            };
          })
          .filter((e) => e.dias >= 0)
          .sort((a, b) => a.dias - b.dias);

        setEventos(eventosProcessados);
        setCarregando(false);
      })
      .catch((err) => {
        console.warn('[contagem] erro:', err);
        setCarregando(false);
      });
  }, []);

  return (
    <section className="contagem-regressiva">
      <div className="section-title">
        <h2>
          <span>{t('contagem_titulo_1')}</span>{' '}
          <span className="highlight">{t('contagem_titulo_2')}</span>
        </h2>
        <p>{t('contagem_sub')}</p>
      </div>

      {carregando ? (
        <div className="contagem-vazio">
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
      ) : eventos.length === 0 ? (
        <div className="contagem-vazio">
          <i className="fa-regular fa-calendar" />
          <p>{t('contagem_vazio')}</p>
        </div>
      ) : (
        <div className="contagem-grid">
          {eventos.map((ev, i) => {
            const classe =
              ev.dias < 1 ? 'urgente' : ev.dias < 3 ? 'proximo' : '';
            return (
              <div key={i} className={`contagem-card ${classe}`}>
                <div className="contagem-titulo">{ev.titulo}</div>
                <div className="contagem-timer">
                  <div className="contagem-bloco">
                    <span className="contagem-num">
                      {ev.dias === 0 ? 'HOJE' : ev.dias}
                    </span>
                    {ev.dias !== 0 && (
                      <span className="contagem-label">
                        {ev.dias === 1 ? 'dia' : 'dias'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="contagem-data">
                  <i className="fa-regular fa-calendar-check" />
                  {formatarDataPtBR(ev.dataStr)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}