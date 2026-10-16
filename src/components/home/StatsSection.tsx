import type { RefObject } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useCounter } from '../../hooks/useCounter';

interface CardProps {
  icone: string;
  target: number;
  label: string;
  delay?: number;
}

function StatCard({ icone, target, label, delay = 0 }: CardProps) {
  const { ref, value } = useCounter(target);
  const sufixo = target >= 300 ? '+' : '';

  return (
    <div
      className="stat-card reveal tilt-element"
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      <i className={icone} />
      <h3 ref={ref as RefObject<HTMLHeadingElement>} className="counter">
        {value.toLocaleString('pt-BR')}
        {sufixo}
      </h3>
      <p>{label}</p>
    </div>
  );
}

export function StatsSection() {
  const { t } = useI18n();

  return (
    <section id="estatisticas" className="estatisticas">
      <div className="container">
        <div className="section-title reveal">
          <h2>
            <span>{t('stats_titulo_1')}</span>{' '}
            <span className="highlight">{t('stats_titulo_2')}</span>
          </h2>
          <p>{t('stats_sub')}</p>
        </div>

        <div className="stats-grid">
          <StatCard
            icone="fa-solid fa-users"
            target={40}
            label={t('stats_alunos')}
          />
          <StatCard
            icone="fa-solid fa-code"
            target={15234}
            label={t('stats_linhas')}
            delay={0.1}
          />
          <StatCard
            icone="fa-solid fa-user"
            target={3142}
            label="Resenhas Feitas"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
}