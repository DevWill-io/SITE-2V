import { useMemo, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { PeriodoHistorico } from '../../../hooks/useHistoricoPeriodos';

interface Props {
  periodos: PeriodoHistorico[];
}

export function HistoricoPeriodos({ periodos }: Props) {
  const { t } = useI18n();
  const [aberto, setAberto] = useState(false);

  // Cronológico (mais antigo → mais novo) pra calcular tendência
  const cronologico = useMemo(
    () => [...periodos].sort((a, b) => a.periodo.localeCompare(b.periodo)),
    [periodos]
  );

  // Mapa de diferença entre períodos consecutivos
  const difs = useMemo(() => {
    const mapa: Record<string, number | null> = {};
    cronologico.forEach((p, i) => {
      if (i === 0) {
        mapa[p.periodo] = null;
      } else {
        const anterior = cronologico[i - 1];
        if (p.media !== null && anterior.media !== null) {
          mapa[p.periodo] = p.media - anterior.media;
        } else {
          mapa[p.periodo] = null;
        }
      }
    });
    return mapa;
  }, [cronologico]);

  if (periodos.length === 0) {
    return (
      <div className="historico-vazio-panel">
        <i className="fa-solid fa-clock-rotate-left" />
        <p>{t('historico_vazio')}</p>
      </div>
    );
  }

  return (
    <div className={`historico-periodos-box ${aberto ? 'aberto' : ''}`}>
      <button
        type="button"
        className="historico-periodos-header"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
      >
        <h3>
          <i className="fa-solid fa-clock-rotate-left" />
          <span>{t('historico_titulo')}</span>
        </h3>
        <div className="historico-header-direita">
          <span className="historico-contador">
            {periodos.length} período{periodos.length === 1 ? '' : 's'}
          </span>
          <i className="fa-solid fa-chevron-down historico-seta" />
        </div>
      </button>

      <div className="historico-conteudo-wrapper">
        <div className="historico-conteudo-inner">
          <div className="historico-cards">
            {periodos.map((p) => {
              const dif = difs[p.periodo];
              let trend: React.ReactNode = null;

              if (dif !== null && dif !== undefined) {
                if (dif > 0.3) {
                  trend = (
                    <span className="historico-trend up">
                      <i className="fa-solid fa-arrow-up" /> +{dif.toFixed(1)}
                    </span>
                  );
                } else if (dif < -0.3) {
                  trend = (
                    <span className="historico-trend down">
                      <i className="fa-solid fa-arrow-down" /> {dif.toFixed(1)}
                    </span>
                  );
                } else {
                  trend = (
                    <span className="historico-trend eq">
                      <i className="fa-solid fa-minus" /> estável
                    </span>
                  );
                }
              }

              const classeMedia =
                p.media === null
                  ? ''
                  : p.media >= 60
                  ? 'ok'
                  : p.media >= 40
                  ? 'mid'
                  : 'bad';

              return (
                <div key={p.periodo} className="historico-card">
                  <div className="historico-card-topo">
                    <span className="historico-periodo">{p.periodo}</span>
                    {trend}
                  </div>
                  <div className={`historico-media ${classeMedia}`}>
                    {p.media !== null ? p.media.toFixed(1) : '—'}
                  </div>
                  <span className="historico-info">
                    {p.disciplinas} disciplina{p.disciplinas === 1 ? '' : 's'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}