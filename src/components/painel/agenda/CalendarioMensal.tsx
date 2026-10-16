import { useMemo, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import type { EventoGCal } from '../../../hooks/useGCal';

interface Props {
  eventos: EventoGCal[];
}

const DIAS_SEMANA_CURTO = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DIAS_SEMANA_LONGO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function formatarHorario(inicio: Date, dataStr: string): string {
  // All-day: data pura "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) return 'Dia inteiro';
  return inicio.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Fortaleza',
  });
}

export function CalendarioMensal({ eventos }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isTablet = useMediaQuery('(max-width: 900px)');

  const [mesAtual, setMesAtual] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  const dias = useMemo(() => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiro = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const diaSemanaInicio = primeiro.getDay();

    const grid: Array<{ dia: number | null; data: Date | null }> = [];

    for (let i = 0; i < diaSemanaInicio; i++) {
      grid.push({ dia: null, data: null });
    }

    for (let d = 1; d <= ultimoDia; d++) {
      grid.push({ dia: d, data: new Date(ano, mes, d) });
    }

    return grid;
  }, [mesAtual]);

  const eventosPorDia = useMemo(() => {
    const mapa: Record<string, EventoGCal[]> = {};
    eventos.forEach((ev) => {
      const key = ev.inicio.toISOString().slice(0, 10);
      if (!mapa[key]) mapa[key] = [];
      mapa[key].push(ev);
    });
    return mapa;
  }, [eventos]);

  const hoje = new Date().toISOString().slice(0, 10);

  const mesAnterior = () =>
    setMesAtual((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const mesProximo = () =>
    setMesAtual((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const eventosDoDiaSelecionado = diaSelecionado
    ? eventosPorDia[diaSelecionado] || []
    : [];

  const diasSemana = isMobile ? DIAS_SEMANA_CURTO : DIAS_SEMANA_LONGO;
  const maxEventosNaCelula = isMobile ? 0 : isTablet ? 1 : 2;

  return (
    <>
      <div className="calendario-wrapper">
        <div className="calendario-header">
          <button
            type="button"
            className="btn-nav-calendario"
            onClick={mesAnterior}
            aria-label="Mês anterior"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <h3 className="calendario-mes">
            {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
          </h3>

          <button
            type="button"
            className="btn-nav-calendario"
            onClick={mesProximo}
            aria-label="Próximo mês"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>

        <div className="calendario-grid">
          {diasSemana.map((d, i) => (
            <div key={`${d}-${i}`} className="calendario-dia-semana">
              {d}
            </div>
          ))}

          {dias.map((c, i) => {
            if (c.dia === null || c.data === null) {
              return <div key={`vazio-${i}`} className="calendario-dia vazio" />;
            }

            const key = c.data.toISOString().slice(0, 10);
            const evs = eventosPorDia[key] || [];
            const ehHoje = key === hoje;
            const temEventos = evs.length > 0;
            const evsMostrar = evs.slice(0, maxEventosNaCelula);
            const sobrando = evs.length - evsMostrar.length;

            return (
              <div
                key={key}
                className={`calendario-dia ${ehHoje ? 'hoje' : ''} ${
                  temEventos ? 'com-evento' : ''
                }`}
                onClick={() => {
                  if (temEventos && (isMobile || sobrando > 0)) {
                    setDiaSelecionado(key);
                  }
                }}
              >
                <span className="calendario-num">{c.dia}</span>

                {!isMobile && temEventos && (
                  <div className="calendario-eventos">
                    {evsMostrar.map((ev) => (
                      <a
                        key={ev.id}
                        href={ev.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="calendario-evento"
                        style={{ borderLeftColor: ev.cor }}
                        title={ev.titulo}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="calendario-evento-nome">
                          {ev.titulo}
                        </span>
                      </a>
                    ))}
                    {sobrando > 0 && (
                      <span className="calendario-mais">+{sobrando}</span>
                    )}
                  </div>
                )}

                {isMobile && temEventos && (
                  <div className="calendario-dots">
                    {evs.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className="calendario-dot"
                        style={{ background: ev.cor }}
                      />
                    ))}
                    {evs.length > 3 && <span className="calendario-dot mais" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendario-legenda">
          <span>
            <i className="dot" style={{ background: '#D50000' }} />{' '}
            {t('cal_provas')}
          </span>
          <span>
            <i className="dot" style={{ background: '#0B8043' }} />{' '}
            {t('cal_trabalhos')}
          </span>
          <span>
            <i className="dot" style={{ background: '#3F51B5' }} />{' '}
            {t('cal_reunioes')}
          </span>
          <span>
            <i className="dot" style={{ background: '#8E24AA' }} />{' '}
            {t('cal_festas')}
          </span>
          <span>
            <i className="dot" style={{ background: '#F6BF26' }} />{' '}
            {t('cal_outros')}
          </span>
        </div>
      </div>

      {diaSelecionado && eventosDoDiaSelecionado.length > 0 && (
        <div className="modal-overlay" onClick={() => setDiaSelecionado(null)}>
          <div
            className="modal-content modal-dia-eventos"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setDiaSelecionado(null)}
              aria-label="Fechar"
            >
              ×
            </button>

            <h2 className="modal-title">
              <i className="fa-regular fa-calendar" />
              <span>
                {new Date(`${diaSelecionado}T12:00:00-03:00`).toLocaleDateString(
                  'pt-BR',
                  { weekday: 'long', day: 'numeric', month: 'long' }
                )}
              </span>
            </h2>

            <div className="dia-eventos-lista">
              {eventosDoDiaSelecionado.map((ev) => (
                <a
                  key={ev.id}
                  href={ev.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dia-evento-card"
                >
                  <span
                    className="dia-evento-cor"
                    style={{ background: ev.cor }}
                  />
                  <div className="dia-evento-info">
                    <span className="dia-evento-titulo">
                      {ev.titulo || 'Sem título'}
                    </span>
                    <span className="dia-evento-hora">
                      <i className="fa-regular fa-clock" />{' '}
                      {formatarHorario(ev.inicio, ev.dataStr)}
                    </span>
                  </div>
                  <i className="fa-solid fa-arrow-up-right-from-square dia-evento-seta" />
                </a>
              ))}
            </div>

            <p className="modal-dia-dica">
              <i className="fa-solid fa-circle-info" /> Clique num evento pra
              abrir no Google Calendar
            </p>
          </div>
        </div>
      )}
    </>
  );
}