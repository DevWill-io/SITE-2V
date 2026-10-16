import { useEffect, useState } from 'react';
import { GCAL_API_KEY, GCAL_CALENDAR_ID } from '../utils/constants';

export interface EventoGCal {
  id: string;
  titulo: string;
  inicio: Date;
  dataStr: string;
  url?: string;
  cor: string;
}

export function useGCal() {
  const [eventos, setEventos] = useState<EventoGCal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!GCAL_API_KEY || !GCAL_CALENDAR_ID) {
      setErro('Google Calendar não configurado no .env');
      setCarregando(false);
      return;
    }

    // Busca do início de 2026 até o fim
    const timeMin = '2026-01-01T00:00:00-03:00';
    const timeMax = '2026-12-31T23:59:59-03:00';

    const params = new URLSearchParams({
      key: GCAL_API_KEY,
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
    });

    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        GCAL_CALENDAR_ID
      )}/events?${params.toString()}`
    )
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const items = (data.items || []) as Array<{
          id?: string;
          summary?: string;
          start?: { date?: string; dateTime?: string };
          htmlLink?: string;
          colorId?: string;
        }>;

        // Mapa de cores do Google Calendar (IDs numéricos → hex)
        const coresGCal: Record<string, string> = {
          '1': '#a4bdfc', '2': '#7ae7bf', '3': '#dbadff',
          '4': '#ff887c', '5': '#fbd75b', '6': '#ffb878',
          '7': '#46d6db', '8': '#e1e1e1', '9': '#5484ed',
          '10': '#51b749', '11': '#dc2127',
        };

        const processados: EventoGCal[] = items.map((ev) => {
          const dataStr = ev.start?.date || ev.start?.dateTime || '';
          const inicio = ev.start?.date
            ? new Date(`${ev.start.date}T12:00:00-03:00`)
            : new Date(ev.start?.dateTime || '');
          return {
            id: ev.id || String(Math.random()),
            titulo: ev.summary || 'Evento',
            inicio,
            dataStr,
            url: ev.htmlLink,
            cor: ev.colorId ? coresGCal[ev.colorId] || '#8b5edd' : '#8b5edd',
          };
        });

        setEventos(processados);
        setCarregando(false);
      })
      .catch((err) => {
        console.warn('[gcal] erro:', err);
        setErro('Não foi possível carregar a agenda.');
        setCarregando(false);
      });
  }, []);

  return { eventos, carregando, erro };
}