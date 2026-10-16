import { useI18n } from '../../../hooks/useI18n';
import { formatarDataPtBR } from '../../../utils/format';
import type { EventoGCal } from '../../../hooks/useGCal';

interface Props {
  eventos: EventoGCal[];
}

export function ProximosEventos({ eventos }: Props) {
  const { t } = useI18n();

  // Início de hoje (00:00) e limite de 30 dias
  const agora = new Date();
  const inicioHoje = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    0,
    0,
    0
  );
  const limite = new Date(inicioHoje.getTime() + 31 * 24 * 60 * 60 * 1000);

  const proximos = eventos
    .filter((ev) => {
      const t = ev.inicio.getTime();
      return t >= inicioHoje.getTime() && t <= limite.getTime();
    })
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime())
    .slice(0, 6);

  const calcularDias = (ev: EventoGCal): number => {
    const evInicio = new Date(
      ev.inicio.getFullYear(),
      ev.inicio.getMonth(),
      ev.inicio.getDate()
    );
    const diff = evInicio.getTime() - inicioHoje.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="proximos-eventos">
      <h3>
        <i className="fa-solid fa-clock" />
        <span>Próximos eventos</span>
      </h3>

      {proximos.length === 0 ? (
        <div className="contagem-vazio">
          <i className="fa-regular fa-calendar" />
          <p>{t('contagem_vazio')}</p>
        </div>
      ) : (
        <div className="proximos-lista">
          {proximos.map((ev) => {
            const dias = calcularDias(ev);
            const classe = dias < 1 ? 'urgente' : dias < 3 ? 'proximo' : '';
            return (
              <a
                key={ev.id}
                href={ev.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`proximo-item ${classe}`}
                title={`Abrir no Google Calendar: ${ev.titulo}`}
              >
                <div
                  className="proximo-cor"
                  style={{ background: ev.cor }}
                />
                <div className="proximo-info">
                  <span className="proximo-titulo">
                    {ev.titulo || 'Sem título'}
                  </span>
                  <span className="proximo-data">
                    {formatarDataPtBR(ev.dataStr)}
                  </span>
                </div>
                <span className="proximo-dias">
                  {dias === 0 ? 'HOJE' : dias === 1 ? '1 dia' : `${dias}d`}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}